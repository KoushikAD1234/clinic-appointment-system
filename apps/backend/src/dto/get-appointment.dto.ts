import { IsOptional, IsString } from 'class-validator';

export class GetAppointmentsDto {
  @IsOptional()
  @IsString()
  date?: string; // today | tomorrow | yesterday

  @IsOptional()
  @IsString()
  search?: string;
}
