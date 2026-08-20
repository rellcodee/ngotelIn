import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOfficialDto } from './dto/create-official.dto';
import { Role } from '../common/enums';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.users.create({
        data: {
          ...userData,
          password_hash: hashedPassword,
        },
      });

      const { password_hash: _, ...result } = user;
      return result;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email sudah terdaftar!');
      }
      throw error;
    }
  }

  // Tambahkan fungsi ini di bawah fungsi create() yang udah lu punya
  async findOrCreateGoogleUser(googlePayload: { email: string; name?: string }) {
    let user = await this.findByEmail(googlePayload.email);

    if (!user) {
      // Auto-register kalau email Google ini belum ada di DB
      user = await this.prisma.users.create({
        data: {
          email: googlePayload.email,
          name: googlePayload.name || googlePayload.email.split('@')[0],
          password_hash: null, // Kosongin karena login via Google
          role: Role.USER,        // Kunci mati rolenya sebagai tamu/user
        },
      });
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
      return result;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email sudah terdaftar!');
      }
      throw error;
    }
  }

  async findAll() {
    const users = await this.prisma.users.findMany();
    return users.map(({ password_hash: _, ...user }) => user);
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

    try {
      const user = await this.prisma.users.update({
        where: { id },
        data: updateUserDto,
      });

      const { password_hash: _, ...result } = user;
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
      return { message: `User dengan ID ${id} berhasil dihapus` };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
      }
      throw error;
    }
  }
}
