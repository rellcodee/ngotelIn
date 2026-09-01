"use client"; // Client Component untuk mengelola rute dinamis detail kamar & modal booking

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Users,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Calendar,
  X,
  ShieldCheck,
  Heart,
  SearchX,
  Building2,
} from "lucide-react";

import Header from "../../landing-pages/Header";
import Footer from "../../landing-pages/Footer";

// Interface disamakan 100% dengan Prisma Schema (model resources + room_images)
interface RoomDetail {
  id: string;
  name: string;
  type: string;
  location: string;
  description?: string;
  capacity: number;
  price_per_night: number;
  facilities: string[];
  heroImage: string;
  gallery: string[];
}


import { useEffect } from "react";

export default function DetailKamarPage() {
  const params = useParams();
  const roomId = (params?.id as string) || "";

  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteToast, setFavoriteToast] = useState<string | null>(null);
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [checkInDate, setCheckInDate] = useState("2026-08-25");
  const [checkOutDate, setCheckOutDate] = useState("2026-08-27");
  const [guestCount, setGuestCount] = useState("2");

  useEffect(() => {
    if (!roomId) return;
    const fetchRoomDetail = async () => {
      try {
        const res = await fetch(`http://localhost:3001/resources/${roomId}`);
        const json = await res.json();
        const data = Array.isArray(json) ? json[0] : json.data || json;

        if (res.ok && data && data.id) {
          const roomImages = data.room_images || [];
          const hero =
            roomImages.length > 0
              ? roomImages[0].image_url
              : "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80";

          const gallery =
            roomImages.length > 1
              ? roomImages.slice(1).map((img: any) => img.image_url)
              : [
                  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
                ];

          setRoom({
            id: data.id,
            name: data.name,
            type: data.type || "Standard",
            location: data.location || "-",
            description: data.description,
            capacity: data.capacity || 2,
            price_per_night: data.price_per_night,
            facilities: data.facilities || [],
            heroImage: hero.startsWith("http")
              ? hero
              : `http://localhost:3001${hero}`,
            gallery: gallery.map((g: string) =>
              g.startsWith("http") ? g : `http://localhost:3001${g}`,
            ),
          });
        }
      } catch (err) {
        console.error("Gagal load detail kamar:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoomDetail();
  }, [roomId]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    setFavoriteToast(
      !isFavorite
        ? `❤️ Ditambahkan ke Kamar Favorit`
        : `Dihapus dari Kamar Favorit`,
    );
    setTimeout(() => setFavoriteToast(null), 3000);
  };

  const handleBookingAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/checkout");
    } else {
      setIsLoginModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
        <Header activePage="kamar" />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B4F37]"></div>
            <p className="text-gray-500 text-sm font-medium">
              Memuat detail kamar...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-gray-900 flex flex-col">
        <Header activePage="kamar" />

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="rounded-3xl bg-white p-10 sm:p-12 text-center shadow-xl border border-gray-200/80 max-w-lg w-full">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4 shadow-inner">
              <SearchX className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Maaf, Tipe Kamar Tidak Ditemukan
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed">
              Tipe kamar dengan ID{" "}
              <code className="bg-gray-100 px-2 py-0.5 rounded text-rose-600 font-semibold">
                {roomId}
              </code>{" "}
              tidak tersedia.
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-[#0B4F37] selection:text-white">
      <Header activePage="kamar" />

      {favoriteToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-gray-900/90 px-5 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur-md transition-all">
          {favoriteToast}
        </div>
      )}

      <main className="w-full pb-20">
        {/* BREADCRUMB */}
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
              <Link href="/" className="hover:text-gray-900">
                Beranda
              </Link>
              <span>/</span>
              <Link href="/kamar" className="hover:text-gray-900">
                Kamar
              </Link>
              <span>/</span>
              <span className="text-[#0B4F37] font-bold">{room.name}</span>
            </div>
          </div>
        </div>

        {/* CONTAINER UTAMA DETAIL KAMAR */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          {/* JUDUL UTAMA & HARGA */}
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between border-b border-gray-200 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#0B4F37] px-3.5 py-1 text-xs font-semibold text-white">
                  {room.type}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{room.location}</span>
                </span>
              </div>

              <div className="mt-2.5 flex items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  {room.name}
                </h1>

                <button
                  onClick={handleToggleFavorite}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                    isFavorite
                      ? "bg-rose-500 text-white border-rose-500"
                      : "bg-white text-gray-500 border-gray-300 hover:border-rose-400 hover:text-rose-500"
                  }`}
                  aria-label="Simpan ke Favorit"
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* BLOCK HARGA PER MALAM (Field `price_per_night` di Prisma) */}
            <div className="text-left md:text-right">
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                HARGA / MALAM
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0B4F37]">
                  Rp {room.price_per_night.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* GALERI FOTO KAMAR (Prisma relation: room_images) */}
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="relative h-80 sm:h-96 lg:col-span-2 overflow-hidden rounded-2xl bg-gray-100 shadow-md">
              <Image
                src={room.heroImage}
                alt={room.name}
                fill
                priority
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {room.gallery.slice(0, 2).map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-40 sm:h-44 overflow-hidden rounded-2xl bg-gray-100 shadow-sm"
                >
                  <Image
                    src={img}
                    alt={`${room.name} gallery ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* GRID DETAL TEKS KIRI & CARD FORM BOOKING KANAN */}
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* SPESIFIKASI KAPASITAS & LOKASI */}
              <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#0B4F37]" />
                  <span>Informasi Kamar</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-gray-700">
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3">
                    <Users className="h-5 w-5 text-emerald-600" />
                    <div>
                      <span className="block text-gray-400 text-[10px]">
                        Kapasitas Maksimal
                      </span>
                      <span className="font-bold text-gray-900">
                        {room.capacity} Tamu
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    <div>
                      <span className="block text-gray-400 text-[10px]">
                        Lokasi Kamar
                      </span>
                      <span className="font-bold text-gray-900">
                        {room.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DESKRIPSI KAMAR */}
              {room.description && (
                <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>Tentang Kamar Ini</span>
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {room.description}
                  </p>
                </div>
              )}

              {/* DAFTAR FASILITAS TERSEDIA (Field `facilities String[]` di Prisma) */}
              <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#0B4F37]" />
                  <span>Fasilitas Terdaftar di Kamar Ini</span>
                </h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {room.facilities.map((facility, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 text-xs text-gray-700"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD SIDEBAR FORM SIMULASI BOOKING KAMAR */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-3xl border border-gray-200/90 bg-white p-6 shadow-xl">
                <div className="border-b border-gray-100 pb-4 mb-5">
                  <span className="text-xs text-gray-400 font-medium">
                    Harga Per Malam
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-extrabold text-[#0B4F37]">
                      Rp {room.price_per_night.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleBookingAttempt} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Tanggal Check-in</span>
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-medium text-gray-900 focus:border-[#0B4F37] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Tanggal Check-out</span>
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-medium text-gray-900 focus:border-[#0B4F37] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Jumlah Tamu</span>
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-medium text-gray-900 focus:border-[#0B4F37] focus:outline-none"
                    >
                      <option value="1">1 Orang</option>
                      <option value="2">2 Orang</option>
                      <option value="3">3 Orang</option>
                      <option value="4">4 Orang</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#0B4F37] py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-[#073524] hover:shadow-lg active:scale-95 mt-2"
                  >
                    Pesan Kamar Ini
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL SYARAT LOGIN */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-[#0B4F37] mb-4">
              <Lock className="h-7 w-7" />
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Silakan Masuk Terlebih Dahulu
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
              Untuk melakukan pemesanan kamar{" "}
              <strong className="text-gray-900">{room.name}</strong>, Anda harus
              masuk ke akun SiniBook Anda.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/login"
                className="w-full rounded-full bg-[#0B4F37] py-3 text-xs font-bold text-white shadow hover:bg-[#073524]"
              >
                Masuk ke Akun
              </Link>
              <Link
                href="/register"
                className="w-full rounded-full border border-gray-300 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Daftar Akun Baru
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
