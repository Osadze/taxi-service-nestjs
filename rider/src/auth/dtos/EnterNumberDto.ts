import { IsNotEmpty, Matches } from 'class-validator';

export class EnterNumberDto {
  @IsNotEmpty()
  @Matches(/^\+995[5][0-9]{8}$/, {
    message: 'PhoneNumber must be a valid Georgian phone number',
  })
  phoneNumber: string;
}