"use client"; // Client Component di Next.js App Router untuk interaktivitas modal & navigasi

import React, { useState } from "react"; // Mengimpor React dan useState untuk mengelola state halaman
import Image from "next/image"; // Komponen Image Next.js untuk optimasi loading gambar kamar
import Link from "next/link"; // Komponen Link Next.js untuk berpindah ke halaman detail kamar
import { Search, X, SlidersHorizontal, PhoneCall } from "lucide-react"; // Mengimpor ikon-ikon modern dari Lucide React

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

// Placeholder image jika kamar dari DB belum punya foto
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80";

import { useEffect, useMemo } from "react";

const formatRoomType = (str: string) => {
  if (!str) return "";
  if (str.toLowerCase() === "semua") return "Semua";
  return str
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
export default function KamarPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [showContactToast, setShowContactToast] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [visibleCount, setVisibleCount] = useState(6);
  const [roomsData, setRoomsData] = useState<RoomItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);



  // Derive unique categories from fetched rooms
  const dynamicCategories = useMemo(() => {
    const types = new Set(roomsData.map((room) => formatRoomType(room.type)));
    return ["Semua", ...Array.from(types)];
  }, [roomsData]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3001/resources");
        const json = await response.json();

        if (response.ok) {
          const dataArray = Array.isArray(json) ? json : json.data || [];
          const formattedRooms: RoomItem[] = dataArray.map(
            (room: RoomItem & { room_images?: { image_url: string }[] }) => ({
              id: room.id,
              name: room.name,
              type: room.type,
              location: room.location,
              capacity: room.capacity,
              price_per_night: room.price_per_night,
              facilities: room.facilities || [],
              image:
                room.room_images && room.room_images.length > 0
                  ? room.room_images[0].image_url
                  : FALLBACK_IMAGE,
            }),
          );
          setRoomsData(formattedRooms);
        }
      } catch (error) {
        console.error("Gagal mengambil data kamar", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const filteredRooms = roomsData.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.facilities.some((f) =>
        f.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "Semua" || formatRoomType(room.type) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const paginatedRooms = useMemo(() => {
    return filteredRooms.slice(0, visibleCount);
  }, [filteredRooms, visibleCount]);

  return (
    <div className="min-h-screen bg-surface-bright font-body-md text-on-surface selection:bg-primary selection:text-on-primary">
      {/* 1. Header */}
      <Header activePage="kamar" />

      {/* Toast Kontak Resepsionis */}
      {showContactToast && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-3 rounded-2xl bg-primary px-5 py-3.5 text-sm font-medium text-on-primary shadow-2xl backdrop-blur-md">
          <PhoneCall className="h-5 w-5 text-secondary-fixed" />
          <span>
            Resepsionis Siaga: <strong>+62 21 555 7890</strong>
          </span>
          <button
            onClick={() => setShowContactToast(false)}
            className="ml-2 text-on-primary/70 hover:text-on-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full flex-1">
        {/* HERO SECTION */}
        <section className="relative w-full pt-28 md:pt-32 lg:pt-36 pb-12 bg-surface-bright flex flex-col items-center px-4 md:px-8">
          <div className="relative w-full max-w-container-max mx-auto rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-surface-container-high min-h-[300px] md:min-h-[420px] flex items-center justify-center shadow-lg group">
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
                alt="SiniBook Luxury Hotel Outer View"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                priority
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12 py-12 flex flex-col items-center">
              <h1 className="font-display-xl text-[36px] sm:text-[44px] md:text-[52px] lg:text-[68px] text-white font-bold leading-[1.1] tracking-tight drop-shadow-md">
                Pilihan Kamar & Suites
              </h1>
              <p className="mt-5 font-body-lg text-[15px] sm:text-[16px] md:text-[18px] text-white/90 leading-relaxed max-w-2xl mx-auto font-light drop-shadow-sm">
                Temukan akomodasi premium dengan fasilitas lengkap. Didesain
                khusus untuk memberikan pengalaman menginap terbaik dan tak
                terlupakan bagi Anda.
              </p>
            </div>
          </div>
        </section>

        {/* SEARCH & FILTER BAR */}
        <section className="w-full max-w-container-max mx-auto px-4 md:px-8 mb-6 sticky top-[100px] md:top-[104px] z-30">
          <div className="bg-surface rounded-2xl py-4 px-5 md:px-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between shadow-sm border border-surface-container-low">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Cari kamar atau fasilitas..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(rowsPerPage);
                }}
                className="w-full rounded-full border border-surface-container-high bg-white pl-12 pr-5 py-3 text-[14px] text-on-surface transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none flex-1 lg:flex-initial">
                <SlidersHorizontal className="h-5 w-5 text-on-surface-variant shrink-0 mr-2 hidden sm:block" />
                {dynamicCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setVisibleCount(rowsPerPage);
                    }}
                    className={`rounded-full px-5 py-2.5 text-[14px] font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2 shrink-0 border-l border-surface-container-high pl-4">
                <span className="text-[14px] text-on-surface-variant font-medium hidden sm:block">Tampil:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    const newRows = Number(e.target.value);
                    setRowsPerPage(newRows);
                    setVisibleCount(newRows);
                  }}
                  className="bg-surface border border-surface-container-high rounded-full px-3 py-1.5 text-[14px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={9999}>Semua</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* GRID KATALOG KAMAR */}
        <section className="w-full pb-16 md:pb-20 bg-surface-bright">
          <div className="mx-auto max-w-container-max px-4 md:px-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="rounded-3xl bg-surface p-12 text-center shadow-sm border border-surface-container-low max-w-lg mx-auto">
                <Search className="mx-auto h-12 w-12 text-on-surface-variant mb-3" />
                <h3 className="font-headline-sm text-on-surface">
                  Kamar Tidak Ditemukan
                </h3>
                <p className="mt-2 text-[14px] text-on-surface-variant">
                  Tidak ada kamar yang cocok dengan kata kunci &quot;
                  {searchQuery}&quot;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Semua");
                    setVisibleCount(rowsPerPage);
                  }}
                  className="mt-6 rounded-full bg-primary px-6 py-2.5 text-[14px] font-bold text-on-primary shadow-sm hover:bg-primary/90 transition-all"
                >
                  Reset Filter Pencarian
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
                {paginatedRooms.map((room) => {
                  return (
                    <Link
                      href={`/kamar/${room.id}`}
                      key={room.id}
                      className="group flex flex-col rounded-3xl bg-surface-container-lowest overflow-hidden border border-surface-container shadow-sm hover:shadow-[0_20px_40px_rgba(14,47,118,0.08)] hover:border-primary-container/50 hover:-translate-y-1.5 transition-all duration-500 relative cursor-pointer"
                    >
                      {/* FOTO KAMAR & OVERLAY */}
                      <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden">
                        <Image
                          src={
                            room.image.startsWith("http")
                              ? room.image
                              : `http://localhost:3001${room.image}`
                          }
                          alt={room.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                        {/* NAMA & TIPE KAMAR */}
                        <div className="absolute bottom-space-md left-space-md text-on-primary">
                          <h3 className="font-headline-sm text-headline-sm text-on-primary">
                            {room.name}
                          </h3>
                          <p className="font-label-sm text-label-sm text-primary-fixed-dim">
                            {formatRoomType(room.type)}
                          </p>
                        </div>
                      </div>

                      {/* KONTEN DETAIL: KAPASITAS, LOKASI & FASILITAS */}
                      <div className="p-space-lg flex flex-col flex-1 gap-space-md">
                        <div className="grid grid-cols-2 gap-space-sm mb-space-xs">
                          <div className="flex items-center gap-space-2xs text-on-surface-variant">
                            <span className="material-symbols-outlined text-[18px]">
                              group
                            </span>
                            <span className="font-body-sm text-body-sm">
                              {room.capacity} Tamu
                            </span>
                          </div>
                          <div className="flex items-center gap-space-2xs text-on-surface-variant">
                            <span className="material-symbols-outlined text-[18px]">
                              location_on
                            </span>
                            <span className="font-body-sm text-body-sm truncate">
                              {room.location}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-space-2xs mt-auto">
                          {room.facilities.slice(0, 3).map((fac, idx) => (
                            <span
                              key={idx}
                              className="px-space-xs py-space-2xs rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm border border-surface-container-high"
                            >
                              {fac}
                            </span>
                          ))}
                          {room.facilities.length > 3 && (
                            <span className="px-space-xs py-space-2xs rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm border border-surface-container-high">
                              +{room.facilities.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* HARGA DAN TOMBOL AKSI */}
                      <div className="px-space-lg pb-space-lg pt-space-md border-t border-surface-container flex items-center justify-between">
                        <div>
                          <span className="block font-label-sm text-label-sm text-secondary uppercase mb-space-2xs">
                            Mulai Dari
                          </span>
                          <div className="flex items-baseline gap-space-2xs">
                            <span className="font-headline-sm text-headline-sm text-primary">
                              Rp {room.price_per_night.toLocaleString("id-ID")}
                            </span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              /mlm
                            </span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 group-hover:-rotate-45 shadow-sm group-hover:shadow-[0_8px_16px_rgba(14,47,118,0.25)]">
                          <span className="material-symbols-outlined text-[20px]">
                            arrow_forward
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* LOAD MORE BUTTON */}
              {visibleCount < filteredRooms.length && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + rowsPerPage)}
                    className="px-8 py-3 rounded-full border border-surface-container-high text-on-surface hover:bg-surface-container transition-all font-bold text-[14px] shadow-sm hover:shadow-md"
                  >
                    Tampilkan Lebih Banyak
                  </button>
                </div>
              )}
              </>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
