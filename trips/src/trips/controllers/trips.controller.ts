import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TripsService } from '../services/trips.service';
import { TripsEntity } from 'src/typeorm/trips.entity';
import { CreateTripDto } from '../dtos/CreateTrip.dto';

@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Get(':bookingId')
  async findOne(@Param('bookingId') bookingId: number): Promise<TripsEntity> {
    return await this.tripsService.findOne(bookingId);
  }

  @Post()
  async createTrip(@Body() data: CreateTripDto): Promise<any> {
    return await this.tripsService.createTrip(data);
  }
}
