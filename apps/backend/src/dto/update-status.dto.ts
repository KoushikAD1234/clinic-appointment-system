import { IsEnum } from 'class-validator';
import { AppointmentStatus } from 'src/database/entities/appointment.entity';

export class UpdateStatusDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
