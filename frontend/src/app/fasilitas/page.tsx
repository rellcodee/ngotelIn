// Halaman Fasilitas SiniBook Hotel (/fasilitas)
// Menampilkan 5 fasilitas eksklusif hotel dalam layout bento grid modern

"use client"; // Client Component Next.js untuk halaman fasilitas eksklusif

import React from "react"; // Mengimpor React
import Image from "next/image"; // Komponen Image Next.js untuk optimasi gambar fasilitas
import Link from "next/link"; // Komponen Link Next.js untuk navigasi antar halaman
import {
  Sparkles,
  Utensils,
  Coffee,
  Star,
  ArrowRight,
  PhoneCall,
} from "lucide-react"; // Mengimpor ikon-ikon pendukung dari lucide-react

// Mengimpor komponen layout utama yang sudah ada di project
import Header from "../landing-pages/Header"; // Header dengan navigasi aktif "fasilitas"
import Footer from "../landing-pages/Footer"; // Footer dengan informasi kontak hotel


// ============================================================================
// TIPE DATA ITEM FASILITAS HOTEL
// ============================================================================
interface FacilitasItem {
  id: string; // ID unik fasilitas (untuk key React)
  category: string; // Kategori fasilitas (WELLNESS, FITNESS, CULINARY, EXCLUSIVE)
  categoryIcon: React.ElementType; // Ikon kategori dari lucide-react
  categoryBg: string; // Warna latar badge kategori (Tailwind class)
  title: string; // Nama fasilitas
  description: string; // Deskripsi singkat fasilitas
  image: string; // URL gambar latar kartu fasilitas
  primaryBtn: string; // Teks tombol aksi utama
  secondaryBtn?: string; // Teks tombol aksi sekunder (opsional, hanya untuk Executive Lounge)
  colSpan: string; // Kelas col-span Tailwind untuk layout bento grid
  rowHeight: string; // Kelas tinggi kartu Tailwind untuk variasi visual
}

// ============================================================================
// DATA 5 FASILITAS EKSKLUSIF SINIBOOK HOTEL (Inline sesuai pola project)
// ============================================================================
const FACILITIES_DATA: FacilitasItem[] = [
  // Fasilitas 1: Infinity Pool (Kartu Besar Kiri — 2/3 lebar desktop)
  {
    id: "infinity-pool",
    category: "WELLNESS",
    categoryIcon: Sparkles,
    categoryBg: "bg-emerald-600/80",
    title: "Infinity Pool",
    description:
      "Kolam renang air hangat di atap gedung dengan pemandangan cakrawala kota yang menakjubkan, tersedia eksklusif untuk tamu kami.",
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
    primaryBtn: "Lihat Detail",
    colSpan: "sm:col-span-1 lg:col-span-2",
    rowHeight: "h-72 sm:h-80 lg:h-[420px]",
  },

  // Fasilitas 2: Sky Gym (Kartu Kecil Kanan — 1/3 lebar desktop)
  {
    id: "sky-gym",
    category: "FITNESS",
    categoryIcon: Star,
    categoryBg: "bg-blue-600/80",
    title: "Sky Gym",
    description:
      "Pusat kebugaran modern berstandar internasional dengan pemandangan kota terbaik.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    primaryBtn: "Lihat Detail",
    colSpan: "sm:col-span-1 lg:col-span-1",
    rowHeight: "h-72 sm:h-80 lg:h-[420px]",
  },

  // Fasilitas 3: Luxury Spa (Kartu Kecil Kiri — 1/3 lebar desktop)
  {
    id: "luxury-spa",
    category: "WELLNESS",
    categoryIcon: Sparkles,
    categoryBg: "bg-emerald-600/80",
    title: "Luxury Spa",
    description:
      "Perawatan holistik dan layanan pijat profesional oleh terapis bersertifikat internasional.",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    primaryBtn: "Lihat Detail",
    colSpan: "sm:col-span-1 lg:col-span-1",
    rowHeight: "h-72 sm:h-80 lg:h-[420px]",
  },

  // Fasilitas 4: Fine Dining (Kartu Besar Kanan — 2/3 lebar desktop)
  {
    id: "fine-dining",
    category: "CULINARY",
    categoryIcon: Utensils,
    categoryBg: "bg-amber-600/80",
    title: "Fine Dining (SiniRestaurant)",
    description:
      "Karya koki pemenang penghargaan internasional, sajian yang disajikan dengan cita rasa dan presentasi berkelas.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    primaryBtn: "Reservasi Meja",
    colSpan: "sm:col-span-1 lg:col-span-2",
    rowHeight: "h-72 sm:h-80 lg:h-[420px]",
  },

  // Fasilitas 5: Executive Lounge (Kartu Full-Width — 3/3 lebar desktop)
  {
    id: "executive-lounge",
    category: "EXCLUSIVE",
    categoryIcon: Coffee,
    categoryBg: "bg-gray-600/80",
    title: "Executive Lounge",
    description:
      "Ruang eksklusif untuk pertemuan bisnis dan relaksasi premium. Nikmati sajian ringan dan minuman pilihan sepanjang hari dengan layanan concierge pribadi.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80",
    primaryBtn: "Lihat Detail",
    secondaryBtn: "Akses Member",
    colSpan: "sm:col-span-2 lg:col-span-3",
    rowHeight: "h-64 sm:h-72 lg:h-[320px]",
  },
];

// ============================================================================
// KOMPONEN UTAMA HALAMAN FASILITAS (Rute /fasilitas)
// ============================================================================
export default function FasilitasPage() {
  return (
    // Pembungkus utama layout halaman fasilitas dengan warna dasar slate
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-[#0B4F37] selection:text-white">

      {/* 1. Navigasi Header Bagian Teratas — Fasilitas sebagai halaman aktif */}
      <Header activePage="fasilitas" />

      <main className="w-full flex-1">

        {/* ======================================================================= */}
        {/* 2. HERO BANNER: Banner Judul "Fasilitas Eksklusif SiniBook" */}
        {/* ======================================================================= */}
        <section className="relative w-full overflow-hidden bg-[#073524] py-24 sm:py-28 md:py-32 text-white">
          {/* Gambar Latar Belakang Hotel */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
              alt="SiniBook Hotel Fasilitas Eksklusif"
              fill
              priority
              className="object-cover opacity-60"
            />
            {/* Overlay Gradient untuk Keterbacaan Teks */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B4F37]/20 via-[#073524]/50 to-[#073524]/85" />
          </div>

          {/* Konten Teks Hero (di atas overlay) */}
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">

            {/* Badge Pill Kategori (persis seperti halaman /kamar) */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md border border-emerald-400/30 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Pengalaman Tak Terlupakan</span>
            </span>

            {/* Judul Utama Halaman */}
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-white">
              Fasilitas Eksklusif SiniBook
            </h1>

            {/* Deskripsi Singkat Halaman */}
            <p className="mt-4 text-sm sm:text-base md:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto font-light">
              Manjakan diri Anda dalam standar kemewahan baru. Dari kolam renang tanpa batas
              hingga layanan spa holistik, setiap detail dirancang untuk kenyamanan maksimal Anda.
            </p>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* 3. BENTO GRID FASILITAS: Layout grid asimetris 5 fasilitas eksklusif */}
        {/* ======================================================================= */}
        <section className="w-full py-14 sm:py-16 md:py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Header Section Grid Fasilitas */}
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Semua Fasilitas Kami
              </h2>
              <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto font-light">
                Setiap fasilitas dirancang untuk memberikan pengalaman menginap kelas dunia yang tak terlupakan.
              </p>
            </div>

            {/* Bento Grid Container
                Mobile    (1 col) : Semua kartu full-width tumpuk ke bawah
                Tablet    (2 col) : Kartu berpasangan 1-1, Executive Lounge full span
                Desktop   (3 col) : Layout bento asimetris sesuai desain referensi
            */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FACILITIES_DATA.map((item) => {
                const CategoryIcon = item.categoryIcon; // Ikon kategori fasilitas
                return (
                  // Kartu Fasilitas Individual dengan efek hover seperti FacilitiesSection.tsx
                  <div
                    key={item.id}
                    className={`group relative overflow-hidden rounded-2xl bg-gray-900 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${item.colSpan} ${item.rowHeight}`}
                  >
                    {/* Gambar Latar Kartu (Optimasi Next.js Image) */}
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay Gradient Gelap (Sama persis dengan FacilitiesSection.tsx) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

                    {/* Konten Teks Kartu (Posisi Kiri-Bawah) */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">

                      {/* Badge Kategori Fasilitas */}
                      <div className="mb-3">
                        <span className={`inline-flex items-center gap-1 rounded-md ${item.categoryBg} px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md`}>
                          <CategoryIcon className="h-3 w-3" />
                          <span>{item.category}</span>
                        </span>
                      </div>

                      {/* Nama Fasilitas */}
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </h3>

                      {/* Deskripsi Singkat Fasilitas */}
                      <p className="mt-2 text-xs sm:text-sm text-gray-200 leading-relaxed font-light line-clamp-2">
                        {item.description}
                      </p>

                      {/* Baris Tombol Aksi */}
                      <div className="mt-5 flex flex-wrap items-center gap-3">

                        {/* Tombol Aksi Utama (Bordered White Pill) */}
                        <button className="rounded-full border border-white/80 bg-white/10 px-5 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white hover:text-[#0B4F37] active:scale-95">
                          {item.primaryBtn}
                        </button>

                        {/* Tombol Aksi Sekunder — Hanya tampil jika ada (Executive Lounge) */}
                        {item.secondaryBtn && (
                          <button className="rounded-full border border-white/50 bg-transparent px-5 py-2 text-xs font-semibold text-white/90 backdrop-blur-md transition-all hover:border-white hover:text-white active:scale-95">
                            {item.secondaryBtn}
                          </button>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ======================================================================= */}
        {/* 4. SECTION CTA: "Siap Untuk Menginap?" (Pola sama dengan /kamar) */}
        {/* ======================================================================= */}
        <section className="w-full bg-slate-100/80 py-14 sm:py-16 border-t border-gray-200/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center gap-6 rounded-3xl bg-white p-10 sm:p-14 shadow-sm border border-gray-200/80">

              {/* Judul Utama CTA */}
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
                  Siap Untuk Menginap?
                </h2>

                {/* Teks Pendukung CTA */}
                <p className="mt-3 text-sm sm:text-base text-gray-600 font-light max-w-xl mx-auto leading-relaxed">
                  Pesan sekarang untuk mendapatkan akses prioritas ke semua fasilitas eksklusif
                  kami dan nikmati penawaran terbatas untuk member baru.
                </p>
              </div>

              {/* Tombol Aksi CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-4">

                {/* Tombol Primer: Mulai Reservasi (Solid Green Pill) */}
                <Link
                  href="/kamar"
                  className="flex items-center gap-2 rounded-full bg-[#0B4F37] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#073524] hover:shadow-lg active:scale-95"
                >
                  <span>Mulai Reservasi</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {/* Tombol Sekunder: Hubungi Kami (Outline Green Pill) */}
                <a
                  href="/#kontak"
                  className="flex items-center gap-2 rounded-full border-2 border-[#0B4F37] px-8 py-3 text-sm font-bold text-[#0B4F37] transition-all hover:bg-[#0B4F37] hover:text-white active:scale-95"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Hubungi Kami</span>
                </a>

              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 5. Footer Utama Halaman */}
      <Footer />



    </div>
  );
}
