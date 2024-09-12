import { Module } from '@nestjs/common';
import { SmsModule } from './sms/sms.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [SmsModule,KafkaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
