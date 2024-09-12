import { Injectable } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';

@Injectable()
export class TripsService {
  constructor(
    private googleMapsService: GoogleMapsService,
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  async onModuleInit() {
    // await this.consumerService.consume(
    //   'rider-trip-locations',
    //   { topics: ['rider-trip-locations'] },
    //   {
    //     eachMessage: async ({ topic, partition, message }) => {
    //       try {
    //         const dataString = message.value.toString();
    //         const dataObject = JSON.parse(dataString);

    //         const pickUpObject = JSON.parse(dataObject.pickUp);
    //         const dropOffObject = JSON.parse(dataObject.dropOff);

    //         const tripId = dataObject.tripId;
    //         const pickupLat = pickUpObject.Lat;
    //         const pickupLng = pickUpObject.Lng;
    //         const dropoffLat = dropOffObject.Lat;
    //         const dropoffLng = dropOffObject.Lng;

    //         console.log(
    //           'this came from trips ms' + tripId,
    //           pickupLat,
    //           pickupLng,
    //           dropoffLat,
    //           dropoffLng,
    //         );

    //         await this.calculateTrip(
    //           tripId,
    //           pickupLat,
    //           pickupLng,
    //           dropoffLat,
    //           dropoffLng,
    //         );
    //       } catch (error) {
    //         console.error(error);
    //       }
    //     },
    //   },
    // );
    await this.consumerService.consume(
      'rider-locations-group',
      { topics: ['rider-request-ride'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const dataString = message.value.toString();
            const dataObject = JSON.parse(dataString);

            const pickUpObject = JSON.parse(dataObject.pickUp);
            const dropOffObject = JSON.parse(dataObject.dropOff);

            const riderId = pickUpObject.riderId;
            const pickupLat = pickUpObject.Lat;
            const pickupLng = pickUpObject.Lng;
            const dropoffLat = dropOffObject.Lat;
            const dropoffLng = dropOffObject.Lng;

            console.log(
              'this came from rider ms',
              riderId,
              pickupLat,
              pickupLng,
              dropoffLat,
              dropoffLng,
            );

            await this.calculateTrip(
              riderId,
              pickupLat,
              pickupLng,
              dropoffLat,
              dropoffLng,
            );
          } catch (error) {
            console.error(error);
          }
        },
      },
    );
  }

  async calculateTrip(
    riderId: number,
    pickupLat: number,
    pickupLng: number,
    dropoffLat: number,
    dropoffLng: number,
  ) {
    console.log(riderId, pickupLat, pickupLng, dropoffLat, dropoffLng);

    const tripDetails = await this.googleMapsService.getRideDetails(
      riderId,
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng,
    );

    const routePath = tripDetails.encodedPolyline;
    const distance = tripDetails.distanceInMeters;
    const estimatedDurationOfRide = tripDetails.durationInSeconds;

    await this.producerService.produce({
      topic: 'trip-geolocation-details',
      messages: [
        {
          value: JSON.stringify({
            estimatedDurationOfRide: estimatedDurationOfRide,
            distance: distance,
            routePath: routePath,
          }),
        },
      ],
    });

    console.log(
      {
        estimatedDurationOfRide: estimatedDurationOfRide,
        distance: distance,
        routePath: routePath,
      },
      'sent to rider ms',
    );
    return tripDetails;
  }
  // async calculateTrip(
  //   tripId: number, // for update trip service
  //   pickupLat: number,
  //   pickupLng: number,
  //   dropoffLat: number,
  //   dropoffLng: number,
  // ) {
  //   const tripDetails = await this.googleMapsService.getRideDetails(
  //     pickupLat,
  //     pickupLng,
  //     dropoffLat,
  //     dropoffLng,
  //   );

  //   const routePath = tripDetails.encodedPolyline;
  //   const distance = tripDetails.distanceInMeters;
  //   const estimatedDurationOfRide = tripDetails.durationInSeconds;

  //   await this.producerService.produce({
  //     topic: 'trip-geolocation-details',
  //     messages: [
  //       {
  //         value: JSON.stringify({
  //           tripId: tripId,
  //           estimatedDurationOfRide: estimatedDurationOfRide,
  //           distance: distance,
  //           routePath: routePath,
  //         }),
  //       },
  //     ],
  //   });

  //   console.log(
  //     {
  //       tripId: tripId,
  //       estimatedDurationOfRide: estimatedDurationOfRide,
  //       distance: distance,
  //       routePath: routePath,
  //     },
  //     'sent to trips ms',
  //   );
  //   return tripDetails;
  // }
}
