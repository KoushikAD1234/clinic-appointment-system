import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
} from 'typeorm';

export enum AppointmentStatus {
  BOOKED = 'BOOKED',
  COMPLETED = 'COMPLETED',
}

export enum AppointmentType {
  FIRST_VISIT = 'FIRST_VISIT',
  FOLLOW_UP = 'FOLLOW_UP',
  CONSULTATION = 'CONSULTATION',
}

@Entity()
@Unique(['doctor_id', 'appointment_time'])
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clinic_id: string;

  @Column()
  doctor_id: string;

  @Column({ nullable: true })
  patient_name: string;

  @Column({ nullable: true })
  patient_phone: string;

  @Column({ nullable: true })
  patient_id: string; // optional (future use)

  @Column({ type: 'timestamp' })
  appointment_time: Date;

  @Column({
    type: 'enum',
    enum: AppointmentType,
    default: AppointmentType.FIRST_VISIT,
  })
  type: AppointmentType;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.BOOKED,
  })
  status: AppointmentStatus;

  @CreateDateColumn()
  created_at: Date;
}
