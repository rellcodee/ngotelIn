import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import {
  ScheduleStatus,
  BookingStatus,
  PaymentStatus,
  Role,
} from '../common/enums';
import { BookingStatusUpdatedEvent } from '../notifications/events/booking-status-updated.event';
import * as midtransClient from 'midtrans-client';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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
    const date =
      typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    // standar YYYY-MM-DD
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
    }).format(date);
  }

  async createBooking(dto: CreateBookingDto) {
    const startDateStr = this.extractWibDateString(dto.start_time);
    const endDateStr = this.extractWibDateString(dto.end_time);

    // 14:00 WIB setara dengan 07:00 UTC
    const startTime = new Date(`${startDateStr}T07:00:00.000Z`);
    // 12:00 WIB setara dengan 05:00 UTC
    const endTime = new Date(`${endDateStr}T05:00:00.000Z`);

    if (endTime <= startTime) {
      throw new BadRequestException(
        'Waktu check-out harus minimal 1 hari setelah check-in!',
      );
    }

    const startMs = new Date(startDateStr).getTime();
    const endMs = new Date(endDateStr).getTime();
    const oneDayInMs = 1000 * 60 * 60 * 24;
    const totalNights = Math.max(1, Math.round((endMs - startMs) / oneDayInMs));

    // 1. Eksekusi Database (Cepat & Terisolasi)
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
        throw new ConflictException(
          'Resource/Ruangan sudah dibooking pada tanggal tersebut!',
        );
      }

      const resource = await tx.resources.findUnique({
        where: { id: dto.resource_id },
      });
      if (!resource)
        throw new NotFoundException('Resource/kamar tidak ditemukan!');

      const user = await tx.users.findUnique({
        where: { id: dto.user_id as string },
      });
      if (!user)
        throw new NotFoundException('User tidak ditemukan di database!');

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

      return { newBooking, newSchedule, newPayment, user, totalPrice };
    });

    // 2. Panggil API Midtrans (Di Luar Transaksi DB)
    const parameter: any = {
      transaction_details: {
        order_id: result.newBooking.id,
        gross_amount: result.totalPrice,
      },
      customer_details: {
        first_name: result.user.name,
        email: result.user.email,
      },
      callbacks: {
        finish: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?payment=success`,
      },
    };

    if (process.env.MIDTRANS_NOTIFICATION_URL) {
      parameter.override_notification_url =
        process.env.MIDTRANS_NOTIFICATION_URL;
    }

    let transaction;
    try {
      transaction = await this.snap.createTransaction(parameter);
    } catch (error) {
      throw new BadRequestException(
        'Gagal membuat transaksi Midtrans: ' + error.message,
      );
    }

    // 3. Emit Event Notifikasi (Fitur Tambahan Kamu)
    this.eventEmitter.emit('booking.status_updated', {
      user_id: result.newBooking.user_id,
      booking_id: result.newBooking.id,
      status: BookingStatus.PENDING,
    });

    return {
      message: 'Booking dan invoice pembayaran berhasil dibuat!',
      booking: result.newBooking,
      schedule: result.newSchedule,
      payment: result.newPayment,
      midtrans_token: transaction.token,
      midtrans_redirect_url: transaction.redirect_url,
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
        booking.payment.status === (PaymentStatus.PENDING as string)
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
      });

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

    // Auto-sync status pembayaran dengan Midtrans API jika ada booking status pending
    try {
      const pendingBookings = await this.prisma.bookings.findMany({
        where: {
          ...(userId && { user_id: userId }),
          status: BookingStatus.PENDING,
        },
      });

      for (const pb of pendingBookings) {
        try {
          let statusResponse: any = null;
          try {
            statusResponse = await (this.snap as any).transaction.status(pb.id);
          } catch (e) {
            // Silently ignore if transaction ID not found in Midtrans
          }

          if (statusResponse) {
            const trStatus = statusResponse.transaction_status;
            const isSuccess =
              trStatus === 'settlement' ||
              (trStatus === 'capture' &&
                statusResponse.fraud_status === 'accept');

            if (isSuccess) {
              await this.prisma.$transaction(async (tx) => {
                await tx.payments.updateMany({
                  where: { booking_id: pb.id },
                  data: {
                    status: PaymentStatus.PAID,
                    payment_method: statusResponse.payment_type || 'gopay',
                    paid_at: statusResponse.settlement_time
                      ? new Date(statusResponse.settlement_time)
                      : new Date(),
                  },
                });

                await tx.bookings.update({
                  where: { id: pb.id },
                  data: { status: BookingStatus.APPROVED },
                });
              });
            } else if (
              trStatus === 'expire' ||
              trStatus === 'cancel' ||
              trStatus === 'deny'
            ) {
              await this.prisma.$transaction(async (tx) => {
                await tx.payments.updateMany({
                  where: { booking_id: pb.id },
                  data: { status: PaymentStatus.CANCELED },
                });

                await tx.bookings.update({
                  where: { id: pb.id },
                  data: { status: BookingStatus.CANCELED },
                });
              });
            }
          }
        } catch (err) {
          // Ignore individual sync errors
        }
      }
    } catch (error) {
      // Ignore global sync errors
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
    const booking = await this.prisma.bookings.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Data booking tidak ditemukan!');

    // 1. BATALKAN TRANSAKSI MIDTRANS (DI LUAR DB TRANSACTION)
    if (
      dto.status === BookingStatus.CANCELED ||
      dto.status === BookingStatus.REJECTED
    ) {
      try {
        // Cast ke 'any' untuk melewati isu type definition pada package midtrans-client
        await (this.snap as any).transaction.cancel(id);
      } catch (error: any) {
        console.warn(
          `[Midtrans] Gagal membatalkan transaksi ${id} (Mungkin sudah expired/batal):`,
          error.message || error,
        );
      }
    }

    const updatedBooking = await this.prisma.$transaction(async (tx) => {
      // A. JIKA REJECTED ATAU CANCELED
      if (
        dto.status === BookingStatus.CANCELED ||
        dto.status === BookingStatus.REJECTED
      ) {
        // Bebaskan schedule jika ada
        if (booking.schedule_id) {
          await tx.schedules.update({
            where: { id: booking.schedule_id },
            data: { status: ScheduleStatus.CANCELED },
          });
        }

        await tx.payments.updateMany({
          where: { booking_id: id },
          data: { status: PaymentStatus.CANCELED },
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

    // 3. EMIT EVENT UPDATE STATUS
    if (dto.status) {
      this.eventEmitter.emit('booking.status_updated', {
        user_id: updatedBooking.user_id,
        booking_id: updatedBooking.id,
        status: updatedBooking.status as BookingStatus,
      });
    }

    return {
      message: `Booking berhasil di-update menjadi ${dto.status || updatedBooking.status}`,
      data: updatedBooking,
    };
  }
}
