"use client"; // Client Component Next.js

import React from "react"; // Mengimpor React
import Image from "next/image"; // Mengimpor komponen Image dari Next.js untuk optimasi gambar
import { ArrowRight } from "lucide-react"; // Mengimpor ikon panah kanan

// Array data 6 fasilitas hotel lengkap dengan gambar dan deskripsi
const facilitiesData = [
  {
    id: 1,
    title: "Kolam Renang",
    description: "Kolam renang outdoor dengan pemandangan kota yang menakjubkan.",
    image: "/images/pool.png", // Menggunakan gambar hasil generate rooftop pool
  },
  {
    id: 2,
    title: "Restoran",
    description: "Menu kuliner khas nusantara dan hidangan internasional.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Fitness Center",
    description: "Peralatan gym modern dan lengkap untuk aktivitas olahraga harian.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Wi-Fi Kencang",
    description: "Akses internet berkecepatan tinggi gratis di seluruh area hotel.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Spa & Massage",
    description: "Layanan pijat relaksasi dan perawatan tubuh oleh terapis berpengalaman.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Ruang Rapat",
    description: "Ruang meeting modern dan terfasilitasi lengkap untuk bisnis Anda.",
    image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80",
  },
];

// Komponen FacilitiesSection: Menampilkan 6 kartu fasilitas hotel mewah
export default function FacilitiesSection() {
  return (
    // Section utama fasilitas hotel dengan latar belakang putih netral
    <section className="w-full bg-white py-16 sm:py-20" id="fasilitas">
      {/* Wrapper pembatas lebar konten */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION: Judul di kiri dan Link 'Lihat semua fasilitas' di kanan */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Fasilitas Hotel
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Nikmati fasilitas unggulan yang kami sediakan untuk kenyamanan menginap Anda.
            </p>
          </div>
          {/* Link Lihat Semua Fasilitas */}
          <a
            href="#semua-fasilitas"
            className="group flex items-center gap-1.5 text-sm font-semibold text-[#0B4F37] hover:text-[#073524]"
          >
            <span>Lihat semua fasilitas</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* GRID KARTU FASILITAS: 6 Kartu Fasilitas (2 baris x 3 kolom di desktop) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilitiesData.map((item) => (
            <div
              key={item.id}
              className="group relative h-64 overflow-hidden rounded-2xl bg-gray-900 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* GAMBAR BACKGROUND KARTU FASILITAS */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* OVERLAY GRADIENT DARK: Agar teks judul dan penjelasan terlihat jelas */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* TEKS INFORMASI FASILITAS DIBAGIAN BAWAH KARTU */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                {/* Judul Fasilitas */}
                <h3 className="text-xl font-bold tracking-tight group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>
                {/* Penjelasan Ringkas Fasilitas */}
                <p className="mt-1 text-xs text-gray-200 line-clamp-2 font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
