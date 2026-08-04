"use client"; // Client Component untuk mengelola rute dinamis detail kamar, modal login & ulasan tamu

import React, { useState } from "react"; // Mengimpor React dan useState
import Image from "next/image"; // Komponen Image Next.js untuk galeri foto kamar
import Link from "next/link"; // Komponen Link Next.js untuk breadcrumb & navigasi
import { useParams } from "next/navigation"; // Hook untuk mengambil parameter ID kamar dari URL (/kamar/[id])
import {
  Square,
  Bed,
  Wifi,
  Sparkles,
  Utensils,
  Coffee,
  Headphones,
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
  ThumbsUp,
  SearchX,
} from "lucide-react"; // Mengimpor ikon-ikon modern dari Lucide React

// Mengimpor komponen layout utama (Header, Footer, dan Widget Chatbot AI)
import Header from "../../landing-pages/Header";
import Footer from "../../landing-pages/Footer";
import AiAssistantModal from "../../landing-pages/AiAssistantModal";

// Data Detail Lengkap 8 Pilihan Kamar dalam Bahasa Indonesia
const ROOM_DETAILS_MAP: Record<
  string,
  {
    id: string;
    title: string;
    badge: string;
    price: string;
    originalPrice: string;
    discountBadge: string;
    description: string;
    longDescription: string;
    heroImage: string;
    gallery: string[];
    specs: { label: string; icon: React.ElementType }[];
    amenities: string[];
    rating: string;
    reviewCount: number;
  }
> = {
  "standard-room": {
    id: "standard-room",
    title: "Standard Room",
    badge: "Pilihan Hemat",
    price: "Rp 520.000",
    originalPrice: "Rp 650.000",
    discountBadge: "DISKON 20%",
    description:
      "Kamar ekonomis yang bersih, rapi, dan nyaman untuk backpacker atau traveler mandiri.",
    longDescription:
      "Standard Room dirancang bagi Anda yang mencari tempat menginap yang bersih, tenang, dan efisien dengan budget terjangkau. Dilengkapi tempat tidur Single Bed yang empuk, pendingin ruangan (AC), serta kamar mandi pribadi ber-shower.",
    heroImage:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
    ],
    specs: [
      { label: "Luas 20 m²", icon: Square },
      { label: "Single Size Bed", icon: Bed },
      { label: "Wi-Fi Cepat 50 Mbps", icon: Wifi },
    ],
    amenities: [
      "Penyejuk Udara (AC) Individual",
      "Smart TV 43 Inci",
      "Meja Kerja Mini",
      "Sarapan Gratis 1 Orang",
      "Kamar Mandi Shower Air Hangat",
      "Brankas Pribadi",
      "Air Mineral Kemasan Gratis",
      "Handuk & Perlengkapan Mandi",
    ],
    rating: "4.7",
    reviewCount: 62,
  },
  "superior-room": {
    id: "superior-room",
    title: "Superior Room",
    badge: "Favorit Bisnis",
    price: "Rp 680.000",
    originalPrice: "Rp 850.000",
    discountBadge: "DISKON 20%",
    description:
      "Kamar nyaman dan rapi yang dirancang khusus untuk profesional bisnis dengan area kerja pribadi.",
    longDescription:
      "Superior Room memberikan suasana menginap yang sangat tenang dan elegan. Dilengkapi dengan meja kerja ergonomis, akses internet Wi-Fi berkecepatan tinggi, serta tempat tidur berukuran Queen yang sangat nyaman untuk menjamin kualitas istirahat Anda setelah seharian beraktivitas.",
    heroImage:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
    ],
    specs: [
      { label: "Luas 25 m²", icon: Square },
      { label: "Queen Size Bed", icon: Bed },
      { label: "Wi-Fi Cepat 100 Mbps", icon: Wifi },
    ],
    amenities: [
      "Penyejuk Udara (AC) Individual",
      "Smart TV 50 Inci dengan Netflix & YouTube",
      "Meja Kerja Ergonomis & Lampu Baca",
      "Sarapan Gratis untuk 2 Orang",
      "Pembuat Kopi & Teh Otomatis",
      "Kamar Mandi Shower Air Hangat & Dingin",
      "Brankas Pribadi Ukuran Laptop",
      "Layanan Kamar (Room Service) 24 Jam",
    ],
    rating: "4.8",
    reviewCount: 78,
  },
  "deluxe-room": {
    id: "deluxe-room",
    title: "Deluxe Room",
    badge: "Populer",
    price: "Rp 935.000",
    originalPrice: "Rp 1.100.000",
    discountBadge: "DISKON 15%",
    description:
      "Kamar luas dengan pemandangan lanskap kota yang memukau dari jendela serta tempat tidur kelas premium.",
    longDescription:
      "Nikmati pemandangan lanskap kota Jakarta yang mempesona langsung dari jendela besar Deluxe Room. Kamar ini menyajikan kemewahan tempat tidur King Size berbahan seprai katun Mesir pilihan, serta sofa santai untuk menikmati waktu luang Anda.",
    heroImage:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80",
    ],
    specs: [
      { label: "Luas 35 m²", icon: Square },
      { label: "King Size Bed", icon: Bed },
      { label: "Pemandangan Kota Indah", icon: Sparkles },
    ],
    amenities: [
      "Pemandangan Kota (City View)",
      "Smart TV 55 Inci Resolusi 4K",
      "Sofa Santai & Meja Kopi",
      "Sarapan Gratis Buffet Internasional",
      "Mesin Pembuat Kopi Kapsul",
      "Kamar Mandi Marmer & Shower Rainwater",
      "Jubah Mandi (Bathrobe) & Handuk Lembut",
      "Mini Bar dengan Pengisian Harian",
    ],
    rating: "4.9",
    reviewCount: 124,
  },
  "executive-room": {
    id: "executive-room",
    title: "Executive Room",
    badge: "Eksklusif",
    price: "Rp 1.350.000",
    originalPrice: "Rp 1.500.000",
    discountBadge: "DISKON 10%",
    description:
      "Fasilitas eksklusif dengan ornamen kayu kenari berkualitas tinggi dan akses khusus ke executive lounge.",
    longDescription:
      "Executive Room menghadirkan standar kenyamanan tertinggi untuk Anda yang menginginkan privilase ekstra. Tamu Executive Room mendapatkan akses gratis ke Executive Club Lounge yang menyajikan sarapan privat, teh sore (afternoon tea), dan cocktail malam.",
    heroImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80",
    ],
    specs: [
      { label: "Akses Executive Lounge", icon: Utensils },
      { label: "Mesin Nespresso", icon: Coffee },
      { label: "Bathtub Rendam Mewah", icon: Sparkles },
    ],
    amenities: [
      "Akses Privat Executive Lounge 24 Jam",
      "Gratis Afternoon Tea & Evening Cocktails",
      "Bathtub Rendam dengan Garam Mandi",
      "Smart TV 65 Inci Soundbar Premium",
      "Mesin Kopi Nespresso dengan Kapsul Pilihan",
      "Layanan Setrika Baju Gratis 2 Pakaian/Hari",
      "Check-in & Check-out VIP Kilat",
      "Kamar Mandi Marmer Lengkap",
    ],
    rating: "4.9",
    reviewCount: 96,
  },
  "family-suite": {
    id: "family-suite",
    title: "Family Suite",
    badge: "Liburan Keluarga",
    price: "Rp 1.785.000",
    originalPrice: "Rp 2.100.000",
    discountBadge: "DISKON 15%",
    description:
      "Kamar keluarga super luas dengan 2 Queen Bed, area bermain santai, dan sarapan buffet untuk 4 orang.",
    longDescription:
      "Pilihan sempurna untuk liburan keluarga tercinta. Family Suite memiliki kapasitas lapang dengan dua tempat tidur Queen Size, ruang santai keluarga terpisah, serta paket sarapan gratis untuk 4 orang dewasa dan anak-anak.",
    heroImage:
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
    ],
    specs: [
      { label: "Luas 50 m²", icon: Square },
      { label: "2 Queen Bed", icon: Bed },
      { label: "Kapasitas 4 Orang", icon: Users },
    ],
    amenities: [
      "Ruang Santai Keluarga Terpisah",
      "2 Tempat Tidur Queen Size Bed",
      "Sarapan Gratis Buffet untuk 4 Orang",
      "Konsol Game & Smart TV 65 Inci",
      "Kamar Mandi Ganda dengan Bathtub & Shower",
      "Kulkas & Dapur Kecil (Kitchenette)",
      "Area Bermain Anak-Anak di Kamar",
      "Jubah Mandi Ukuran Dewasa & Anak",
    ],
    rating: "4.9",
    reviewCount: 110,
  },
  "honeymoon-suite": {
    id: "honeymoon-suite",
    title: "Honeymoon Suite",
    badge: "Romantis Pasangan",
    price: "Rp 1.955.000",
    originalPrice: "Rp 2.300.000",
    discountBadge: "DISKON 15%",
    description:
      "Suasana romantis pasangan dengan tempat tidur berhias mawar, bathtub aromaterapi, dan wine gratis.",
    longDescription:
      "Ciptakan kenangan bulan madu yang tak terlupakan bersama pasangan di Honeymoon Suite. Kamar ini menghadirkan dekorasi khusus berupa kelopak mawar merah segar, bathtub aromaterapi dengan minyak esensial rilaksasi, serta sebotol wine dan kue cokelat sambutan.",
    heroImage:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
    ],
    specs: [
      { label: "Bathtub Aromaterapi", icon: Sparkles },
      { label: "King Bed Romantis", icon: Bed },
      { label: "Gratis Wine Sambutan", icon: Utensils },
    ],
    amenities: [
      "Dekorasi Rangkaian Bunga Mawar Segar",
      "Sebotol Wine & Kue Cokelat Sambutan",
      "Bathtub Rendam dengan Minyak Aromaterapi",
      "Sarapan Romantis Disajikan di Atas Tempat Tidur",
      "Gratis Paket Spa Rilaksasi Pasangan 60 Menit",
      "Balkon Privat Pemandangan Kota Malam Hari",
      "Smart TV 60 Inci Sistem Audio Surround",
      "Layanan Kamar Prioritas 24 Jam",
    ],
    rating: "5.0",
    reviewCount: 45,
  },
  "suite-room": {
    id: "suite-room",
    title: "Suite Room",
    badge: "Koleksi Teratas",
    price: "Rp 2.125.000",
    originalPrice: "Rp 2.500.000",
    discountBadge: "DISKON 15%",
    description:
      "Pengalaman menginap paling mewah dengan perpaduan pencahayaan hangat dan interior marmer yang megah.",
    longDescription:
      "Suite Room adalah mahakarya terbesar SiniBook Hotel. Dirancang dengan ruang tamu terpisah yang sangat lapang, Jacuzzi pribadi dengan panorama langit kota, serta layanan Butler pribadi 24 jam yang siap membantu segala kebutuhan menginap Anda.",
    heroImage:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    ],
    specs: [
      { label: "Ruang Tamu Terpisah", icon: Square },
      { label: "Jacuzzi Privat", icon: Sparkles },
      { label: "Layanan Butler 24/7", icon: Headphones },
    ],
    amenities: [
      "Ruang Tamu & Ruang Makan Mewah Terpisah",
      "Jacuzzi Pribadi dengan Pemandangan Kota",
      "Layanan Asisten/Butler Pribadi 24 Jam",
      "Sistem Audio Mewah & Smart Home Lighting",
      "Gratis Antar-Jemput Bandara Mobil Mewah",
      "Sarapan Privat Disajikan di Kamar",
      "Kamar Mandi Marmer Ganda (His & Hers)",
      "Balkon Privat dengan Area Santai",
    ],
    rating: "5.0",
    reviewCount: 52,
  },
  "presidential-suite": {
    id: "presidential-suite",
    title: "Presidential Suite",
    badge: "Kemewahan Tertinggi",
    price: "Rp 3.825.000",
    originalPrice: "Rp 4.500.000",
    discountBadge: "DISKON 15%",
    description:
      "Penthouse termegah lantai paling atas dengan kolam renang pribadi, ruang rapat VIP, dan lift privat.",
    longDescription:
      "Presidential Suite adalah puncak kemewahan hotel di lantai paling atas (Penthouse). Dilengkapi dengan kolam renang pribadi outdoor, ruang rapat privat VIP, piano grand, serta layanan pelayan/butler eksklusif 24 jam nonstop.",
    heroImage:
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
    ],
    specs: [
      { label: "Kolam Renang Privat", icon: Sparkles },
      { label: "Penthouse 120 m²", icon: Square },
      { label: "Lift Privat VIP", icon: Headphones },
    ],
    amenities: [
      "Kolam Renang Pribadi Outdoor di Balkon Penthouse",
      "Lift Privat Khusus Akses Kamar VIP",
      "Ruang Rapat Privat & Ruang Makan 8 Orang",
      "Dapur Chef Privat Lengkap",
      "Layanan Butler & Koki Pribadi 24 Jam",
      "Gratis Limosin Antar-Jemput Bandara",
      "Sistem Keamanan Pintar & Cermin Pintar",
      "Pemandangan Kota 360 Derajat",
    ],
    rating: "5.0",
    reviewCount: 34,
  },
};

// Data Komentar Ulasan Tamu Mockup
const SAMPLE_REVIEWS = [
  {
    name: "Budi Santoso",
    date: "24 Juli 2026",
    rating: 5,
    comment:
      "Pengalaman menginap yang luar biasa! Pelayanan staf sangat ramah, kebersihan kamar 10/10, dan pemandangan malam hari dari jendela kamar sangat indah.",
  },
  {
    name: "Siti Rahmawati",
    date: "18 Juli 2026",
    rating: 5,
    comment:
      "Kasurnya sangat empuk dan sarapannya bervariasi. Sangat cocok untuk liburan keluarga maupun perjalanan bisnis.",
  },
  {
    name: "Hendra Wijaya",
    date: "05 Juli 2026",
    rating: 5,
    comment:
      "Fasilitas sesuai gambar, internet cepat untuk kerja zoom. Proses check-in sangat cepat.",
  },
];

// Komponen Utama Halaman Detail Kamar
export default function DetailKamarPage() {
  const params = useParams(); // Mengambil id kamar dari parameter URL
  const roomId = (params?.id as string) || "";

  // Ambil detail kamar berdasarkan ID (Jika ID tidak ada di objek MAP, hasilnya undefined)
  const room = ROOM_DETAILS_MAP[roomId];

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

  // =========================================================================
  // FALLBACK FITUR 4: TAMPILAN JIKA KAMAR TIDAK DITEMUKAN (URL SALAH)
  // =========================================================================
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
              <span className="text-[#0B4F37] font-bold">{room.title}</span>
            </div>
          </div>
        </div>

        {/* CONTAINER UTAMA KONTEN DETAIL KAMAR */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          
          {/* JUDUL UTAMA KAMAR, RATING & HARGA */}
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between border-b border-gray-200 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#0B4F37] px-3 py-0.5 text-xs font-semibold text-white">
                  {room.badge}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{room.rating} ({room.reviewCount} Ulasan Tamu)</span>
                </span>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  {room.title}
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
                SiniBook Hotel • Pusat Kota Jakarta
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                HARGA PER MALAM
              </span>
              <div className="flex items-center gap-2 md:justify-end mt-0.5">
                <span className="text-xs text-gray-400 line-through">
                  {room.originalPrice}
                </span>
                <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                  {room.discountBadge}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-0.5 md:justify-end">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0B4F37]">
                  {room.price}
                </span>
                <span className="text-sm text-gray-500 font-normal">/ malam</span>
              </div>
            </div>
          </div>

          {/* GALERI FOTO GRID */}
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="relative h-80 sm:h-96 lg:col-span-2 overflow-hidden rounded-2xl bg-gray-200 shadow-md">
              <Image
                src={room.heroImage}
                alt={room.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 lg:grid-cols-1">
              {room.gallery.map((imgUrl, index) => (
                <div
                  key={index}
                  className="relative h-24 sm:h-28 lg:h-[118px] overflow-hidden rounded-xl bg-gray-200 shadow-sm"
                >
                  <Image
                    src={imgUrl}
                    alt={`${room.title} Interior ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* GRID KONTEN DESKRIPSI (KIRI) VS BOX RESERVASI (KANAN) */}
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
            
            {/* KOLOM KIRI */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* RINGKASAN SPESIFIKASI UTAMA */}
              <div className="grid grid-cols-3 gap-4 rounded-2xl bg-emerald-900/5 p-4 sm:p-6 border border-emerald-900/10">
                {room.specs.map((spec, i) => {
                  const IconComp = spec.icon;
                  return (
                    <div key={i} className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B4F37] text-white shadow-sm">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-800">
                        {spec.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* DESKRIPSI LENGKAP KAMAR */}
              <div>
                <h2 className="text-xl font-bold text-gray-900">Deskripsi Kamar</h2>
                <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                  {room.longDescription}
                </p>
              </div>

              {/* FASILITAS KAMAR LENGKAP */}
              <div>
                <h2 className="text-xl font-bold text-gray-900">Fasilitas Kamar</h2>
                <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {room.amenities.map((item, idx) => (
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

              {/* FITUR 3: SECTION ULASAN & RATING KOMENTAR TAMU */}
              <div className="rounded-2xl bg-white p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <ThumbsUp className="h-5 w-5 text-[#0B4F37]" />
                      <span>Ulasan & Pengalaman Tamu</span>
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                      Ulasan jujur dari tamu yang telah menginap di {room.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
                    <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                    <div>
                      <span className="text-lg font-black text-[#0B4F37] block leading-none">{room.rating}</span>
                      <span className="text-[10px] text-gray-500 font-medium">/ 5.0 dari {room.reviewCount} Ulasan</span>
                    </div>
                  </div>
                </div>

                {/* LIST KOMENTAR TAMU */}
                <div className="mt-6 space-y-4">
                  {SAMPLE_REVIEWS.map((rev, idx) => (
                    <div key={idx} className="rounded-xl bg-slate-50 p-4 border border-gray-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B4F37] text-white text-xs font-bold">
                            {rev.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-900 block">{rev.name}</span>
                            <span className="text-[10px] text-gray-400">{rev.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed font-light pl-10">
                        &quot;{rev.comment}&quot;
                      </p>
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

            {/* KOLOM KANAN: FORM RESERVASI */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-xl border border-gray-200/90">
                <div className="border-b border-gray-100 pb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    HARGA SPESIAL
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-extrabold text-[#0B4F37]">
                      {room.price}
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
                      <span>{room.price} x 2 Malam</span>
                      <span className="font-semibold text-gray-900">
                        {room.price}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Pajak & Layanan (10%)</span>
                      <span className="font-semibold text-gray-900">Termasuk</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-[#0B4F37] text-sm">
                      <span>Total Estimasi</span>
                      <span>{room.price}</span>
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
              Untuk melakukan pemesanan kamar <strong className="text-[#0B4F37]">{room.title}</strong>, Anda wajib masuk ke akun SiniBook Anda terlebih dahulu demi keamanan data transaksi.
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
