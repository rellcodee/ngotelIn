"use client";

import React from "react";
import {
  Wifi,
  Waves,
  Utensils,
  Dumbbell,
  Sparkles,
  Clock,
  Briefcase,
  Car,
  Building2,
  ShieldCheck,
} from "lucide-react";

// Daftar fasilitas hotel (Sesuai dengan struktur data String[] pada Prisma Schema: facilities String[])
const facilitiesList = [
  {
    name: "Kolam Renang",
    icon: Waves,
    description: "Kolam renang outdoor dengan pemandangan lanskap kota.",
  },
  {
    name: "Restoran & Bar",
    icon: Utensils,
    description: "Sajian kuliner nusantara dan mancanegara kelas dunia.",
  },
  {
    name: "Fitness Center",
    icon: Dumbbell,
    description: "Peralatan gym modern dan area latihan terpadu.",
  },
  {
    name: "Wi-Fi Kencang",
    icon: Wifi,
    description: "Koneksi internet berkecepatan tinggi gratis di seluruh area.",
  },
  {
    name: "Spa & Massage",
    icon: Sparkles,
    description: "Perawatan tubuh relaksasi oleh terapis profesional.",
  },
  {
    name: "Layanan 24 Jam",
    icon: Clock,
    description: "Layanan kamar dan resepsionis siaga penuh 24 jam.",
  },
  {
    name: "Ruang Rapat",
    icon: Briefcase,
    description: "Ruang meeting dan fasilitas konvensi bisnis lengkap.",
  },
  {
    name: "Parkir Gratis",
    icon: Car,
    description: "Area parkir luas dan aman dengan fasilitas valet.",
  },
];

export default function FacilitiesSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20" id="fasilitas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-[#0B4F37] border border-emerald-200/80 mb-3">
            <Building2 className="h-3.5 w-3.5 text-[#0B4F37]" />
            <span>Fasilitas Hotel</span>
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Fasilitas Unggulan SiniBook
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Fasilitas terintegrasi yang tersedia secara langsung dalam layanan kamar dan area hotel.
          </p>
        </div>

        {/* GRID KARTU FASILITAS (Kartu Ikon Modern tanpa ketergantungan URL Gambar individual) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {facilitiesList.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/70 bg-emerald-50/30 p-6 transition-all duration-300 hover:border-emerald-300 hover:bg-white hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B4F37] text-white shadow-md transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-[#0B4F37] transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 pt-3 border-t border-gray-100">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Tersedia untuk Tamu</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
