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
  X,
  SearchX,
  Building2,
  ChevronLeft,
  ChevronRight,
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


  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const allImages = room ? [room.heroImage, ...room.gallery] : [];

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
              ? roomImages.slice(1).map((img: { image_url: string }) => img.image_url)
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

  // Handle navigasi keyboard untuk Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => 
          prev !== null ? (prev + 1) % allImages.length : null
        );
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => 
          prev !== null ? (prev - 1 + allImages.length) % allImages.length : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, allImages.length]);



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
      <div className="min-h-screen bg-surface-bright flex flex-col font-body-md text-on-surface">
        <Header activePage="kamar" />
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-on-surface-variant text-[14px] font-medium">
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
      <div className="min-h-screen bg-surface-bright font-body-md text-on-surface flex flex-col">
        <Header activePage="kamar" />

        <main className="flex-1 flex items-center justify-center p-6 pt-32">
          <div className="rounded-3xl bg-surface p-10 sm:p-12 text-center shadow-sm border border-surface-container-low max-w-lg w-full">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-error mb-4 shadow-inner">
              <SearchX className="h-8 w-8" />
            </div>
            <h1 className="font-headline-sm text-on-surface">
              Maaf, Tipe Kamar Tidak Ditemukan
            </h1>
            <p className="mt-2 text-[14px] text-on-surface-variant leading-relaxed">
              Tipe kamar dengan ID{" "}
              <code className="bg-surface-container-high px-2 py-0.5 rounded text-error font-semibold">
                {roomId}
              </code>{" "}
              tidak tersedia.
            </p>
            <Link
              href="/kamar"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-bold text-on-primary shadow-sm transition-all hover:bg-primary/90"
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
    <div className="min-h-screen bg-surface-bright font-body-md text-on-surface selection:bg-primary selection:text-on-primary">
      <Header activePage="kamar" />



      <main className="w-full pb-20 pt-24">
        {/* BREADCRUMB */}
        <div className="bg-surface-bright border-b border-surface-container py-4">
          <div className="mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link
              href="/kamar"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[14px] font-bold text-on-primary shadow-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:scale-95 group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Kembali ke Katalog Kamar</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-[13px] text-on-surface-variant font-medium">
              <Link href="/" className="hover:text-on-surface">
                Beranda
              </Link>
              <span>/</span>
              <Link href="/kamar" className="hover:text-on-surface">
                Kamar
              </Link>
              <span>/</span>
              <span className="text-primary font-bold">{room.name}</span>
            </div>
          </div>
        </div>

        {/* CONTAINER UTAMA DETAIL KAMAR */}
        <div className="mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 pt-8">
          {/* GALERI FOTO KAMAR (Prisma relation: room_images) */}
          <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div 
              className="relative h-80 sm:h-96 lg:col-span-2 overflow-hidden rounded-[1.5rem] bg-surface-container-high shadow-sm cursor-pointer group"
              onClick={() => setLightboxIndex(0)}
            >
              <Image
                src={room.heroImage}
                alt={room.name}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {room.gallery.slice(0, 2).map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-40 sm:h-44 overflow-hidden rounded-[1.5rem] bg-surface-container-high shadow-sm cursor-pointer group"
                  onClick={() => setLightboxIndex(idx + 1)}
                >
                  <Image
                    src={img}
                    alt={`${room.name} gallery ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* JUDUL, HIGHLIGHTS, DAN AKSI PEMESANAN */}
          <div className="flex flex-col lg:flex-row lg:items-stretch lg:justify-between gap-8 border-b border-surface-container pb-8 mt-4">
            
            {/* KOLOM KIRI: IDENTITAS & INFO KAMAR */}
            <div className="flex flex-col gap-6">
              {/* Judul & Tipe */}
              <div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary px-3.5 py-1 text-[12px] font-semibold text-on-primary capitalize">
                    {room.type}
                  </span>
                  <span className="flex items-center gap-1 text-[13px] font-medium text-on-surface-variant">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{room.location}</span>
                  </span>
                </div>
                <h1 className="mt-2.5 font-display-lg text-[32px] sm:text-[40px] text-on-surface font-bold tracking-tight leading-none">
                  {room.name}
                </h1>
              </div>

              {/* Highlights (Kapasitas & Lokasi) */}
              <div className="flex flex-wrap items-center gap-8 sm:gap-20">
                <div className="flex items-center gap-4">
                  <Users className="w-6 h-6 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
                      Kapasitas
                    </span>
                    <span className="font-bold text-on-surface text-[15px]">
                      {room.capacity} Tamu
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-10 bg-surface-container"></div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
                      Lokasi
                    </span>
                    <span className="font-bold text-on-surface text-[15px]">
                      {room.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN: HARGA & TOMBOL PESAN */}
            <div className="flex flex-col justify-between lg:items-end gap-5 lg:min-w-[280px] lg:py-1">
              <div className="text-left lg:text-right">
                <span className="block text-[11px] uppercase font-bold text-on-surface-variant tracking-wider">
                  HARGA / MALAM
                </span>
                <div className="flex items-baseline gap-1 mt-0.5 justify-start lg:justify-end">
                  <span className="font-headline-lg text-[24px] sm:text-[32px] font-bold text-primary leading-none">
                    Rp {room.price_per_night.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
              <button
                onClick={handleBookingAttempt}
                className="flex items-center justify-center rounded-full bg-primary px-10 py-3.5 text-[15px] font-bold text-on-primary shadow-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 active:scale-95 w-full"
              >
                Pesan Kamar Ini
              </button>
            </div>

          </div>

          {/* KONTEN UTAMA DETAIL KAMAR */}
          <div className="mt-8 w-full pb-16">
            
            {/* GRID 2 KOLOM UNTUK DESKRIPSI & FASILITAS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              
              {/* KOLOM KIRI: TENTANG KAMAR INI (CARD) */}
              {room.description && (
                <section className="rounded-[2rem] border border-surface-container bg-surface-container-lowest p-8 md:p-10 shadow-sm flex flex-col h-full transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 hover:border-primary/20 group">
                  <h2 className="font-display-sm text-[24px] font-bold text-on-surface mb-6 pb-6 border-b border-surface-container flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-primary" />
                    Tentang Kamar Ini
                  </h2>
                  <p className="text-[15px] text-on-surface-variant leading-relaxed whitespace-pre-line flex-grow">
                    {room.description}
                  </p>
                </section>
              )}

              {/* KOLOM KANAN: FASILITAS KAMAR (CARD) */}
              <section className="rounded-[2rem] border border-surface-container bg-surface-container-lowest p-8 md:p-10 shadow-sm flex flex-col h-full transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 hover:border-primary/20">
                <h2 className="font-display-sm text-[24px] font-bold text-on-surface mb-6 pb-6 border-b border-surface-container flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  Fasilitas Kamar
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow content-start">
                  {room.facilities.map((facility, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-surface-container-lowest border border-surface-container hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm transition-all duration-300 cursor-default"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-[14px] font-medium text-on-surface transition-colors group-hover:text-primary">
                        {facility}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      {/* MODAL LIGHTBOX GAMBAR */}
      {lightboxIndex !== null && room && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition-all"
          >
            <X className="h-6 w-6" />
          </button>

          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex - 1 + allImages.length) % allImages.length);
              }}
              className="absolute left-4 sm:left-10 z-50 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-3 transition-all"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          <div 
            className="relative w-full max-w-6xl aspect-[4/3] sm:aspect-video rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[lightboxIndex]}
              alt={`Gallery image ${lightboxIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex + 1) % allImages.length);
              }}
              className="absolute right-4 sm:right-10 z-50 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-3 transition-all"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
          
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 pointer-events-none">
             {allImages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${idx === lightboxIndex ? "bg-white w-8" : "bg-white/40"}`}
                />
             ))}
          </div>
        </div>
      )}

      {/* MODAL SYARAT LOGIN */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-surface-bright p-6 sm:p-8 text-center shadow-2xl border border-surface-container-high relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full p-1 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Lock className="h-7 w-7" />
            </div>

            <h3 className="font-headline-sm text-[20px] text-on-surface">
              Silakan Masuk Terlebih Dahulu
            </h3>
            <p className="mt-2 text-[14px] text-on-surface-variant leading-relaxed font-normal">
              Untuk melakukan pemesanan kamar{" "}
              <strong className="text-on-surface">{room.name}</strong>, Anda
              harus masuk ke akun SiniBook Anda.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full rounded-full bg-primary py-3.5 text-[14px] font-bold text-on-primary shadow-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                Masuk ke Akun
              </Link>
              <Link
                href="/register"
                className="w-full rounded-full border border-outline py-3.5 text-[14px] font-bold text-on-surface transition-all duration-300 hover:bg-surface-container hover:shadow-sm hover:-translate-y-0.5 active:scale-95"
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
