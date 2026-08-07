// Halaman Promo SiniBook Hotel (/promo)
// Menampilkan daftar promo spesial dengan fitur salin kode interaktif

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tag, Calendar, Info, Copy, Check, Sparkles, ArrowRight } from "lucide-react";

import Header from "../landing-pages/Header";
import Footer from "../landing-pages/Footer";


interface PromoItem {
  id: number;
  tag: string;
  discount: string;
  code: string;
  description: string;
  validUntil: string;
  minStay: string;
  bgGradient: string;
  accentBg: string;
  terms: string[];
}

const PROMO_DATA: PromoItem[] = [
  {
    id: 1,
    tag: "Early Bird",
    discount: "Diskon 30%",
    code: "EARLYBIRD30",
    description: "Nikmati potongan harga spesial untuk Anda yang merencanakan liburan jauh-jauh hari.",
    validUntil: "31 Des 2026",
    minStay: "Minimal 3 Malam",
    bgGradient: "from-[#0B4F37] to-[#073524]",
    accentBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    terms: [
      "Pemesanan minimal 14 hari sebelum tanggal check-in.",
      "Berlaku untuk semua tipe kamar.",
      "Tidak dapat dibatalkan atau di-refund."
    ]
  },
  {
    id: 2,
    tag: "Weekend Sale",
    discount: "Diskon 20%",
    code: "WEEKEND20",
    description: "Jadikan akhir pekan Anda lebih berkesan dengan menginap di kamar mewah kami.",
    validUntil: "31 Des 2026",
    minStay: "Menginap di Akhir Pekan",
    bgGradient: "from-[#1E40AF] to-[#1E3A8A]",
    accentBg: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    terms: [
      "Hanya berlaku untuk check-in pada hari Jumat & Sabtu.",
      "Termasuk sarapan gratis untuk 2 orang.",
      "Pembatalan gratis hingga H-3."
    ]
  },
  {
    id: 3,
    tag: "Staycation Deal",
    discount: "Diskon 25%",
    code: "STAYCATION25",
    description: "Rehat sejenak dari rutinitas harian dengan paket staycation akhir bulan terbaik.",
    validUntil: "31 Des 2026",
    minStay: "Minimal 2 Malam",
    bgGradient: "from-[#0F766E] to-[#115E59]",
    accentBg: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    terms: [
      "Berlaku untuk pemesanan mulai tanggal 20 hingga akhir bulan.",
      "Hanya berlaku untuk tipe kamar Deluxe ke atas.",
      "Mendapatkan voucher makan Rp 100.000."
    ]
  },
  {
    id: 4,
    tag: "Honeymoon Package",
    discount: "Diskon 15% + Dinner",
    code: "HONEYMOON15",
    description: "Rayakan momen romantis berdua dengan dekorasi kamar khusus dan candle-lit dinner.",
    validUntil: "31 Des 2026",
    minStay: "Minimal 2 Malam",
    bgGradient: "from-[#BE185D] to-[#9D174D]",
    accentBg: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    terms: [
      "Sudah termasuk dekorasi tempat tidur bertema bulan madu.",
      "Termasuk 1x makan malam romantis di SiniRestaurant.",
      "Wajib reservasi minimal 5 hari sebelum kedatangan."
    ]
  },
  {
    id: 5,
    tag: "Business Saver",
    discount: "Diskon 15% + Gym",
    code: "BIZSAVER15",
    description: "Solusi menginap hemat dan produktif bagi para profesional bisnis di pusat kota.",
    validUntil: "31 Des 2026",
    minStay: "Minimal 1 Malam",
    bgGradient: "from-[#374151] to-[#1F2937]",
    accentBg: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    terms: [
      "Berlaku pada hari kerja (Senin - Kamis).",
      "Termasuk layanan setrika 2 pakaian per hari.",
      "Akses prioritas ke ruang rapat (Business Center)."
    ]
  }
];

export default function PromoPage() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyCode = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-[#0B4F37] selection:text-white">
      {/* 1. Header Navigation */}
      <Header activePage="promo" />

      <main className="w-full flex-1">
        {/* 2. Hero Banner */}
        <section className="relative w-full overflow-hidden bg-[#073524] py-24 sm:py-28 md:py-32 text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80"
              alt="Promo Spesial SiniBook"
              fill
              priority
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B4F37]/20 via-[#073524]/50 to-[#073524]/85" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md border border-emerald-400/30 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Penawaran Terbatas</span>
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-white">
              Promo Spesial SiniBook
            </h1>

            <p className="mt-4 text-sm sm:text-base md:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto font-light">
              Gunakan kode promo eksklusif kami untuk mendapatkan harga kamar terbaik. Rencanakan liburan mewah Anda bersama kami sekarang dengan penawaran hemat.
            </p>
          </div>
        </section>

        {/* 3. Promo Cards Grid */}
        <section className="w-full py-16 sm:py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Gunakan Kode Voucher Anda
              </h2>
              <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto font-light">
                Salin kode voucher di bawah ini dan masukkan pada kolom promo saat melakukan pencarian kamar untuk mendapatkan potongan harga langsung.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {PROMO_DATA.map((promo) => (
                <div
                  key={promo.id}
                  className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${promo.bgGradient} p-6 sm:p-8 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between`}
                >
                  {/* Decorative shape */}
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-xl pointer-events-none" />

                  <div>
                    {/* Header elements */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide border backdrop-blur-sm ${promo.accentBg}`}>
                        <Tag className="h-3 w-3" />
                        <span>{promo.tag}</span>
                      </span>
                      <span className="text-xs text-white/70 font-light flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>s.d. {promo.validUntil}</span>
                      </span>
                    </div>

                    {/* Discount Value */}
                    <h3 className="mt-5 text-3xl font-extrabold tracking-tight">
                      {promo.discount}
                    </h3>
                    
                    {/* Minimum stay badge */}
                    <p className="text-xs font-medium text-amber-300 mt-1">
                      {promo.minStay}
                    </p>

                    {/* Description */}
                    <p className="mt-4 text-sm text-white/80 font-light leading-relaxed">
                      {promo.description}
                    </p>

                    {/* Terms & Conditions Box */}
                    <div className="mt-5 border-t border-white/10 pt-4 text-xs text-white/75 font-light space-y-1.5">
                      <p className="font-semibold text-white/90 flex items-center gap-1 mb-1">
                        <Info className="h-3 w-3 shrink-0" />
                        <span>Syarat & Ketentuan:</span>
                      </p>
                      {promo.terms.map((term, index) => (
                        <li key={index} className="list-none pl-3 relative before:absolute before:left-0 before:top-1.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-white/40">
                          {term}
                        </li>
                      ))}
                    </div>
                  </div>

                  {/* Promo Code Copy Bar */}
                  <div className="mt-8">
                    <div className="flex items-center justify-between gap-2 rounded-xl bg-black/25 p-1.5 border border-white/10">
                      <div className="pl-3 font-mono font-bold text-sm tracking-wider text-amber-200">
                        {promo.code}
                      </div>
                      <button
                        onClick={() => handleCopyCode(promo.id, promo.code)}
                        className={`rounded-lg py-2 px-4 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                          copiedId === promo.id
                            ? "bg-emerald-500 text-white"
                            : "bg-white text-gray-900 hover:bg-emerald-50"
                        }`}
                      >
                        {copiedId === promo.id ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Salin Kode</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. CTA Section */}
        <section className="w-full bg-slate-100/80 py-14 sm:py-16 border-t border-gray-200/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center gap-6 rounded-3xl bg-white p-10 sm:p-14 shadow-sm border border-gray-200/80">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
                  Sudah Menentukan Pilihan?
                </h2>
                <p className="mt-3 text-sm sm:text-base text-gray-600 font-light max-w-xl mx-auto leading-relaxed">
                  Pilih kamar impian Anda sekarang, masukkan kode promo yang telah Anda salin, dan nikmati menginap mewah dengan tarif hemat.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/kamar"
                  className="flex items-center gap-2 rounded-full bg-[#0B4F37] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#073524] hover:shadow-lg active:scale-95"
                >
                  <span>Lihat Kamar & Booking</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/fasilitas"
                  className="flex items-center gap-2 rounded-full border-2 border-[#0B4F37] px-8 py-3 text-sm font-bold text-[#0B4F37] transition-all hover:bg-[#0B4F37] hover:text-white active:scale-95"
                >
                  <span>Eksplor Fasilitas</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. Footer */}
      <Footer />


    </div>
  );
}
