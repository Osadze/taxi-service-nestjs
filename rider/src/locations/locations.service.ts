import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dtos/create-location.dto';
import { Location } from './entities/location.entity';
import { GetNearbyDriversDto } from './dtos/getNearbyDrivers.dto';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';
import { ReturnNearbyDriver } from './dtos/returnNearbyDriver.dto';
import { LocationsGateway } from './locations.gateway';
import { AppEvents } from '../helpers/event-emitter.provider';

@Injectable()
export class LocationsService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      'get-nearby-drivers-group',
      { topics: ['return-nearby-drivers'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const dataString = message.value.toString();
          const dataObject = JSON.parse(dataString);

          console.log({
            string: dataString,
            object: dataObject,
            topic: topic.toString(),
          });
          await this.returnNearbyDrivers(dataObject);
        },
      },
    );
  }

  async getNearbyDrivers(getNearbyDriversDto: GetNearbyDriversDto) {
    const areaDetails = JSON.stringify({
      lat: getNearbyDriversDto.lat,
      long: getNearbyDriversDto.long,
      radius: getNearbyDriversDto.radius,
      unit: getNearbyDriversDto.unit,
    });
    console.log(areaDetails);

    await this.producerService.produce({
      topic: 'get-nearby-drivers',
      messages: [
        {
          value: areaDetails,
        },
      ],
    });
    console.log(`Sent to Driver microservice: ${areaDetails}`);
  }
  async returnNearbyDrivers(returnNearbyDriver: ReturnNearbyDriver[]) {
    AppEvents.emit('returnNearbyDrivers', returnNearbyDriver);
    return returnNearbyDriver;
  }
}
