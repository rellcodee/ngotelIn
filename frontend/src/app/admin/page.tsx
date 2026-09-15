"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CalendarCheck, 
  Key, 
  UsersThree, 
  CurrencyCircleDollar,
  TrendUp,
  Clock,
  CheckCircle,
  XCircle,
  SlidersHorizontal,
  CaretRight,
  ArrowDown,
  Bed,
  Sparkle,
  ShieldCheck,
  Building,
  UserCheck,
  FunnelSimple,
  ArrowUpRight
} from "@phosphor-icons/react";

interface RoomImage {
  id: string;
  image_url: string;
  is_primary: boolean;
}

interface ResourceItem {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  price_per_night: number;
  facilities: string[];
  room_images?: RoomImage[];
}

interface BookingItem {
  id: string;
  user_id: string;
  schedule_id: string;
  status: string;
  total_price: number;
  created_at: string;
  users?: { name: string; email: string };
}

export default function AdminDashboard() {
  const [timeFilter, setTimeFilter] = useState("Bulan Ini");
  const [stats, setStats] = useState({
    totalBookings: 86,
    occupancyRate: 78,
    totalUsers: 1204,
    revenue: "93.4 Jt",
  });
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [recentBookings, setRecentBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      try {
        const [resRooms, resBookings] = await Promise.all([
          fetch("http://localhost:3001/resources").catch(() => null),
          fetch("http://localhost:3001/bookings", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }).catch(() => null)
        ]);

        if (resRooms && resRooms.ok) {
          const roomsData = await resRooms.json();
          if (Array.isArray(roomsData) && roomsData.length > 0) {
            setResources(roomsData);
          }
        }

        if (resBookings && resBookings.ok) {
          const bookingsData = await resBookings.json();
          if (Array.isArray(bookingsData) && bookingsData.length > 0) {
            setRecentBookings(bookingsData);
            const totalRev = bookingsData.reduce((acc: number, curr: BookingItem) => acc + (curr.total_price || 0), 0);
            setStats(prev => ({
              ...prev,
              totalBookings: bookingsData.length,
              revenue: totalRev > 0 ? `${(totalRev / 1000000).toFixed(1)} Jt` : prev.revenue
            }));
          }
        }
      } catch (e) {
        console.warn("Menggunakan fallback data untuk Admin Dashboard SiniBook:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Preset Room Data Fallbacks if resources empty
  const defaultRooms = [
    {
      id: "std-1",
      name: "Standard Double Room",
      type: "Standard",
      price_per_night: 400000,
      capacity: 2,
      available: "8 Unit Ready",
      facilities: ["WiFi Gratis", "AC Split", "Smart TV 43\"", "Kamar Mandi Dalam"],
      color: "from-blue-600 to-indigo-700",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      id: "ste-1",
      name: "Executive Suite Ocean View",
      type: "Suite",
      price_per_night: 1500000,
      capacity: 4,
      available: "5 Unit Ready",
      facilities: ["Smart TV 55\"", "Bathtub Marble", "Minibar Premium", "Ruang Tamu Luas"],
      color: "from-emerald-600 to-teal-700",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      id: "prs-1",
      name: "Presidential Sky Penthouse",
      type: "Presidential Suite",
      price_per_night: 3500000,
      capacity: 6,
      available: "2 Unit Ready",
      facilities: ["Private Jacuzzi", "Dapur Pribadi", "Layanan Butler 24 Jam", "Balkon Panoramic"],
      color: "from-amber-500 to-orange-600",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-200"
    }
  ];

  const displayRooms = resources.length >= 3 
    ? resources.slice(0, 3).map((r, i) => ({
        id: r.id,
        name: r.name,
        type: r.type || (i === 0 ? "Standard" : i === 1 ? "Suite" : "Presidential Suite"),
        price_per_night: r.price_per_night,
        capacity: r.capacity || 2,
        available: `${6 - i * 2} Unit Ready`,
        facilities: r.facilities.length > 0 ? r.facilities : defaultRooms[i % 3].facilities,
        color: defaultRooms[i % 3].color,
        badgeBg: defaultRooms[i % 3].badgeBg
      }))
    : defaultRooms;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12 select-none">
      {/* 1. TOP STATS CARDS ROW (JOBIE DASHBOARD 4 COLOR CARDS tuned to SINIBOOK) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* CARD 1: Interviews Schedule / Jadwal Reservasi (SINIBOOK DEEP BLUE / INDIGO) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#001a52] via-[#09296e] to-[#041d54] p-6 text-white shadow-xl shadow-blue-950/20 transition-all duration-300 hover:-translate-y-1 border border-white/10 group">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
              <CalendarCheck className="h-6 w-6 text-white" weight="bold" />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-200 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
              Jadwal Reservasi
            </span>
          </div>
          <div className="mt-6 flex items-baseline justify-between">
            <div>
              <p className="text-3xl font-black tracking-tight">{stats.totalBookings}</p>
              <p className="mt-1 text-xs text-blue-100/90 font-medium">Pemesanan Bulan Ini</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/30">
              <TrendUp className="h-3.5 w-3.5" /> +12%
            </span>
          </div>
        </div>

        {/* CARD 2: Application Sent / Tingkat Okupansi Kamar (SKY BLUE) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] p-6 text-white shadow-xl shadow-sky-500/20 transition-all duration-300 hover:-translate-y-1 border border-white/10 group">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
              <Key className="h-6 w-6 text-white" weight="bold" />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-100 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
              Tingkat Okupansi
            </span>
          </div>
          <div className="mt-6 flex items-baseline justify-between">
            <div>
              <p className="text-3xl font-black tracking-tight">{stats.occupancyRate}%</p>
              <p className="mt-1 text-xs text-sky-100/90 font-medium">16/20 Kamar Terisi</p>
            </div>
            <span className="flex items-center text-xs font-bold text-sky-100 bg-white/20 px-2.5 py-1 rounded-full border border-white/20">
              Optimal
            </span>
          </div>
        </div>

        {/* CARD 3: Profile Viewed / Tamu Terdaftar (EMERALD GREEN) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#059669] to-[#047857] p-6 text-white shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 border border-white/10 group">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
              <UserCheck className="h-6 w-6 text-white" weight="bold" />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-100 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
              Tamu Terdaftar
            </span>
          </div>
          <div className="mt-6 flex items-baseline justify-between">
            <div>
              <p className="text-3xl font-black tracking-tight">{stats.totalUsers.toLocaleString()}</p>
              <p className="mt-1 text-xs text-emerald-100/90 font-medium">Member Aktif System</p>
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-100 bg-white/20 px-2.5 py-1 rounded-full border border-white/20">
              +18 Baru
            </span>
          </div>
        </div>

        {/* CARD 4: Unread Message / Pendapatan Omset (LIME AMBER GREEN) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#65A30D] to-[#4D7C0F] p-6 text-white shadow-xl shadow-lime-600/20 transition-all duration-300 hover:-translate-y-1 border border-white/10 group">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
              <CurrencyCircleDollar className="h-6 w-6 text-white" weight="bold" />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-lime-100 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
              Pendapatan
            </span>
          </div>
          <div className="mt-6 flex items-baseline justify-between">
            <div>
              <p className="text-3xl font-black tracking-tight">Rp {stats.revenue}</p>
              <p className="mt-1 text-xs text-lime-100/90 font-medium">Omset Terverifikasi</p>
            </div>
            <span className="flex items-center text-xs font-bold text-lime-100 bg-white/20 px-2.5 py-1 rounded-full border border-white/20">
              +24% YoY
            </span>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: PROFILE WIDGET & TIMELINE (LEFT 4 COLS) vs ANALYTICS CHART (RIGHT 8 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: ADMIN PROFILE CARD & RECENT ACTIVITIES TIMELINE */}
        <div className="lg:col-span-4 space-y-6">
          {/* PROFILE SUMMARY WIDGET (JOBIE DASHBOARD STYLE) */}
          <div className="rounded-3xl bg-white p-7 shadow-xs border border-slate-200/80 text-center relative overflow-hidden transition-all hover:shadow-md">
            {/* Header Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#001a52] via-[#09296e] to-[#001a52]" />
            <div className="relative z-10 pt-4">
              {/* Avatar Ring */}
              <div className="relative mx-auto h-24 w-24 rounded-full bg-white p-1 shadow-xl">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-[#001a52] via-blue-900 to-indigo-600 text-white font-black text-3xl shadow-inner border border-blue-200">
                  S
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-slate-900 border-2 border-white shadow-md">
                  <ShieldCheck weight="fill" className="h-4 w-4 text-[#001a52]" />
                </div>
              </div>

              <h3 className="mt-4 text-xl font-black text-slate-900 tracking-tight">Super Admin</h3>
              <p className="text-xs font-extrabold text-[#001a52] uppercase tracking-widest mt-0.5">
                Head of Hotel Operations
              </p>

              {/* Progress Ring / Bar Indicators (Standard 66%, Suite 31%, Presidential 7%) */}
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-6">
                <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
                  <div className="text-sm font-black text-slate-900">66%</div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Standard</div>
                  <div className="mx-auto mt-1.5 h-1.5 w-full rounded-full bg-orange-100 overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full w-[66%]" />
                  </div>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
                  <div className="text-sm font-black text-slate-900">31%</div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Suite</div>
                  <div className="mx-auto mt-1.5 h-1.5 w-full rounded-full bg-emerald-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[31%]" />
                  </div>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
                  <div className="text-sm font-black text-slate-900">7%</div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Presid.</div>
                  <div className="mx-auto mt-1.5 h-1.5 w-full rounded-full bg-cyan-100 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full w-[25%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITIES TIMELINE */}
          <div className="rounded-3xl bg-white p-7 shadow-xs border border-slate-200/80">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-base font-extrabold text-slate-900 tracking-tight">Aktivitas Terkini</h4>
              <span className="text-xs text-[#001a52] font-extrabold cursor-pointer hover:underline">
                Lihat Semua
              </span>
            </div>

            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {[
                {
                  title: "Reservasi #BK-102 Dikonfirmasi",
                  time: "2 jam yang lalu",
                  icon: CheckCircle,
                  color: "text-emerald-600 bg-emerald-50 border-emerald-200"
                },
                {
                  title: "Pembayaran Midtrans Rp 1.500.000 Berhasil",
                  time: "3 jam yang lalu",
                  icon: CurrencyCircleDollar,
                  color: "text-blue-600 bg-blue-50 border-blue-200"
                },
                {
                  title: "Data Kamar Suite 109 Diperbarui",
                  time: "5 jam yang lalu",
                  icon: Key,
                  color: "text-purple-600 bg-purple-50 border-purple-200"
                },
                {
                  title: "User 'Tamu Regular' Mendaftar Akun",
                  time: "1 hari yang lalu",
                  icon: UsersThree,
                  color: "text-amber-600 bg-amber-50 border-amber-200"
                },
              ].map((act, index) => {
                const IconComp = act.icon;
                return (
                  <div key={index} className="relative flex items-start gap-4 pl-2 group">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${act.color} shadow-2xs shrink-0 z-10 transition-transform group-hover:scale-110`}>
                      <IconComp className="h-4 w-4" weight="bold" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800">{act.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{act.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-50 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all border border-slate-200/80 cursor-pointer">
              <span>Muat Lebih Banyak</span>
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: VACANCY / OCCUPANCY GRAPH CHART (JOBIE STYLE) */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl bg-white p-7 shadow-xs border border-slate-200/80 h-full flex flex-col justify-between">
            {/* Chart Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Statistik Okupansi & Reservasi SiniBook
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Analisis real-time tren pemesanan kamar dan tingkat hunian bulanan.
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* Legend Badges */}
                <div className="flex items-center gap-3 text-xs font-extrabold">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#001a52]" />
                    <span className="text-slate-700">Pemesanan</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#059669]" />
                    <span className="text-slate-700">Check-In</span>
                  </div>
                </div>

                {/* Filter Dropdown */}
                <select 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#001a52]/30 cursor-pointer shadow-2xs"
                >
                  <option value="Bulan Ini">Bulan Ini</option>
                  <option value="Triwulan">Triwulan Ini</option>
                  <option value="Tahun Ini">Tahun 2026</option>
                </select>
              </div>
            </div>

            {/* Visual SVG Bezier Curve Graph with Floating Active Tooltip (Jobie layout) */}
            <div className="relative my-8 flex-1 min-h-[280px] flex flex-col justify-end">
              {/* Floating Active Tooltip Box */}
              <div className="absolute top-4 right-1/3 bg-[#001a52] text-white p-3.5 rounded-2xl shadow-2xl border border-blue-400/30 text-xs font-medium z-10 animate-bounce">
                <p className="text-[10px] text-blue-200 font-mono font-bold uppercase tracking-wider">16 Juli 2026</p>
                <div className="flex items-center gap-4 mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    <span className="font-extrabold text-white">37 Booking</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="font-extrabold text-emerald-200">2 Check-In</span>
                  </div>
                </div>
              </div>

              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-30 pointer-events-none">
                <div className="border-b border-dashed border-slate-300 w-full" />
                <div className="border-b border-dashed border-slate-300 w-full" />
                <div className="border-b border-dashed border-slate-300 w-full" />
                <div className="border-b border-dashed border-slate-300 w-full" />
              </div>

              {/* SVG Smooth Curves */}
              <svg viewBox="0 0 800 200" className="w-full h-48 overflow-visible z-0">
                <defs>
                  <linearGradient id="gradientNavy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#001a52" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#001a52" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="gradientEmerald" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Navy Blue Curve & Gradient Fill */}
                <path
                  d="M 0 140 Q 100 60 200 130 T 400 70 T 600 120 T 800 80 L 800 200 L 0 200 Z"
                  fill="url(#gradientNavy)"
                />
                <path
                  d="M 0 140 Q 100 60 200 130 T 400 70 T 600 120 T 800 80"
                  fill="none"
                  stroke="#001a52"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Emerald Green Curve & Gradient Fill */}
                <path
                  d="M 0 170 Q 100 120 200 150 T 400 130 T 600 160 T 800 110 L 800 200 L 0 200 Z"
                  fill="url(#gradientEmerald)"
                />
                <path
                  d="M 0 170 Q 100 120 200 150 T 400 130 T 600 160 T 800 110"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Active Interactive Dot Marker */}
                <circle cx="530" cy="135" r="7" fill="#001a52" className="animate-pulse" />
                <circle cx="530" cy="135" r="14" fill="#001a52" fillOpacity="0.2" />
              </svg>

              {/* X Axis Labels */}
              <div className="flex justify-between pt-4 text-[11px] font-bold text-slate-400 border-t border-slate-100">
                <span>Minggu 01</span>
                <span>Minggu 02</span>
                <span>Minggu 03</span>
                <span>Minggu 04</span>
                <span>Minggu 05</span>
                <span>Minggu 06</span>
                <span>Minggu 07</span>
                <span>Minggu 08</span>
              </div>
            </div>

            {/* Bottom Summary Bar */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 bg-slate-50/80 rounded-2xl p-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Booking Masuk</span>
                <p className="text-base font-black text-slate-900 mt-0.5">342 Kamar</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Rata-rata Lama Menginap</span>
                <p className="text-base font-black text-slate-900 mt-0.5">2.4 Malam</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Tingkat Pembatalan</span>
                <p className="text-base font-black text-rose-600 mt-0.5">1.8% (Sangat Rendah)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION: RECOMMENDED ROOM TYPES SHOWCASE (JOBIE STYLE) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Tipe Kamar Unggulan SiniBook</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Ringkasan ketersediaan unit, harga, dan fasilitas utama kamar hotel.
            </p>
          </div>
          <Link
            href="/admin/kamar"
            className="flex items-center gap-1.5 text-xs font-extrabold text-[#001a52] hover:underline transition-all bg-blue-50 px-4 py-2 rounded-xl border border-blue-100"
          >
            <span>Kelola Semua Kamar</span>
            <CaretRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 3 ROOM CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayRooms.map((room, idx) => (
            <div 
              key={room.id} 
              className="rounded-3xl bg-white p-6 shadow-xs border border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold border ${room.badgeBg}`}>
                    {room.type}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <UsersThree className="h-4 w-4 text-slate-400" />
                    {room.capacity} Tamu
                  </span>
                </div>

                <h4 className="text-lg font-black text-slate-900 group-hover:text-[#001a52] transition-colors">{room.name}</h4>
                <p className="text-xl font-black text-[#001a52] mt-1.5">
                  Rp {room.price_per_night.toLocaleString("id-ID")}{" "}
                  <span className="text-xs font-medium text-slate-400">/malam</span>
                </p>

                {/* Facility Pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {room.facilities.map((fac, i) => (
                    <span key={i} className="rounded-xl bg-slate-100/90 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-extrabold text-emerald-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {room.available}
                </span>
                <Link
                  href="/admin/kamar"
                  className="font-extrabold text-[#001a52] hover:underline flex items-center gap-1"
                >
                  <span>Detail</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

