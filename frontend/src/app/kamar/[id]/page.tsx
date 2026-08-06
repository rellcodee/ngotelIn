"use client"; // Client Component untuk mengelola rute dinamis detail kamar, modal login & ulasan tamu

import React, { useState, useEffect } from "react"; // Mengimpor React, useState, dan useEffect
import Image from "next/image"; // Komponen Image Next.js untuk galeri foto kamar
import Link from "next/link"; // Komponen Link Next.js untuk breadcrumb & navigasi
import { useParams } from "next/navigation"; // Hook untuk mengambil parameter ID kamar dari URL (/kamar/[id])
import {
  CheckCircle2,
  Lock,
  ArrowLeft,
  Calendar,
  Users,
  ShieldAlert,
  X,
  ShieldCheck,
  Heart,
  Star,
  SearchX,
  MapPin,
} from "lucide-react"; // Mengimpor ikon-ikon modern dari Lucide React

// Mengimpor komponen layout utama (Header, Footer, dan Widget Chatbot AI)
import Header from "../../landing-pages/Header";
import Footer from "../../landing-pages/Footer"; // sesuaikan path import footer
import AiAssistantModal from "../../landing-pages/AiAssistantModal";

// Interface / tipe data typescript untuk struktur kamar dari API
interface RoomImage {
  id: string;
  image_url: string;
  is_primary: boolean;
}

interface RoomItem {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  price_per_night: number;
  facilities: string[];
  room_images: RoomImage[];
}

// Komponen Utama Halaman Detail Kamar
export default function DetailKamarPage() {
  const params = useParams(); // Mengambil id kamar dari parameter URL
  const roomId = (params?.id as string) || "";

  const [room, setRoom] = useState<RoomItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Ambil URL API dari env
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    if (!roomId) return;
    const fetchRoomDetail = async () => {
      try {
        const res = await fetch(`${apiUrl}/resources/${roomId}`);
        if (!res.ok) throw new Error("Gagal mengambil detail kamar");
        const data = await res.json();
        setRoom(data);
      } catch (error) {
        console.error("Error fetching room detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetail();
  }, [roomId, apiUrl]);

  // State untuk Favorit Wishlist (Ikon Hati)
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteToast, setFavoriteToast] = useState<string | null>(null);

  // State untuk mengontrol pembukaan Modal Notifikasi Wajib Login
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // State form simulasi pemesanan tanggal
  const [checkInDate, setCheckInDate] = useState("2026-08-10");
  const [checkOutDate, setCheckOutDate] = useState("2026-08-12");
  const [guestCount, setGuestCount] = useState("2");

  // Handler toggle favorit
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    setFavoriteToast(
      !isFavorite
        ? `❤️ Ditambahkan ke Kamar Favorit`
        : `Dihapus dari Kamar Favorit`
    );
    setTimeout(() => setFavoriteToast(null), 3000);
  };

  // Handler saat tombol "Pesan Kamar Ini" diklik oleh pengunjung
  const handleBookingAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginModalOpen(true);
  };

  // Render Form Reservasi / Booking
  const renderBookingForm = () => {
    if (!room) return null;
    return (
      <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-xl border border-gray-200/90">
        <div className="border-b border-gray-100 pb-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            HARGA SPESIAL
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-[#0B4F37]">
              Rp {room.price_per_night?.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-gray-500 font-normal">/ malam</span>
          </div>
        </div>

        <form onSubmit={handleBookingAttempt} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#0B4F37]" />
              <span>Tanggal Check-in</span>
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4F37]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#0B4F37]" />
              <span>Tanggal Check-out</span>
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4F37]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#0B4F37]" />
              <span>Jumlah Tamu</span>
            </label>
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4F37]"
            >
              <option value="1">1 Orang Dewasa</option>
              <option value="2">2 Orang Dewasa</option>
              <option value="3">2 Orang Dewasa + 1 Anak</option>
              <option value="4">4 Orang (Keluarga)</option>
            </select>
          </div>

          <div className="rounded-xl bg-gray-50 p-3.5 space-y-2 border border-gray-200/60 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Harga Kamar</span>
              <span className="font-semibold text-gray-900">
                Rp {room.price_per_night?.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Pajak & Layanan (10%)</span>
              <span className="font-semibold text-gray-900">Termasuk</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-[#0B4F37] text-sm">
              <span>Total Estimasi</span>
              <span>Rp {room.price_per_night?.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0B4F37] py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#073524] hover:shadow-xl active:scale-95"
          >
            <Lock className="h-4 w-4 text-emerald-300" />
            <span>Pesan Kamar Ini</span>
          </button>

          <p className="text-[11px] text-center text-gray-400 font-light">
            🔒 Bebas biaya pembatalan hingga 24 jam sebelum check-in
          </p>
        </form>
      </div>
    );
  };

  // Tampilan loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-gray-900 flex flex-col">
        <Header activePage="kamar" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0B4F37] border-r-transparent align-[-0.125em]" role="status"></div>
            <p className="mt-4 text-sm text-gray-500 font-medium">Memuat data kamar...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // TAMPILAN JIKA KAMAR TIDAK DITEMUKAN (URL SALAH ATAU API ERROR)
  if (!room) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-gray-900 flex flex-col">
        <Header activePage="kamar" />
        
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="rounded-3xl bg-white p-10 sm:p-12 text-center shadow-xl border border-gray-200/80 max-w-lg w-full">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4 shadow-inner">
              <SearchX className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Maaf, Tipe Kamar Tidak Ditemukan</h1>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed">
              Tipe kamar dengan ID <code className="bg-gray-100 px-2 py-0.5 rounded text-rose-600 font-semibold">{roomId}</code> tidak tersedia atau telah dihapus dari katalog kami.
            </p>
            <Link
              href="/kamar"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0B4F37] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow transition-all hover:bg-[#073524]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Katalog Kamar</span>
            </Link>
          </div>
        </main>

        <Footer />
        <AiAssistantModal />
      </div>
    );
  }

  // Ambil gambar utama dan gambar galeri tambahan
  const primaryImage = room.room_images?.find((img) => img.is_primary)?.image_url
    || room.room_images?.[0]?.image_url
    || "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80";

  const galleryImages = room.room_images?.filter((img) => img.image_url !== primaryImage) || [];

  return (
    // Wrapper Utama Layout
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-[#0B4F37] selection:text-white">
      
      {/* 1. Header Navigasi */}
      <Header activePage="kamar" />

      <main className="w-full pb-20">
        {/* BREADCRUMB & TOMBOL KEMBALI */}
        <div className="bg-white border-b border-gray-200/80 py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link
              href="/kamar"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0B4F37] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Katalog Kamar</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 font-medium">
              <Link href="/" className="hover:text-gray-900">Beranda</Link>
              <span>/</span>
              <Link href="/kamar" className="hover:text-gray-900">Kamar</Link>
              <span>/</span>
              <span className="text-[#0B4F37] font-bold">{room.name}</span>
            </div>
          </div>
        </div>

        {/* CONTAINER UTAMA KONTEN DETAIL KAMAR */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          
          {/* JUDUL UTAMA KAMAR, RATING & HARGA */}
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between border-b border-gray-200 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#0B4F37] px-3 py-0.5 text-xs font-semibold text-white uppercase">
                  {room.type}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>Kapasitas {room.capacity} Orang</span>
                </span>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  {room.name}
                </h1>
                
                {/* FITUR 2: TOMBOL WISHLIST IKON HATI */}
                <button
                  onClick={handleToggleFavorite}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                    isFavorite
                      ? "bg-rose-500 text-white border-rose-500"
                      : "bg-white text-gray-500 border-gray-300 hover:border-rose-400 hover:text-rose-500"
                  }`}
                  aria-label="Simpan ke Favorit"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                </button>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                SiniBook Hotel • {room.location}
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                HARGA PER MALAM
              </span>
              <div className="flex items-baseline gap-1 mt-0.5 md:justify-end">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0B4F37]">
                  Rp {room.price_per_night?.toLocaleString("id-ID")}
                </span>
                <span className="text-sm text-gray-500 font-normal">/ malam</span>
              </div>
            </div>
          </div>

          {/* GRID UTAMA: DETAIL KAMAR (FOTO + DESKRIPSI) DI KIRI, RESERVASI / GALERI DI KANAN */}
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
            
            {/* KOLOM KIRI (FOTO UTAMA & DETAIL DESKRIPSI) */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Foto Utama */}
              <div className="relative h-80 sm:h-96 overflow-hidden rounded-2xl bg-gray-200 shadow-md">
                <Image
                  src={primaryImage}
                  alt={room.name}
                  fill
                  priority
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* RINGKASAN SPESIFIKASI UTAMA */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl bg-emerald-900/5 p-4 sm:p-6 border border-emerald-900/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B4F37] text-white shadow-sm">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400">KAPASITAS</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-800">
                      {room.capacity} Tamu
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B4F37] text-white shadow-sm">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400">LOKASI</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-800">
                      {room.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* FASILITAS KAMAR LENGKAP */}
              <div>
                <h2 className="text-xl font-bold text-gray-900">Fasilitas Kamar</h2>
                <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {room.facilities?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-xl bg-white p-3 border border-gray-200/70 shadow-sm">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#0B4F37]">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ATURAN & KEBIJAKAN MENGINAP */}
              <div className="rounded-2xl bg-white p-6 border border-gray-200/80 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#0B4F37]" />
                  <span>Kebijakan & Aturan Menginap</span>
                </h3>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm text-gray-600 font-light">
                  <li>• **Waktu Check-in**: Mulai pukul 14.00 WIB</li>
                  <li>• **Waktu Check-out**: Maksimal pukul 12.00 WIB</li>
                  <li>• **Bebas Asap Rokok**: Kamar ini 100% Bebas Asap Rokok (Non-smoking)</li>
                  <li>• **Pembatalan Gratis**: Pembatalan tanpa biaya hingga 24 jam sebelum check-in</li>
                </ul>
              </div>

            </div>

            {/* KOLOM KANAN (GALERI TAMBAHAN & FORM RESERVASI) */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Galeri Tambahan (Hanya jika foto > 1) */}
              {room.room_images && room.room_images.length > 1 && (
                <div className="grid grid-cols-3 gap-4 lg:grid-cols-1">
                  {galleryImages.slice(0, 3).map((img, index) => (
                    <div
                      key={img.id}
                      className="relative h-24 sm:h-28 lg:h-[118px] overflow-hidden rounded-xl bg-gray-200 shadow-sm"
                    >
                      <Image
                        src={img.image_url}
                        alt={`${room.name} Interior ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                  ))}
                  {/* Fallback jika galeri ada yang kosong, isi dengan placeholder agar totalnya 3 */}
                  {galleryImages.length < 3 &&
                    Array.from({ length: 3 - galleryImages.length }).map((_, idx) => (
                      <div
                        key={`placeholder-${idx}`}
                        className="relative h-24 sm:h-28 lg:h-[118px] overflow-hidden rounded-xl bg-gray-100 border border-dashed flex items-center justify-center text-gray-400"
                      >
                        <span className="text-[10px]">No Image</span>
                      </div>
                    ))}
                </div>
              )}

              {/* Form Reservasi (akan sticky sendiri) */}
              {renderBookingForm()}

            </div>

          </div>

        </div>
      </main>

      {/* POPUP MODAL PERINGATAN WAJIB LOGIN */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 text-center">
            
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-4 shadow-inner">
              <ShieldAlert className="h-8 w-8" />
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Anda Harus Login Terlebih Dahulu
            </h3>

            <p className="mt-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
              Untuk melakukan pemesanan kamar <strong className="text-[#0B4F37]">{room.name}</strong>, Anda wajib masuk ke akun SiniBook Anda terlebih dahulu demi keamanan data transaksi.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  alert("Fitur Form Login & Register akan dibuat pada tahap berikutnya!");
                  setIsLoginModalOpen(false);
                }}
                className="w-full rounded-xl bg-[#0B4F37] py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#073524] active:scale-95"
              >
                Masuk / Login Sekarang
              </button>

              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="w-full rounded-xl border border-gray-300 bg-white py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Kembali Melihat Detail Kamar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* NOTIFIKASI TOAST FAVORIT */}
      {favoriteToast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#0B4F37] px-6 py-3 text-xs font-bold text-white shadow-2xl border border-emerald-400/40 animate-fade-in">
          {favoriteToast}
        </div>
      )}

      <Footer />
      <AiAssistantModal />

    </div>
  );
}
