import { IsNumber, IsString } from 'class-validator';

export class GetNearbyDriversDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  long: number;

  @IsNumber()
  radius: number;

  @IsString()
  unit: 'm' | 'km' | 'mi' | 'ft';
}
