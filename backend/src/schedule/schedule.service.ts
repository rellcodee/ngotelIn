import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) { }

  // 1. pengecekan jadwal bentrok (Kunci Utama Dynamic Booking)
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
        // HANYA status ini yang mengunci kamar. 
        // Jika ada jadwal 'canceled', sistem akan mengabaikannya (kamar dianggap kosong).
        status: { in: ['booked', 'maintenance'] },
        start_time: { lt: new Date(end_time) },
        end_time: { gt: new Date(start_time) },
      },
    });

    if (overlapping) {
      throw new ConflictException(
        'Jadwal bentrok! Kamar ini sudah terpesan atau sedang dalam perbaikan pada rentang waktu tersebut.',
      );
    }
  }

  // 2. STATISTIK (Hanya menghitung aksi nyata)
  async getScheduleStats(resource_id?: string) {
    const stats = await this.prisma.schedules.groupBy({
      by: ['status'],
      where: resource_id ? { resource_id } : undefined,
      _count: {
        id: true,
      },
    });

    const result: Record<string, number> = {
      booked: 0,
      canceled: 0,
      maintenance: 0,
    };

    stats.forEach((item) => {
      if (item.status && result[item.status] !== undefined) {
        result[item.status] = item._count.id;
      }
    });

    return result;
  }

  // 3. BATCH CREATE
  async createBatch(createScheduleDtos: CreateScheduleDto[]) {
    if (createScheduleDtos.length === 0) return { count: 0 };

    // Cek Bentrok Internal (Cepat-cepatan di memory)
    const sorted = [...createScheduleDtos].sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    );
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];
      if (
        current.resource_id === next.resource_id &&
        new Date(current.end_time) > new Date(next.start_time)
      ) {
        throw new ConflictException('Ada jadwal yang tabrakan di dalam data yang Anda kirim!');
      }
    }

    // Cek Bentrok ke Database
    const overlapConditions = createScheduleDtos.map((dto) => ({
      resource_id: dto.resource_id,
      status: { in: ['booked', 'maintenance'] },
      start_time: { lt: new Date(dto.end_time) },
      end_time: { gt: new Date(dto.start_time) },
    }));

    if (overlapConditions.length > 0) {
      const dbOverlap = await this.prisma.schedules.findFirst({
        where: { OR: overlapConditions },
      });

      if (dbOverlap) {
        throw new ConflictException('Sebagian jadwal yang dikirim bentrok dengan database!');
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

  // 4. CRUD UMUM
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
      include: { resources: true },
      orderBy: { start_time: 'asc' },
    });
  }

  // 5. PENCARI JADWAL SIBUK (Pengganti findAvailable)
  // Method ini digunakan frontend untuk me-nonaktifkan tanggal di komponen Kalender (DatePicker)
  async findBusySchedules(resource_id: string) {
    return this.prisma.schedules.findMany({
      where: {
        resource_id,
        status: { in: ['booked', 'maintenance'] }, // Ambil yang memblokir saja
        end_time: { gte: new Date() }, // Abaikan jadwal masa lalu
      },
      orderBy: {
        start_time: 'asc',
      },
    });
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const existingSchedule = await this.findOne(id);

    // Asumsikan status default adalah dari DB jika tidak di-passing
    const currentStatus = updateScheduleDto.status || existingSchedule.status;

    // jika statusnya akan diubah jadi canceled, kita tidak perlu cek bentrok lagi.
    // kita hanya cek bentrok kalau statusnya dibiarkan booked/maintenance
    if (
      (currentStatus === 'booked' || currentStatus === 'maintenance') &&
      (updateScheduleDto.start_time || updateScheduleDto.end_time || updateScheduleDto.resource_id)
    ) {
      const resourceId = updateScheduleDto.resource_id || existingSchedule.resource_id;
      const startTime = updateScheduleDto.start_time || existingSchedule.start_time.toISOString();
      const endTime = updateScheduleDto.end_time || existingSchedule.end_time.toISOString();

      if (!resourceId) {
        throw new ConflictException('Resource ID tidak valid atau tidak ditemukan pada jadwal ini.');
      }

      await this.checkOverlap(resourceId, startTime, endTime, id);
    }

    return this.prisma.schedules.update({
      where: { id },
      data: updateScheduleDto,
    });
  }

  async remove(id: string) {
    try {
      const deleted = await this.prisma.schedules.delete({
        where: { id },
      });
      return {
        statusCode: 200,
        message: `Jadwal dengan ID ${id} berhasil dihapus.`,
        data: deleted,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Schedule dengan ID ${id} tidak ditemukan.`);
      }
      throw new InternalServerErrorException('Terjadi kesalahan saat menghapus jadwal');
    }
  }
}