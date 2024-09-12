import { Module } from '@nestjs/common';
import { SmsController } from './controllers/sms.controller';
import { SmsService } from './services/sms.service';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';

@Module({
  controllers: [SmsController],
  providers: [SmsService, ProducerService, ConsumerService],
})
export class SmsModule {}
