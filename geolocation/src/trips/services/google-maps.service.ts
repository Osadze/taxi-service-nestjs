import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { map } from 'rxjs/operators';

@Injectable()
export class GoogleMapsService {
  constructor(private httpService: HttpService) {}

  async getRideDetails(
    riderId: number,
    pickupLat: number,
    pickupLng: number,
    dropoffLat: number,
    dropoffLng: number,
  ) {
    const apiKey = 'key'; 
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

    const requestBody = {
      origin: {
        location: {
          latLng: {
            latitude: pickupLat,
            longitude: pickupLng,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: dropoffLat,
            longitude: dropoffLng,
          },
        },
      },
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE',
      // ... other options
    };

    return this.httpService
      .post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask':
            'routes.duration,routes.distanceMeters,routes.localizedValues,routes.polyline.encodedPolyline,routes.legs.steps',
        },
      })
      .pipe(
        map((response) => {
          const routes = response.data.routes;
          if (!routes || routes.length === 0) {
            throw new Error('No routes found');
          }
          const firstRoute = routes[0];
          const duration = firstRoute.localizedValues.duration.text;
          const distance = firstRoute.localizedValues.distance.text;
          const encodedPolyline = firstRoute.polyline.encodedPolyline;
          const durationInSeconds = parseInt(
            firstRoute.duration.match(/\d+/)[0],
            10,
          );
          const distanceInMeters = firstRoute.distanceMeters;

          const steps = firstRoute.legs.flatMap((leg) =>
            leg.steps.map((step) => {
              return {
                instruction: step.navigationInstruction,
                stepDistance: step.localizedValues.distance.text,
                stepDuration: step.localizedValues.staticDuration.text,
                startLocation: step.startLocation.latLng,
                endLocation: step.endLocation.latLng,
              };
            }),
          );

          return {
            duration,
            distance,
            encodedPolyline,
            steps,
            distanceInMeters,
            durationInSeconds,
            riderId,
          };
        }),
      )
      .toPromise();
  }
}
