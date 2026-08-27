"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CreditCard,
  Bell,
  Star,
  User,
  LogOut,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  ShieldCheck,
  MapPin,
  Users,
  Search,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  X,
  Edit3,
  Check,
  MessageSquare,
  Lock,
} from "lucide-react";

import Header from "../landing-pages/Header";
import Footer from "../landing-pages/Footer";

// ============================================================================
// DEFINISI INTERFACE TYPESCRIPT (100% SAMA DENGAN PRISMA SCHEMA)
// ============================================================================

// Model Prisma: `users`
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

// Model Prisma: `bookings` + `schedules` + `resources`
interface BookingItem {
  id: string;
  user_id: string;
  schedule_id: string;
  room_name: string;
  room_type: string;
  room_location: string;
  room_image: string;
  check_in: string;
  check_out: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  total_price: number;
  created_at: string;
}

// Model Prisma: `payments`
interface PaymentItem {
  id: string;
  booking_id: string;
  room_name: string;
  amount: number;
  payment_method: string; // "gopay" | "bank_transfer" | "qris" | "credit_card"
  status: "pending" | "success" | "settlement" | "expire";
  paid_at?: string;
}

// Model Prisma: `notifications`
interface NotificationItem {
  id: string;
  user_id: string;
  booking_id?: string;
  type: string; // "booking_confirmation" | "payment_success" | "promo" | "system"
  message: string;
  is_read: boolean;
  created_at: string;
}

// Model Prisma: `reviews`
interface ReviewItem {
  id: string;
  booking_id: string;
  room_name: string;
  rating: number; // 1 - 5
  comment: string;
  created_at: string;
}

// ============================================================================
// INITIAL MOCK DATA (PRESISI DENGAN DATA DATABASE PRISMA)
// ============================================================================

const MOCK_BOOKINGS: BookingItem[] = [
  {
    id: "bk-9823-uuid-01",
    user_id: "usr-101",
    schedule_id: "sch-01",
    room_name: "Deluxe Ocean View",
    room_type: "Deluxe",
    room_location: "Gedung Utama - Lantai 5",
    room_image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
    check_in: "2026-08-25",
    check_out: "2026-08-27",
    status: "confirmed",
    notes: "Minta kamar lantai tinggi dan pemandangan laut bersih.",
    total_price: 1700000,
    created_at: "2026-08-20T10:30:00Z",
  },
  {
    id: "bk-4512-uuid-02",
    user_id: "usr-101",
    schedule_id: "sch-02",
    room_name: "Executive King Suite",
    room_type: "Suite",
    room_location: "Wing Barat - Lantai 8",
    room_image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    check_in: "2026-09-01",
    check_out: "2026-09-03",
    status: "pending",
    notes: "Late check-in sekitar jam 7 malam.",
    total_price: 2700000,
    created_at: "2026-08-21T08:15:00Z",
  },
  {
    id: "bk-1102-uuid-03",
    user_id: "usr-101",
    schedule_id: "sch-03",
    room_name: "Superior Room",
    room_type: "Superior",
    room_location: "Gedung Utama - Lantai 3",
    room_image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    check_in: "2026-07-10",
    check_out: "2026-07-12",
    status: "completed",
    notes: "Kamar bersih dan sarapan enak.",
    total_price: 1360000,
    created_at: "2026-07-08T14:20:00Z",
  },
];

const MOCK_PAYMENTS: PaymentItem[] = [
  {
    id: "pay-7711-uuid-01",
    booking_id: "bk-9823-uuid-01",
    room_name: "Deluxe Ocean View",
    amount: 1700000,
    payment_method: "gopay",
    status: "settlement",
    paid_at: "2026-08-20T10:35:12Z",
  },
  {
    id: "pay-8822-uuid-02",
    booking_id: "bk-4512-uuid-02",
    room_name: "Executive King Suite",
    amount: 2700000,
    payment_method: "bank_transfer",
    status: "pending",
  },
  {
    id: "pay-3344-uuid-03",
    booking_id: "bk-1102-uuid-03",
    room_name: "Superior Room",
    amount: 1360000,
    payment_method: "qris",
    status: "settlement",
    paid_at: "2026-07-08T14:22:00Z",
  },
];

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-01",
    user_id: "usr-101",
    booking_id: "bk-9823-uuid-01",
    type: "payment_success",
    message: "Pembayaran pemesanan Deluxe Ocean View sebesar Rp 1.700.000 telah sukses dikonfirmasi!",
    is_read: false,
    created_at: "2026-08-20T10:35:12Z",
  },
  {
    id: "notif-02",
    user_id: "usr-101",
    booking_id: "bk-4512-uuid-02",
    type: "booking_confirmation",
    message: "Pemesanan Executive King Suite telah dibuat. Silakan selesaikan pembayaran sebelum 24 jam.",
    is_read: false,
    created_at: "2026-08-21T08:15:00Z",
  },
  {
    id: "notif-03",
    user_id: "usr-101",
    type: "promo",
    message: "Selamat! Anda mendapatkan voucher promo diskon 20% untuk pemesanan kamar bulan depan.",
    is_read: true,
    created_at: "2026-08-15T12:00:00Z",
  },
];

const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: "rev-01",
    booking_id: "bk-1102-uuid-03",
    room_name: "Superior Room",
    rating: 5,
    comment: "Pelayanan dari resepsionis sangat ramah dan proses check-in sangat cepat. Kamarnya bersih sekali!",
    created_at: "2026-07-13T09:00:00Z",
  },
];

export default function UserDashboardPage() {
  const router = useRouter();

  // State Tab Navigasi Active
  const [activeTab, setActiveTab] = useState<
    "bookings" | "payments" | "notifications" | "reviews" | "settings"
  >("bookings");

  // State Authenticated User (Decode dari JWT token localStorage)
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // State Data Interaktif
  const [bookings, setBookings] = useState<BookingItem[]>(MOCK_BOOKINGS);
  const [payments, setPayments] = useState<PaymentItem[]>(MOCK_PAYMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [reviews, setReviews] = useState<ReviewItem[]>(MOCK_REVIEWS);

  // State Modal Beri Ulasan
  const [selectedReviewBooking, setSelectedReviewBooking] = useState<BookingItem | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");

  // State Form Settings Profile
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Function Tampilkan Toast Notifikasi Sementara
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check Authenticated User dari JWT Token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Jika belum login, redirect ke halaman /login
      router.push("/login");
      return;
    }

    try {
      // Decode JWT Payload Sederhana
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);

      const loadedUser: UserProfile = {
        id: payload.sub || "usr-101",
        name: payload.name || payload.email?.split("@")[0] || "Tamu SiniBook",
        email: payload.email || "user@sinibook.com",
        role: payload.role || "user",
        created_at: "2026-01-15",
      };

      setUser(loadedUser);
      setProfileName(loadedUser.name);
      setProfileEmail(loadedUser.email);
    } catch (err) {
      console.error("JWT Decode error:", err);
      localStorage.removeItem("token");
      router.push("/login");
    } finally {
      setIsLoadingAuth(false);
    }
  }, [router]);

  // Handler Logout User
  const handleLogout = () => {
    localStorage.removeItem("token");
    showToast("Berhasil keluar dari akun.");
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  // Handler Tandai Notifikasi Sudah Dibaca (`is_read: true`)
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    showToast("Notifikasi ditandai sudah dibaca.");
  };

  // Handler Submit Ulasan Baru
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReviewBooking) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      booking_id: selectedReviewBooking.id,
      room_name: selectedReviewBooking.room_name,
      rating: reviewRating,
      comment: reviewComment,
      created_at: new Date().toISOString(),
    };

    setReviews((prev) => [newRev, ...prev]);
    setSelectedReviewBooking(null);
    setReviewComment("");
    showToast("⭐ Ulasan dan rating berhasil dikirim!");
  };

  // Handler Update Profil User
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({ ...user, name: profileName, email: profileEmail });
      showToast(" Profil akun berhasil diperbarui!");
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#0B4F37] font-semibold">
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Memuat Dashboard Member...</span>
        </div>
      </div>
    );
  }

  // Menghitung statistik untuk ringkasan kartu
  const unreadNotifCount = notifications.filter((n) => !n.is_read).length;
  const activeBookingsCount = bookings.filter((b) => b.status === "confirmed" || b.status === "pending").length;
  const totalSettledPayments = payments
    .filter((p) => p.status === "settlement")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-[#0B4F37] selection:text-white flex flex-col">
      {/* 1. Header Navigation */}
      <Header activePage="dashboard" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-gray-900/90 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl backdrop-blur-md transition-all animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Main Content Dashboard */}
      <main className="flex-1 w-full pb-20">
        {/* BANNER PROFIL HEADER DASHBOARD */}
        <section className="relative w-full bg-[#073524] pt-12 pb-20 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
              alt="SiniBook Hotel Outer View"
              fill
              priority
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B4F37]/40 via-[#073524]/80 to-[#073524]" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Avatar Circle */}
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-[#126E4E] text-white text-2xl sm:text-3xl font-extrabold shadow-xl border-2 border-emerald-400/40">
                  {user?.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {user?.name}
                    </h1>
                    <span className="rounded-full bg-emerald-500/30 px-3 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-400/40">
                      Member {user?.role.toUpperCase()}
                    </span>
                  </div>

                  <p className="mt-1 text-xs sm:text-sm text-emerald-100/80 flex items-center gap-2 font-light">
                    <span>{user?.email}</span>
                    <span>•</span>
                    <span>ID: {user?.id}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Link
                  href="/kamar"
                  className="rounded-full bg-white px-5 py-2.5 text-xs font-bold text-[#0B4F37] shadow transition-all hover:bg-emerald-50 hover:shadow-md"
                >
                  Pesan Kamar Baru
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-full border border-red-400/50 px-4 py-2.5 text-xs font-semibold text-red-200 transition-all hover:bg-red-500/20 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>

            {/* KARTU RINGKASAN STATISTIK DASAR */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <span className="block text-[11px] font-medium text-emerald-200 uppercase tracking-wider">Total Booking</span>
                <span className="mt-1 block text-2xl sm:text-3xl font-extrabold text-white">{bookings.length}</span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <span className="block text-[11px] font-medium text-emerald-200 uppercase tracking-wider">Booking Aktif</span>
                <span className="mt-1 block text-2xl sm:text-3xl font-extrabold text-amber-300">{activeBookingsCount}</span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <span className="block text-[11px] font-medium text-emerald-200 uppercase tracking-wider">Total Transaksi</span>
                <span className="mt-1 block text-lg sm:text-xl font-extrabold text-emerald-300 truncate">
                  Rp {totalSettledPayments.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <span className="block text-[11px] font-medium text-emerald-200 uppercase tracking-wider">Notifikasi Baru</span>
                <span className="mt-1 block text-2xl sm:text-3xl font-extrabold text-rose-300">{unreadNotifCount}</span>
              </div>
            </div>
          </div>
        </section>

        {/* CONTAINER TAB & KONTEN ISI DASHBOARD */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="rounded-3xl border border-gray-200/80 bg-white shadow-xl overflow-hidden">
            {/* BILAH TAB NAVIGATION HORIZONTAL */}
            <div className="flex border-b border-gray-100 bg-gray-50/70 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex items-center gap-2 px-6 py-4 text-xs sm:text-sm font-bold transition-all whitespace-nowrap border-b-2 ${
                  activeTab === "bookings"
                    ? "border-[#0B4F37] bg-white text-[#0B4F37]"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Pemesanan Saya</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-800">
                  {bookings.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("payments")}
                className={`flex items-center gap-2 px-6 py-4 text-xs sm:text-sm font-bold transition-all whitespace-nowrap border-b-2 ${
                  activeTab === "payments"
                    ? "border-[#0B4F37] bg-white text-[#0B4F37]"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Riwayat Pembayaran</span>
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center gap-2 px-6 py-4 text-xs sm:text-sm font-bold transition-all whitespace-nowrap border-b-2 relative ${
                  activeTab === "notifications"
                    ? "border-[#0B4F37] bg-white text-[#0B4F37]"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
              >
                <Bell className="h-4 w-4" />
                <span>Notifikasi</span>
                {unreadNotifCount > 0 && (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] text-white font-bold animate-pulse">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex items-center gap-2 px-6 py-4 text-xs sm:text-sm font-bold transition-all whitespace-nowrap border-b-2 ${
                  activeTab === "reviews"
                    ? "border-[#0B4F37] bg-white text-[#0B4F37]"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
              >
                <Star className="h-4 w-4" />
                <span>Ulasan Saya</span>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 px-6 py-4 text-xs sm:text-sm font-bold transition-all whitespace-nowrap border-b-2 ${
                  activeTab === "settings"
                    ? "border-[#0B4F37] bg-white text-[#0B4F37]"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
              >
                <User className="h-4 w-4" />
                <span>Pengaturan Profil</span>
              </button>
            </div>

            {/* BODY KONTEN TAB HASIL NAVIGASI */}
            <div className="p-6 sm:p-8 min-h-[400px]">
              
              {/* TAB 1: PEMESANAN SAYA (BOOKINGS) */}
              {activeTab === "bookings" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Daftar Pemesanan Kamar</h2>
                      <p className="text-xs text-gray-500">Kelola reservasi kamar aktif dan riwayat menginap Anda.</p>
                    </div>
                    <Link
                      href="/kamar"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B4F37] hover:underline"
                    >
                      <span>Cari Kamar Lain</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-xs">
                      Belum ada reservasi kamar. Silakan pesan kamar impian Anda!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex flex-col md:flex-row overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all hover:shadow-md"
                        >
                          {/* Gambar Kamar */}
                          <div className="relative h-48 md:h-auto md:w-64 shrink-0 bg-gray-100">
                            <Image
                              src={booking.room_image}
                              alt={booking.room_name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="rounded-full bg-[#0B4F37] px-3 py-1 text-[11px] font-bold text-white shadow">
                                {booking.room_type}
                              </span>
                            </div>
                          </div>

                          {/* Detail Pemesanan */}
                          <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                            <div>
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <span className="text-[10px] font-mono text-gray-400 uppercase">ID: {booking.id}</span>
                                  <h3 className="text-lg font-bold text-gray-900">{booking.room_name}</h3>
                                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                    <span>{booking.room_location}</span>
                                  </div>
                                </div>

                                {/* Status Badge */}
                                <div>
                                  {booking.status === "confirmed" && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                      Terverifikasi (Lunas)
                                    </span>
                                  )}
                                  {booking.status === "pending" && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                                      Menunggu Bayar
                                    </span>
                                  )}
                                  {booking.status === "completed" && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                                      Selesai Menginap
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Tanggal Check-in / Out */}
                              <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-3 text-xs">
                                <div>
                                  <span className="block text-[10px] text-gray-400 font-semibold uppercase">Check-in</span>
                                  <span className="font-bold text-gray-800">{booking.check_in}</span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-gray-400 font-semibold uppercase">Check-out</span>
                                  <span className="font-bold text-gray-800">{booking.check_out}</span>
                                </div>
                              </div>

                              {booking.notes && (
                                <p className="mt-3 text-xs text-gray-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                                  &quot;{booking.notes}&quot;
                                </p>
                              )}
                            </div>

                            {/* Kaki Card: Harga & Tombol Aksi */}
                            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                              <div>
                                <span className="block text-[10px] text-gray-400 font-bold uppercase">Total Tagihan</span>
                                <span className="text-lg font-extrabold text-[#0B4F37]">
                                  Rp {booking.total_price.toLocaleString("id-ID")}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {booking.status === "pending" && (
                                  <Link
                                    href="/checkout"
                                    className="rounded-xl bg-[#0B4F37] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#073524]"
                                  >
                                    Bayar Sekarang
                                  </Link>
                                )}
                                {booking.status === "completed" && (
                                  <button
                                    onClick={() => setSelectedReviewBooking(booking)}
                                    className="rounded-xl border border-[#0B4F37] px-4 py-2 text-xs font-bold text-[#0B4F37] hover:bg-emerald-50"
                                  >
                                    Beri Ulasan
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: RIWAYAT PEMBAYARAN (PAYMENTS) */}
              {activeTab === "payments" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-gray-900">Riwayat Pembayaran & Transaksi</h2>
                    <p className="text-xs text-gray-500">Catatan pembayaran aman yang terdaftar di sistem.</p>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                        <tr>
                          <th className="p-4">ID Transaksi</th>
                          <th className="p-4">Kamar</th>
                          <th className="p-4">Nominal</th>
                          <th className="p-4">Metode Bayar</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Waktu Bayar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {payments.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50/50">
                            <td className="p-4 font-mono font-medium text-gray-900">{p.id}</td>
                            <td className="p-4 font-semibold text-gray-800">{p.room_name}</td>
                            <td className="p-4 font-extrabold text-[#0B4F37]">Rp {p.amount.toLocaleString("id-ID")}</td>
                            <td className="p-4 uppercase font-bold text-gray-600">{p.payment_method}</td>
                            <td className="p-4">
                              {p.status === "settlement" || p.status === "success" ? (
                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                                  SUKSES
                                </span>
                              ) : (
                                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                                  PENDING
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-gray-500">
                              {p.paid_at ? new Date(p.paid_at).toLocaleString("id-ID") : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: PUSAT NOTIFIKASI (NOTIFICATIONS) */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Pusat Notifikasi</h2>
                      <p className="text-xs text-gray-500">Pemberitahuan resmi seputar reservasi dan penawaran eksklusif.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex items-start justify-between p-4 rounded-2xl border transition-all ${
                          n.is_read
                            ? "bg-white border-gray-200/80 text-gray-600"
                            : "bg-emerald-50/40 border-emerald-200 text-gray-900 shadow-sm"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl mt-0.5 ${n.is_read ? "bg-gray-100 text-gray-500" : "bg-[#0B4F37] text-white"}`}>
                            <Bell className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-medium leading-relaxed">{n.message}</p>
                            <span className="text-[10px] text-gray-400 mt-1 block">
                              {new Date(n.created_at).toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>

                        {!n.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(n.id)}
                            className="text-[11px] font-bold text-[#0B4F37] hover:underline shrink-0 ml-4"
                          >
                            Tandai dibaca
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ULASAN SAYA (REVIEWS) */}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-gray-900">Ulasan & Rating Saya</h2>
                    <p className="text-xs text-gray-500">Ulasan yang telah Anda kirimkan untuk pengalaman menginap.</p>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-xs">
                      Belum ada ulasan yang diberikan. Berikan ulasan pada booking yang sudah selesai!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((r) => (
                        <div key={r.id} className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-sm text-gray-900">{r.room_name}</h3>
                            <div className="flex items-center gap-1 text-amber-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < r.rating ? "fill-amber-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">&quot;{r.comment}&quot;</p>
                          <span className="text-[10px] text-gray-400 block pt-1">
                            Dikirim pada: {new Date(r.created_at).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: PENGATURAN PROFIL (SETTINGS) */}
              {activeTab === "settings" && (
                <div className="space-y-6 max-w-xl">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-gray-900">Pengaturan Akun</h2>
                    <p className="text-xs text-gray-500">Perbarui data informasi pribadi Anda.</p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 p-3 text-xs font-semibold text-gray-900 focus:border-[#0B4F37] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email Terdaftar</label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 p-3 text-xs font-semibold text-gray-900 focus:border-[#0B4F37] focus:outline-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="rounded-full bg-[#0B4F37] px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-[#073524]"
                    >
                      Simpan Perubahan
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </section>
      </main>

      {/* MODAL BERI ULASAN */}
      {selectedReviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedReviewBooking(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900">Beri Ulasan & Rating</h3>
            <p className="text-xs text-gray-500 mt-1">Bagikan pengalaman Anda menginap di {selectedReviewBooking.room_name}.</p>

            <form onSubmit={handleSubmitReview} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Rating Bintang</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 transition-transform hover:scale-125"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Komentar Ulasan</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  placeholder="Tulis ulasan Anda di sini..."
                  className="w-full rounded-xl border border-gray-300 p-3 text-xs text-gray-900 focus:border-[#0B4F37] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#0B4F37] py-3 text-xs font-bold text-white shadow hover:bg-[#073524]"
              >
                Kirim Ulasan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
