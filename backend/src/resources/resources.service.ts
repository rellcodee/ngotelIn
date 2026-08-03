import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { put, del } from '@vercel/blob';
@Injectable()
export class ResourcesService {

  constructor(private readonly prisma: PrismaService) { }
  async create(createResourceDto: CreateResourceDto, files?: Express.Multer.File[]) {
    try {
      const resource = await this.prisma.resources.create({
        data: {
          name: createResourceDto.name,
          type: createResourceDto.type,
          location: createResourceDto.location,
          capacity: createResourceDto.capacity ? Number(createResourceDto.capacity) : null,
          price_per_night: Number(createResourceDto.price_per_night),
          facilities: createResourceDto.facilities || [],
        },
      });

      // 2. Jika ada file gambar yang diunggah
      if (files && files.length > 0) {
        const uploadPromises = files.map(async (file, index) => {
          const fileName = `room-images/${resource.id}-${Date.now()}-${file.originalname}`;
          const blob = await put(fileName, file.buffer, { access: 'public' });

          return {
            resource_id: resource.id,
            image_url: blob.url,
            is_primary: index === 0, // Foto pertama otomatis jadi foto utama
          };
        });

        const uploadedImagesData = await Promise.all(uploadPromises);

        await this.prisma.room_images.createMany({
          data: uploadedImagesData,
        });
      }

      return await this.prisma.resources.findUnique({
        where: { id: resource.id },
        include: { room_images: true },
      });

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Resource dengan nama tersebut sudah terdaftar!');
      }

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
      include: {
        room_images: true,
      }
    });
  }

  async findOne(id: string) {
    const resource = await this.prisma.resources.findUnique({
      where: { id },
      include: {
        room_images: true,
      }
    });

    if (!resource) {
      throw new NotFoundException(`Resource dengan ID ${id} tidak ditemukan`);
    }

    return resource;
  }

  async update(
    id: string,
    updateDto: UpdateResourceDto,
    files?: Express.Multer.File[],
    deleteImageIds?: string[]
  ) {
    // A. Cek apakah kamar ada di DB
    const existingResource = await this.prisma.resources.findUnique({
      where: { id },
      include: { room_images: true },
    });

    if (!existingResource) {
      throw new NotFoundException(`Resource/Kamar dengan ID ${id} tidak ditemukan`);
    }

    try {
      if (deleteImageIds && deleteImageIds.length > 0) {
        // Cari URL foto fisik di DB yang ID-nya masuk ke list deleteImageIds
        const imagesToDelete = await this.prisma.room_images.findMany({
          where: {
            id: { in: deleteImageIds },
            resource_id: id,
          },
        });

        if (imagesToDelete.length > 0) {
          // Hapus dari Vercel Blob
          const deleteBlobPromises = imagesToDelete.map((img) => del(img.image_url));
          await Promise.all(deleteBlobPromises);

          // Hapus dari Database
          await this.prisma.room_images.deleteMany({
            where: { id: { in: deleteImageIds } },
          });
        }
      }

      // Proses Upload New Photo
      if (files && files.length > 0) {
        const uploadPromises = files.map(async (file, i) => {
          const fileName = `room-images/${id}-${Date.now()}-${file.originalname}`;
          const blob = await put(fileName, file.buffer, { access: 'public' });

          return {
            resource_id: id,
            image_url: blob.url,
            is_primary: i === 0,
          };
        });

        const newImagesData = await Promise.all(uploadPromises);

        await this.prisma.room_images.createMany({
          data: newImagesData,
        });
      }

      await this.prisma.resources.update({
        where: { id },
        data: {
          name: updateDto.name,
          type: updateDto.type,
          location: updateDto.location,
          capacity: updateDto.capacity ? Number(updateDto.capacity) : undefined,
          price_per_night: updateDto.price_per_night ? Number(updateDto.price_per_night) : undefined,
          facilities: updateDto.facilities,
        },
      });

      // Return data terbaru lengkap dengan foto-fotonya
      return await this.prisma.resources.findUnique({
        where: { id },
        include: { room_images: true },
      });

    } catch (error) {
      throw new InternalServerErrorException('Gagal memperbarui data kamar dan gambar');
    }
  }

  async remove(id: string) {
    // Cari kamar beserta daftar gambar-gambarnya dulu
    const resource = await this.prisma.resources.findUnique({
      where: { id },
      include: { room_images: true },
    });

    if (!resource) {
      throw new NotFoundException(`Resource/Kamar dengan ID ${id} tidak ditemukan`);
    }

    try {
      // Jika kamar punya foto, hapus SEMUA file fisiknya di Blob
      if (resource.room_images && resource.room_images.length > 0) {
        const deleteBlobPromises = resource.room_images.map((img) => del(img.image_url));
        await Promise.all(deleteBlobPromises);
      }

      // Setelah file di cloud bersih, baru hapus data kamar dari database
      await this.prisma.resources.delete({
        where: { id },
      });

      return {
        message: `Kamar "${resource.name}" beserta seluruh gambarnya berhasil dihapus dari cloud dan database!`,
      };
    } catch (error) {
      throw new InternalServerErrorException('Gagal menghapus kamar beserta gambarnya');
    }
  }

  async findAvailableRooms(checkIn: string, checkOut: string) {
    const busySchedules = await this.prisma.schedules.findMany({
      where: {
        status: { in: ['booked', 'maintenance'] },
        start_time: { lt: new Date(checkOut) },
        end_time: { gt: new Date(checkIn) },
      },
      select: {
        resource_id: true, // ambil id kamar sibuk
      },
    });

    const busyResourceIds = busySchedules.map((s) => s.resource_id)
      .filter((id: string): id is string => id !== null);

    // 2. Tampilkan semua kamar dari tabel Resources yang ID-nya TIDAK ADA di list kamar sibuk
    return this.prisma.resources.findMany({
      where: {
        id: {
          notIn: busyResourceIds, // KUNCI UTAMA: Tampilkan yang tidak sibuk!
        },
      },
    });
  }
}
