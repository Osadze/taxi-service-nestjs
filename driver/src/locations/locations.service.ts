import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dtos/create-location.dto';
import { Location } from './entities/location.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DriversService } from 'src/drivers/services/drivers.service';
import { DriverEntity } from 'src/typeorm/driver.entity';
import { RedisService } from 'src/redis/redis.service';
import { UpdateDriverLocationDto } from './dtos/updateDriverLocation.dto';
import { GetNearbyDriversDto } from './dtos/getNearbyDrivers.dto';
import { LocationDto } from './dtos/changeStatus.dto';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';

@Injectable()
export class LocationsService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private driversService: DriversService,
    private readonly redisService: RedisService,
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  async onModuleInit() {
    console.log('test');

    await this.consumerService.consume(
      'nearby-drivers-group',
      { topics: ['get-nearby-drivers'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const dataString = message.value.toString();
          const dataObject = JSON.parse(dataString);

          console.log({
            string: dataString,
            object: dataObject,
            topic: topic.toString(),
          });

          await this.getNearbyDrivers(dataObject);
        },
      },
    );
  }

  // async sendCurrentLocation(createLocationDto: CreateLocationDto) {
  //   const userId = `driver:${createLocationDto.userId}`;
  //   const currentLocation = [
  //     createLocationDto.location,
  //     createLocationDto.timestamp,
  //   ];
  //   await this.cacheManager.set(userId, { key: currentLocation }, 60000000);
  //   return createLocationDto;
  // }

  async updateDriverLocation(
    id: number,
    updateLocation: LocationDto,
  ): Promise<void> {
    await this.redisService.addDriverLocation(id, updateLocation);
  }

  async changeDriverStatus(
    id: number,
    status: string,
    updateLocation: LocationDto,
  ) {
    const updateData: Partial<DriverEntity> = { status };
    await this.driversService.updateDriverById(id, updateData);

    if (status === 'offline') {
      await this.redisService.removeDriverLocation(id);
    } else if (status === 'online') {
      await this.updateDriverLocation(id, updateLocation);
    }
  }

  // async getAllDrivers() {
  //   const driverKeys = await this.cacheManager.store.keys('driver:*');
  //   if (driverKeys.length === 0) {
  //     throw new NotFoundException('No drivers found');
  //   }
  //   const drivers = [];

  //   for (const key of driverKeys) {
  //     const driverData = await this.cacheManager.get(key);
  //     drivers.push(driverData);
  //   }

  //   return drivers;
  // }

  async getNearbyDrivers(getNearbyDrivers: GetNearbyDriversDto) {
    const nearbyDrivers =
      await this.redisService.getNearbyDrivers(getNearbyDrivers);

    const nearbyDriversString = JSON.stringify(nearbyDrivers);

    await this.producerService.produce({
      topic: 'return-nearby-drivers',
      messages: [
        {
          value: nearbyDriversString,
        },
      ],
    });
    return nearbyDrivers;
  }


  // find best driver
}
