import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateOfficialDto } from './dto/create-official.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '../common/enums';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { password, captchaToken, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.users.create({
        data: {
          ...userData,
          password_hash: hashedPassword,
        },
      });

      const { password_hash: _, ...result } = user;
      await this.cacheManager.del('users:all');
      return result;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email sudah terdaftar!');
      }
      throw error;
    }
  }

  async findOrCreateGoogleUser(googlePayload: {
    email: string;
    name?: string;
  }) {
    let user = await this.findByEmail(googlePayload.email);

    if (!user) {
      user = await this.prisma.users.create({
        data: {
          email: googlePayload.email,
          name: googlePayload.name || googlePayload.email.split('@')[0],
          password_hash: null, // Kosongin karena login via Google
          role: Role.USER, // Kunci mati rolenya sebagai tamu/user
        },
      });
      await this.cacheManager.del('users:all');
    }

    const { password_hash: _, ...result } = user;
    return result;
  }

  async createOfficial(createOfficialDto: CreateOfficialDto) {
    const { password, ...officialData } = createOfficialDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const official = await this.prisma.users.create({
        data: {
          ...officialData,
          password_hash: hashedPassword,
        },
      });

      const { password_hash: _, ...result } = official;
      await this.cacheManager.del('users:all');
      return result;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email sudah terdaftar!');
      }
      throw error;
    }
  }

  async findAll(query?: GetUsersQueryDto) {
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.max(1, Number(query?.limit) || 10);
    const skip = (page - 1) * limit;
    const search = query?.search?.trim();
    const roleType = query?.roleType;

    const where: Prisma.usersWhereInput = {};

    if (roleType === 'official') {
      where.role = { in: [Role.ADMIN, Role.STAFF] };
    } else if (roleType === 'users') {
      where.role = Role.USER;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.users.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          created_at: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.users.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }
  // --- CEK KEPEMILIKAN AKUN ---
  private checkAccountOwnership(targetId: string, currentUser: any) {
    if (currentUser.role === Role.ADMIN) return;

    if (currentUser.userId !== targetId) {
      throw new ForbiddenException(
        'Akses Ditolak! Anda tidak berhak memanipulasi profil orang lain.',
      );
    }
  }

  async findOne(id: string, currentUser: any) {
    if (
      currentUser.role !== Role.ADMIN &&
      currentUser.role !== Role.STAFF &&
      currentUser.userId !== id
    ) {
      throw new ForbiddenException(
        'Akses Ditolak! Anda tidak berhak melihat profil tamu lain.',
      );
    }

    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
    }
    const { password_hash: _, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUser: any) {
    // Mengecek apakah yang request ini punya hak atas akun ini
    this.checkAccountOwnership(id, currentUser);

    const { password, ...rest } = updateUserDto;

    const payload: any = { ...rest };

    if (currentUser.role !== Role.ADMIN) {
      delete payload.role;
    }

    // Hash password baru sebelum disimpan ke DB
    if (password) {
      payload.password_hash = await bcrypt.hash(password, 10);
    }

    try {
      const user = await this.prisma.users.update({
        where: { id },
        data: payload,
      });

      const { password_hash: _, ...result } = user;
      await this.cacheManager.del('users:all');
      return result;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
      }
      throw error;
    }
  }

  async remove(id: string, currentUser: any) {
    // Mengecek apakah yang request ini punya hak menghapus akun ini
    this.checkAccountOwnership(id, currentUser);

    try {
      await this.prisma.users.delete({
        where: { id },
      });
      await this.cacheManager.del('users:all');
      return { message: `User dengan ID ${id} berhasil dihapus` };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
      }
      throw error;
    }
  }
}
