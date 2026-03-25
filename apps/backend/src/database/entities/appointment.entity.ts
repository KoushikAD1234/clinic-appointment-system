import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum AppointmentStatus {
  BOOKED = 'BOOKED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clinic_id: string;

  @Column()
  patient_id: string;

  @Column()
  doctor_id: string;

  @Column()
  appointment_time: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.BOOKED,
  })
  status: AppointmentStatus;
}
