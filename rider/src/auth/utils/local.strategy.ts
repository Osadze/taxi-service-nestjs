import { VerifyNumberDto } from './../dtos/VerifyNumberDto';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'phoneNumber', passwordField: 'verificationCode' });
  }
  async validate(
    phoneNumber: string,
    verificationCode: string,
  ): Promise<VerifyNumberDto> {
    const user = await this.authService.validateUser(
      phoneNumber,
      verificationCode,
    );
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
