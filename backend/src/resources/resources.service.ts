import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class ResourcesService {

  constructor(private readonly prisma: PrismaService) { }
  async create(createResourceDto: CreateResourceDto) {

    try {
      const resource = await this.prisma.resources.create({
        data: createResourceDto,
      });
      return resource;
    } catch (error) {

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Resource dengan nama tersebut sudah terdaftar!');
      }

      //  error-nya di luar masalah duplikat
      throw new InternalServerErrorException('Terjadi kesalahan internal pada server');
    }

  }

  async findAll(query?: { search?: string; location?: string; type?: string }) {
    const { search, location, type } = query || {};

    // Penampung kondisi filter Prisma
    const whereCondition: Prisma.resourcesWhereInput = {};

    // 1. Logika untuk Search Bar (Mencari teks di nama atau lokasi)
    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 2. Logika untuk Filter Select (Pencocokan Tepat / Exact Match)
    // Kalau ada filter lokasi (misal user pilih 'Lantai 2' di dropdown)
    if (location) {
      whereCondition.location = { contains: location, mode: 'insensitive' };
    }

    // Kalau ada filter type (misal user pilih 'MEWAH' di dropdown)
    if (type) {
      whereCondition.type = type; // Langsung match (bisa sesuaikan kalau pakai Enum)
    }

    // Eksekusi ke database dengan semua filter yang aktif
    return await this.prisma.resources.findMany({
      where: whereCondition,
    });
  }

  async findOne(id: string) {
    const resource = await this.prisma.resources.findUnique({
      where: { id },
    });

    if (!resource) {
      throw new NotFoundException(`Resource dengan ID ${id} tidak ditemukan`);
    }

    return resource;
  }

  async update(id: string, updateResourceDto: UpdateResourceDto) {
    try {
      const resource = await this.prisma.resources.update({
        where: { id },
        data: updateResourceDto,
      });
      return resource;
    } catch (error) {
      throw new NotFoundException(`Resource dengan ID ${id} tidak ditemukan`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.resources.delete({
        where: { id },
      });
      return { message: `Resource dengan ID ${id} berhasil dihapus` };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Resource dengan ID ${id} tidak ditemukan`);
      }
    }
  }
}
