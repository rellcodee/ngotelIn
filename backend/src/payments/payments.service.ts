import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
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

    // Cari booking untuk mengambil schedule_id
    const booking = await this.prisma.bookings.findUnique({
      where: { id: order_id },
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
          where: { booking_id: order_id },
          data: {
            status: PaymentStatus.PAID,
            payment_method: payment_type,
            paid_at: settlement_time ? new Date(settlement_time) : new Date(),
          },
        });

        // Update status Booking
        await tx.bookings.update({
          where: { id: order_id },
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
          where: { booking_id: order_id },
          data: { status: PaymentStatus.CANCELED },
        });

        // Update status Booking menjadi CANCELED
        await tx.bookings.update({
          where: { id: order_id },
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
