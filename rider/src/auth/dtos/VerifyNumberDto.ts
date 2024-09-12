import { IsNotEmpty, Matches } from 'class-validator';

export class VerifyNumberDto {
  @IsNotEmpty()
  @Matches(/^\+995[5][0-9]{8}$/, {
    message: 'PhoneNumber must be a valid Georgian phone number',
  })
  phoneNumber: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{4}$/, {
    message: 'VerificationCode must be a valid 4 digit number',
  })
  verificationCode: string;
}
