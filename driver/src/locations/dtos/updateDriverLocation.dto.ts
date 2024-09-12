import { IsNumber } from 'class-validator';

export class UpdateDriverLocationDto {
  @IsNumber()
  driverId?: number;

  @IsNumber()
  lat: number;

  @IsNumber()
  long: number;
}
