import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

export interface MidtransNotification {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  payment_type: string;
  settlement_time?: string;
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
    } = payload;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';

    const hashData =
      String(order_id) + String(status_code) + String(gross_amount) + serverKey;
    const hash = crypto.createHash('sha512').update(hashData).digest('hex');

    if (hash !== signature_key) {
      throw new BadRequestException('Invalid signature key');
    }

    if (
      transaction_status === 'settlement' ||
      transaction_status === 'capture'
    ) {
      await this.prisma.$transaction(async (tx) => {
        await tx.payments.update({
          where: { booking_id: order_id },
          data: {
            status: 'settlement',
            payment_method: payment_type,
            paid_at: settlement_time ? new Date(settlement_time) : new Date(),
          },
        });

        await tx.bookings.update({
          where: { id: order_id },
          data: { status: 'confirmed' },
        });
      });
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'expire'
    ) {
      await this.prisma.payments.update({
        where: { booking_id: order_id },
        data: { status: transaction_status },
      });
    }

    return { message: 'Webhook received successfully' };
  }
}
