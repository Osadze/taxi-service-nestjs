import { SmsDto } from '../dtos/SmsDto';
import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { SmsService } from '../services/sms.service';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  // @Post()
  // @UsePipes(ValidationPipe)
  // async sendSms(@Body() body: SmsDto) {
  //   return this.smsService.sendSms(body);
  // }
}
