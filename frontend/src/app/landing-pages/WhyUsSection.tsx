"use client"; // Menandakan Client Component di Next.js

import React from "react"; // Mengimpor library React
import { MapPin, BedDouble, ShieldCheck, UserCheck, Lock, Building } from "lucide-react"; // Mengimpor ikon keunggulan dari lucide-react

// Array data 5 keunggulan utama NgotelIn
const whyUsData = [
  {
    id: 1,
    icon: MapPin, // Ikon Lokasi Strategis
    title: "Lokasi Strategis",
    description: "Dekat pusat kota dan akses transportasi mudah.",
  },
  {
    id: 2,
    icon: BedDouble, // Ikon Kamar Nyaman
    title: "Kamar Nyaman",
    description: "Kasur empuk dengan seprai berkualitas premium.",
  },
  {
    id: 3,
    icon: ShieldCheck, // Ikon Kebersihan Terjamin
    title: "Kebersihan Terjamin",
    description: "Kamar selalu steril dan bersih setiap hari.",
  },
  {
    id: 4,
    icon: UserCheck, // Ikon Staf Profesional
    title: "Staf Profesional",
    description: "Siap membantu 24 jam dengan ramah dan cekatan.",
  },
  {
    id: 5,
    icon: Lock, // Ikon Keamanan 24 Jam
    title: "Keamanan 24 Jam",
    description: "Akses kunci kartu digital dan pengawasan CCTV.",
  },
];

// Komponen WhyUsSection: Menampilkan keunggulan hotel NgotelIn dengan 5 kolom ikon & penjelasan
export default function WhyUsSection() {
  return (
    // Section pembungkus utama dengan warna latar belakang soft green tint (#F4F8F5)
    <section className="w-full bg-[#F4F8F5] py-16 sm:py-20">
      {/* Wrapper pembatas lebar konten */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION: Judul, Subtitle, dan Badge Ikon di Pojok Kanan */}
        <div className="flex items-center justify-between mb-12">
          <div className="max-w-2xl">
            {/* Judul Utama Section Mengapa Memilih NgotelIn */}
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Mengapa Memilih NgotelIn?
            </h2>
            {/* Subtitle Penjelasan */}
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Berbagai keunggulan yang membuat pengalaman menginap Anda makin istimewa.
            </p>
          </div>

          {/* BADGE IKON MELAYANG (Right Top Badge): Sesuai dengan elemen hijau bulat di desain */}
          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B4F37] text-white shadow-lg">
            <Building className="h-6 w-6" />
          </div>
        </div>

        {/* BARIS 5 KEUNGGULAN (5 Grid Columns) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {whyUsData.map((item) => {
            const IconComponent = item.icon; // Mengambil komponen ikon dinamis
            return (
              <div
                key={item.id}
                className="group flex flex-col items-center text-center rounded-2xl bg-white p-6 shadow-sm border border-emerald-100/60 transition-all hover:border-[#0B4F37] hover:shadow-md hover:-translate-y-1"
              >
                {/* Latar Belakang Bulat Ikon Keunggulan */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-[#0B4F37] transition-colors group-hover:bg-[#0B4F37] group-hover:text-white">
                  <IconComponent className="h-7 w-7" />
                </div>

                {/* Judul Keunggulan */}
                <h3 className="mt-4 text-base font-bold text-gray-900">
                  {item.title}
                </h3>

                {/* Deskripsi Keunggulan */}
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
