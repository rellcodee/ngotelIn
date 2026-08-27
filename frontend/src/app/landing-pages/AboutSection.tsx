"use client"; // Menandakan Client Component untuk interaksi tombol video

import React, { useState } from "react"; // Mengimpor React dan useState
import Image from "next/image"; // Mengimpor komponen Image dari Next.js
import { Check, Play, X } from "lucide-react"; // Mengimpor ikon centang, play, dan tutup modal video

// Komponen AboutSection: Blok informasi utama tentang SiniBook Hotel (Profil, Keunggulan & Video Tour)
export default function AboutSection() {
  // State untuk melacak apakah modal video promo sedang diputar
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    // Section utama tentang kami dengan latar belakang container warna Hijau Tua (#0B4F37)
    <section className="w-full bg-[#0B4F37] py-16 sm:py-20 text-white" id="tentang-kami">
      {/* Wrapper pembatas lebar konten */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Grid 2 kolom: Kiri Teks Informasi, Kanan Video Preview */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* KOLOM KIRI: TEKS INFORMASI TENTANG SINIBOOK HOTEL */}
          <div>
            {/* Judul Utama Section Tentang SiniBook Hotel */}
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-white">
              Tentang SiniBook Hotel
            </h2>

            {/* Paragraf Penjelasan Profil Hotel */}
            <p className="mt-4 text-sm sm:text-base text-emerald-100/90 leading-relaxed font-light">
              SiniBook Hotel merupakan hotel bintang 4 yang berlokasi di pusat kota Jakarta. Kami berkomitmen memberikan pengalaman menginap terbaik dengan fasilitas modern dan kenyamanan maksimal bagi para tamu.
            </p>



            {/* GRID 4 POIN KEUNGGULAN (2x2 Grid) */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Poin 1: Layanan Kamar 24 Jam */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-emerald-50">Layanan Kamar 24 Jam</span>
              </div>

              {/* Poin 2: Restoran & Bar Mewah */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-emerald-50">Restoran & Bar Mewah</span>
              </div>

              {/* Poin 3: Kolam Renang Outdoor */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-emerald-50">Kolam Renang Outdoor</span>
              </div>

              {/* Poin 4: Pengalaman Memuaskan */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-emerald-50">Pengalaman Memuaskan</span>
              </div>
            </div>

          </div>

          {/* KOLOM KANAN: PREVIEW VIDEO HOTEL DENGAN TOMBOL PLAY */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-emerald-600/30">
            <div className="relative h-[320px] sm:h-[380px] w-full">
              {/* Gambar thumbnail interior lobi hotel */}
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
                alt="SiniBook Hotel Video Preview"
                fill
                className="object-cover"
              />

              {/* Overlay gelap di atas gambar video */}
              <div className="absolute inset-0 bg-black/30 transition-opacity hover:bg-black/20" />

              {/* TOMBOL PLAY MELAYANG DITENGAH VIDEO */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsVideoModalOpen(true)} // Membuka modal video saat diklik
                  className="group flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-[#0B4F37] shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95"
                  aria-label="Putar Video Hotel"
                >
                  {/* Ikon Play dengan sedikit margin offset agar center secara visual */}
                  <Play className="h-8 w-8 fill-current ml-1 transition-transform group-hover:scale-110" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* POPUP MODAL VIDEO (Apabila pengguna mengklik tombol Play Video) */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl">
            {/* Tombol Tutup Video */}
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/40"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Video Player Embed / Frame */}
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="SiniBook Hotel Video Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
