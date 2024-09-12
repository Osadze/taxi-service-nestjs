import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DriverEntity } from 'src/typeorm/driver.entity';
import { LocationsService } from './locations.service';
import { ChangeStatusDto } from './dtos/changeStatus.dto';
import { CreateLocationDto } from './dtos/create-location.dto';
import { GetNearbyDriversDto } from './dtos/getNearbyDrivers.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationsService) {}

  @Patch('status/:id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true, // to throw an error if non-whitelisted properties are present
    }),
  )
  async changeDriverStatus(
    @Param('id') id: number,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    await this.locationService.changeDriverStatus(
      id,
      changeStatusDto.status,
      changeStatusDto.location,
    );

    return `Driver ${changeStatusDto.status}`;
  }
  @Get('test')
  async test(@Body() getNearbyDrivers: GetNearbyDriversDto) {
    const drivers =
      await this.locationService.getNearbyDrivers(getNearbyDrivers);
    return drivers;
  }
}
