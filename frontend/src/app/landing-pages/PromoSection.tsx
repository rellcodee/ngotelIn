"use client"; // Client component agar interaktif saat hover/klik tombol promo

import React from "react"; // Mengimpor library React
import Link from "next/link"; // Mengimpor Link Next.js
import { ArrowRight } from "lucide-react"; // Mengimpor ikon panah kanan dari lucide-react

// Array data penawaran promo spesial agar kode bersih dan mudah dikelola
const promoData = [
  {
    id: 1,
    tag: "Early Bird", // Badge nama promo
    discount: "Diskon Hingga 30%", // Judul utama diskon
    description: "Untuk pemesanan awal minimal 14 hari sebelum check-in.", // Keterangan promo
    bgGradient: "from-[#0B4F37] to-[#073524]", // Warna latar belakang gradien hijau tua
    btnTextColor: "text-[#0B4F37]", // Warna teks tombol
  },
  {
    id: 2,
    tag: "Weekend Sale", // Badge promo akhir pekan
    discount: "Diskon Hingga 20%", // Judul utama diskon
    description: "Liburan akhir pekan seru bersama keluarga tercinta.", // Keterangan promo
    bgGradient: "from-[#1E40AF] to-[#1E3A8A]", // Warna latar belakang gradien biru royal
    btnTextColor: "text-[#1E40AF]", // Warna teks tombol
  },
  {
    id: 3,
    tag: "Staycation Deal", // Badge promo staycation
    discount: "Diskon Hingga 25%", // Judul utama diskon
    description: "Khusus pemesanan kamar di akhir bulan ini.", // Keterangan promo
    bgGradient: "from-[#0F766E] to-[#115E59]", // Warna latar belakang gradien teal / dark cyan
    btnTextColor: "text-[#0F766E]", // Warna teks tombol
  },
];

// Komponen PromoSection: Menampilkan 3 kartu promo spesial dengan desain persis pada mockup
export default function PromoSection() {
  return (
    // Section utama Promo Spesial dengan background netral terang
    <section className="w-full bg-white py-16 sm:py-20">
      {/* Wrapper pembatas lebar konten */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION: Judul di kiri dan Link 'Lihat semua promo' di kanan */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Promo Spesial Untuk Anda
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manfaatkan tawaran terbatas ini untuk mendapatkan harga menginap terbaik.
            </p>
          </div>
          {/* Link Lihat Semua Promo */}
          <Link
            href="/promo"
            className="group flex items-center gap-1.5 text-sm font-semibold text-[#0B4F37] hover:text-[#073524]"
          >
            <span>Lihat semua promo</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* GRID KARTU PROMO: 3 Kartu side-by-side */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {promoData.map((promo) => (
            <div
              key={promo.id}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${promo.bgGradient} p-6 sm:p-8 text-white shadow-xl transition-transform hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between`}
            >
              {/* ACCENT SHAPE DEKORATIF DIBELAKANG KARTU */}
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

              <div>
                {/* BADGE KATEGORI PROMO (Label Oranye / Kuning) */}
                <div className="inline-block rounded-md bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-900 shadow-sm">
                  {promo.tag}
                </div>

                {/* TEKS UTAMA DISKON */}
                <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl tracking-tight">
                  {promo.discount}
                </h3>

                {/* DESKRIPSI SINGKAT PROMO */}
                <p className="mt-2 text-sm text-white/80 font-light leading-relaxed">
                  {promo.description}
                </p>
              </div>

              {/* TOMBOL PESAN SEKARANG (Solid White Pill) */}
              <div className="mt-8">
                <Link
                  href="/kamar"
                  className={`block w-full text-center rounded-full bg-white py-3 px-6 text-sm font-bold ${promo.btnTextColor} shadow-md transition-all hover:bg-emerald-50 hover:shadow-lg active:scale-98`}
                >
                  Pesan Sekarang
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
