import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TripsService } from '../services/trips.service';
import { CreateTripDto } from '../dtos/CreateTrip.dto';

@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Get('request-ride')
  async createTrip(@Body() data: CreateTripDto): Promise<any> {
    return await this.tripsService.requestRide(data);
  }
}
