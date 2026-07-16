import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateRoomImageDto } from './dto/create-room_image.dto';
import { UpdateRoomImageDto } from './dto/update-room_image.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoomImagesService {

  constructor(private readonly prisma: PrismaService) { }

  async create(createRoomImageDto: CreateRoomImageDto) {
    try {
      const room_image = await this.prisma.room_images.create({
        data: createRoomImageDto,
      });
      return room_image;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Gambar kamar ini sudah terdaftar dalam sistem!');
      }

      throw new InternalServerErrorException('Terjadi kesalahan internal saat menyimpan gambar');
    }
  }

  async findAll() {
    return await this.prisma.room_images.findMany();
  }

  async findOne(id: string) {
    const room_image = await this.prisma.room_images.findUnique({
      where: { id },
    });

    if (!room_image) {
      throw new NotFoundException(`Gambar kamar dengan ID ${id} tidak ditemukan`);
    }
    return room_image;
  }

  async update(id: string, updateRoomImageDto: UpdateRoomImageDto) {
    try {
      return await this.prisma.room_images.update({
        where: { id },
        data: updateRoomImageDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Gambar kamar dengan ID ${id} tidak dapat diupdate karena tidak ditemukan`);
      }
      throw new InternalServerErrorException('Terjadi kesalahan internal saat memperbarui gambar');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.room_images.delete({
        where: { id },
      });

      return { success: true, message: `Gambar kamar dengan ID ${id} berhasil dihapus` };
    }
    catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException(`Gambar kamar dengan ID ${id} tidak ditemukan`);
      }

      // FIX: Lempar error fallback jika terjadi masalah database lainnya agar tidak ketelan
      throw new InternalServerErrorException('Terjadi kesalahan internal saat menghapus gambar');
    }
  }
}