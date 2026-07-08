import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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

  async findAll() {
    const users = await this.prisma.users.findMany();
    return users.map(({ password_hash: _, ...user }) => user);
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
    }
    const { password_hash: _, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
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

  async remove(id: string) {
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
