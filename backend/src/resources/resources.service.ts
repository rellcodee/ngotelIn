import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, BadRequestException, HttpException, Inject } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class ResourcesService {

  constructor(private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }
  async create(createResourceDto: CreateResourceDto, files?: Express.Multer.File[]) {
    try {

      if (files && files.length > 5) {
        throw new BadRequestException('Maksimal foto yang diunggah adalah 5 file!');
      }

      const existingResource = await this.prisma.resources.findUnique({
        where: { name: createResourceDto.name },
      });

      if (existingResource) {
        throw new ConflictException('Resource dengan nama tersebut sudah terdaftar!');
      }

      const resource = await this.prisma.resources.create({
        data: {
          name: createResourceDto.name,
          type: createResourceDto.type,
          location: createResourceDto.location,
          description: createResourceDto.description,
          capacity: createResourceDto.capacity ? Number(createResourceDto.capacity) : null,
          price_per_night: Number(createResourceDto.price_per_night),
          facilities: createResourceDto.facilities || [],
        },
      });

      // 2. Jika ada file gambar yang diunggah
      if (files && files.length > 0) {
        const uploadFolder = path.resolve('./public/uploads/rooms');

        // Pastikan folder tujuan ada
        await fs.mkdir(uploadFolder, { recursive: true });

        const uploadPromises = files.map(async (file, index) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const fileName = `room-${uniqueSuffix}${ext}`;
          const filePath = path.join(uploadFolder, fileName);

          // Tulis fisik buffer ke hard disk
          await fs.writeFile(filePath, file.buffer);

          return {
            resource_id: resource.id,
            image_url: `/uploads/rooms/${fileName}`,
            is_primary: index === 0,
          };
        });

        const uploadedImagesData = await Promise.all(uploadPromises);

        await this.prisma.room_images.createMany({
          data: uploadedImagesData,
        });
      }

      await this.cacheManager.set('resources:version', Date.now(), 0);
      return await this.prisma.resources.findUnique({
        where: { id: resource.id },
        include: { room_images: true },
      });


    } catch (error) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Resource dengan nama tersebut sudah terdaftar!');
      }

      throw new InternalServerErrorException('Terjadi kesalahan internal pada server');
    }
  }

  async findAll(query?: { search?: string; location?: string; type?: string }) {
    const { search, location, type } = query || {};

    const currentVersion = (await this.cacheManager.get<number>('resources:version')) || 1;

    const searchPart = search ? `search:${search.toLowerCase().trim()}` : '';
    const locPart = location ? `loc:${location.toLowerCase().trim()}` : '';
    const typePart = type ? `type:${type.toLowerCase().trim()}` : '';

    const filterKey = [searchPart, locPart, typePart].filter(Boolean).join(':');

    const cacheKey = filterKey
      ? `resources:v${currentVersion}:filter:${filterKey}`
      : `resources:v${currentVersion}:all`;

    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const whereCondition: Prisma.resourcesWhereInput = {};

    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (location) {
      whereCondition.location = { contains: location, mode: 'insensitive' };
    }
    if (type) {
      whereCondition.type = type;
    }

    const resources = await this.prisma.resources.findMany({
      where: whereCondition,
      include: {
        room_images: true,
      },
    });

    await this.cacheManager.set(cacheKey, resources, 3600000);
    return resources;
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
    deleteImageIds?: string[],
    primaryImageId?: string,
  ) {
    const existingResource = await this.prisma.resources.findUnique({
      where: { id },
      include: { room_images: true },
    });

    if (!existingResource) {
      throw new NotFoundException(`Resource/Kamar dengan ID ${id} tidak ditemukan`);
    }

    try {
      const currentImagesCount = existingResource.room_images.length;
      const deleteCount = deleteImageIds ? deleteImageIds.length : 0;
      const newFilesCount = files ? files.length : 0;

      const finalImageCount = currentImagesCount - deleteCount + newFilesCount;

      if (finalImageCount > 5) {
        throw new BadRequestException(
          `Maksimal total foto untuk 1 kamar adalah 5! Setelah perubahan ini total foto akan menjadi ${finalImageCount}.`,
        );
      }

      if (deleteImageIds && deleteImageIds.length > 0) {
        const imagesToDelete = await this.prisma.room_images.findMany({
          where: { id: { in: deleteImageIds }, resource_id: id },
        });

        if (imagesToDelete.length > 0) {
          const deleteFilePromises = imagesToDelete.map(async (img) => {
            try {
              const cleanPath = img.image_url.startsWith('/')
                ? img.image_url.slice(1)
                : img.image_url;
              const fullPath = path.resolve('./public', cleanPath);
              await fs.unlink(fullPath);
            } catch (err) {
              console.error(`Gagal menghapus file lokal: ${img.image_url}`, err);
            }
          });
          await Promise.all(deleteFilePromises);

          await this.prisma.room_images.deleteMany({
            where: { id: { in: deleteImageIds } },
          });
        }
      }

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

      if (files && files.length > 0) {
        const remainingImages = await this.prisma.room_images.findMany({
          where: { resource_id: id },
        });
        const hasPrimary = remainingImages.some((img) => img.is_primary);

        const uploadFolder = path.resolve('./public/uploads/rooms');
        await fs.mkdir(uploadFolder, { recursive: true });

        const uploadPromises = files.map(async (file, i) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const fileName = `room-${uniqueSuffix}${ext}`;
          const filePath = path.join(uploadFolder, fileName);

          await fs.writeFile(filePath, file.buffer);

          return {
            resource_id: id,
            image_url: `/uploads/rooms/${fileName}`,
            is_primary: !hasPrimary && i === 0,
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
          description: updateDto.description,
          capacity: updateDto.capacity ? Number(updateDto.capacity) : undefined,
          price_per_night: updateDto.price_per_night
            ? Number(updateDto.price_per_night)
            : undefined,
          facilities: updateDto.facilities,
        },
      });

      await this.cacheManager.set('resources:version', Date.now(), 0);

      return await this.prisma.resources.findUnique({
        where: { id },
        include: { room_images: true },
      });

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Update resource error: ', error);
      throw new InternalServerErrorException('Gagal memperbarui data kamar dan gambar');
    }
  }


  async remove(id: string) {
    const resource = await this.prisma.resources.findUnique({
      where: { id },
      include: { room_images: true },
    });

    if (!resource) {
      throw new NotFoundException(`Resource/Kamar dengan ID ${id} tidak ditemukan`);
    }

    try {
      // 1. Hapus semua file fisik dari disk lokal
      if (resource.room_images && resource.room_images.length > 0) {
        const deletePromises = resource.room_images.map(async (image) => {
          try {
            const cleanPath = image.image_url.startsWith('/')
              ? image.image_url.slice(1)
              : image.image_url;
            const fullPath = path.resolve('./public', cleanPath);
            await fs.unlink(fullPath);
          } catch (err) {
            console.error(`Gagal menghapus file lokal: ${image.image_url}`, err);
          }
        });
        await Promise.all(deletePromises);
      }

      // 2. Hapus data kamar dari database (relasi room_images otomatis terhapus via onDelete: Cascade)
      await this.prisma.resources.delete({
        where: { id },
      });

      await this.cacheManager.set('resources:version', Date.now(), 0);
      return {
        message: `Kamar "${resource.name}" beserta seluruh gambarnya berhasil dihapus dari server dan database!`,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Error saat menghapus resource:', error);
      throw new InternalServerErrorException('Gagal menghapus kamar beserta gambarnya');
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
      include: { room_images: { where: { is_primary: true } } }
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
      }
    });

    const statusMap = new Map<string, string>();
    activeSchedules.forEach(schedule => {
      if (schedule.resource_id && schedule.status) {
        statusMap.set(schedule.resource_id, schedule.status);
      }
    });

    return allResources.map(res => ({
      ...res,
      current_status: statusMap.get(res.id) || 'available'
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
