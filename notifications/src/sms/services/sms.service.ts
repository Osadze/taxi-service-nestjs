import {
  Injectable,
  OnModuleInit,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { SmsDto } from '../dtos/SmsDto';
import * as twilio from 'twilio';
import { ConsumerService } from 'src/kafka/consumer.service';
import { ProducerService } from 'src/kafka/producer.service';
import { error } from 'console';

@Injectable()
export class SmsService implements OnModuleInit {
  private client: any;
  phoneNumber: string;

  constructor(
    private readonly consumerService: ConsumerService,
    private readonly producerService: ProducerService,
  ) {
    this.client = twilio(
      'key',
      'key',
    );
  }
  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['send-number'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const userDataString = message.value.toString();
          const userDataObject = JSON.parse(userDataString);

          console.log({
            value: userDataObject.phoneNumber,
            topic: topic.toString(),
            partition: partition.toString(),
          });

          if (userDataObject.userType === 'driver') {
            await this.sendSmsToDriver(userDataObject.phoneNumber);
          } else if (userDataObject.userType === 'rider') {
            await this.sendSmsToRider(userDataObject.phoneNumber);
          } else {
            throw new NotFoundException('Something is wrong');
          }
        },
      },
    );
  }

  async sendSmsToRider(phoneNumber: string) {
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    await this.producerService.produce({
      topic: 'send-number-with-code',
      messages: [
        {
          value: JSON.stringify({
            phoneNumber: phoneNumber,
            verificationCode: verificationCode,
          }),
        },
      ],
    });

    const message = await this.client.messages.create({
      body: `Your verification code is ${verificationCode}`,
      from: '+19037306296',
      to: phoneNumber,
    });

    return `${this.phoneNumber} sms sent successfully with message id ${message.sid}`;
  }
  async sendSmsToDriver(phoneNumber: string) {
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    await this.producerService.produce({
      topic: 'send-driver-number-with-code',
      messages: [
        {
          value: JSON.stringify({
            phoneNumber: phoneNumber,
            verificationCode: verificationCode,
          }),
        },
      ],
    });

    const message = await this.client.messages.create({
      body: `Your verification code is ${verificationCode}`,
      from: '+19037306296',
      to: phoneNumber,
    });

    return `${this.phoneNumber} sms sent successfully with message id ${message.sid}`;
  }
}
