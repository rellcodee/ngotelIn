import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()

export class ScheduleService {

  constructor(private prisma: PrismaService) { }

  // Pengecekan Bentrok (Overlapping Validation)

  private async checkOverlap(

    resource_id: string,
    start_time: string,

    end_time: string,

    excludeScheduleId?: string,

  ) {

    const overlapping = await this.prisma.schedules.findFirst({

      where: {

        resource_id,

        id: excludeScheduleId ? { not: excludeScheduleId } : undefined,

        start_time: { lt: new Date(end_time) },

        end_time: { gt: new Date(start_time) },

      },

    });



    if (overlapping) {

      throw new ConflictException(

        'Jadwal bentrok! Fasilitas ini sudah memiliki jadwal pada rentang waktu tersebut.',

      );

    }

  }



  // Statistik (Hitung Booked, Maintenance, dll)

  async getScheduleStats(resource_id?: string) {

    const stats = await this.prisma.schedules.groupBy({

      by: ['status'],

      where: resource_id ? { resource_id } : undefined,

      _count: {

        id: true,

      },

    });

    const result: Record<string, number> = {
      available: 0,
      booked: 0,
      canceled: 0,
      maintenance: 0,

    };



    stats.forEach((item) => {

      if (item.status) {

        result[item.status] = item._count.id;

      }

    });



    return result;

  }



  // Batch Create (Buat Banyak Sekaligus)

  async createBatch(createScheduleDtos: CreateScheduleDto[]) {

    for (const dto of createScheduleDtos) {

      if (dto.resource_id) {

        await this.checkOverlap(dto.resource_id, dto.start_time, dto.end_time);

      }

    }



    const created = await this.prisma.schedules.createMany({

      data: createScheduleDtos,

      skipDuplicates: true,

    });



    return {

      message: `${created.count} jadwal berhasil dibuat.`,

      count: created.count,

    };

  }



  async findOne(id: string) {

    const schedule = await this.prisma.schedules.findUnique({

      where: { id },

      include: { resources: true },

    });



    if (!schedule) {

      throw new NotFoundException(`Schedule dengan ID ${id} tidak ditemukan.`);

    }



    return schedule;

  }

  // CRUD
  async create(createScheduleDto: CreateScheduleDto) {
    if (createScheduleDto.resource_id) {
      await this.checkOverlap(
        createScheduleDto.resource_id,
        createScheduleDto.start_time,
        createScheduleDto.end_time,
      );
    }

    return this.prisma.schedules.create({
      data: createScheduleDto,
    });
  }

  async findAll() {
    return this.prisma.schedules.findMany({
      include: {
        resources: true,
      },
      orderBy: {
        start_time: 'asc',
      },
    });
  }

  async findAvailable(resource_id: string) {
    return this.prisma.schedules.findMany({
      where: {
        resource_id,
        status: 'available',
        start_time: { gte: new Date() },
      },
      orderBy: {
        start_time: 'asc',
      },
    });
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const existingSchedule = await this.findOne(id);

    if (

      updateScheduleDto.start_time || updateScheduleDto.end_time || updateScheduleDto.resource_id

    ) {

      const resourceId = updateScheduleDto.resource_id || existingSchedule.resource_id;

      const startTime = updateScheduleDto.start_time || existingSchedule.start_time.toISOString();

      const endTime = updateScheduleDto.end_time || existingSchedule.end_time.toISOString();

      if (resourceId) {
        await this.checkOverlap(resourceId, startTime, endTime, id);
      }
    }

    return this.prisma.schedules.update({
      where: { id },
      data: updateScheduleDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    const deleted = await this.prisma.schedules.delete({
      where: { id },
    });

    return {
      statusCode: 200,
      message: `Jadwal dengan ID ${id} berhasil dihapus.`,
      data: deleted,
    };
  }

} 