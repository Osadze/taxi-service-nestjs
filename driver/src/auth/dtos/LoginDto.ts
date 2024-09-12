import { IsNotEmpty, IsEmail, Matches, ValidateIf } from 'class-validator';

export class LoginDto {
  @ValidateIf(o => !o.email)
  @IsNotEmpty()
  @Matches(/^\+995[5][0-9]{8}$/, {
    message: 'PhoneNumber must be a valid Georgian phone number',
  })
  phoneNumber?: string;

  @ValidateIf(o => !o.phoneNumber)
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;
}


// if we want to use both phoneNumber and email for login