import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // Kalau rutenya nggak dipakein tag @Roles(...), berarti siapapun yg udah login bebas masuk
    if (!requiredRoles) {
      return true;
    }

    // Tarik data user yang sudah lolos validasi JWT di HTTP request
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      return false;
    }

    // Cek apakah role akun tersebut match dengan spesifikasi rute
    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      throw new ForbiddenException(
        'Akses Ditolak! Akun Anda tidak berhak melakukan aksi operasional ini.',
      );
    }

    return true;
  }
}
