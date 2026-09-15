import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    // Override handleRequest agar tidak melempar UnauthorizedException jika token tidak ada / invalid
    handleRequest(err: any, user: any) {
        return user || null; // Jika guest, req.user bernilai null
    }
}
