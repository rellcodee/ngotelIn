"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


import Header from "../landing-pages/Header";
import Footer from "../landing-pages/Footer";

// Room catalog metadata for calculation
const ROOM_MAP: Record<string, { name: string; type: string; price: number; location: string; image: string }> = {
  "standard-room": {
    name: "Standard Room",
    type: "Standard",
    price: 520000,
    location: "Gedung Utama - Lantai 2",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
  },
  "superior-room": {
    name: "Superior Room",
    type: "Superior",
    price: 680000,
    location: "Gedung Utama - Lantai 3",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
  },
  "deluxe-room": {
    name: "Deluxe Room",
    type: "Deluxe",
    price: 935000,
    location: "Gedung Utama - Lantai 5",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
  },
  "executive-room": {
    name: "Executive Room",
    type: "Executive",
    price: 1350000,
    location: "Wing Barat - Lantai 7",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  },
  "family-suite": {
    name: "Family Suite",
    type: "Suite",
    price: 1785000,
    location: "Wing Timur - Lantai 4",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
  },
  "honeymoon-suite": {
    name: "Honeymoon Suite",
    type: "Suite",
    price: 1955000,
    location: "Gedung Utama - Lantai 9",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
  },
  "suite-room": {
    name: "Suite Room",
    type: "Suite",
    price: 2125000,
    location: "Wing Barat - Lantai 10",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
  },
  "presidential-suite": {
    name: "Presidential Suite",
    type: "Presidential",
    price: 3825000,
    location: "Penthouse - Lantai 12",
    image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
  },
};

export default function CheckoutPage() {
  const router = useRouter();

  // State User Data (Token JWT Auth)
  const [userName, setUserName] = useState("Tamu SiniBook");
  const [userEmail, setUserEmail] = useState("");
  const [isAuth, setIsAuth] = useState(false);

  // Form State (Kamar & Tanggal)
  const [selectedRoomKey, setSelectedRoomKey] = useState("deluxe-room");
  const [checkIn, setCheckIn] = useState("2026-08-25");
  const [checkOut, setCheckOut] = useState("2026-08-27");
  const [guestCount, setGuestCount] = useState("2");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("gopay");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
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
      setUserEmail(payload.email || "user@sinibook.com");
      setUserName(payload.name || payload.email?.split("@")[0] || "Tamu SiniBook");
      setIsAuth(true);
    } catch (e) {
      console.error(e);
      router.push("/login");
    }
  }, [router]);

  const selectedRoom = ROOM_MAP[selectedRoomKey] || ROOM_MAP["deluxe-room"];

  // Hitung jumlah malam & total harga (Prisma: `bookings.total_price`)
  const nightCount = Math.max(
    1,
    Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)
    ) || 2
  );
  const subtotal = selectedRoom.price * nightCount;
  const serviceFee = 25000;
  const totalPrice = subtotal + serviceFee;

  const handleProcessCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    }, 1500);
  };

  if (!isAuth) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-[#1D4ED8] selection:text-white flex flex-col">
      <Header activePage="checkout" />

      <main className="flex-1 w-full pb-20">
        {/* Breadcrumb Header */}
        <div className="bg-white border-b border-gray-200/80 py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link
              href="/kamar"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1D4ED8] hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Kembali ke Katalog Kamar</span>
            </Link>

            <span className="text-xs font-bold text-gray-500">Konfirmasi Pemesanan & Tagihan</span>
          </div>
        </div>

        {/* Form & Summary Container */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Checkout & Konfirmasi Reservasi
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Periksa rincian tanggal, data pemesan, dan metode pembayaran Anda.
            </p>
          </div>

          {isSuccess ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-xl border border-emerald-100 max-w-lg mx-auto my-12 animate-in zoom-in duration-300">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-inner">
                <span className="material-symbols-outlined text-[40px]">check_circle</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Pemesanan Berhasil Dikirim!</h2>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                Reservasi kamar <strong className="text-gray-900">{selectedRoom.name}</strong> telah terdaftar di sistem. Mengalihkan Anda ke Dashboard Member...
              </p>
              <div className="mt-6 flex justify-center">
                <svg className="animate-spin h-6 w-6 text-[#1D4ED8]" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProcessCheckout} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Kolom Kiri: Form Data & Pilihan Pembayaran */}
              <div className="lg:col-span-2 space-y-6">

                {/* Card Data Pemesan */}
                <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-sm">
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#1D4ED8]">group</span>
                    <span>Data Diri Pemesan (Tamu)</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-gray-700">
                    <div className="rounded-2xl bg-slate-50 p-4 border border-gray-100">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">Nama Pengguna</span>
                      <span className="font-bold text-gray-900 text-sm">{userName}</span>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 border border-gray-100">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">Email Kontak</span>
                      <span className="font-bold text-gray-900 text-sm">{userEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Card Tanggal & Catatan Pemesanan (Prisma: `bookings.notes`) */}
                <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-sm">
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#1D4ED8]">calendar_today</span>
                    <span>Jadwal Menginap & Catatan</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Check-in</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-[#1D4ED8] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Check-out</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-[#1D4ED8] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Jumlah Tamu</label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-[#1D4ED8] focus:outline-none"
                      >
                        <option value="1">1 Orang</option>
                        <option value="2">2 Orang</option>
                        <option value="3">3 Orang</option>
                        <option value="4">4 Orang</option>
                      </select>
                    </div>
                  </div>

                  {/* Input Catatan Khusus (Prisma field: `notes`) */}
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Catatan Khusus Tambahan (Opsional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Contoh: Minta kamar bebas asap rokok, meminta extra handuk..."
                      className="w-full rounded-xl border border-gray-300 p-3 text-xs text-gray-900 focus:border-[#1D4ED8] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Card Metode Pembayaran (Prisma: `payments.payment_method`) */}
                <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-sm">
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#1D4ED8]">credit_card</span>
                    <span>Pilih Metode Pembayaran</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === "gopay"
                        ? "border-[#1D4ED8] bg-emerald-50/50 ring-2 ring-[#1D4ED8]/20"
                        : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          value="gopay"
                          checked={paymentMethod === "gopay"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-[#1D4ED8]"
                        />
                        <span className="text-xs font-bold text-gray-800">GoPay / E-Wallet</span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === "bank_transfer"
                        ? "border-[#1D4ED8] bg-emerald-50/50 ring-2 ring-[#1D4ED8]/20"
                        : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          value="bank_transfer"
                          checked={paymentMethod === "bank_transfer"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-[#1D4ED8]"
                        />
                        <span className="text-xs font-bold text-gray-800">Virtual Account</span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === "qris"
                        ? "border-[#1D4ED8] bg-emerald-50/50 ring-2 ring-[#1D4ED8]/20"
                        : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          value="qris"
                          checked={paymentMethod === "qris"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-[#1D4ED8]"
                        />
                        <span className="text-xs font-bold text-gray-800">QRIS Instant</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Summary Rincian Harga Tagihan */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-3xl border border-gray-200/90 bg-white p-6 shadow-xl space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <span className="rounded-full bg-[#1D4ED8] px-3 py-1 text-[11px] font-bold text-white">
                      {selectedRoom.type}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2">{selectedRoom.name}</h3>
                    <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[14px] text-emerald-600">location_on</span>
                      <span>{selectedRoom.location}</span>
                    </span>
                  </div>

                  <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-gray-100">
                    <Image src={selectedRoom.image} alt={selectedRoom.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                  </div>

                  {/* Breakdown Harga Tagihan */}
                  <div className="space-y-3 text-xs border-t border-b border-gray-100 py-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Harga per Malam</span>
                      <span>Rp {selectedRoom.price.toLocaleString("id-ID")}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Durasi Menginap</span>
                      <span>{nightCount} Malam</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Biaya Layanan & Pajak</span>
                      <span>Rp {serviceFee.toLocaleString("id-ID")}</span>
                    </div>

                    <div className="flex justify-between text-base font-extrabold text-[#1D4ED8] pt-2 border-t border-gray-100">
                      <span>Total Tagihan</span>
                      <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-full bg-[#1D4ED8] py-3.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#1E3A8A] hover:shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? "Memproses Pemesanan..." : "Konfirmasi & Bayar Sekarang"}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-light">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    <span>Transaksi terenkripsi & 100% aman</span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
