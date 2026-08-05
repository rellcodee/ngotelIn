"use client"; // Client Component Next.js

import React from "react"; // Mengimpor React
import Image from "next/image"; // Mengimpor komponen Image dari Next.js
import { Star, ArrowRight } from "lucide-react"; // Mengimpor ikon bintang rating dan panah kanan

// Array data 4 testimoni tamu yang pernah menginap di SiniBook Hotel
const testimonialsData = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "Pengusaha",
    rating: 5,
    comment: "Pelayanan sangat ramah, kamar bersih dan wangi. Kolam renang rooftop-nya menawarkan pemandangan kota Jakarta yang mengagumkan!",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    role: "Wisatawan",
    rating: 5,
    comment: "Proses check-in cepat dan mudah. Sarapan restoran hotelnya sangat variatif dengan cita rasa nusantara yang lezat sekali.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 3,
    name: "Deni Gunawan",
    role: "Pekerja Eksekutif",
    rating: 5,
    comment: "Fasilitas Wi-Fi sangat cepat dan stabil, sangat membantu untuk urusan pekerjaan dan meeting bisnis daring saya di kamar.",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 4,
    name: "Rini Pratama",
    role: "Keluarga",
    rating: 5,
    comment: "Tempat menginap terbaik untuk liburan keluarga akhir pekan. Anak-anak sangat senang bermain di kolam dan fasilitas spanya menenangkan.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
  },
];

// Komponen TestimonialSection: Menampilkan Ulasan dan Testimoni dari Tamu
export default function TestimonialSection() {
  return (
    // Section utama testimoni dengan background putih
    <section className="w-full bg-white py-16 sm:py-20">
      {/* Wrapper pembatas lebar konten */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION: Judul di kiri dan Link 'Lihat semua ulasan' di kanan */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Testimoni Tamu Kami
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Apa kata para tamu mengenai pengalaman menginap di SiniBook Hotel.
            </p>
          </div>
          {/* Link Lihat Semua Ulasan */}
          <a
            href="#semua-ulasan"
            className="group flex items-center gap-1.5 text-sm font-semibold text-[#0B4F37] hover:text-[#073524]"
          >
            <span>Lihat semua ulasan</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* GRID 4 KARTU TESTIMONI (4 Kolom side-by-side) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonialsData.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-gray-50/60 p-6 shadow-sm transition-all hover:border-emerald-200 hover:bg-white hover:shadow-md"
            >
              <div>
                {/* PROFIL TAMU: Foto Avatar & Nama Tamu */}
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[#0B4F37]/20">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-400">{item.role}</p>
                  </div>
                </div>

                {/* RATING 5 BINTANG KUNING */}
                <div className="mt-3 flex items-center gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* TEKS ULASAN TESTIMONI */}
                <p className="mt-3 text-xs sm:text-sm text-gray-600 italic leading-relaxed">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
