import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { put, del } from '@vercel/blob';
@Injectable()
export class ResourcesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createResourceDto: CreateResourceDto,
    files?: Express.Multer.File[],
  ) {
    try {
      if (files && files.length > 5) {
        throw new BadRequestException(
          'Maksimal foto yang diunggah adalah 5 file!',
        );
      }

      const resource = await this.prisma.resources.create({
        data: {
          name: createResourceDto.name,
          type: createResourceDto.type,
          location: createResourceDto.location,
          description: createResourceDto.description,
          capacity: createResourceDto.capacity
            ? Number(createResourceDto.capacity)
            : null,
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
      if (error instanceof HttpException) throw error;

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Resource dengan nama tersebut sudah terdaftar!',
        );
      }

      throw new InternalServerErrorException(
        'Terjadi kesalahan internal pada server',
      );
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
      },
    });
  }

  async findOne(id: string) {
    const resource = await this.prisma.resources.findUnique({
      where: { id },
      include: {
        room_images: true,
      },
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
    deleteImageIds?: string[],
    primaryImageId?: string,
  ) {
    // A. Cek apakah kamar ada di DB
    const existingResource = await this.prisma.resources.findUnique({
      where: { id },
      include: { room_images: true },
    });

    if (!existingResource) {
      throw new NotFoundException(
        `Resource/Kamar dengan ID ${id} tidak ditemukan`,
      );
    }

    try {
      // B. VALIDASI TOTAL FOTO DI AWAL! (Sebelum hapus/upload apa pun)
      const currentImagesCount = existingResource.room_images.length;
      const deleteCount = deleteImageIds ? deleteImageIds.length : 0;
      const newFilesCount = files ? files.length : 0;

      const finalImageCount = currentImagesCount - deleteCount + newFilesCount;

      if (finalImageCount > 5) {
        throw new BadRequestException(
          `Maksimal total foto untuk 1 kamar adalah 5! Setelah perubahan ini total foto akan menjadi ${finalImageCount}.`,
        );
      }

      // C. PROSES DELETE GAMBAR LAMA
      if (deleteImageIds && deleteImageIds.length > 0) {
        const imagesToDelete = await this.prisma.room_images.findMany({
          where: { id: { in: deleteImageIds }, resource_id: id },
        });

        if (imagesToDelete.length > 0) {
          const deleteBlobPromises = imagesToDelete.map((img) =>
            del(img.image_url),
          );
          await Promise.all(deleteBlobPromises);

          await this.prisma.room_images.deleteMany({
            where: { id: { in: deleteImageIds } },
          });
        }
      }

      // D. PROSES SET PRIMARY IMAGE
      if (primaryImageId) {
        await this.prisma.room_images.updateMany({
          where: { resource_id: id },
          data: { is_primary: false },
        });

        await this.prisma.room_images.updateMany({
          where: { id: primaryImageId, resource_id: id },
          data: { is_primary: true },
        });
      }

      // E. PROSES UPLOAD FOTO BARU
      if (files && files.length > 0) {
        const remainingImages = await this.prisma.room_images.findMany({
          where: { resource_id: id },
        });
        const hasPrimary = remainingImages.some((img) => img.is_primary);

        const uploadPromises = files.map(async (file, i) => {
          const fileName = `room-images/${id}-${Date.now()}-${file.originalname}`;
          const blob = await put(fileName, file.buffer, { access: 'public' });

          return {
            resource_id: id,
            image_url: blob.url,
            is_primary: !hasPrimary && i === 0,
          };
        });

        const newImagesData = await Promise.all(uploadPromises);

        await this.prisma.room_images.createMany({
          data: newImagesData,
        });
      }

      // F. UPDATE DATA TEKS
      await this.prisma.resources.update({
        where: { id },
        data: {
          name: updateDto.name,
          type: updateDto.type,
          location: updateDto.location,
          description: updateDto.description,
          capacity: updateDto.capacity ? Number(updateDto.capacity) : undefined,
          price_per_night: updateDto.price_per_night
            ? Number(updateDto.price_per_night)
            : undefined,
          facilities: updateDto.facilities,
        },
      });

      return await this.prisma.resources.findUnique({
        where: { id },
        include: { room_images: true },
      });
    } catch (error) {
      // 👈 SANGAT PENTING: Biar BadRequestException (400) dan NotFoundException (404)
      // langsung diteruskan ke client tanpa diubah jadi 500!
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Update resource error: ', error);
      throw new InternalServerErrorException(
        'Gagal memperbarui data kamar dan gambar',
      );
    }
  }

  async remove(id: string) {
    // Cari kamar beserta daftar gambar-gambarnya dulu
    const resource = await this.prisma.resources.findUnique({
      where: { id },
      include: { room_images: true },
    });

    if (!resource) {
      throw new NotFoundException(
        `Resource/Kamar dengan ID ${id} tidak ditemukan`,
      );
    }

    try {
      // Jika kamar punya foto, hapus SEMUA file fisiknya di Blob
      if (resource.room_images && resource.room_images.length > 0) {
        const deleteBlobPromises = resource.room_images.map((img) =>
          del(img.image_url),
        );
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
      throw new InternalServerErrorException(
        'Gagal menghapus kamar beserta gambarnya',
      );
    }
  }

  async getLiveStatus(query?: { search?: string; type?: string }) {
    const { search, type } = query || {};
    const whereCondition: Prisma.resourcesWhereInput = {};

    if (search) {
      whereCondition.name = { contains: search, mode: 'insensitive' };
    }

    if (type && type !== 'all') {
      whereCondition.type = type;
    }

    const allResources = await this.prisma.resources.findMany({
      where: whereCondition,
      include: { room_images: { where: { is_primary: true } } },
    });

    const now = new Date();

    // Cari jadwal yang aktif detik ini juga
    const activeSchedules = await this.prisma.schedules.findMany({
      where: {
        start_time: { lte: now },
        end_time: { gte: now },
        status: { in: ['booked', 'maintenance'] },
      },
      select: {
        resource_id: true,
        status: true,
      },
    });

    const statusMap = new Map<string, string>();
    activeSchedules.forEach((schedule) => {
      if (schedule.resource_id && schedule.status) {
        statusMap.set(schedule.resource_id, schedule.status);
      }
    });

    return allResources.map((res) => ({
      ...res,
      current_status: statusMap.get(res.id) || 'available',
    }));
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

    const busyResourceIds = busySchedules
      .map((s) => s.resource_id)
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
