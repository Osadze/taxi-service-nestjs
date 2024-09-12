import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TripsEntity } from 'src/typeorm/trips.entity';
import { Repository } from 'typeorm';
import { CreateTripDto } from '../dtos/CreateTrip.dto';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(TripsEntity)
    private readonly tripsRepository: Repository<TripsEntity>,
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      'trips-geolocation-details',
      { topics: ['trip-geolocation-details'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const dataString = message.value.toString();
          const dataObject = JSON.parse(dataString);

          const tripId = dataObject.tripId;

          const pricePerMeter = 1.5 / 1000; //temporarily --->
          const distanceInMeters = dataObject.distance;

          const tripPrice = distanceInMeters * pricePerMeter;
          const roundedTripPrice = parseFloat(tripPrice.toFixed(2)); //temporarily  -<<<<<

          const updateData: UpdateTripData = {
            estimatedDurationOfRide: dataObject.estimatedDurationOfRide,
            distance: dataObject.distance,
            routePath: dataObject.routePath,
            tripPrice: roundedTripPrice, //temporarily
          };

          await this.updateTripById(tripId, updateData);
        },
      },
    );
    await this.consumerService.consume(
      'rider-create-trip',
      { topics: ['rider-create-trip'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const dataString = message.value.toString();
          const dataObject = JSON.parse(dataString);

          const tripData: CreateTripDto = {
            riderId: dataObject.riderId,
            pickUp: dataObject.pickUp,
            dropOff: dataObject.dropOff,
          };
          console.log(tripData, 'tripData');

          await this.createTrip(tripData);
        },
      },
    );
  }

  async findOne(tripId: number): Promise<TripsEntity | undefined> {
    const trip = await this.tripsRepository.findOne({
      where: { tripId },
    });

    return trip;
  }

  async createTrip(data: CreateTripDto): Promise<TripsEntity | ResponseData> {
    const trip = await this.tripsRepository.save(data);

    await this.producerService.produce({
      topic: 'rider-trip-locations',
      messages: [
        {
          value: JSON.stringify(trip),
        },
      ],
    });

    console.log(`sent to geolocation ms ${JSON.stringify(trip)}`);

    return { message: 'Trip created successfully', statusCode: 200 };
  }

  async assignDriver() {
    // find best driver from drivers microservice,
  }

  async updateTripById(
    tripId: number,
    updateData: Partial<TripsEntity>,
  ): Promise<TripsEntity> {
    const trip = await this.tripsRepository.findOne({ where: { tripId } });
    if (!trip) {
      throw new Error('Trip not found');
    }

    const updatedRider = await this.tripsRepository.save({
      ...trip,
      ...updateData,
    });

    return updatedRider;
  }
}
// find best driver, in driver service
