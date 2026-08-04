import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Ambil JWT dari HTTP-Only Cookie, atau jatuh kembali ke Auth Header (Postman)
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.cookies?.access_token || null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'ngotelin_jaya_jaya',
    });
  }

  validate(payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
