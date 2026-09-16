import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Total Pendapatan & Pendapatan Bulan Ini
    const paidStatuses = ['paid', 'settlement', 'success', 'capture'];

    const [allPaidPayments, thisMonthPayments] = await Promise.all([
      this.prisma.payments.findMany({
        where: {
          status: { in: paidStatuses },
        },
        select: { amount: true },
      }),
      this.prisma.payments.findMany({
        where: {
          status: { in: paidStatuses },
          paid_at: { gte: startOfMonth },
        },
        select: { amount: true },
      }),
    ]);

    const totalRevenue = allPaidPayments.reduce((acc, p) => acc + p.amount, 0);
    const thisMonthRevenue = thisMonthPayments.reduce((acc, p) => acc + p.amount, 0);

    // 2. Okupansi & Kapasitas Kamar
    const [totalRooms, activeSchedules, activeBookings, totalUsers] = await Promise.all([
      this.prisma.resources.count(),
      this.prisma.schedules.count({
        where: {
          start_time: { lte: now },
          end_time: { gte: now },
          status: { in: ['booked', 'maintenance'] },
        },
      }),
      this.prisma.bookings.count({
        where: {
          status: { in: ['approved', 'confirmed', 'checked_in', 'pending'] },
        },
      }),
      this.prisma.users.count({
        where: { role: 'user' },
      }),
    ]);

    const occupancyRate = totalRooms > 0 ? Math.round((activeSchedules / totalRooms) * 100) : 0;

    // 3. Tren Pendapatan 7 Hari Terakhir (Senin - Minggu)
    const trendDays: { day: string; date: string; income: number }[] = [];
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

      const dayPayments = await this.prisma.payments.findMany({
        where: {
          status: { in: paidStatuses },
          paid_at: { gte: startOfDay, lte: endOfDay },
        },
        select: { amount: true },
      });

      const dayIncome = dayPayments.reduce((acc, p) => acc + p.amount, 0);

      trendDays.push({
        day: dayNames[d.getDay()],
        date: d.toISOString().split('T')[0],
        income: dayIncome,
      });
    }

    // 4. Kamar Terlaris (Top Performing Rooms)
    const resourcesWithBookings = await this.prisma.resources.findMany({
      include: {
        room_images: { where: { is_primary: true } },
        schedules: {
          include: {
            bookings: {
              include: { payment: true },
            },
          },
        },
      },
    });

    const roomPerformance = resourcesWithBookings.map((res) => {
      let ordersCount = 0;
      let earned = 0;

      res.schedules.forEach((sch) => {
        sch.bookings.forEach((b) => {
          ordersCount++;
          if (b.payment && paidStatuses.includes(b.payment.status?.toLowerCase())) {
            earned += b.payment.amount;
          }
        });
      });

      const primaryImg = res.room_images[0]?.image_url || '/placeholder.png';
      const fullImgUrl = primaryImg.startsWith('http')
        ? primaryImg
        : `http://localhost:3001${primaryImg}`;

      return {
        id: res.id,
        name: res.name,
        type: res.type || 'Standard',
        imageUrl: fullImgUrl,
        pricePerNight: res.price_per_night,
        totalOrders: ordersCount,
        totalEarned: earned,
      };
    });

    // Urutkan dari yang terbanyak order/earned dan ambil 4 teratas
    const topRooms = roomPerformance
      .sort((a, b) => b.totalOrders - a.totalOrders || b.totalEarned - a.totalEarned)
      .slice(0, 4);

    // 5. 5 Transaksi Pembayaran Terkini
    const recentBookings = await this.prisma.bookings.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        users: { select: { id: true, name: true, email: true } },
        payment: true,
        schedules: { include: { resources: true } },
      },
    });

    const recentTransactions = recentBookings.map((b) => ({
      id: b.id,
      guestName: b.users?.name || 'Tamu',
      guestEmail: b.users?.email || '-',
      roomName: b.schedules?.resources?.name || 'Kamar',
      roomType: b.schedules?.resources?.type || 'Standard',
      amount: b.payment?.amount || b.total_price || 0,
      paymentMethod: b.payment?.payment_method || 'QRIS / E-Wallet',
      status: b.payment?.status || b.status,
      date: b.payment?.paid_at || b.created_at,
    }));

    return {
      totalRevenue,
      thisMonthRevenue,
      occupancyRate,
      occupiedRooms: activeSchedules,
      totalRooms,
      activeBookings,
      totalUsers,
      revenueTrend7Days: trendDays,
      topRooms,
      recentTransactions,
    };
  }

  async getStaffStats() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // 1. Ambil jadwal hari ini
    const todaySchedules = await this.prisma.schedules.findMany({
      where: {
        OR: [
          // Check-in hari ini
          { start_time: { gte: startOfDay, lte: endOfDay } },
          // Check-out hari ini
          { end_time: { gte: startOfDay, lte: endOfDay } },
          // Sedang menginap aktif detik ini
          { start_time: { lte: now }, end_time: { gte: now } },
        ],
      },
      include: {
        resources: true,
        bookings: {
          include: {
            users: { select: { id: true, name: true, email: true } },
            payment: true,
          },
        },
      },
      orderBy: { start_time: 'asc' },
    });

    // 2. Hitung Metrik Operasional Hari Ini
    let checkInTodayCount = 0;
    let checkedInTodayCount = 0;
    let checkOutTodayCount = 0;
    let inHouseCount = 0;

    const arrivalList: any[] = [];

    todaySchedules.forEach((sch) => {
      const isStartToday =
        new Date(sch.start_time) >= startOfDay && new Date(sch.start_time) <= endOfDay;
      const isEndToday =
        new Date(sch.end_time) >= startOfDay && new Date(sch.end_time) <= endOfDay;
      const isInHouse =
        new Date(sch.start_time) <= now && new Date(sch.end_time) >= now && sch.status === 'booked';

      if (isStartToday) checkInTodayCount++;
      if (isEndToday) checkOutTodayCount++;
      if (isInHouse) inHouseCount++;

      sch.bookings.forEach((b) => {
        if (b.status === 'checked_in') {
          checkedInTodayCount++;
        }

        arrivalList.push({
          bookingId: b.id,
          scheduleId: sch.id,
          guestName: b.users?.name || 'Tamu',
          guestEmail: b.users?.email || '-',
          roomName: sch.resources?.name || 'Kamar',
          roomType: sch.resources?.type || 'Standard',
          roomLocation: sch.resources?.location || '-',
          checkIn: sch.start_time,
          checkOut: sch.end_time,
          bookingStatus: b.status,
          paymentStatus: b.payment?.status || 'pending',
          paymentAmount: b.payment?.amount || b.total_price || 0,
          paymentMethod: b.payment?.payment_method || '-',
          notes: b.notes || null,
        });
      });
    });

    // 3. Ringkasan Status Kamar Global (Tersedia, Terisi, Maintenance)
    const [totalRooms, maintenanceCount] = await Promise.all([
      this.prisma.resources.count(),
      this.prisma.schedules.count({
        where: {
          start_time: { lte: now },
          end_time: { gte: now },
          status: 'maintenance',
        },
      }),
    ]);

    const bookedCount = inHouseCount;
    const availableCount = Math.max(0, totalRooms - bookedCount - maintenanceCount);

    return {
      checkInTodayCount,
      checkedInTodayCount,
      checkOutTodayCount,
      inHouseCount,
      totalRooms,
      roomOverview: {
        total: totalRooms,
        available: availableCount,
        booked: bookedCount,
        maintenance: maintenanceCount,
      },
      todayArrivals: arrivalList.slice(0, 10),
    };
  }
}
