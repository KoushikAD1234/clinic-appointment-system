import { Controller, Post, UseGuards, Req, Get, Body } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { JwtAuthGuard } from 'src/common/guards/jwt/jwt.guard';
import { CreateAppointmentDto } from 'src/dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateAppointmentDto, @Req() req: any) {
    return this.appointmentService.create(body, req.user.clinic_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: any) {
    return this.appointmentService.findAll(req.user.clinic_id);
  }
}
