import { Type } from 'class-transformer';
import { IsEnum, ValidateNested, IsNotEmpty, IsNumber } from 'class-validator';

export enum Status {
  Online = 'online',
  Offline = 'offline',
}

export class LocationDto {
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  long: number;
}

export class ChangeStatusDto {
  @IsEnum(Status)
  status: Status;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
