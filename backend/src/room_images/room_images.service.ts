import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { put, del } from '@vercel/blob';

@Injectable()
export class RoomImagesService {
  constructor(private readonly prisma: PrismaService) { }

  // 1. UPLOAD FILE KE VERCEL BLOB + SIMPAN KE DB
  async uploadImage(resourceId: string, file: Express.Multer.File, isPrimary: boolean = false) {
    if (!file) {
      throw new BadRequestException('File gambar wajib diunggah!');
    }

    const resource = await this.prisma.resources.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new NotFoundException(`Kamar/Resource dengan ID ${resourceId} tidak ditemukan`);
    }

    try {
      // A. Upload file buffer ke Vercel Blob
      const fileName = `room-images/${resourceId}-${Date.now()}-${file.originalname}`;
      const blob = await put(fileName, file.buffer, {
        access: 'public',
      });

      // B. Simpan data ke database sesuai schema
      const room_image = await this.prisma.room_images.create({
        data: {
          resource_id: resourceId,
          image_url: blob.url, // URL resmi dari CDN Vercel Blob
          is_primary: isPrimary,
        },
      });

      return {
        message: 'Gambar kamar berhasil diunggah!',
        data: room_image,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Gambar kamar ini sudah terdaftar dalam sistem!');
      }

      throw new InternalServerErrorException('Terjadi kesalahan internal saat mengunggah gambar');
    }
  }

  // 2. AMBIL SEMUA GAMBAR
  async findAll() {
    return await this.prisma.room_images.findMany();
  }

  // 3. AMBIL SEMUA GAMBAR BERDASARKAN RESOURCE ID
  async findByResource(resourceId: string) {
    return await this.prisma.room_images.findMany({
      where: { resource_id: resourceId },
    });
  }

  // 4. AMBIL SINGLE GAMBAR
  async findOne(id: string) {
    const room_image = await this.prisma.room_images.findUnique({
      where: { id },
    });

    if (!room_image) {
      throw new NotFoundException(`Gambar kamar dengan ID ${id} tidak ditemukan`);
    }
    return room_image;
  }

  // 5. HAPUS GAMBAR
  async remove(id: string) {
    const room_image = await this.prisma.room_images.findUnique({
      where: { id },
    });

    if (!room_image) {
      throw new NotFoundException(`Gambar kamar dengan ID ${id} tidak ditemukan`);
    }

    try {
      // A. Hapus file fisik dari Vercel Blob jika ada URL-nya
      if (room_image.image_url) {
        await del(room_image.image_url);
      }

      // B. Hapus record dari PostgreSQL
      await this.prisma.room_images.delete({
        where: { id },
      });

      return { success: true, message: `Gambar kamar dengan ID ${id} berhasil dihapus dari cloud dan database` };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException(`Gambar kamar dengan ID ${id} tidak ditemukan`);
      }

      throw new InternalServerErrorException('Terjadi kesalahan internal saat menghapus gambar');
    }
  }
}