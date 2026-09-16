import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(
    email: string,
    pass: string,
    request: { body?: { captcha_token?: string }; ip?: string },
  ): Promise<Record<string, any>> {
    await this.authService.validateCaptcha(
      request.body?.captcha_token,
      request.ip,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = await this.authService.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Email atau password salah!');
    }
    return user;
  }
}
