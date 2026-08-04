import { Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    const { access_token } = this.authService.login(req.user);

    // 1. Simpan token JWT ke HTTP-Only Cookie
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HANYA kirim lewat HTTPS di Production
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // Masa aktif 1 Hari (miliadetik)
    });

    // 2. Kembalikan data profil user (tanpa memotong keamanan token di response body)
    return {
      message: 'Login berhasil!',
      user: req.user,
      access_token,
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logout berhasil, sesi telah dihapus.' };
  }
}
