import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    // Cek apakah user ini login pakai Google atau password biasa
    if (!user.password_hash) {
      throw new UnauthorizedException(
        'Silakan login menggunakan tombol Google Sign-In.',
      );
    }

    if (user && (await bcrypt.compare(pass, user.password_hash))) {
      const { password_hash: _, ...result } = user;
      return result;
    }
    return null;
  }

  async loginWithGoogle(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Token Google tidak valid');
      }

      // Lempar ke UserService buat dicari atau didaftarin
      const user = await this.userService.findOrCreateGoogleUser({
        email: payload.email,
        name: payload.name,
      });

      // Kembalikan JWT sistem lokal lu (fungsi login() lu yang udah ada)
      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Gagal memverifikasi akun Google!');
    }
  }

  login(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
