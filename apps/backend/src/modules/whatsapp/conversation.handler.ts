import { Injectable } from '@nestjs/common';
import {
  Conversation,
  ConversationStep,
} from 'src/database/entities/conversation.entity';
import { ConversationService } from './conversation.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from 'src/database/entities/doctor.entity';
import { Patient } from 'src/database/entities/patient.entity';
import { Repository } from 'typeorm';
import { AppointmentService } from '../appointment/appointment.service';
import { AppointmentType } from 'src/database/entities/appointment.entity';
import { WhatsappSender } from './whatsapp.sender';
import { parseEntryMessage } from 'src/common/utils/entry-parser';

@Injectable()
export class ConversationHandler {
  constructor(
    private convoService: ConversationService,
    private sender: WhatsappSender,
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    private appointmentService: AppointmentService,
  ) {}

  private readonly TEMPLATES = {
    GENDER: 'HXcc8d9bf533eb0ced84848349658b2bfa',
    TYPE: 'HXb6d1741ef55eb9e87c23bca6beeb697f',
    DATE: 'HX7d85c71075861689217a12b5311e2313',
    CONFIRMATION: 'HX0872f7f1e15d83507b13558009f92cca',
  };

  async handle(convo: Conversation, message: string): Promise<string | null> {
    const msg = message.trim();
    const entry = parseEntryMessage(msg);

    // 1. GLOBAL CANCEL / RESET
    if (msg.toLowerCase() === 'cancel' || msg.toLowerCase() === 'reset') {
      await this.convoService.delete(convo.phone);
      return '🔄 Session cleared. To start a new booking, please scan the QR code or click the WhatsApp link for your specific doctor.';
    }

    // 2. HANDLE QR ENTRY (The only way to start/restart a valid session)
    if (entry.type === 'DOCTOR_DIRECT') {
      const doctor = await this.doctorRepo.findOne({
        where: { id: entry.doctorId },
      });

      if (!doctor) {
        return '❌ Invalid doctor link. Please scan a valid QR code from the clinic.';
      }

      // We reset/update the conversation to the new doctor and start from Name
      convo.doctor_id = doctor.id;
      convo.step = ConversationStep.ASK_NAME;
      // Optional: Clear old patient data if you want a fresh start
      convo.name = '';
      await this.convoService.save(convo);

      return `👨‍⚕️ Booking an appointment with *Dr. ${doctor.name}*\n\nPlease enter your *Full Name*:`;
    }

    // 3. QR-FIRST GUARD: If no doctor is associated, block any further interaction
    if (!convo.doctor_id) {
      return '👋 Welcome! To book an appointment, please **scan the QR code** or **click the WhatsApp link** provided by your doctor to begin.';
    }

    // 4. MAIN BOOKING FLOW
    switch (convo.step) {
      case ConversationStep.ASK_NAME:
        if (msg.length < 2)
          return '⚠️ Please enter a valid name (at least 2 characters).';
        convo.name = msg;
        convo.step = ConversationStep.ASK_AGE;
        await this.convoService.save(convo);
        return 'What is your age?';

      case ConversationStep.ASK_AGE:
        const age = parseInt(msg);
        if (isNaN(age) || age < 0 || age > 120)
          return '⚠️ Please enter a valid age.';
        convo.age = age;
        convo.step = ConversationStep.ASK_ADDRESS;
        await this.convoService.save(convo);
        return 'What is your address?';

      case ConversationStep.ASK_ADDRESS:
        if (msg.length < 5) return '⚠️ Please provide a more detailed address.';
        convo.address = msg;
        convo.step = ConversationStep.ASK_TYPE;
        await this.convoService.save(convo);
        await this.sender.sendTemplate(convo.phone, this.TEMPLATES.TYPE);
        return null;

      case ConversationStep.ASK_TYPE:
        convo.type =
          msg === '1' || msg.toLowerCase().includes('first')
            ? 'First Visit'
            : 'Follow-up';
        convo.step = ConversationStep.ASK_GENDER;
        await this.convoService.save(convo);
        await this.sender.sendTemplate(convo.phone, this.TEMPLATES.GENDER);
        return null;

      case ConversationStep.ASK_GENDER:
        convo.gender =
          msg === '1' || msg.toLowerCase() === 'male' ? 'Male' : 'Female';
        convo.step = ConversationStep.ASK_DATE;
        await this.convoService.save(convo);
        await this.sender.sendTemplate(convo.phone, this.TEMPLATES.DATE);
        return null;

      case ConversationStep.ASK_DATE: {
        const date = this.getDate(msg);
        if (!date)
          return '⚠️ Invalid selection. Please tap one of the buttons below.';
        convo.appointment_date = date;
        convo.step = ConversationStep.ASK_TIME;
        await this.convoService.save(convo);
        return 'Enter appointment time (24h format, e.g., 10:30 or 15:00):';
      }

      case ConversationStep.ASK_TIME: {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(msg))
          return '⚠️ Please use HH:MM format (e.g., 14:30).';

        // Check for past time if appointment is today
        const todayStr = new Date().toISOString().split('T')[0];
        if (convo.appointment_date === todayStr) {
          const [hrs, mins] = msg.split(':').map(Number);
          const now = new Date();
          if (
            hrs < now.getHours() ||
            (hrs === now.getHours() && mins < now.getMinutes())
          ) {
            return '⚠️ That time has already passed today. Please pick a future time.';
          }
        }

        convo.appointment_time = `${convo.appointment_date}T${msg}:00`;
        convo.step = ConversationStep.CONFIRM;
        await this.convoService.save(convo);
        await this.sender.sendTemplate(
          convo.phone,
          this.TEMPLATES.CONFIRMATION,
        );
        return null;
      }

      case ConversationStep.CONFIRM:
        if (msg === '2' || msg.toLowerCase().includes('no')) {
          await this.convoService.delete(convo.phone);
          return '❌ Booking cancelled. To restart, please scan the doctor’s QR code again.';
        }
        return this.book(convo);

      default:
        return 'Type "Cancel" to stop or provide the information requested above.';
    }
  }

  async book(convo: Conversation): Promise<string> {
    try {
      let patient = await this.patientRepo.findOne({
        where: { phone: convo.phone },
      });
      if (!patient) {
        patient = await this.patientRepo.save({
          name: convo.name,
          phone: convo.phone,
          gender: convo.gender,
          age: convo.age,
          address: convo.address,
          clinic_id: 'default-clinic',
        });
      }
      await this.appointmentService.create(
        {
          patient_id: patient.id,
          doctor_id: convo.doctor_id,
          patient_name: convo.name,
          patient_phone: convo.phone.replace('whatsapp:', ''),
          type:
            convo.type === 'First Visit'
              ? AppointmentType.FIRST_VISIT
              : AppointmentType.FOLLOW_UP,
          appointment_time: convo.appointment_time,
        },
        'default-clinic',
      );

      await this.convoService.delete(convo.phone);
      return '✅ Appointment successfully booked! We look forward to seeing you.';
    } catch (err) {
      console.error(err);
      return '❌ This time slot was just taken. Please type "Cancel" and scan the QR code to try another time.';
    }
  }

  private getDate(option: string) {
    const d = new Date();
    const opt = option.toLowerCase();
    if (opt.includes('1') || opt.includes('today'))
      return d.toISOString().split('T')[0];
    if (opt.includes('2') || opt.includes('tomorrow')) {
      d.setDate(d.getDate() + 1);
      return d.toISOString().split('T')[0];
    }
    if (opt.includes('3') || opt.includes('day after')) {
      d.setDate(d.getDate() + 2);
      return d.toISOString().split('T')[0];
    }
    return null;
  }
}
