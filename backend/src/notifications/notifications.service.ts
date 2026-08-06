import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingStatusUpdatedEvent } from './events/booking-status-updated.event';
import { BookingStatus } from 'src/common/enums';
import { QueryNotificationDto } from './dto/query-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) { }

  // EVENT LISTENER (INTERNAL SYSTEM)
  @OnEvent('booking.status_updated')
  async handleBookingStatusUpdated(payload: BookingStatusUpdatedEvent) {
    const messageMap: Record<BookingStatus, string> = {
      [BookingStatus.PENDING]: 'Pesanan berhasil dibuat. Silakan lakukan pembayaran!',
      [BookingStatus.APPROVED]: 'Pembayaran dikonfirmasi! Booking kamu resmi aman.',
      [BookingStatus.CHECKED_IN]: 'Proses check-in berhasil. Selamat menikmati layanan kami!',
      [BookingStatus.COMPLETED]: 'Sewa telah selesai. Terima kasih! Jangan lupa berikan ulasan ya.',
      [BookingStatus.REJECTED]: 'Maaf, pengajuan booking kamu ditolak oleh staff.',
      [BookingStatus.CANCELED]: 'Pesanan kamu telah dibatalkan.',
    };

    const message = messageMap[payload.status] || `Status pesanan kamu sekarang: ${payload.status}`;

    return this.prisma.notifications.create({
      data: {
        user_id: payload.user_id,
        booking_id: payload.booking_id,
        type: `BOOKING_${payload.status.toUpperCase()}`,
        message: message,
      },
    });
  }

  // HTTP METHODS (UNTUK USER VIA CONTROLLER)

  // Ambil daftar notifikasi milik user
  async findAll(userId: string, query: QueryNotificationDto) {
    return this.prisma.notifications.findMany({
      where: {
        user_id: userId,
        ...(query.is_read !== undefined && { is_read: query.is_read }),
      },
      orderBy: {
        created_at: 'desc', // terbaru di paling atas
      },
      include: {
        bookings: {
          select: {
            id: true,
            status: true,
            schedules: {
              select: {
                resources: {
                  select: { name: true }, // Biar dapet nama kamar/alat di notif
                },
              },
            },
          },
        },
      },
    });
  }

  // Hitung jumlah notifikasi yang belum dibaca (Buat badge lonceng)
  async getUnreadCount(userId: string) {
    const count = await this.prisma.notifications.count({
      where: {
        user_id: userId,
        is_read: false,
      },
    });

    return { unread_count: count };
  }

  // Tandai 1 notifikasi spesifik sebagai sudah dibaca
  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notifications.findFirst({
      where: { id, user_id: userId },
    });

    if (!notification) {
      throw new NotFoundException('Notifikasi tidak ditemukan atau bukan milik kamu!');
    }

    return this.prisma.notifications.update({
      where: { id },
      data: { is_read: true },
    });
  }

  // Tandai SEMUA notifikasi user sebagai sudah dibaca
  async markAllAsRead(userId: string) {
    await this.prisma.notifications.updateMany({
      where: {
        user_id: userId,
        is_read: false,
      },
      data: { is_read: true },
    });

    return { message: 'Semua notifikasi telah ditandai sebagai dibaca.' };
  }

  async deleteNotif(id: string) {
    const notif = await this.prisma.notifications.findUnique({
      where: { id },
    });

    if (!notif) {
      throw new NotFoundException('Notifikasi tidak ditemukan atau bukan milik kamu!');
    }

    await this.prisma.notifications.delete({
      where: { id }
    })

    return { message: 'Notifikasi berhasil dihapus!' }
  }

  async deleteAll(userId: string) {
    const notifications = await this.prisma.notifications.findMany({
      where: { user_id: userId }
    });
    if (!notifications) {
      throw new NotFoundException('Notifikasi tidak ditemukan');
    }
    await this.prisma.notifications.deleteMany({
      where: { user_id: userId }
    });
    return { message: 'Semua notifikasi berhasil dihapus!' }
  }
}