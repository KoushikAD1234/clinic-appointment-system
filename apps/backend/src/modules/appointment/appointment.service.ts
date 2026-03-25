import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/database/entities/appointment.entity';
import { CreateAppointmentDto } from 'src/dto/create-appointment.dto';
import { Repository } from 'typeorm';

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

    return this.appointmentRepo.save(appointment);
  }

  async findAll(clinic_id: string) {
    return this.appointmentRepo.find({
      where: { clinic_id },
      order: { appointment_time: 'ASC' },
    });
  }
}
