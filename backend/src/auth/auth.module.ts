import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CaptchaModule } from '../captcha/captcha.module';
import { CaptchaService } from '../captcha/captcha.service';

@Module({
  imports: [
    UserModule,
    CaptchaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'ngotelin_jaya_jaya',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, CaptchaService],
  exports: [CaptchaService],
})
export class AuthModule {}
