"use client"; // Menandakan bahwa komponen ini di-render di sisi client untuk memungkinkan interaksi form

import React, { useState } from "react"; // Mengimpor React dan useState untuk menyimpan input tanggal & tamu
import Image from "next/image"; // Mengimpor komponen Image dari Next.js untuk menampilkan foto hotel secara jelas & cepat
import { Calendar, User, BedDouble, Search, Tag, RotateCcw, Utensils, Wifi, Clock, X, CheckCircle2 } from "lucide-react"; // Mengimpor ikon-ikon pendukung dari lucide-react

// Komponen HeroSection: Banner utama bagian paling atas dengan background foto hotel THE LUMINA & form pencarian kamar
export default function HeroSection() {
  // State untuk menyimpan nilai input tanggal check-in (default YYYY-MM-DD untuk DatePicker)
  const [checkInDate, setCheckInDate] = useState("2024-05-20");
  
  // State untuk menyimpan nilai input tanggal check-out (default YYYY-MM-DD untuk DatePicker)
  const [checkOutDate, setCheckOutDate] = useState("2024-05-21");
  
  // State untuk menyimpan jumlah tamu (default 2 Dewasa)
  const [guests, setGuests] = useState("2 Dewasa");
  
  // State untuk menyimpan jumlah kamar (default 1 Kamar)
  const [rooms, setRooms] = useState("1 Kamar");

  // State untuk melacak apakah modal popup hasil pencarian sedang terbuka
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Handler ketika pengguna menekan tombol "Cari Kamar"
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman standar browser saat form dikirim
    setIsSearchModalOpen(true); // Membuka modal popup visual pencarian kamar
  };

  return (
    // Section pembungkus utama dengan posisi relatif dan latar belakang foto gedung hotel THE LUMINA
    <section className="relative w-full min-h-[640px] overflow-hidden bg-gray-900 text-white flex flex-col justify-between">
      
      {/* 1. GAMBAR LATAR BELAKANG HOTEL (THE LUMINA BUILDING): Di-render dengan Next Image agar gambar 100% JELAS & TERLIHAT */}
      <Image
        src="/images/hero-hotel.png"
        alt="SiniBook Hotel THE LUMINA"
        fill
        priority
        className="object-cover object-center z-0 brightness-90"
      />

      {/* 2. OVERLAY GRADIENT GELAP TRANSPARAN: Melapisi gambar agar teks berwarna putih terlihat kontras & mudah dibaca */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />

      {/* 3. KONTEN HERO UTAMA: Berada di atas overlay dengan z-index 20 */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8 lg:pt-20">
        
        {/* JUDUL DAN SUBTITLE HERO */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Judul Utama Banner (Main Heading sesuai desain) */}
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl leading-tight drop-shadow-md">
            Pengalaman Menginap Terbaik Hanya di SiniBook Hotel
          </h1>
          
          {/* Subtitle / Deskripsi Singkat Hero */}
          <p className="mt-4 text-base sm:text-lg text-gray-200 md:text-xl max-w-2xl mx-auto font-light drop-shadow-sm">
            Nikmati kenyamanan, layanan terbaik, dan fasilitas lengkap untuk pengalaman menginap tak terlupakan.
          </p>
        </div>

        {/* FLOATING BOOKING SEARCH BOX: Kotak pencarian kamar melayang dengan background putih bersih */}
        <div className="mt-10 sm:mt-12">
          <form 
            onSubmit={handleSearch}
            className="mx-auto max-w-5xl rounded-2xl bg-white p-4 shadow-2xl sm:p-5 text-gray-800 border border-gray-100"
          >
            {/* Grid 5 kolom untuk input tanggal, jumlah tamu, jumlah kamar, dan tombol pencarian */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 items-center">
              
              {/* INPUT 1: Tanggal Check-in (DatePicker Kalender Interaktif) */}
              <div className="flex flex-col rounded-xl border border-gray-200/80 p-3 hover:border-[#0B4F37] transition-colors bg-gray-50/50">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">CHECK-IN</span>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#0B4F37] shrink-0" />
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-gray-900 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* INPUT 2: Tanggal Check-out (DatePicker Kalender Interaktif) */}
              <div className="flex flex-col rounded-xl border border-gray-200/80 p-3 hover:border-[#0B4F37] transition-colors bg-gray-50/50">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">CHECK-OUT</span>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#0B4F37] shrink-0" />
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-gray-900 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* INPUT 3: Jumlah Tamu (Dropdown Selection) */}
              <div className="flex flex-col rounded-xl border border-gray-200/80 p-3 hover:border-[#0B4F37] transition-colors bg-gray-50/50">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">TAMU</span>
                <div className="mt-1 flex items-center gap-2">
                  <User className="h-4 w-4 text-[#0B4F37] shrink-0" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-gray-900 focus:outline-none cursor-pointer"
                  >
                    <option value="1 Dewasa">1 Dewasa</option>
                    <option value="2 Dewasa">2 Dewasa</option>
                    <option value="3 Dewasa">3 Dewasa</option>
                    <option value="Keluarga (2 Dewasa, 2 Anak)">Keluarga (2 Dewasa, 2 Anak)</option>
                  </select>
                </div>
              </div>

              {/* INPUT 4: Jumlah Kamar (Dropdown Selection) */}
              <div className="flex flex-col rounded-xl border border-gray-200/80 p-3 hover:border-[#0B4F37] transition-colors bg-gray-50/50">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">KAMAR</span>
                <div className="mt-1 flex items-center gap-2">
                  <BedDouble className="h-4 w-4 text-[#0B4F37] shrink-0" />
                  <select
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-gray-900 focus:outline-none cursor-pointer"
                  >
                    <option value="1 Kamar">1 Kamar</option>
                    <option value="2 Kamar">2 Kamar</option>
                    <option value="3 Kamar">3 Kamar</option>
                    <option value="4+ Kamar">4+ Kamar</option>
                  </select>
                </div>
              </div>

              {/* TOMBOL PENCARIAN (Cari Kamar) */}
              <div className="sm:col-span-2 lg:col-span-1">
                <button
                  type="submit"
                  className="flex h-full min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#0B4F37] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#073524] active:scale-95"
                >
                  <Search className="h-4 w-4" />
                  <span>Cari Kamar</span>
                </button>
              </div>

            </div>
          </form>
        </div>

        {/* 5 FITUR LINGKARAN IKON DIBAGIAN BAWAH (Persis Sesuai Screenshot Desain) */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 text-white">
          
          {/* Fitur 1: Harga Terbaik */}
          <div className="flex items-center gap-3 rounded-xl bg-black/40 backdrop-blur-md p-3 border border-white/10">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Harga Terbaik</h4>
              <p className="text-[10px] text-gray-300">Jaminan harga paling murah</p>
            </div>
          </div>

          {/* Fitur 2: Pembatalan Gratis */}
          <div className="flex items-center gap-3 rounded-xl bg-black/40 backdrop-blur-md p-3 border border-white/10">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Pembatalan Gratis</h4>
              <p className="text-[10px] text-gray-300">Fleksibel hingga H-1 check-in</p>
            </div>
          </div>

          {/* Fitur 3: Sarapan Gratis */}
          <div className="flex items-center gap-3 rounded-xl bg-black/40 backdrop-blur-md p-3 border border-white/10">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Sarapan Gratis</h4>
              <p className="text-[10px] text-gray-300">Untuk semua tipe kamar</p>
            </div>
          </div>

          {/* Fitur 4: Wi-Fi Cepat */}
          <div className="flex items-center gap-3 rounded-xl bg-black/40 backdrop-blur-md p-3 border border-white/10">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
              <Wifi className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Wi-Fi Cepat</h4>
              <p className="text-[10px] text-gray-300">Akses internet tanpa batas</p>
            </div>
          </div>

          {/* Fitur 5: Layanan 24 Jam */}
          <div className="flex items-center gap-3 rounded-xl bg-black/40 backdrop-blur-md p-3 border border-white/10 col-span-2 sm:col-span-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Layanan 24 Jam</h4>
              <p className="text-[10px] text-gray-300">Kami selalu siap membantu</p>
            </div>
          </div>

        </div>

      </div>

      {/* POPUP MODAL MOCKUP UI PENCARIAN KAMAR */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in text-gray-900">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
            {/* Tombol Tutup X */}
            <button
              onClick={() => setIsSearchModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content Body Modal */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-[#0B4F37] mb-3">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                Pencarian Kamar Diterima
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Kriteria reservasi kamar yang kamu pilih:
              </p>

              {/* Rincian Pilihan Form */}
              <div className="mt-4 w-full rounded-xl bg-gray-50 p-3.5 text-left border border-gray-100 text-xs space-y-2">
                <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                  <span className="text-gray-500">Check-in:</span>
                  <span className="font-bold text-gray-900">{checkInDate}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                  <span className="text-gray-500">Check-out:</span>
                  <span className="font-bold text-gray-900">{checkOutDate}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                  <span className="text-gray-500">Tamu:</span>
                  <span className="font-bold text-gray-900">{guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jumlah Kamar:</span>
                  <span className="font-bold text-gray-900">{rooms}</span>
                </div>
              </div>

              <p className="mt-4 text-[11px] text-gray-400 italic">
                *Halaman daftar pencarian ketersediaan kamar disiapkan untuk integrasi Backend nanti.
              </p>

              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="mt-5 w-full rounded-xl bg-[#0B4F37] py-2.5 text-xs font-bold text-white shadow hover:bg-[#073524] transition-all"
              >
                Mengerti & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
