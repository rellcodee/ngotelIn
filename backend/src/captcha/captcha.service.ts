import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CaptchaService {
  async validate(token?: string, remoteIp?: string): Promise<void> {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) return;
    if (!token) throw new BadRequestException('CAPTCHA wajib diselesaikan');

    const form = new URLSearchParams({ secret, response: token });
    if (remoteIp) form.set('remoteip', remoteIp);

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form,
      },
    );
    const result = (await response.json()) as { success?: boolean };
    if (!response.ok || !result.success) {
      throw new BadRequestException('Verifikasi CAPTCHA gagal');
    }
  }
}
