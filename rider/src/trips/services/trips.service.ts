import { Injectable } from '@nestjs/common';
import { LocationsService } from 'src/locations/locations.service';
import { CreateTripDto } from '../dtos/CreateTrip.dto';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';
import { AppEvents } from '../../helpers/event-emitter.provider';

@Injectable()
export class TripsService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      'locations-rider-group',
      { topics: ['trip-geolocation-details'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const dataString = message.value.toString();
          const dataObject = JSON.parse(dataString);

          console.log({
            string: dataString,
            object: dataObject,
            topic: topic.toString(),
          });
          await this.returnRequestedRide(dataObject);
        },
      },
    );
  }

  async requestRide(data: CreateTripDto) {
    const tripData = {
      ...data,
      pickUp: JSON.stringify(data.pickUp),
      dropOff: JSON.stringify(data.dropOff),
    };

    await this.producerService.produce({
      topic: 'rider-request-ride',
      messages: [
        {
          value: JSON.stringify(tripData),
        },
      ],
    });

    console.log('this is for geolocation ms' + JSON.stringify(tripData));
  }

  async returnRequestedRide(rideData: any[]) {
    AppEvents.emit('returnRequestedRide', rideData);
    return rideData;
  }

  // async requestRide(data: CreateTripDto) {
  //   const tripData = {
  //     ...data,
  //     pickUp: JSON.stringify(data.pickUp),
  //     dropOff: JSON.stringify(data.dropOff),
  //   };

  //   await this.producerService.produce({
  //     topic: 'rider-create-trip',
  //     messages: [
  //       {
  //         value: JSON.stringify(tripData),
  //       },
  //     ],
  //   });

  //   console.log('this is sent to trips ms' + JSON.stringify(tripData));

  //   return { message: 'Ride Requested!', statusCode: 200 };
  // }
}
