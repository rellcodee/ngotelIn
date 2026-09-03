"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  CalendarBlank, 
  User, 
  Bed, 
  MagnifyingGlass, 
  Tag, 
  ArrowCounterClockwise, 
  ForkKnife, 
  WifiHigh, 
  Clock, 
  X, 
  CheckCircle 
} from "@phosphor-icons/react";

export default function HeroSection() {
  const [checkInDate, setCheckInDate] = useState("2024-05-20");
  const [checkOutDate, setCheckOutDate] = useState("2024-05-21");
  const [guests, setGuests] = useState("2 Dewasa");
  const [rooms, setRooms] = useState("1 Kamar");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchModalOpen(true);
  };

  return (
    <section className="relative w-full min-h-[600px] overflow-hidden bg-slate-950 text-white flex flex-col justify-between font-sans">
      {/* BACKGROUND IMAGE */}
      <Image
        src="/images/hero-hotel.png"
        alt="SiniBook Hotel"
        fill
        priority
        className="object-cover object-center z-0 opacity-40"
      />

      {/* OVERLAY GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/40 z-10" />

      {/* HERO CONTENT */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        
        {/* HEADINGS */}
        <div className="max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
            Reservasi Kamar Hotel Nyaman & Praktis
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
            Temukan berbagai pilihan tipe kamar dengan fasilitas lengkap untuk keperluan bisnis maupun liburan keluarga.
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="mt-10">
          <form
            onSubmit={handleSearch}
            className="rounded-xl bg-white p-3.5 sm:p-4 shadow-lg text-slate-800 border border-slate-200"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 items-center">

              {/* CHECK-IN */}
              <div className="flex flex-col rounded-lg border border-slate-200 p-2.5 bg-slate-50/80 hover:border-blue-500 transition-colors">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">CHECK-IN</span>
                <div className="mt-1 flex items-center gap-2">
                  <CalendarBlank weight="duotone" className="h-4 w-4 text-blue-600 shrink-0" />
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* CHECK-OUT */}
              <div className="flex flex-col rounded-lg border border-slate-200 p-2.5 bg-slate-50/80 hover:border-blue-500 transition-colors">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">CHECK-OUT</span>
                <div className="mt-1 flex items-center gap-2">
                  <CalendarBlank weight="duotone" className="h-4 w-4 text-blue-600 shrink-0" />
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* TAMU */}
              <div className="flex flex-col rounded-lg border border-slate-200 p-2.5 bg-slate-50/80 hover:border-blue-500 transition-colors">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">TAMU</span>
                <div className="mt-1 flex items-center gap-2">
                  <User weight="duotone" className="h-4 w-4 text-blue-600 shrink-0" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="1 Dewasa">1 Dewasa</option>
                    <option value="2 Dewasa">2 Dewasa</option>
                    <option value="3 Dewasa">3 Dewasa</option>
                    <option value="Keluarga (2 Dewasa, 2 Anak)">Keluarga (2 Dewasa, 2 Anak)</option>
                  </select>
                </div>
              </div>

              {/* KAMAR */}
              <div className="flex flex-col rounded-lg border border-slate-200 p-2.5 bg-slate-50/80 hover:border-blue-500 transition-colors">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">KAMAR</span>
                <div className="mt-1 flex items-center gap-2">
                  <Bed weight="duotone" className="h-4 w-4 text-blue-600 shrink-0" />
                  <select
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="1 Kamar">1 Kamar</option>
                    <option value="2 Kamar">2 Kamar</option>
                    <option value="3 Kamar">3 Kamar</option>
                    <option value="4+ Kamar">4+ Kamar</option>
                  </select>
                </div>
              </div>

              {/* BUTTON */}
              <div className="sm:col-span-2 lg:col-span-1">
                <button
                  type="submit"
                  className="flex h-full min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 active:scale-98"
                >
                  <MagnifyingGlass weight="bold" className="h-4 w-4" />
                  <span>Cari Kamar</span>
                </button>
              </div>

            </div>
          </form>
        </div>

        {/* FEATURE PILLS */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 text-white">
          <div className="flex items-center gap-2.5 rounded-lg bg-slate-900/60 p-2.5 border border-slate-800 backdrop-blur-xs">
            <Tag weight="duotone" className="h-5 w-5 text-blue-400 shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white">Harga Terbaik</h4>
              <p className="text-[10px] text-slate-400">Jaminan harga jujur</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg bg-slate-900/60 p-2.5 border border-slate-800 backdrop-blur-xs">
            <ArrowCounterClockwise weight="duotone" className="h-5 w-5 text-blue-400 shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white">Bisa Pembatalan</h4>
              <p className="text-[10px] text-slate-400">Syarat & ketentuan berlaku</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg bg-slate-900/60 p-2.5 border border-slate-800 backdrop-blur-xs">
            <ForkKnife weight="duotone" className="h-5 w-5 text-blue-400 shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white">Pilihan Sarapan</h4>
              <p className="text-[10px] text-slate-400">Tersedia per kamar</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg bg-slate-900/60 p-2.5 border border-slate-800 backdrop-blur-xs">
            <WifiHigh weight="duotone" className="h-5 w-5 text-blue-400 shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white">Wi-Fi Kamar</h4>
              <p className="text-[10px] text-slate-400">Koneksi stabil</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg bg-slate-900/60 p-2.5 border border-slate-800 backdrop-blur-xs col-span-2 sm:col-span-1">
            <Clock weight="duotone" className="h-5 w-5 text-blue-400 shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white">Layanan Reception</h4>
              <p className="text-[10px] text-slate-400">24 jam siaga</p>
            </div>
          </div>
        </div>

      </div>

      {/* SEARCH MODAL */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-fade-in text-slate-900 font-sans">
          <div className="relative w-full max-w-sm rounded-xl bg-white p-5 shadow-xl border border-slate-200">
            <button
              onClick={() => setIsSearchModalOpen(false)}
              className="absolute top-3.5 right-3.5 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-2.5">
                <CheckCircle weight="duotone" className="h-6 w-6" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Kriteria Pencarian
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Detail tanggal & kapasitas kamar yang kamu pilih:
              </p>

              <div className="mt-4 w-full rounded-lg bg-slate-50 p-3 text-left border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex justify-between border-b border-slate-200/60 pb-1">
                  <span className="text-slate-500">Check-in:</span>
                  <span className="font-semibold text-slate-900">{checkInDate}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1">
                  <span className="text-slate-500">Check-out:</span>
                  <span className="font-semibold text-slate-900">{checkOutDate}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1">
                  <span className="text-slate-500">Tamu:</span>
                  <span className="font-semibold text-slate-900">{guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kamar:</span>
                  <span className="font-semibold text-slate-900">{rooms}</span>
                </div>
              </div>

              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
