import { IsNumber, IsString } from 'class-validator';

export class ReturnNearbyDriver {
  @IsNumber()
  driverId: number;

  // @IsNumber()
  // vehicleClass: number;

  // @IsNumber()
  // radius: number;

  // @IsString()
  // unit: 'm' | 'km' | 'mi' | 'ft';
}
