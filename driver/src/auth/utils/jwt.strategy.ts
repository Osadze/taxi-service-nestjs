import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'jskldjskl2qj31ojku8217u90391ewk-mdnmaskj1301wp3sdamd9k12m3-123', // env
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, phoneNumber: payload.phoneNumber };
  }
}
