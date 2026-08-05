import { Injectable, ConflictException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ScheduleStatus, BookingStatus, PaymentStatus, Role } from '../common/enums';
import { BookingStatusUpdatedEvent } from '../notifications/events/booking-status-updated.event';
import * as midtransClient from 'midtrans-client';


@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) { }

  // Midtrans
  private snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
  });

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

  private extractWibDateString(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    // standar YYYY-MM-DD
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(date);
  }

  async createBooking(dto: CreateBookingDto) {
    const startDateStr = this.extractWibDateString(dto.start_time);
    const endDateStr = this.extractWibDateString(dto.end_time);

    // 14:00 WIB setara dengan 07:00 UTC
    const startTime = new Date(`${startDateStr}T07:00:00.000Z`);

    // 12:00 WIB setara dengan 05:00 UTC
    const endTime = new Date(`${endDateStr}T05:00:00.000Z`);

    if (endTime <= startTime) {
      throw new BadRequestException('Waktu check-out harus minimal 1 hari (besoknya) setelah check-in!');
    }

    const result = await this.prisma.$transaction(async (tx) => {
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

        throw new ConflictException('Resource/Ruangan sudah dibooking pada tanggal tersebut!');
      }

      const resource = await tx.resources.findUnique({ where: { id: dto.resource_id } });
      if (!resource) throw new NotFoundException('Resource/kamar tidak ditemukan!');

      const user = await tx.users.findUnique({ where: { id: dto.user_id } });
      if (!user) throw new NotFoundException('User tidak ditemukan di database!');

      const startDateOnly = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
      const endDateOnly = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate());

      const oneDayInMs = 1000 * 60 * 60 * 24;
      const totalNights = Math.max(1, Math.round((endDateOnly.getTime() - startDateOnly.getTime()) / oneDayInMs));
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
          user_id: dto.user_id,
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

      return { newBooking, newSchedule, newPayment };
    });

    // 3. EMIT EVENT (SETELAH TRANSAKSI BERHASIL)
    this.eventEmitter.emit('booking.status_updated', {
      user_id: result.newBooking.user_id,
      booking_id: result.newBooking.id,
      status: BookingStatus.PENDING,
    } as BookingStatusUpdatedEvent);

    return {
      message: 'Booking dan invoice pembayaran berhasil dibuat!',
      booking: result.newBooking,
      schedule: result.newSchedule,
      payment: result.newPayment,
    };
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
        (booking.payment.status) === (PaymentStatus.PENDING as string)
      ) {
        await tx.payments.update({
          where: { id: booking.payment.id },
          data: { status: PaymentStatus.CANCELED },
        });
      }

      // 4. EMIT EVENT CANCEL
      this.eventEmitter.emit('booking.status_updated', {
        user_id: updatedBooking.user_id,
        booking_id: updatedBooking.id,
        status: BookingStatus.CANCELED,
      } as BookingStatusUpdatedEvent);

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
        users: {
          select: { id: true, name: true, email: true }, // (amanin password)
        },
        schedules: {
          include: {
            resources: true,
          },
        },
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
    const updatedBooking = await this.prisma.$transaction(async (tx) => {
      const booking = await tx.bookings.findUnique({ where: { id } });
      if (!booking) throw new NotFoundException('Data booking tidak ditemukan!');

      if ((dto.status === BookingStatus.CANCELED || dto.status === BookingStatus.REJECTED) && booking.schedule_id) {
        await tx.schedules.update({
          where: { id: booking.schedule_id },
          data: { status: ScheduleStatus.CANCELED },
        });
      }

      if (dto.status === BookingStatus.APPROVED) {
        await tx.payments.updateMany({
          where: { booking_id: id },
          data: {
            status: PaymentStatus.PAID,
            paid_at: new Date(),
          },
        });
      }

      return tx.bookings.update({
        where: { id },
        data: {
          ...(dto.status && { status: dto.status }),
          ...(dto.notes && { notes: dto.notes }),
        },
      });
    });

    // 5. EMIT EVENT UPDATE STATUS (Hanya jika status berubah)
    if (dto.status) {
      this.eventEmitter.emit('booking.status_updated', {
        user_id: updatedBooking.user_id,
        booking_id: updatedBooking.id,
        status: updatedBooking.status as BookingStatus,
      } as BookingStatusUpdatedEvent);
    }

    return {
      message: `Booking berhasil di-update menjadi ${dto.status || updatedBooking.status}`,
      data: updatedBooking,
    };
  }
}
