import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import * as midtransClient from 'midtrans-client';
import { BookingStatus, PaymentStatus, ScheduleStatus } from '../common/enums';

export interface MidtransNotification {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  payment_type: string;
  settlement_time?: string;
  fraud_status?: string;
}

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async getPaymentUrl(
    bookingId: string,
    currentUser: { userId: string; role: string },
  ) {
    const booking = await this.prisma.bookings.findUnique({
      where: { id: bookingId },
      include: {
        payment: true,
        users: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Data booking tidak ditemukan!');
    }

    if (
      currentUser.role !== 'admin' &&
      currentUser.role !== 'staff' &&
      booking.user_id !== currentUser.userId
    ) {
      throw new ForbiddenException('Akses ditolak!');
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Booking ini tidak dalam status pending!');
    }

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || '',
      clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
    });

    const amount = booking.payment?.amount || 0;
    const midtransOrderId = `${booking.id}-${Date.now().toString().slice(-4)}`;

    const parameter: any = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: booking.users?.name || 'Tamu',
        email: booking.users?.email || 'user@example.com',
      },
      callbacks: {
        finish: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?payment=success`,
      },
    };

    if (process.env.MIDTRANS_NOTIFICATION_URL) {
      parameter.override_notification_url =
        process.env.MIDTRANS_NOTIFICATION_URL;
    }

    try {
      const transaction = await snap.createTransaction(parameter);
      return {
        midtrans_redirect_url: transaction.redirect_url,
        midtrans_token: transaction.token,
      };
    } catch (error) {
      throw new BadRequestException(
        'Gagal membuat transaksi Midtrans: ' + error.message,
      );
    }
  }

  async handleMidtransWebhook(payload: MidtransNotification) {
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
      settlement_time,
      fraud_status,
    } = payload;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';

    // 1. VERIFIKASI SIGNATURE KEY
    const hashData =
      String(order_id) + String(status_code) + String(gross_amount) + serverKey;
    const hash = crypto.createHash('sha512').update(hashData).digest('hex');

    if (hash !== signature_key) {
      throw new BadRequestException('Invalid signature key');
    }

    const realBookingId =
      order_id && order_id.length >= 36 ? order_id.substring(0, 36) : order_id;

    // Cari booking untuk mengambil schedule_id
    const booking = await this.prisma.bookings.findUnique({
      where: { id: realBookingId },
    });

    if (!booking) {
      throw new BadRequestException('Data booking tidak ditemukan');
    }

    // 2. JIKA PEMBAYARAN BERHASIL (settlement / capture)
    const isSuccess =
      transaction_status === 'settlement' ||
      (transaction_status === 'capture' && fraud_status === 'accept');

    if (isSuccess) {
      await this.prisma.$transaction(async (tx) => {
        // Update status Payment
        await tx.payments.updateMany({
          where: { booking_id: realBookingId },
          data: {
            status: PaymentStatus.PAID,
            payment_method: payment_type,
            paid_at: settlement_time ? new Date(settlement_time) : new Date(),
          },
        });

        // Update status Booking
        await tx.bookings.update({
          where: { id: realBookingId },
          data: { status: BookingStatus.APPROVED },
        });
      });
    }
    // 3. JIKA PEMBAYARAN KEDALUWARSA / BATAL / DENY
    else if (
      transaction_status === 'cancel' ||
      transaction_status === 'expire' ||
      transaction_status === 'deny'
    ) {
      await this.prisma.$transaction(async (tx) => {
        // Update status Payment menjadi CANCELED
        await tx.payments.updateMany({
          where: { booking_id: realBookingId },
          data: { status: PaymentStatus.CANCELED },
        });

        // Update status Booking menjadi CANCELED
        await tx.bookings.update({
          where: { id: realBookingId },
          data: { status: BookingStatus.CANCELED },
        });

        // Bebaskan Schedule agar kamar bisa dibooking kembali
        if (booking.schedule_id) {
          await tx.schedules.update({
            where: { id: booking.schedule_id },
            data: { status: ScheduleStatus.CANCELED },
          });
        }
      });
    }

    return { message: 'Webhook processed successfully' };
  }
}
