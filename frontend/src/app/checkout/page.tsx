"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import Header from "../landing-pages/Header";
import Footer from "../landing-pages/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  // Baca roomId dari URL
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  // State buat nyimpen data kamar asli dari API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [roomData, setRoomData] = useState<Record<string, any> | null>(null);
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);

  // State User Data (Token JWT Auth)
  const [userName, setUserName] = useState("Tamu SiniBook");
  const [userEmail, setUserEmail] = useState("");
  const [isAuth, setIsAuth] = useState(false);

  // Form State (Kamar & Tanggal)
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
          .join(""),
      );
      const payload = JSON.parse(jsonPayload);
      // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
      setUserEmail(payload.email || "user@sinibook.com");
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setUserName(
        payload.name || payload.email?.split("@")[0] || "Tamu SiniBook",
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setIsAuth(true);
    } catch (e) {
      console.error(e);
      router.push("/login");
    }
  }, [router]);

  // Fetch data kamar asli dari API berdasarkan roomId
  useEffect(() => {
    if (!roomId) {
      setIsLoadingRoom(false);
      return;
    }
    
    fetch(`http://localhost:3001/resources/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error && !data.message) {
          setRoomData(data);
          if (data.capacity) {
            setGuestCount(String(data.capacity));
          }
        }
      })
      .catch((err) => console.error("Gagal ngambil data kamar:", err))
      .finally(() => setIsLoadingRoom(false));
  }, [roomId]);

  // Hitung jumlah malam & total harga (Prisma: `bookings.total_price`)
  const nightCount = Math.max(
    1,
    Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 3600 * 24),
    ) || 2,
  );

  const subtotal = (roomData?.price_per_night || 0) * nightCount;
  const serviceFee = 25000;
  const totalPrice = subtotal + serviceFee;

    const handleProcessCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ambil token dari local storage buat otentikasi
      const token = localStorage.getItem("token");
      
      // Tambahin jam check-in & check-out standar hotel (14:00 dan 12:00) biar backend lu gak nolak
      const formattedCheckIn = `${checkIn}T14:00:00.000Z`;
      const formattedCheckOut = `${checkOut}T12:00:00.000Z`;

      // Tembak API POST /bookings pake fetch
      const res = await fetch("http://localhost:3001/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          resource_id: roomId,
          start_time: formattedCheckIn,
          end_time: formattedCheckOut,
          payment_method: paymentMethod,
          notes: notes
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Gagal booking");
      }

      // Kalo sukses dapet Token Midtrans, lempar user ke halaman Midtrans!
      setIsSuccess(true);
      setTimeout(() => {
        if (result.midtrans_redirect_url) {
          window.location.href = result.midtrans_redirect_url;
        } else {
          router.push("/dashboard");
        }
      }, 2500);

    } catch (error: unknown) {
      alert("Oops! " + (error as Error).message);
      setIsLoading(false);
    }
  };


  if (!isAuth) {
    return null;
  }

  if (isLoadingRoom) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <span className="text-sm font-bold text-gray-500 animate-pulse">
          Menyiapkan rincian pesanan...
        </span>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 gap-4">
        <span className="text-lg font-bold text-rose-500">
          Data kamar tidak ditemukan!
        </span>
        <button
          onClick={() => router.push("/kamar")}
          className="rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-bold text-white"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
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
              <span className="material-symbols-outlined text-[16px]">
                arrow_back
              </span>
              <span>Kembali ke Katalog Kamar</span>
            </Link>

            <span className="text-xs font-bold text-gray-500">
              Konfirmasi Pemesanan & Tagihan
            </span>
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
                <span className="material-symbols-outlined text-[40px]">
                  check_circle
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Pemesanan Berhasil Dikirim!
              </h2>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                Reservasi kamar{" "}
                <strong className="text-gray-900">{roomData.name}</strong> telah
                terdaftar di sistem. Mengalihkan Anda ke Dashboard Member...
              </p>
              <div className="mt-6 flex justify-center">
                <svg
                  className="animate-spin h-6 w-6 text-[#1D4ED8]"
                  viewBox="0 0 24 24"
                >
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
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleProcessCheckout}
              className="grid grid-cols-1 gap-8 lg:grid-cols-3"
            >
              {/* Kolom Kiri: Form Data & Pilihan Pembayaran */}
              <div className="lg:col-span-2 space-y-6">
                {/* Card Data Pemesan */}
                <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-sm">
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#1D4ED8]">
                      group
                    </span>
                    <span>Data Diri Pemesan (Tamu)</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-gray-700">
                    <div className="rounded-2xl bg-slate-50 p-4 border border-gray-100">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">
                        Nama Pengguna
                      </span>
                      <span className="font-bold text-gray-900 text-sm">
                        {userName}
                      </span>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 border border-gray-100">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">
                        Email Kontak
                      </span>
                      <span className="font-bold text-gray-900 text-sm">
                        {userEmail}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Tanggal & Catatan Pemesanan (Prisma: `bookings.notes`) */}
                <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-sm">
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#1D4ED8]">
                      calendar_today
                    </span>
                    <span>Jadwal Menginap & Catatan</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-[#1D4ED8] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Check-out
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-[#1D4ED8] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Jumlah Tamu
                      </label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-[#1D4ED8] focus:outline-none"
                      >
                        {Array.from(
                          { length: roomData?.capacity || 2 },
                          (_, i) => i + 1,
                        ).map((num) => (
                          <option key={num} value={num}>
                            {num} Orang {num === roomData?.capacity ? "(Maksimal)" : ""}
                          </option>
                        ))}
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
                  <h2 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#1D4ED8]">
                      credit_card
                    </span>
                    <span>Metode Pembayaran</span>
                  </h2>
                  <p className="text-xs text-gray-500 mb-4">
                    Pembayaran diproses secara otomatis &amp; terverifikasi instan via Payment Gateway.
                  </p>

                  <div className="rounded-2xl border-2 border-[#1D4ED8] bg-blue-50/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-11 w-11 shrink-0 rounded-xl bg-[#1D4ED8] text-white flex items-center justify-center font-bold shadow-md shadow-[#1D4ED8]/20">
                        <span className="material-symbols-outlined text-[24px]">verified_user</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-gray-900">
                            Instant Payment
                          </h4>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            Otomatis
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                          Mendukung QRIS (All Bank &amp; E-Wallet), GoPay, Virtual Account (BCA, Mandiri, BNI, BRI), &amp; Kartu Kredit.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Summary Rincian Harga Tagihan */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-3xl border border-gray-200/90 bg-white p-6 shadow-xl space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <span className="rounded-full bg-[#1D4ED8] px-3 py-1 text-[11px] font-bold text-white">
                      {roomData.type}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2">
                      {roomData.name}
                    </h3>
                    <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[14px] text-emerald-600">
                        location_on
                      </span>
                      <span>{roomData.location}</span>
                    </span>
                  </div>

                  <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-gray-100">
                    <Image
                      src={
                        roomData.room_images?.[0]?.image_url ||
                        "/placeholder.jpg"
                      }
                      alt={roomData.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Breakdown Harga Tagihan */}
                  <div className="space-y-3 text-xs border-t border-b border-gray-100 py-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Harga per Malam</span>
                      <span>
                        Rp{" "}
                        {(roomData.price_per_night || 0).toLocaleString(
                          "id-ID",
                        )}
                      </span>
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
                    {isLoading
                      ? "Memproses Pemesanan..."
                      : "Konfirmasi & Bayar Sekarang"}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-light">
                    <span className="material-symbols-outlined text-[14px]">
                      lock
                    </span>
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
