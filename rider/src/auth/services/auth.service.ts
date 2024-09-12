import { Inject, Injectable } from '@nestjs/common';
import { EnterNumberDto } from '../dtos/EnterNumberDto';
import { RiderEntity } from 'src/typeorm/rider.entity';
import { JwtService } from '@nestjs/jwt';
import { RidersService } from 'src/riders/services/riders.service';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private ridersService: RidersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      'rider-auth-group',
      { topics: ['send-number-with-code'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const notifiString = message.value.toString();
          const notifiObject = JSON.parse(notifiString);

          const phoneNumber = notifiObject.phoneNumber;
          const verificationCode = notifiObject.verificationCode;
          console.log({
            phoneNumber: phoneNumber,
            verificationCode: verificationCode,
            topic: topic.toString(),
          });
          await this.saveNumberAndCode(phoneNumber, verificationCode);
        },
      },
    );
  }

  async saveNumberAndCode(phoneNumber: string, verificationCode: string) {
    await this.cacheManager.set(
      phoneNumber,
      { key: verificationCode },
      60000000,
    );
    const cachedItem = await this.cacheManager.get(phoneNumber);
    console.log(cachedItem);
  }

  async validateUser(
    phoneNumber: string,
    verificationCode: string,
  ): Promise<any> {
    const user = await this.ridersService.findOne(phoneNumber);

    if (!user) {
      return null;
    }

    const cachedData = await this.cacheManager.get<{ key: string }>(
      phoneNumber,
    );

    if (cachedData && cachedData.key == verificationCode) {
      console.log(
        'Verification success:',
        cachedData,
        phoneNumber,
        verificationCode,
      );
      return user;
    }

    console.log(
      'Verification failed or code expired for:',
      cachedData,
      phoneNumber,
    );
    return null;
  }

  async findOrCreate(enterNumberDto: EnterNumberDto): Promise<RiderEntity> {
    const user = await this.ridersService.findOne(enterNumberDto.phoneNumber);

    if (!user) {
      const registeredUser =
        await this.ridersService.createRider(enterNumberDto);
      return registeredUser;
    }
  }

  async sendNumber(phoneNumber: string) {
    console.log(phoneNumber);

    await this.producerService.produce({
      topic: 'send-number',
      messages: [
        {
          value: JSON.stringify({
            phoneNumber: phoneNumber,
            userType: 'rider',
          }),
        },
      ],
      // messages: [
      //   {
      //     value: phoneNumber,
      //   },
    });

    console.log(`Sent to microservice ${phoneNumber}`);

    return `Sent to microservice ${phoneNumber}`;
  }

  async login(user: any) {
    // type here

    const registeredUser = await this.ridersService.findOne(user.phoneNumber);

    if (!registeredUser) {
      return null;
    }

    const payload = { sub: user.id, phoneNumber: user.phoneNumber };
    return {
      access_token: await this.jwtService.signAsync(payload),
      isfullyRegistered: registeredUser.isFullyRegistered,
    };
  }

  async enterDetails(riderId: number, newDetails: Partial<RiderEntity>) {
    try {
      const updatedRider = await this.ridersService.updateRiderById(
        riderId,
        newDetails,
      );
      // Additional logic after updating the rider...
      return updatedRider;
    } catch (error) {
      // Error handling...
      throw error; // or handle it as per your application's needs
    }
  }
}
