import { IsString, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  patient_id: string;

  @IsString()
  doctor_id: string;

  @IsDateString()
  appointment_time: string;
}
