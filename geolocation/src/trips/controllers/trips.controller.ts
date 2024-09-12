// ride.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { LocationDto } from '../dtos/LocationDto';
import { TripsService } from '../services/trips.service';

@Controller('ride')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post('calculate')
  async calculateRide(@Body() createRideDto: LocationDto) {
    return this.tripsService.calculateTrip(
      createRideDto.riderId,
      createRideDto.pickupLat,
      createRideDto.pickupLng,
      createRideDto.dropoffLat,
      createRideDto.dropoffLng,
    );
  }
}
