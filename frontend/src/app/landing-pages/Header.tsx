"use client"; // Menandakan bahwa komponen ini adalah Client Component di Next.js (bisa menggunakan interactivity/state)

import React, { useState } from "react"; // Mengimpor React dan hook useState untuk mengelola state menu mobile
import Link from "next/link"; // Mengimpor komponen Link dari Next.js untuk navigasi antar halaman tanpa reload
import { Building2, Menu, X } from "lucide-react"; // Mengimpor ikon logo, hamburger menu, dan tombol tutup dari lucide-react

interface HeaderProps {
  activePage?: "home" | "kamar" | string; // Prop opsional untuk menentukan halaman mana yang sedang aktif
}

// Komponen Header: Menampilkan navigasi utama di bagian teratas halaman website SiniBook Hotel
export default function Header({ activePage = "home" }: HeaderProps) {
  // State untuk melacak apakah menu navigasi versi mobile sedang terbuka atau tertutup
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    // Container utama Navbar dengan warna background Hijau Tua (#0B4F37) khas SiniBook Hotel
    <header className="sticky top-0 z-50 w-full bg-[#0B4F37] text-white shadow-md">
      {/* Wrapper pembatas lebar konten dengan padding horizontal */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        
        {/* SECTION LOGO: Menampilkan logo SiniBook Hotel di sebelah kiri */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* Kotak latar ikon logo dengan warna hijau terang yang memberikan aksen modern */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#126E4E] text-white shadow-inner transition-transform group-hover:scale-105">
            {/* Ikon Gedung / Hotel */}
            <Building2 className="h-5 w-5" />
          </div>
          {/* Teks Nama Brand SiniBook */}
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            SiniBook
          </span>
        </Link>

        {/* SECTION NAVIGASI DESKTOP: Menampilkan menu navigasi utama (persis sesuai screenshot desain) */}
        <nav className="hidden items-center gap-7 md:flex">
          {/* Link Beranda */}
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-emerald-200 relative py-1 ${
              activePage === "home"
                ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400 after:rounded-full"
                : "text-emerald-100/90"
            }`}
          >
            Beranda
          </Link>
          {/* Link Kamar */}
          <Link
            href="/kamar"
            className={`text-sm font-medium transition-colors hover:text-emerald-200 relative py-1 ${
              activePage === "kamar"
                ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400 after:rounded-full"
                : "text-emerald-100/90"
            }`}
          >
            Kamar
          </Link>
          {/* Link Fasilitas */}
          <a href="/#fasilitas" className="text-sm font-medium text-emerald-100/90 transition-colors hover:text-white cursor-pointer">
            Fasilitas
          </a>
          {/* Link Tentang Hotel */}
          <a href="/#tentang-kami" className="text-sm font-medium text-emerald-100/90 transition-colors hover:text-white cursor-pointer">
            Tentang Hotel
          </a>
          {/* Link Promo */}
          <a href="/#promo" className="text-sm font-medium text-emerald-100/90 transition-colors hover:text-white">
            Promo
          </a>
          {/* Link Kontak */}
          <a href="/#kontak" className="text-sm font-medium text-emerald-100/90 transition-colors hover:text-white">
            Kontak
          </a>
        </nav>

        {/* SECTION TOMBOL AKSI (DESKTOP): Tombol Masuk & Daftar di sebelah kanan */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Tombol Masuk (Bordered / Transparent style dengan warna hijau khas) */}
          <button className="rounded-full border border-emerald-400/60 px-5 py-1.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white">
            Masuk
          </button>
          {/* Tombol Daftar (Solid White Pill style dengan teks hijau tua) */}
          <button className="rounded-full bg-white px-5 py-1.5 text-sm font-bold text-[#0B4F37] shadow transition-all hover:bg-emerald-50 hover:shadow-md">
            Daftar
          </button>
        </div>

        {/* TOMBOL MENU MOBILE: Tombol hamburger untuk membuka/menutup menu di layar smartphone */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Mengubah status buka/tutup menu mobile
            className="rounded-lg p-2 text-white hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {/* Tampilkan ikon X jika menu terbuka, atau ikon Hamburger Menu jika tertutup */}
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* NAVIGASI MOBILE (POPUP MENU): Tampil hanya ketika ikon hamburger di-klik pada layar kecil */}
      {isMobileMenuOpen && (
        <div className="border-t border-emerald-800 bg-[#073524] px-4 pt-3 pb-6 md:hidden">
          <div className="flex flex-col gap-3">
            {/* Link Navigasi versi mobile */}
            <Link href="/" className={`rounded-md px-3 py-2 text-base font-medium ${activePage === "home" ? "bg-[#0B4F37] text-white font-bold" : "text-emerald-100 hover:bg-[#0B4F37]"}`} onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
            <Link href="/kamar" className={`rounded-md px-3 py-2 text-base font-medium ${activePage === "kamar" ? "bg-[#0B4F37] text-white font-bold" : "text-emerald-100 hover:bg-[#0B4F37]"}`} onClick={() => setIsMobileMenuOpen(false)}>Kamar</Link>
            <a href="/#fasilitas" className="rounded-md px-3 py-2 text-base font-medium text-emerald-100 hover:bg-[#0B4F37]" onClick={() => setIsMobileMenuOpen(false)}>Fasilitas</a>
            <a href="/#tentang-kami" className="rounded-md px-3 py-2 text-base font-medium text-emerald-100 hover:bg-[#0B4F37]" onClick={() => setIsMobileMenuOpen(false)}>Tentang Hotel</a>
            <a href="/#promo" className="rounded-md px-3 py-2 text-base font-medium text-emerald-100 hover:bg-[#0B4F37]" onClick={() => setIsMobileMenuOpen(false)}>Promo</a>
            <a href="/#kontak" className="rounded-md px-3 py-2 text-base font-medium text-emerald-100 hover:bg-[#0B4F37]" onClick={() => setIsMobileMenuOpen(false)}>Kontak</a>
            
            {/* Tombol aksi versi mobile */}
            <div className="mt-4 flex flex-col gap-2 pt-2 border-t border-emerald-800/60">
              <button className="w-full rounded-full border border-white/40 py-2.5 text-center font-medium text-white hover:bg-white/10">
                Masuk
              </button>
              <button className="w-full rounded-full bg-white py-2.5 text-center font-semibold text-[#0B4F37] hover:bg-emerald-50">
                Daftar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

