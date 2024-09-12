import { IsNumber } from 'class-validator';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTripDto {
  @IsNumber()
  @IsNotEmpty()
  riderId: number;

  @IsString()
  @IsNotEmpty()
  pickUp: { [key: string]: string };

  @IsString()
  @IsNotEmpty()
  dropOff: { [key: string]: string };
}
