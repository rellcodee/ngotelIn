"use client"; // Client Component di Next.js App Router untuk interaktivitas modal & navigasi

import React, { useState } from "react"; // Mengimpor React dan useState untuk mengelola state halaman
import Image from "next/image"; // Komponen Image Next.js untuk optimasi loading gambar kamar
import Link from "next/link"; // Komponen Link Next.js untuk berpindah ke halaman detail kamar
import {
  Square,
  Bed,
  Wifi,
  Sparkles,
  Utensils,
  Coffee,
  Headphones,
  Bot,
  PhoneCall,
  Search,
  Heart,
  X,
  SlidersHorizontal,
  Star,
  Users,
  Flame,
} from "lucide-react"; // Mengimpor ikon-ikon modern dari Lucide React

// Mengimpor komponen layout utama (Header, Footer, dan Widget Chatbot AI)
import Header from "../landing-pages/Header";
import Footer from "../landing-pages/Footer";


// Interface / tipe data typescript untuk struktur kartu kamar
interface RoomSpec {
  label: string;
  icon: React.ElementType;
}

interface RoomItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  specs: RoomSpec[];
  originalPrice: string;
  discountBadge: string;
  finalPrice: string;
  period: string;
  buttonText: string;
  rating: string;
  reviewCount: number;
  stockBadge?: string;
  isSolidButton?: boolean;
}

// Data Katalog 8 Pilihan Kamar Lengkap & Variatif (100% Bahasa Indonesia)
const ROOMS_DATA: RoomItem[] = [
  {
    id: "standard-room",
    badge: "Pilihan Hemat",
    title: "Standard Room",
    description:
      "Kamar ekonomis yang bersih, rapi, dan nyaman untuk backpacker atau traveler mandiri.",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    specs: [
      { label: "20 m²", icon: Square },
      { label: "Single Bed", icon: Bed },
      { label: "Wi-Fi Cepat", icon: Wifi },
    ],
    originalPrice: "Rp 650.000",
    discountBadge: "DISKON 20%",
    finalPrice: "Rp 520.000",
    period: "/ malam",
    buttonText: "Detail →",
    rating: "4.7",
    reviewCount: 62,
    stockBadge: "Tersisa 3 Kamar!",
    isSolidButton: false,
  },
  {
    id: "superior-room",
    badge: "Favorit Bisnis",
    title: "Superior Room",
    description:
      "Kamar nyaman dan rapi yang dirancang khusus untuk profesional bisnis dengan area kerja pribadi.",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
    specs: [
      { label: "25 m²", icon: Square },
      { label: "Queen Bed", icon: Bed },
      { label: "Wi-Fi Cepat", icon: Wifi },
    ],
    originalPrice: "Rp 850.000",
    discountBadge: "DISKON 20%",
    finalPrice: "Rp 680.000",
    period: "/ malam",
    buttonText: "Detail →",
    rating: "4.8",
    reviewCount: 78,
    stockBadge: "Tersisa 4 Kamar!",
    isSolidButton: false,
  },
  {
    id: "deluxe-room",
    badge: "Populer",
    title: "Deluxe Room",
    description:
      "Kamar luas dengan pemandangan lanskap kota yang memukau dari jendela serta tempat tidur kelas premium.",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    specs: [
      { label: "35 m²", icon: Square },
      { label: "King Bed", icon: Bed },
      { label: "Pemandangan Kota", icon: Sparkles },
    ],
    originalPrice: "Rp 1.100.000",
    discountBadge: "DISKON 15%",
    finalPrice: "Rp 935.000",
    period: "/ malam",
    buttonText: "Detail →",
    rating: "4.9",
    reviewCount: 124,
    stockBadge: "🔥 Paling Dicari!",
    isSolidButton: false,
  },
  {
    id: "executive-room",
    badge: "Eksklusif",
    title: "Executive Room",
    description:
      "Fasilitas eksklusif dengan ornamen kayu kenari berkualitas tinggi dan akses khusus ke executive lounge.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    specs: [
      { label: "Akses Lounge", icon: Utensils },
      { label: "Mesin Nespresso", icon: Coffee },
      { label: "Bathtub Mewah", icon: Sparkles },
    ],
    originalPrice: "Rp 1.500.000",
    discountBadge: "DISKON 10%",
    finalPrice: "Rp 1.350.000",
    period: "/ malam",
    buttonText: "Detail →",
    rating: "4.9",
    reviewCount: 96,
    stockBadge: "Tersisa 2 Kamar!",
    isSolidButton: false,
  },
  {
    id: "family-suite",
    badge: "Liburan Keluarga",
    title: "Family Suite",
    description:
      "Kamar keluarga super luas dengan 2 Queen Bed, area bermain santai, dan sarapan buffet untuk 4 orang.",
    image:
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
    specs: [
      { label: "Luas 50 m²", icon: Square },
      { label: "2 Queen Bed", icon: Bed },
      { label: "Kapasitas 4 Orang", icon: Users },
    ],
    originalPrice: "Rp 2.100.000",
    discountBadge: "DISKON 15%",
    finalPrice: "Rp 1.785.000",
    period: "/ malam",
    buttonText: "Detail →",
    rating: "4.9",
    reviewCount: 110,
    stockBadge: "Gratis Sarapan 4 Orang",
    isSolidButton: false,
  },
  {
    id: "honeymoon-suite",
    badge: "Romantis Pasangan",
    title: "Honeymoon Suite",
    description:
      "Suasana romantis pasangan dengan tempat tidur berhias mawar, bathtub aromaterapi, dan wine gratis.",
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
    specs: [
      { label: "Bathtub Aromaterapi", icon: Sparkles },
      { label: "King Bed Romantis", icon: Bed },
      { label: "Gratis Wine", icon: Utensils },
    ],
    originalPrice: "Rp 2.300.000",
    discountBadge: "DISKON 15%",
    finalPrice: "Rp 1.955.000",
    period: "/ malam",
    buttonText: "Detail →",
    rating: "5.0",
    reviewCount: 45,
    stockBadge: "Gratis Paket Spa",
    isSolidButton: false,
  },
  {
    id: "suite-room",
    badge: "Koleksi Teratas",
    title: "Suite Room",
    description:
      "Pengalaman menginap paling mewah dengan perpaduan pencahayaan hangat dan interior marmer yang megah.",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
    specs: [
      { label: "Ruang Tamu", icon: Square },
      { label: "Jacuzzi", icon: Sparkles },
      { label: "Butler 24 Jam", icon: Headphones },
    ],
    originalPrice: "Rp 2.500.000",
    discountBadge: "DISKON 15%",
    finalPrice: "Rp 2.125.000",
    period: "/ malam",
    buttonText: "Sewa →",
    rating: "5.0",
    reviewCount: 52,
    stockBadge: "Tersisa 1 Kamar!",
    isSolidButton: true,
  },
  {
    id: "presidential-suite",
    badge: "Kemewahan Tertinggi",
    title: "Presidential Suite",
    description:
      "Penthouse termegah lantai paling atas dengan kolam renang pribadi, ruang rapat VIP, dan lift privat.",
    image:
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
    specs: [
      { label: "Kolam Renang Privat", icon: Sparkles },
      { label: "Penthouse 120 m²", icon: Square },
      { label: "Lift Privat VIP", icon: Headphones },
    ],
    originalPrice: "Rp 4.500.000",
    discountBadge: "DISKON 15%",
    finalPrice: "Rp 3.825.000",
    period: "/ malam",
    buttonText: "Sewa →",
    rating: "5.0",
    reviewCount: 34,
    stockBadge: "Kolam Renang Privat",
    isSolidButton: true,
  },
];

// Daftar Kategori Filter Tambahan
const CATEGORIES = [
  "Semua",
  "Pilihan Hemat",
  "Favorit Bisnis",
  "Populer",
  "Eksklusif",
  "Liburan Keluarga",
  "Romantis Pasangan",
  "Koleksi Teratas",
  "Kemewahan Tertinggi",
];

// Komponen Utama Halaman Kamar (Rute /kamar)
export default function KamarPage() {
  // State untuk Pencarian & Filter Kategori
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // State Favorit (Wishlist) menyimpan array ID kamar yang disukai
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteToast, setFavoriteToast] = useState<string | null>(null);

  // State toast notifikasi resepsionis
  const [showContactToast, setShowContactToast] = useState(false);

  // Fungsi toggle kamar favorit (Wishlist)
  const toggleFavorite = (roomId: string, roomTitle: string) => {
    if (favoriteIds.includes(roomId)) {
      setFavoriteIds((prev) => prev.filter((id) => id !== roomId));
      setFavoriteToast(`Dihapus dari Kamar Favorit (${roomTitle})`);
    } else {
      setFavoriteIds((prev) => [...prev, roomId]);
      setFavoriteToast(`❤️ Ditambahkan ke Kamar Favorit (${roomTitle})`);
    }
    setTimeout(() => setFavoriteToast(null), 3000);
  };

  // Fungsi penanganan saat tombol Hubungi Resepsionis diklik
  const handleContactReceptionist = () => {
    setShowContactToast(true);
    setTimeout(() => setShowContactToast(false), 4000);
  };

  // Logika Penyaringan Kamar berdasarkan Pencarian & Kategori
  const filteredRooms = ROOMS_DATA.filter((room) => {
    const matchesSearch =
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || room.badge === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    // Pembungkus utama layout halaman web dengan warna dasar latar putih dan font sans
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-[#0B4F37] selection:text-white">

      {/* 1. Navigasi Header Bagian Teratas */}
      <Header activePage="kamar" />

      <main className="w-full flex-1">
        {/* ========================================================================= */}
        {/* 2. HERO BANNER: Banner Judul "Pilihan Kamar Terbaik" */}
        {/* ========================================================================= */}
        <section className="relative w-full overflow-hidden bg-[#073524] py-20 sm:py-24 md:py-28 text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
              alt="SiniBook Luxury Hotel Outer View"
              fill
              priority
              className="object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B4F37]/30 via-[#073524]/50 to-[#073524]/80" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md border border-emerald-400/30 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>8 Pilihan Kamar Mewah Bintang 5</span>
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-white">
              Pilihan Kamar Terbaik
            </h1>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto font-light">
              Rasakan kemewahan tak tertandingi di jantung kota. Setiap sudut dirancang
              untuk memberikan kenyamanan maksimal bagi setiap tamu kami.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. BAR PENCARIAN & FILTER INTERAKTIF */}
        {/* ========================================================================= */}
        <section className="w-full bg-white border-b border-gray-200/80 py-6 sticky top-16 z-30 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            {/* Search Input Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau jenis kamar..."
                className="w-full rounded-full border border-gray-300 bg-gray-50 pl-10 pr-9 py-2 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4F37] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <span className="text-xs font-semibold text-gray-400 mr-1 flex items-center gap-1 shrink-0">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filter:</span>
              </span>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all shrink-0 ${selectedCategory === category
                    ? "bg-[#0B4F37] text-white shadow-sm font-bold"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. GRID KATALOG 8 KAMAR LENGKAP */}
        {/* ========================================================================= */}
        <section className="w-full py-12 sm:py-16 md:py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* JIKA KAMAR TIDAK DITEMUKAN PADA HASIL PENCARIAN */}
            {filteredRooms.length === 0 ? (
              <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-gray-200/80 max-w-lg mx-auto">
                <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-bold text-gray-900">Kamar Tidak Ditemukan</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Tidak ada kamar yang cocok dengan kata kunci &quot;{searchQuery}&quot; atau kategori &quot;{selectedCategory}&quot;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Semua");
                  }}
                  className="mt-5 rounded-full bg-[#0B4F37] px-5 py-2 text-xs font-bold text-white shadow hover:bg-[#073524]"
                >
                  Reset Filter Pencarian
                </button>
              </div>
            ) : (
              /* Grid Container 2 Kolom pada Layar Sedang & Besar */
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
                {filteredRooms.map((room) => {
                  const isFav = favoriteIds.includes(room.id);
                  return (
                    // Kartu Kamar Individual
                    <div
                      key={room.id}
                      className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative"
                    >
                      {/* FOTO KAMAR, IKON FAVORIT WISHLIST, STOK BADGE & KATEGORI BADGE */}
                      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-100">
                        <Image
                          src={room.image}
                          alt={room.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* TOMBOL FAVORIT WISHLIST (IKON HATI) */}
                        <button
                          onClick={() => toggleFavorite(room.id, room.title)}
                          aria-label="Simpan ke Favorit"
                          className={`absolute top-4 left-4 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all hover:scale-110 active:scale-95 ${isFav
                            ? "bg-rose-500 text-white"
                            : "bg-white/80 text-gray-600 hover:bg-white hover:text-rose-500"
                            }`}
                        >
                          <Heart className={`h-5 w-5 ${isFav ? "fill-current" : ""}`} />
                        </button>

                        {/* BADGE STOK TERBATAS / HIGHLIGHT */}
                        {room.stockBadge && (
                          <div className="absolute bottom-4 left-4 z-10">
                            <span className="flex items-center gap-1 rounded-md bg-amber-500/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur-md">
                              <Flame className="h-3.5 w-3.5 fill-current" />
                              <span>{room.stockBadge}</span>
                            </span>
                          </div>
                        )}

                        {/* BADGE KATEGORI DI KANAN ATAS */}
                        <div className="absolute top-4 right-4 z-10">
                          <span className="rounded-full bg-[#0B4F37]/90 px-3.5 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-md border border-white/20">
                            {room.badge}
                          </span>
                        </div>
                      </div>

                      {/* KONTEN DETAIL TEKS & HARGA KAMAR */}
                      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                        <div>
                          {/* Nama Kamar & SKOR RATING BINTANG */}
                          <div className="flex items-center justify-between gap-2">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 group-hover:text-[#0B4F37] transition-colors">
                              {room.title}
                            </h2>
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs font-bold text-amber-700 shrink-0">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span>{room.rating}</span>
                              <span className="text-[10px] text-gray-400 font-normal">({room.reviewCount})</span>
                            </div>
                          </div>

                          {/* Deskripsi Singkat Kamar */}
                          <p className="mt-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                            {room.description}
                          </p>

                          {/* LIST IKON SPESIFIKASI / FASILITAS KAMAR */}
                          <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-b border-gray-100 py-3.5">
                            {room.specs.map((spec, idx) => {
                              const SpecIcon = spec.icon;
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center gap-1.5 text-xs font-medium text-gray-600"
                                >
                                  <SpecIcon className="h-4 w-4 text-[#0B4F37]" />
                                  <span>{spec.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* BARIS HARGA DAN TOMBOL AKSI */}
                        <div className="mt-6 flex items-end justify-between gap-4 pt-2">
                          <div>
                            <span className="block text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                              MULAI DARI
                            </span>

                            <div className="mt-0.5 flex items-center gap-2">
                              <span className="text-xs text-gray-400 line-through">
                                {room.originalPrice}
                              </span>
                              <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                                {room.discountBadge}
                              </span>
                            </div>

                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="text-lg sm:text-xl font-extrabold text-[#0B4F37]">
                                {room.finalPrice}
                              </span>
                              <span className="text-xs text-gray-500 font-normal">
                                {room.period}
                              </span>
                            </div>
                          </div>

                          <div>
                            {room.isSolidButton ? (
                              <Link
                                href={`/kamar/${room.id}`}
                                className="flex items-center gap-1.5 rounded-full bg-[#0B4F37] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow transition-all hover:bg-[#073524] hover:shadow-md active:scale-95"
                              >
                                <span>{room.buttonText}</span>
                              </Link>
                            ) : (
                              <Link
                                href={`/kamar/${room.id}`}
                                className="flex items-center gap-1.5 rounded-full border-2 border-[#0B4F37] px-6 py-2 text-xs sm:text-sm font-bold text-[#0B4F37] transition-all hover:bg-[#0B4F37] hover:text-white active:scale-95"
                              >
                                <span>{room.buttonText}</span>
                              </Link>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. SECTION BANNER CTA: "Butuh Bantuan Memilih Kamar?" */}
        {/* ========================================================================= */}
        <section className="w-full bg-slate-100/80 py-12 sm:py-16 border-t border-gray-200/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between rounded-3xl bg-white p-8 sm:p-10 shadow-sm border border-gray-200/80">

              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                  Butuh Bantuan Memilih Kamar?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 font-light">
                  Konsultasikan kebutuhan menginap Anda dengan spesialis reservasi kami.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={handleContactReceptionist}
                  className="flex items-center gap-2 rounded-full border-2 border-gray-300 bg-white px-6 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 transition-all hover:border-gray-400 hover:bg-gray-50 active:scale-95"
                >
                  <PhoneCall className="h-4 w-4 text-gray-600" />
                  <span>Hubungi Resepsionis</span>
                </button>

                <button
                  onClick={() => {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                  }}
                  className="flex items-center gap-2 rounded-full bg-[#0B4F37] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow transition-all hover:bg-[#073524] hover:shadow-md active:scale-95"
                >
                  <Bot className="h-4 w-4 text-emerald-300" />
                  <span>Chat AI Assistant</span>
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* NOTIFIKASI TOAST SEMENTARA JIKA RESEPSIONIS DIKLIK */}
        {showContactToast && (
          <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900 px-6 py-3 text-xs font-semibold text-white shadow-2xl animate-bounce">
            📞 Layanan Resepsionis: (021) 555-0199 / WhatsApp +62 812-3456-7890
          </div>
        )}

        {/* NOTIFIKASI TOAST FAVORIT WISHLIST */}
        {favoriteToast && (
          <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#0B4F37] px-6 py-3 text-xs font-bold text-white shadow-2xl border border-emerald-400/40 animate-fade-in">
            {favoriteToast}
          </div>
        )}

      </main>

      {/* Footer Utama */}
      <Footer />



    </div>
  );
}
