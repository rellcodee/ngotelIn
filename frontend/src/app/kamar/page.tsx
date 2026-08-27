"use client"; // Client Component di Next.js App Router untuk interaktivitas modal & navigasi

import React, { useState } from "react"; // Mengimpor React dan useState untuk mengelola state halaman
import Image from "next/image"; // Komponen Image Next.js untuk optimasi loading gambar kamar
import Link from "next/link"; // Komponen Link Next.js untuk berpindah ke halaman detail kamar
import {
  Users,
  MapPin,
  Search,
  Heart,
  X,
  SlidersHorizontal,
  PhoneCall,
  ShieldCheck,
  Building2,
} from "lucide-react"; // Mengimpor ikon-ikon modern dari Lucide React

// Mengimpor komponen layout utama (Header, Footer)
import Header from "../landing-pages/Header";
import Footer from "../landing-pages/Footer";

// Interface disamakan 100% dengan Prisma Schema (model resources)
interface RoomItem {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  price_per_night: number;
  facilities: string[];
  image: string; // Dari relation room_images
}

// Data Katalog 8 Pilihan Kamar (Sesuai persis dengan kolom Prisma Schema model `resources`)
const ROOMS_DATA: RoomItem[] = [
  {
    id: "standard-room",
    name: "Standard Room",
    type: "Standard",
    location: "Gedung Utama - Lantai 2",
    capacity: 1,
    price_per_night: 520000,
    facilities: ["Wi-Fi Gratis", "AC", "Single Bed", "Shower Air Hangat"],
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "superior-room",
    name: "Superior Room",
    type: "Superior",
    location: "Gedung Utama - Lantai 3",
    capacity: 2,
    price_per_night: 680000,
    facilities: ["Wi-Fi Kencang", "Queen Bed", "AC", "Smart TV", "Meja Kerja"],
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "deluxe-room",
    name: "Deluxe Room",
    type: "Deluxe",
    location: "Gedung Utama - Lantai 5",
    capacity: 2,
    price_per_night: 935000,
    facilities: ["Free Wi-Fi", "King Bed", "Balkon Laut", "Bathtub", "Sarapan"],
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "executive-room",
    name: "Executive Room",
    type: "Executive",
    location: "Wing Barat - Lantai 7",
    capacity: 2,
    price_per_night: 1350000,
    facilities: ["Akses Lounge", "Mesin Kopi", "King Bed", "Smart TV", "Bathtub"],
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "family-suite",
    name: "Family Suite",
    type: "Suite",
    location: "Wing Timur - Lantai 4",
    capacity: 4,
    price_per_night: 1785000,
    facilities: ["2 Queen Bed", "Wi-Fi Kencang", "Sarapan 4 Pax", "Ruang Keluarga"],
    image:
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "honeymoon-suite",
    name: "Honeymoon Suite",
    type: "Suite",
    location: "Gedung Utama - Lantai 9",
    capacity: 2,
    price_per_night: 1955000,
    facilities: ["Bathtub Aromaterapi", "King Bed", "Gratis Wine", "View Kota"],
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "suite-room",
    name: "Suite Room",
    type: "Suite",
    location: "Wing Barat - Lantai 10",
    capacity: 3,
    price_per_night: 2125000,
    facilities: ["Jacuzzi", "Ruang Tamu Terpisah", "Butler 24 Jam", "King Bed"],
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "presidential-suite",
    name: "Presidential Suite",
    type: "Presidential",
    location: "Penthouse - Lantai 12",
    capacity: 5,
    price_per_night: 3825000,
    facilities: ["Kolam Renang Privat", "Lift VIP", "Dapur Mini", "Jacuzzi"],
    image:
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
  },
];

// Daftar Kategori Filter Berdasarkan `type` pada Prisma Schema
const CATEGORIES = ["Semua", "Standard", "Superior", "Deluxe", "Executive", "Suite", "Presidential"];

export default function KamarPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteToast, setFavoriteToast] = useState<string | null>(null);
  const [showContactToast, setShowContactToast] = useState(false);

  const toggleFavorite = (roomId: string, roomName: string) => {
    if (favoriteIds.includes(roomId)) {
      setFavoriteIds((prev) => prev.filter((id) => id !== roomId));
      setFavoriteToast(`Dihapus dari Kamar Favorit (${roomName})`);
    } else {
      setFavoriteIds((prev) => [...prev, roomId]);
      setFavoriteToast(`❤️ Ditambahkan ke Kamar Favorit (${roomName})`);
    }
    setTimeout(() => setFavoriteToast(null), 3000);
  };

  const handleContactReceptionist = () => {
    setShowContactToast(true);
    setTimeout(() => setShowContactToast(false), 4000);
  };

  const filteredRooms = ROOMS_DATA.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.facilities.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "Semua" || room.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-[#0B4F37] selection:text-white">
      {/* 1. Header */}
      <Header activePage="kamar" />

      {/* Toast Wishlist */}
      {favoriteToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-gray-900/90 px-5 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur-md transition-all">
          {favoriteToast}
        </div>
      )}

      {/* Toast Kontak Resepsionis */}
      {showContactToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#0B4F37] px-5 py-3.5 text-sm font-medium text-white shadow-2xl backdrop-blur-md">
          <PhoneCall className="h-5 w-5 text-emerald-300" />
          <span>Resepsionis Siaga: <strong>+62 21 555 7890</strong></span>
          <button onClick={() => setShowContactToast(false)} className="ml-2 text-white/70 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full flex-1">
        {/* HERO SECTION */}
        <section className="relative w-full bg-[#073524] py-20 lg:py-24 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
              alt="SiniBook Luxury Hotel Outer View"
              fill
              priority
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B4F37]/30 via-[#073524]/60 to-[#073524]" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-white">
              Pilihan Kamar & Suites
            </h1>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto font-light">
              Temukan akomodasi terbaik dengan ketersediaan fasilitas lengkap dan kenyamanan maksimal.
            </p>
          </div>
        </section>

        {/* SEARCH & FILTER BAR */}
        <section className="w-full bg-white border-b border-gray-200/80 py-6 sticky top-16 z-30 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kamar atau fasilitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-300 bg-gray-50 pl-10 pr-4 py-2.5 text-xs text-gray-900 transition-all focus:border-[#0B4F37] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4F37]/20"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <SlidersHorizontal className="h-4 w-4 text-gray-400 shrink-0 mr-1" />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-[#0B4F37] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* GRID KATALOG KAMAR */}
        <section className="w-full py-12 sm:py-16 md:py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {filteredRooms.length === 0 ? (
              <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-gray-200/80 max-w-lg mx-auto">
                <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-bold text-gray-900">Kamar Tidak Ditemukan</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Tidak ada kamar yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
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
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
                {filteredRooms.map((room) => {
                  const isFav = favoriteIds.includes(room.id);
                  return (
                    <div
                      key={room.id}
                      className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-200/80 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative"
                    >
                      {/* FOTO KAMAR & BADGE TIPE */}
                      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-100">
                        <Image
                          src={room.image}
                          alt={room.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* TOMBOL FAVORIT */}
                        <button
                          onClick={() => toggleFavorite(room.id, room.name)}
                          aria-label="Simpan ke Favorit"
                          className={`absolute top-4 left-4 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all hover:scale-110 active:scale-95 ${
                            isFav
                              ? "bg-rose-500 text-white"
                              : "bg-white/80 text-gray-600 hover:bg-white hover:text-rose-500"
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${isFav ? "fill-current" : ""}`} />
                        </button>

                        {/* BADGE TIPE KAMAR (Field `type` di Prisma) */}
                        <div className="absolute top-4 right-4 z-10">
                          <span className="rounded-full bg-[#0B4F37]/90 px-3.5 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-md border border-white/20">
                            {room.type}
                          </span>
                        </div>
                      </div>

                      {/* KONTEN DETAIL TEKS & HARGA KAMAR */}
                      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                        <div>
                          {/* Nama Kamar & Kapasitas */}
                          <div className="flex items-center justify-between gap-2">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 group-hover:text-[#0B4F37] transition-colors">
                              {room.name}
                            </h2>
                            <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded text-xs font-semibold text-[#0B4F37] shrink-0 border border-emerald-100">
                              <Users className="h-3.5 w-3.5 text-emerald-600" />
                              <span>{room.capacity} Tamu</span>
                            </div>
                          </div>

                          {/* Lokasi Kamar (Field `location` di Prisma) */}
                          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>{room.location}</span>
                          </div>

                          {/* LIST FASILITAS KAMAR (Field `facilities String[]` di Prisma) */}
                          <div className="mt-5 flex flex-wrap items-center gap-1.5 border-t border-b border-gray-100 py-3.5">
                            {room.facilities.map((fac, idx) => (
                              <span
                                key={idx}
                                className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800"
                              >
                                {fac}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* HARGA DAN TOMBOL AKSI */}
                        <div className="mt-6 flex items-end justify-between gap-4 pt-2">
                          <div>
                            <span className="block text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                              HARGA / MALAM
                            </span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="text-xl sm:text-2xl font-extrabold text-[#0B4F37]">
                                Rp {room.price_per_night.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>

                          <Link
                            href={`/kamar/${room.id}`}
                            className="rounded-full bg-[#0B4F37] px-6 py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-[#073524] hover:shadow-md"
                          >
                            Detail Kamar
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
