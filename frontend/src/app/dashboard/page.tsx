"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

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
  resource_id?: string;
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



const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: "rev-01",
    booking_id: "bk-1102-uuid-03",
    room_name: "Superior Room",
    rating: 5,
    comment:
      "Pelayanan dari resepsionis sangat ramah dan proses check-in sangat cepat. Kamarnya bersih sekali!",
    created_at: "2026-07-13T09:00:00Z",
  },
];

export default function UserDashboardPage() {
  const router = useRouter();

  // State Tab Navigasi Active
  const [activeTab, setActiveTab] = useState<
    "bookings" | "notifications" | "reviews" | "settings"
  >("bookings");

  // State Authenticated User (Decode dari JWT token localStorage)
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // State Data Interaktif
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  // State Modal Beri Ulasan
  const [selectedReviewBooking, setSelectedReviewBooking] =
    useState<BookingItem | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

  const handlePayNow = async (bookingId: string) => {
    try {
      setPayingBookingId(bookingId);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/payments/${bookingId}/pay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal memproses pembayaran");
      }

      if (data.midtrans_redirect_url) {
        window.location.href = data.midtrans_redirect_url;
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setPayingBookingId(null);
    }
  };

  // State Form Settings Profile
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();

  // Function Tampilkan Toast Notifikasi Sementara
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    const paymentStatus =
      searchParams.get("payment") || searchParams.get("transaction_status");
    if (paymentStatus === "success" || paymentStatus === "settlement") {
      showToast("Pembayaran Berhasil! Pesanan Anda telah terkonfirmasi.");
    }
  }, [searchParams]);

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
          .join(""),
      );
      const payload = JSON.parse(jsonPayload);

      // Validasi: Jika Admin/Staff mencoba akses dashboard user, lempar ke panel masing-masing
      if (payload.role === "admin") {
        router.replace("/admin");
        return;
      }
      if (payload.role === "staff") {
        router.replace("/staff");
        return;
      }

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

  // Fetch Riwayat Pesanan (Bookings)
  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3001/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const rawData = await res.json();

          // Mapping data dari struktur Prisma Backend ke struktur BookingItem Frontend
          const mappedBookings: BookingItem[] = rawData.map((b: any) => ({
            id: b.id,
            user_id: b.user_id,
            schedule_id: b.schedule_id,
            resource_id: b.schedules?.resource_id || b.schedules?.resources?.id || "",
            room_name: b.schedules?.resources?.name || "Kamar tidak diketahui",
            room_type: b.schedules?.resources?.type || "Standard",
            room_location: b.schedules?.resources?.location || "-",
            // Ambil gambar dari DB atau pakai fallback default
            room_image:
              b.schedules?.resources?.image_url ||
              "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
            // Format ISO date DB (contoh: 2026-08-25T00:00:00.000Z) ke format YYYY-MM-DD
            check_in: b.schedules?.start_time
              ? new Date(b.schedules.start_time).toISOString().split("T")[0]
              : "-",
            check_out: b.schedules?.end_time
              ? new Date(b.schedules.end_time).toISOString().split("T")[0]
              : "-",
            status: b.status,
            notes: b.notes || "-",
            total_price: b.payment?.amount || 0,
            created_at: b.created_at,
          }));

          setBookings(mappedBookings);
        } else {
          console.error("Gagal fetch data bookings, status:", res.status);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    // Eksekusi fungsi fetch kalau user berhasil ter-autentikasi
    if (!isLoadingAuth && user) {
      fetchBookings();
    }
  }, [isLoadingAuth, user]);

  // Fetch Notifikasi
  useEffect(() => {
    const fetchNotifs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3001/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const rawData = await res.json();
          // Backend me-return array notifikasi sesuai struktur Prisma
          setNotifications(rawData);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (!isLoadingAuth && user) {
      fetchNotifs();
    }
  }, [isLoadingAuth, user]);

  // Handler Logout User
  const handleLogout = () => {
    localStorage.removeItem("token");
    showToast("Berhasil keluar dari akun.");
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  // Handler Tandai Notifikasi Sudah Dibaca (`is_read: true`)
  const handleMarkAsRead = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `http://localhost:3001/notifications/${id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
        );
        showToast("Notifikasi ditandai sudah dibaca.");
      }
    } catch (error) {
      console.error("Error marking notif as read:", error);
    }
  };

  // Handler Tandai Semua Notifikasi Sudah Dibaca
  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:3001/notifications/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        showToast("Semua notifikasi ditandai sudah dibaca.");
      }
    } catch (error) {
      console.error("Error marking all notifs as read:", error);
    }
  };

  // Handler Submit Ulasan Baru
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReviewBooking) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3001/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking_id: selectedReviewBooking.id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        // Masukin ulasan ke list sementara di UI biar kelihatan langsung
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
        showToast("Ulasan dan rating berhasil dikirim!");
      } else {
        // Kalau error (misal udah pernah kasih ulasan)
        const errorData = await res.json();
        showToast(`Gagal: ${errorData.message || "Ulasan gagal dikirim"}`);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast("Terjadi kesalahan sistem.");
    }
  };

  // Handler Update Profil User
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Kita siapin data nama dan email
      const bodyPayload: any = {
        name: profileName,
        email: profileEmail,
      };

      // Kalau user ngisi kolom password, baru kita ikutin buat di-update
      if (profilePassword.trim() !== "") {
        bodyPayload.password = profilePassword;
      }

      const res = await fetch(`http://localhost:3001/user/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      if (res.ok) {
        setUser({ ...user, name: profileName, email: profileEmail });
        setProfilePassword("");
        showToast("Profil akun berhasil diperbarui!");
      } else {
        const errorData = await res.json();
        showToast(`Gagal: ${errorData.message || "Gagal memperbarui profil"}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Terjadi kesalahan sistem.");
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#1D4ED8] font-semibold">
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Memuat Dashboard Member...</span>
        </div>
      </div>
    );
  }

  // Menghitung statistik untuk ringkasan kartu
  const unreadNotifCount = notifications.filter((n) => !n.is_read).length;
  const activeBookingsCount = bookings.filter(
    (b) =>
      b.status === "confirmed" ||
      b.status === "approved" ||
      b.status === "pending" ||
      b.status === "checked_in",
  ).length;
  const totalSettledPayments = bookings
    .filter((b: any) => b.payment?.status === "settlement" || b.payment?.status === "success")
    .reduce((acc: number, b: any) => acc + (b.payment?.amount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-[#1D4ED8] selection:text-white flex flex-col">
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
        <section className="relative w-full bg-[#1E3A8A] pt-12 pb-20 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
              alt="SiniBook Hotel Outer View"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1D4ED8]/40 via-[#1E3A8A]/80 to-[#1E3A8A]" />
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
                  className="rounded-full bg-white px-5 py-2.5 text-xs font-bold text-[#1D4ED8] shadow transition-all hover:bg-emerald-50 hover:shadow-md"
                >
                  Pesan Kamar Baru
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-full border border-red-400/50 px-4 py-2.5 text-xs font-semibold text-red-200 transition-all hover:bg-red-500/20 hover:text-white"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    logout
                  </span>
                  <span>Keluar</span>
                </button>
              </div>
            </div>

            {/* KARTU RINGKASAN STATISTIK DASAR */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <span className="block text-[11px] font-medium text-emerald-200 uppercase tracking-wider">
                  Total Booking
                </span>
                <span className="mt-1 block text-2xl sm:text-3xl font-extrabold text-white">
                  {bookings.length}
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <span className="block text-[11px] font-medium text-emerald-200 uppercase tracking-wider">
                  Booking Aktif
                </span>
                <span className="mt-1 block text-2xl sm:text-3xl font-extrabold text-amber-300">
                  {activeBookingsCount}
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <span className="block text-[11px] font-medium text-emerald-200 uppercase tracking-wider">
                  Total Transaksi
                </span>
                <span className="mt-1 block text-lg sm:text-xl font-extrabold text-emerald-300 truncate">
                  Rp {totalSettledPayments.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <span className="block text-[11px] font-medium text-emerald-200 uppercase tracking-wider">
                  Notifikasi Baru
                </span>
                <span className="mt-1 block text-2xl sm:text-3xl font-extrabold text-rose-300">
                  {unreadNotifCount}
                </span>
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
                    ? "border-[#1D4ED8] bg-white text-[#1D4ED8]"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  calendar_today
                </span>
                <span>Pemesanan Saya</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-800">
                  {bookings.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center gap-2 px-6 py-4 text-xs sm:text-sm font-bold transition-all whitespace-nowrap border-b-2 relative ${
                  activeTab === "notifications"
                    ? "border-[#1D4ED8] bg-white text-[#1D4ED8]"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  notifications
                </span>
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
                    ? "border-[#1D4ED8] bg-white text-[#1D4ED8]"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  star
                </span>
                <span>Ulasan Saya</span>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 px-6 py-4 text-xs sm:text-sm font-bold transition-all whitespace-nowrap border-b-2 ${
                  activeTab === "settings"
                    ? "border-[#1D4ED8] bg-white text-[#1D4ED8]"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  person
                </span>
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
                      <h2 className="text-lg font-bold text-gray-900">
                        Daftar Pemesanan Kamar
                      </h2>
                      <p className="text-xs text-gray-500">
                        Kelola reservasi kamar aktif dan riwayat menginap Anda.
                      </p>
                    </div>
                    <Link
                      href="/kamar"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] hover:underline"
                    >
                      <span>Cari Kamar Lain</span>
                      <span className="material-symbols-outlined text-[16px]">
                        chevron_right
                      </span>
                    </Link>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-xs">
                      Belum ada reservasi kamar. Silakan pesan kamar impian
                      Anda!
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
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="rounded-full bg-[#1D4ED8] px-3 py-1 text-[11px] font-bold text-white shadow">
                                {booking.room_type}
                              </span>
                            </div>
                          </div>

                          {/* Detail Pemesanan */}
                          <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                            <div>
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <span className="text-[10px] font-mono text-gray-400 uppercase">
                                    ID: {booking.id}
                                  </span>
                                  <h3 className="text-lg font-bold text-gray-900">
                                    {booking.room_name}
                                  </h3>
                                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                    <span className="material-symbols-outlined text-[14px] text-emerald-600 shrink-0">
                                      location_on
                                    </span>
                                    <span>{booking.room_location}</span>
                                  </div>
                                </div>

                                {/* Status Badge */}
                                <div>
                                  {booking.status === "pending" && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                                      <span className="material-symbols-outlined text-[14px] text-amber-600">
                                        schedule
                                      </span>
                                      Menunggu Bayar
                                    </span>
                                  )}
                                  {(booking.status === "confirmed" ||
                                    booking.status === "approved") && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                      <span className="material-symbols-outlined text-[14px] text-emerald-600">
                                        check_circle
                                      </span>
                                      Terverifikasi (Lunas)
                                    </span>
                                  )}
                                  {booking.status === "checked_in" && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200">
                                      <span className="material-symbols-outlined text-[14px] text-indigo-600">
                                        sensor_door
                                      </span>
                                      Checked In (Menginap)
                                    </span>
                                  )}
                                  {booking.status === "completed" && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                                      <span className="material-symbols-outlined text-[14px] text-blue-600">
                                        task_alt
                                      </span>
                                      Selesai Menginap
                                    </span>
                                  )}
                                  {booking.status === "rejected" && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
                                      <span className="material-symbols-outlined text-[14px] text-rose-600">
                                        cancel
                                      </span>
                                      Ditolak
                                    </span>
                                  )}
                                  {booking.status === "canceled" && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                                      <span className="material-symbols-outlined text-[14px] text-slate-500">
                                        block
                                      </span>
                                      Dibatalkan
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Tanggal Check-in / Out */}
                              <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-3 text-xs">
                                <div>
                                  <span className="block text-[10px] text-gray-400 font-semibold uppercase">
                                    Check-in
                                  </span>
                                  <span className="font-bold text-gray-800">
                                    {booking.check_in}
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-gray-400 font-semibold uppercase">
                                    Check-out
                                  </span>
                                  <span className="font-bold text-gray-800">
                                    {booking.check_out}
                                  </span>
                                </div>
                              </div>

                              {booking.notes && (
                                <p className="mt-3 text-xs text-gray-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                                  &quot;{booking.notes}&quot;
                                </p>
                              )}

                              {/* Info Pembayaran (inline dalam card) */}
                              {(booking as any).payment && (
                                <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-gray-50 border border-gray-100 px-3 py-2 text-xs">
                                  <span className="material-symbols-outlined text-[14px] text-gray-400">credit_card</span>
                                  <span className="font-semibold uppercase text-gray-600">{(booking as any).payment?.payment_method || "-"}</span>
                                  <span className="text-gray-300">•</span>
                                  {(booking as any).payment?.status === "settlement" || (booking as any).payment?.status === "success" ? (
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-bold text-emerald-700">LUNAS</span>
                                  ) : (
                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 font-bold text-amber-700">PENDING</span>
                                  )}
                                  {(booking as any).payment?.paid_at && (
                                    <span className="text-gray-400 ml-auto">
                                      {new Date((booking as any).payment.paid_at).toLocaleDateString("id-ID")}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Kaki Card: Harga & Tombol Aksi */}
                            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                              <div>
                                <span className="block text-[10px] text-gray-400 font-bold uppercase">
                                  Total Tagihan
                                </span>
                                <span className="text-lg font-extrabold text-[#1D4ED8]">
                                  Rp{" "}
                                  {booking.total_price.toLocaleString("id-ID")}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {booking.status === "pending" && (
                                  <button
                                    onClick={() => handlePayNow(booking.id)}
                                    disabled={payingBookingId === booking.id}
                                    className="rounded-xl bg-[#1D4ED8] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#1E3A8A] disabled:opacity-50 transition-all flex items-center gap-1.5"
                                  >
                                    {payingBookingId === booking.id ? (
                                      <>
                                        <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                                        Memproses...
                                      </>
                                    ) : (
                                      "Bayar Sekarang"
                                    )}
                                  </button>
                                )}
                                {(booking.status === "confirmed" ||
                                  booking.status === "approved") && (
                                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">key</span>
                                    Siap Check-in
                                  </span>
                                )}
                                {booking.status === "checked_in" && (
                                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">door_open</span>
                                    Sedang Menginap
                                  </span>
                                )}
                                {booking.status === "completed" && (
                                  <button
                                    onClick={() =>
                                      setSelectedReviewBooking(booking)
                                    }
                                    className="rounded-xl border border-[#1D4ED8] px-4 py-2 text-xs font-bold text-[#1D4ED8] hover:bg-emerald-50"
                                  >
                                    Beri Ulasan
                                  </button>
                                )}
                                {booking.status === "rejected" && (
                                  <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                                    Ditolak Admin
                                  </span>
                                )}
                                {booking.status === "canceled" && (
                                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                                    Dibatalkan
                                  </span>
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



              {/* TAB 3: PUSAT NOTIFIKASI (NOTIFICATIONS) */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Pusat Notifikasi
                      </h2>
                      <p className="text-xs text-gray-500">
                        Pemberitahuan resmi seputar reservasi dan penawaran
                        eksklusif.
                      </p>
                    </div>

                    {/* Tombol Tandai Semua Dibaca */}
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs font-semibold text-[#1D4ED8] hover:text-[#1e3a8a] flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        done_all
                      </span>
                      Tandai Semua Dibaca
                    </button>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-xs">
                      Belum ada notifikasi baru.
                    </div>
                  ) : (
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
                            <div
                              className={`p-2 rounded-xl mt-0.5 ${
                                n.is_read
                                  ? "bg-gray-100 text-gray-500"
                                  : "bg-[#1D4ED8] text-white"
                              }`}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                notifications
                              </span>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                                {n.message}
                              </p>
                              <span className="text-[10px] text-gray-400 mt-1 block">
                                {new Date(n.created_at).toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>

                          {!n.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(n.id)}
                              className="text-[11px] font-bold text-[#1D4ED8] hover:underline shrink-0 ml-4"
                            >
                              Tandai dibaca
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ULASAN SAYA (REVIEWS) */}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      Ulasan & Rating Saya
                    </h2>
                    <p className="text-xs text-gray-500">
                      Ulasan yang telah Anda kirimkan untuk pengalaman menginap.
                    </p>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-xs">
                      Belum ada ulasan yang diberikan. Berikan ulasan pada
                      booking yang sudah selesai!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((r) => (
                        <div
                          key={r.id}
                          className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-sm text-gray-900">
                              {r.room_name}
                            </h3>
                            <div className="flex items-center gap-1 text-amber-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`material-symbols-outlined text-[16px] ${i < r.rating ? "text-amber-400" : "text-gray-300"}`}
                                >
                                  star
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            &quot;{r.comment}&quot;
                          </p>
                          <span className="text-[10px] text-gray-400 block pt-1">
                            Dikirim pada:{" "}
                            {new Date(r.created_at).toLocaleDateString("id-ID")}
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
                    <h2 className="text-lg font-bold text-gray-900">
                      Pengaturan Akun
                    </h2>
                    <p className="text-xs text-gray-500">
                      Perbarui data informasi pribadi Anda.
                    </p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 p-3 text-xs font-semibold text-gray-900 focus:border-[#1D4ED8] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                        Email Terdaftar
                      </label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 p-3 text-xs font-semibold text-gray-900 focus:border-[#1D4ED8] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                        Password Baru (Opsional)
                      </label>
                      <input
                        type="password"
                        value={profilePassword}
                        onChange={(e) => setProfilePassword(e.target.value)}
                        placeholder="Kosongkan jika tidak ingin mengubah password"
                        className="w-full rounded-xl border border-gray-300 p-3 text-xs font-semibold text-gray-900 focus:border-[#1D4ED8] focus:outline-none placeholder:font-normal"
                      />
                    </div>

                    <button
                      type="submit"
                      className="rounded-full bg-[#1D4ED8] px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-[#1E3A8A]"
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
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>

            <h3 className="text-lg font-bold text-gray-900">
              Beri Ulasan & Rating
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Bagikan pengalaman Anda menginap di{" "}
              {selectedReviewBooking.room_name}.
            </p>

            <form onSubmit={handleSubmitReview} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Rating Bintang
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 transition-transform hover:scale-125"
                    >
                      <span
                        className={`material-symbols-outlined text-[28px] ${
                          star <= reviewRating
                            ? "text-amber-400"
                            : "text-gray-300"
                        }`}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Komentar Ulasan
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  placeholder="Tulis ulasan Anda di sini..."
                  className="w-full rounded-xl border border-gray-300 p-3 text-xs text-gray-900 focus:border-[#1D4ED8] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#1D4ED8] py-3 text-xs font-bold text-white shadow hover:bg-[#1E3A8A]"
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
