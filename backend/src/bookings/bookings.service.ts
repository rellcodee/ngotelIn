import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Sesuaikan path PrismaService lu
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ScheduleStatus, BookingStatus, PaymentStatus } from '../common/enums';


@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) { }

  async createBooking(dto: CreateBookingDto) {
    const startTime = new Date(dto.start_time);
    const endTime = new Date(dto.end_time);

    // Validasi dasar: Jam selesai gak boleh sebelum jam mulai
    if (endTime <= startTime) {
      throw new BadRequestException('Waktu selesai harus lebih lambat dari waktu mulai!');
    }

    // Jalankan database transaction
    return this.prisma.$transaction(async (tx) => {

      // 1. CEK OVERLAP JADWAL
      // Cari apakah ada schedule di rentang waktu tersebut untuk resource yang sama yang statusnya BUKAN "available"
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
        throw new ConflictException('Resource/Ruangan sudah dibooking pada jam tersebut!');
      }

      // 2. AMBIL DATA RESOURCE & HITUNG TOTAL HARGA BERDASARKAN MALAM
      const resource = await tx.resources.findUnique({ where: { id: dto.resource_id } });
      if (!resource) {
        throw new NotFoundException('Resource/kamar tidak ditemukan!');
      }

      const user = await tx.users.findUnique({ where: { id: dto.user_id } });
      if (!user) {
        throw new NotFoundException('User tidak ditemukan di database!');
      }

      // Ambil tanggalnya saja (tanpa jam) untuk menghitung selisih malam secara akurat
      const startDateOnly = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
      const endDateOnly = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate());

      const oneDayInMs = 1000 * 60 * 60 * 24;
      // Menghitung selisih malam, minimal 1 malam jika di hari yang sama
      const totalNights = Math.max(1, Math.round((endDateOnly.getTime() - startDateOnly.getTime()) / oneDayInMs));

      // Kalikan dengan price_per_night dari database
      const totalPrice = resource.price_per_night * totalNights;

      // 3. BUAT DATA SCHEDULE BARU (Status langsung ditandai booked/pending)
      const newSchedule = await tx.schedules.create({
        data: {
          resource_id: dto.resource_id,
          start_time: startTime,
          end_time: endTime,
          status: ScheduleStatus.BOOKED, // Dikunci biar orang lain gak bisa nyelonong booking jam yang sama
        },
      });

      // 4. BUAT DATA BOOKING
      const newBooking = await tx.bookings.create({
        data: {
          user_id: dto.user_id,
          schedule_id: newSchedule.id, // Hubungkan dengan schedule_id yang baru dibuat di atas
          status: BookingStatus.PENDING,
          notes: dto.notes,
          total_price: totalPrice,
        },
      });

      // 5. BUAT DATA PAYMENT
      const newPayment = await tx.payments.create({
        data: {
          booking_id: newBooking.id, // Hubungkan ke booking yang barusan kelar dibuat
          amount: totalPrice,
          payment_method: dto.payment_method,
          status: PaymentStatus.PENDING,
        },
      });

      // Kembalikan response sukses gabungan
      return {
        message: 'Booking dan invoice pembayaran berhasil dibuat!',
        booking: newBooking,
        schedule: newSchedule,
        payment: newPayment,
      };
    });
  }

  async cancelBooking(bookingId: string) {
    // Jalankan transaksi agar perubahan status di semua tabel sinkron
    return this.prisma.$transaction(async (tx) => {

      // 1. Cari dulu data booking-nya beserta relasi payment-nya
      const booking = await tx.bookings.findUnique({
        where: { id: bookingId },
        include: { payment: true }, // Kita include payment untuk cek status duitnya
      });

      // 2. Validasi: Pastikan data booking-nya ada
      if (!booking) {
        throw new NotFoundException('Data booking tidak ditemukan!');
      }

      // 3. Validasi: Kalau sudah dicancel, jangan diperbolehkan cancel lagi
      if (booking.status === BookingStatus.CANCELED) {
        throw new ConflictException('Booking ini sudah dibatalkan sebelumnya!');
      }

      // 4. Validasi Operasional (Opsional tapi penting): 
      // Jika tamu sudah terlanjur check-in atau selesai, tidak boleh dicancel sepihak
      if (booking.status === BookingStatus.CHECKED_IN || booking.status === BookingStatus.COMPLETED) {
        throw new ConflictException('Tidak bisa membatalkan booking yang sedang berjalan atau sudah selesai!');
      }

      // 5. UPDATE status di tabel bookings menjadi "canceled"
      const updatedBooking = await tx.bookings.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELED },
      });

      // 6. UPDATE status di tabel schedules menjadi "canceled"
      // Ini krusial! Biar query checkOverlap mendeteksi kalau kamar ini sudah BEBAS ditabrak lagi
      if (booking.schedule_id) {
        await tx.schedules.update({
          where: { id: booking.schedule_id },
          data: { status: ScheduleStatus.CANCELED },
        });
      }

      // 7. UPDATE status di tabel payments menjadi "canceled" atau "expire"
      // Kita cuma cancel payment yang statusnya masih belum dibayar (pending)
      if (booking.payment && booking.payment.status === PaymentStatus.PENDING) {
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
  async findAll(userId?: string, status?: string) {
    // Method ini fleksibel: Bisa ditarik semua (Staff), atau difilter per user (Client History)
    return this.prisma.bookings.findMany({
      where: {
        ...(userId && { user_id: userId }),
        ...(status && { status: status as BookingStatus }),
      },
      include: {
        users: {
          select: { id: true, name: true, email: true }, // Ambil data user secukupnya (amanin password)
        },
        schedules: {
          include: {
            resources: true, // Join lagi ke tabel resources buat ambil nama kamar/alat
          },
        },
        payment: true, // Ambil info pembayaran terkait
      },
      orderBy: {
        created_at: 'desc', // Booking terbaru muncul paling atas
      },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.bookings.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, name: true, email: true } },
        schedules: { include: { resources: true } },
        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking dengan ID ${id} tidak ditemukan!`);
    }

    return booking;
  }

  // Update Operasional
  async update(id: string, dto: UpdateBookingDto) {
    // jalankan transaction karena perubahan status booking bisa berdampak ke tabel schedule/payment
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.bookings.findUnique({ where: { id } });

      if (!booking) {
        throw new NotFoundException('Data booking tidak ditemukan!');
      }

      // Logika khusus: Jika staff mengubah status ke "canceled" atau "rejected"
      // Maka kita harus melepaskan slot schedule-nya menjadi "canceled" agar bisa dipesan orang lagi
      // namun riwayat pemesanan tetap tercatat.
      if ((dto.status === BookingStatus.CANCELED || dto.status === BookingStatus.REJECTED) && booking.schedule_id) {
        await tx.schedules.update({
          where: { id: booking.schedule_id },
          data: { status: ScheduleStatus.CANCELED },
        });
      }

      // Logika khusus: Jika di-update ke "approved" (artinya pembayaran manual sukses / dikonfirmasi staff)
      // Maka otomatis status di tabel payment juga kita ikut sukseskan
      if (dto.status === BookingStatus.APPROVED) {
        await tx.payments.updateMany({
          where: { booking_id: id },
          data: {
            status: PaymentStatus.PAID,
            paid_at: new Date()
          },
        });
      }

      // Jalankan update utama ke tabel bookings
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