"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  MapPin,
  ArrowRight,
  Sparkles,
  Building2,
} from "lucide-react";

// Interface disamakan 100% dengan Prisma Schema (model resources)
interface ResourceRoom {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  price_per_night: number;
  facilities: string[];
  image: string; // dari relation room_images
}

// Data Dummy Kamar (Sesuai persis dengan kolom pada Prisma Schema model `resources`)
const recommendedRooms: ResourceRoom[] = [
  {
    id: "deluxe-ocean-view",
    name: "Deluxe Ocean View",
    type: "Deluxe",
    location: "Gedung Utama - Lantai 5",
    capacity: 2,
    price_per_night: 850000,
    facilities: ["Free Wi-Fi", "Sarapan Gratis", "Balkon Laut", "Bathtub"],
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "executive-suite",
    name: "Executive King Suite",
    type: "Suite",
    location: "Wing Barat - Lantai 8",
    capacity: 3,
    price_per_night: 1350000,
    facilities: ["Free Wi-Fi", "Sarapan Gratis", "Lounge Access", "Smart TV"],
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "family-presidential-suite",
    name: "Family Presidential Suite",
    type: "Presidential",
    location: "Penthouse - Lantai 12",
    capacity: 5,
    price_per_night: 2100000,
    facilities: ["Free Wi-Fi", "Sarapan Gratis", "Dapur Mini", "Jacuzzi Private"],
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
  },
];

export default function RecommendedRoomsSection() {
  return (
    <section className="w-full bg-slate-50 py-16 sm:py-24" id="kamar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-700 uppercase mb-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Pilihan Kamar Terbaik</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Kamar Favorit & Recommended
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Nikmati fasilitas terbaik dan kenyamanan kamar berbintang di SiniBook Hotel.
            </p>
          </div>

          {/* Tombol Lihat Semua Kamar */}
          <Link
            href="/kamar"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B4F37] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#073524] hover:shadow-md self-start sm:self-auto"
          >
            <span>Lihat Semua Kamar</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* GRID KARTU KAMAR REKOMENDASI */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recommendedRooms.map((room) => (
            <div
              key={room.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-200/80 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              {/* GAMBAR KAMAR & BADGE TIPE */}
              <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay Soft Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Badge Tipe Kamar (Field `type` di Prisma) */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                  <span className="rounded-full bg-[#0B4F37] px-3 py-1 text-xs font-bold text-white shadow-md">
                    {room.type}
                  </span>
                </div>
              </div>

              {/* KONTEN KARTU KAMAR */}
              <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                <div>
                  {/* Informasi Kapasitas & Lokasi (Field `capacity` & `location` di Prisma) */}
                  <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2.5">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-emerald-600" />
                      {room.capacity} Tamu
                    </span>
                    <span className="flex items-center gap-1 text-gray-400 truncate max-w-[170px]">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{room.location}</span>
                    </span>
                  </div>

                  {/* Nama Kamar (Field `name` di Prisma) */}
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0B4F37] transition-colors">
                    {room.name}
                  </h3>

                  {/* Badges Fasilitas (Field `facilities String[]` di Prisma) */}
                  <div className="mt-4 flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">
                    {room.facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                {/* KAKI KARTU: HARGA & TOMBOL BOOKING (Field `price_per_night` di Prisma) */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Harga / Malam
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-extrabold text-[#0B4F37]">
                        Rp {room.price_per_night.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Pesan */}
                  <Link
                    href={`/kamar`}
                    className="rounded-xl bg-[#0B4F37] px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#073524] hover:shadow-md active:scale-95"
                  >
                    Pesan Kamar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
