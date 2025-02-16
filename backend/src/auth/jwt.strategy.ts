import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
    console.log('JwtStrategy initialized with secret present:', !!configService.get('JWT_SECRET'));
  }

  async validate(payload: any) {
    console.log('JWT validation - Received payload:', payload);
    const user = {
      userId: payload.sub,
      email: payload.email,
      username: payload.username
    };
    console.log('JWT validation - Returning user:', user);
    return user;
  }
}