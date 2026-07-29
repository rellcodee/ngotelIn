import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import {
  ScheduleStatus,
  BookingStatus,
  PaymentStatus,
  Role,
} from '../common/enums';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  // --- CEK KEPEMILIKAN TRANSAKSI ---
  private checkBookingOwnership(
    bookingUserId: string | null,
    currentUser: { userId: string; role: string },
  ) {
    if (currentUser.role === Role.ADMIN || currentUser.role === Role.STAFF) {
      return;
    }
    if (currentUser.userId !== bookingUserId) {
      throw new ForbiddenException(
        'Akses Ditolak! Anda tidak berhak memanipulasi atau melihat transaksi tamu lain.',
      );
    }
  }

  async createBooking(dto: CreateBookingDto) {
    const startTime = new Date(dto.start_time);
    const endTime = new Date(dto.end_time);

    if (endTime <= startTime) {
      throw new BadRequestException(
        'Waktu selesai harus lebih lambat dari waktu mulai!',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const overlappingSchedule = await tx.schedules.findFirst({
        where: {
          resource_id: dto.resource_id,
          status: { in: [ScheduleStatus.BOOKED, ScheduleStatus.MAINTENANCE] },
          AND: [
            { start_time: { lt: endTime } },
            { end_time: { gt: startTime } },
          ],
        },
      });

      if (overlappingSchedule) {
        throw new ConflictException(
          'Resource/Ruangan sudah dibooking pada jam tersebut!',
        );
      }

      const resource = await tx.resources.findUnique({
        where: { id: dto.resource_id },
      });
      if (!resource) {
        throw new NotFoundException('Resource/kamar tidak ditemukan!');
      }

      const user = await tx.users.findUnique({
        where: { id: dto.user_id as string },
      });
      if (!user) {
        throw new NotFoundException('User tidak ditemukan di database!');
      }

      const startDateOnly = new Date(
        startTime.getFullYear(),
        startTime.getMonth(),
        startTime.getDate(),
      );
      const endDateOnly = new Date(
        endTime.getFullYear(),
        endTime.getMonth(),
        endTime.getDate(),
      );
      const oneDayInMs = 1000 * 60 * 60 * 24;
      const totalNights = Math.max(
        1,
        Math.round(
          (endDateOnly.getTime() - startDateOnly.getTime()) / oneDayInMs,
        ),
      );
      const totalPrice = resource.price_per_night * totalNights;

      const newSchedule = await tx.schedules.create({
        data: {
          resource_id: dto.resource_id,
          start_time: startTime,
          end_time: endTime,
          status: ScheduleStatus.BOOKED,
        },
      });

      const newBooking = await tx.bookings.create({
        data: {
          user_id: dto.user_id as string,
          schedule_id: newSchedule.id,
          status: BookingStatus.PENDING,
          notes: dto.notes,
          total_price: totalPrice,
        },
      });

      const newPayment = await tx.payments.create({
        data: {
          booking_id: newBooking.id,
          amount: totalPrice,
          payment_method: dto.payment_method,
          status: PaymentStatus.PENDING,
        },
      });

      return {
        message: 'Booking dan invoice pembayaran berhasil dibuat!',
        booking: newBooking,
        schedule: newSchedule,
        payment: newPayment,
      };
    });
  }

  async cancelBooking(
    bookingId: string,
    currentUser: { userId: string; role: string },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.bookings.findUnique({
        where: { id: bookingId },
        include: { payment: true },
      });

      if (!booking)
        throw new NotFoundException('Data booking tidak ditemukan!');

      // PENGECEKAN KEPEMILIKAN!
      this.checkBookingOwnership(booking.user_id, currentUser);

      if ((booking.status as string) === (BookingStatus.CANCELED as string)) {
        throw new ConflictException('Booking ini sudah dibatalkan sebelumnya!');
      }

      if (
        (booking.status as string) === (BookingStatus.CHECKED_IN as string) ||
        (booking.status as string) === (BookingStatus.COMPLETED as string)
      ) {
        throw new ConflictException(
          'Tidak bisa membatalkan booking yang sedang berjalan atau sudah selesai!',
        );
      }

      const updatedBooking = await tx.bookings.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELED },
      });

      if (booking.schedule_id) {
        await tx.schedules.update({
          where: { id: booking.schedule_id },
          data: { status: ScheduleStatus.CANCELED },
        });
      }

      if (
        booking.payment &&
        (booking.payment.status as string) === (PaymentStatus.PENDING as string)
      ) {
        await tx.payments.update({
          where: { id: booking.payment.id },
          data: { status: PaymentStatus.CANCELED },
        });
      }

      return {
        message: 'Booking berhasil dibatalkan. Kamar telah tersedia kembali.',
        booking_id: updatedBooking.id,
        booking_status: updatedBooking.status,
      };
    });
  }

  async findAll(
    currentUser: { userId: string; role: string },
    userId?: string,
    status?: string,
  ) {
    if (currentUser.role === (Role.USER as string)) {
      userId = currentUser.userId;
    }

    return this.prisma.bookings.findMany({
      where: {
        ...(userId && { user_id: userId }),
        ...(status && { status: status as BookingStatus }),
      },
      include: {
        users: { select: { id: true, name: true, email: true } },
        schedules: { include: { resources: true } },
        payment: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string, currentUser: { userId: string; role: string }) {
    const booking = await this.prisma.bookings.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, name: true, email: true } },
        schedules: { include: { resources: true } },
        payment: true,
      },
    });

    if (!booking)
      throw new NotFoundException(`Booking dengan ID ${id} tidak ditemukan!`);

    this.checkBookingOwnership(booking.user_id, currentUser);

    return booking;
  }

  async update(id: string, dto: UpdateBookingDto) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.bookings.findUnique({ where: { id } });

      if (!booking)
        throw new NotFoundException('Data booking tidak ditemukan!');

      if (
        (dto.status === BookingStatus.CANCELED ||
          dto.status === BookingStatus.REJECTED) &&
        booking.schedule_id
      ) {
        await tx.schedules.update({
          where: { id: booking.schedule_id },
          data: { status: ScheduleStatus.CANCELED },
        });
      }

      if (dto.status === BookingStatus.APPROVED) {
        await tx.payments.updateMany({
          where: { booking_id: id },
          data: { status: PaymentStatus.PAID, paid_at: new Date() },
        });
      }

      const updatedBooking = await tx.bookings.update({
        where: { id },
        data: {
          ...(dto.status && { status: dto.status }),
          ...(dto.notes && { notes: dto.notes }),
        },
      });

      return {
        message: `Booking berhasil di-update menjadi ${dto.status || booking.status}`,
        data: updatedBooking,
      };
    });
  }
}
