import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/database/entities/appointment.entity';
import { CreateAppointmentDto } from 'src/dto/create-appointment.dto';
import { GetAppointmentsDto } from 'src/dto/get-appointment.dto';
import { UpdateStatusDto } from 'src/dto/update-status.dto';
import { Between, ILike, Repository } from 'typeorm';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  async create(body: CreateAppointmentDto, clinic_id: string) {
    const appointment = this.appointmentRepo.create({
      ...body,
      clinic_id,
      appointment_time: new Date(body.appointment_time),
    });
    try {
      return await this.appointmentRepo.save(appointment);
    } catch (error) {
      throw new BadRequestException('Slot already booked');
    }
  }

  async findAll(clinic_id: string) {
    return this.appointmentRepo.find({
      where: { clinic_id },
      order: { appointment_time: 'ASC' },
    });
  }

  async getAppointments(query: GetAppointmentsDto, clinic_id: string) {
    const where: any = { clinic_id };

    // 📅 DATE FILTER
    if (query.date) {
      const now = new Date();

      let start: Date;
      let end: Date;

      if (query.date === 'today') {
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
      }

      if (query.date === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        start = new Date(tomorrow.setHours(0, 0, 0, 0));
        end = new Date(tomorrow.setHours(23, 59, 59, 999));
      }

      if (query.date === 'yesterday') {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        start = new Date(yesterday.setHours(0, 0, 0, 0));
        end = new Date(yesterday.setHours(23, 59, 59, 999));
      }

      where.appointment_time = Between(start!, end!);
    }

    // 🔍 SEARCH
    if (query.search) {
      return this.appointmentRepo.find({
        where: [
          {
            clinic_id,
            patient_name: ILike(`%${query.search}%`),
          },
          {
            clinic_id,
            patient_phone: ILike(`%${query.search}%`),
          },
        ],
        order: { appointment_time: 'ASC' },
      });
    }

    return await this.appointmentRepo.find({
      where,
      order: { appointment_time: 'ASC' },
    });
  }

  async updateStatus(id: string, body: UpdateStatusDto) {
    const appointment = await this.appointmentRepo.findOne({ where: { id } });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    appointment.status = body.status;

    return this.appointmentRepo.save(appointment);
  }
}
