import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RecaptchaGuard implements CanActivate {
    constructor(private configService: ConfigService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { captchaToken } = request.body;

        if (!captchaToken) {
            throw new BadRequestException('reCAPTCHA token tidak ditemukan.');
        }

        const secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');

        if (!secretKey) {
            throw new BadRequestException('RECAPTCHA_SECRET_KEY tidak ditemukan.');
        }

        const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
        const params = new URLSearchParams({
            secret: secretKey,
            response: captchaToken,
        });

        const googleRes = await fetch(verifyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });

        const result = await googleRes.json();

        // result = { success: true/false, score: 0.9, action: 'confirm_booking', ... }
        // Skor di bawah 0.5 biasanya dicurigai sebagai bot
        if (!result.success || result.score < 0.5) {
            throw new ForbiddenException('Aktivitas mencurigakan (terdeteksi bot).');
        }

        console.log(`reCAPTCHA Token valid! Score: ${result.score}, Action: ${result.action}`);
        return true; // Lolos

    }
}