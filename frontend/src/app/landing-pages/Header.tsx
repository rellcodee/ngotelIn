"use client"; // Menandakan bahwa komponen ini adalah Client Component di Next.js (bisa menggunakan interactivity/state)

import React, { useState, useEffect } from "react"; // Mengimpor React dan hook
import Link from "next/link"; // Mengimpor komponen Link dari Next.js untuk navigasi antar halaman tanpa reload
import { Building2, Menu, X, User } from "lucide-react"; // Mengimpor ikon logo, hamburger menu, tombol tutup, dan user dari lucide-react

interface HeaderProps {
  activePage?: "home" | "kamar" | string; // Prop opsional untuk menentukan halaman mana yang sedang aktif
}

// Komponen Header: Menampilkan navigasi utama di bagian teratas halaman website SiniBook Hotel
export default function Header({ activePage = "home" }: HeaderProps) {
  // State untuk melacak apakah menu navigasi versi mobile sedang terbuka atau tertutup
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State untuk melacak data login user
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Mengecek status login dari localStorage saat komponen dimuat di browser
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode payload JWT token sederhana (Base64)
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        setUserEmail(payload.email);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Token tidak valid:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Handler untuk logout user
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserEmail(null);
    window.location.href = "/";
  };

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

        {/* SECTION NAVIGASI DESKTOP: Menampilkan menu navigasi utama */}
        <nav className="hidden items-center gap-7 md:flex">
          {/* Link Beranda */}
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-emerald-200 relative py-1 ${activePage === "home"
                ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400 after:rounded-full"
                : "text-emerald-100/90"
              }`}
          >
            Beranda
          </Link>
          {/* Link Kamar */}
          <Link
            href="/kamar"
            className={`text-sm font-medium transition-colors hover:text-emerald-200 relative py-1 ${activePage === "kamar"
                ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400 after:rounded-full"
                : "text-emerald-100/90"
              }`}
          >
            Kamar
          </Link>
          {/* Link Fasilitas */}
          <Link
            href="/fasilitas"
            className={`text-sm font-medium transition-colors hover:text-emerald-200 relative py-1 ${activePage === "fasilitas"
                ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400 after:rounded-full"
                : "text-emerald-100/90"
              }`}
          >
            Fasilitas
          </Link>
          {/* Link Tentang Hotel */}
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-emerald-200 relative py-1 ${activePage === "about"
                ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400 after:rounded-full"
                : "text-emerald-100/90"
              }`}
          >
            Tentang Hotel
          </Link>
          {/* Link Promo */}
          <Link
            href="/promo"
            className={`text-sm font-medium transition-colors hover:text-emerald-200 relative py-1 ${activePage === "promo"
                ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-400 after:rounded-full"
                : "text-emerald-100/90"
              }`}
          >
            Promo
          </Link>
          {/* Link Kontak */}
          <a href="/#kontak" className="text-sm font-medium text-emerald-100/90 transition-colors hover:text-white">
            Kontak
          </a>
        </nav>

        {/* SECTION TOMBOL AKSI (DESKTOP): Tombol Masuk & Daftar / Profil & Keluar */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {/* Profil Indicator */}
              <div className="flex items-center gap-2 rounded-full bg-emerald-800/50 border border-emerald-700/50 px-3.5 py-1 text-xs font-semibold text-emerald-100">
                <User className="h-3.5 w-3.5 text-emerald-400" />
                <span className="max-w-[120px] truncate">{userEmail}</span>
              </div>
              {/* Tombol Logout */}
              <button
                onClick={handleLogout}
                className="rounded-full border border-red-400/50 px-4 py-1.5 text-xs font-semibold text-red-200 transition-all hover:bg-red-500/10 hover:border-red-400 hover:text-white"
              >
                Keluar
              </button>
            </div>
          ) : (
            <>
              {/* Tombol Masuk */}
              <Link href="/login" className="rounded-full border border-emerald-400/60 px-5 py-1.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white">
                Masuk
              </Link>
              {/* Tombol Daftar */}
              <Link href="/register" className="rounded-full bg-white px-5 py-1.5 text-sm font-bold text-[#0B4F37] shadow transition-all hover:bg-emerald-50 hover:shadow-md">
                Daftar
              </Link>
            </>
          )}
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
            <Link href="/fasilitas" className={`rounded-md px-3 py-2 text-base font-medium ${activePage === "fasilitas" ? "bg-[#0B4F37] text-white font-bold" : "text-emerald-100 hover:bg-[#0B4F37]"}`} onClick={() => setIsMobileMenuOpen(false)}>Fasilitas</Link>
            <Link href="/about" className={`rounded-md px-3 py-2 text-base font-medium ${activePage === "about" ? "bg-[#0B4F37] text-white font-bold" : "text-emerald-100 hover:bg-[#0B4F37]"}`} onClick={() => setIsMobileMenuOpen(false)}>Tentang Hotel</Link>
            <Link href="/promo" className={`rounded-md px-3 py-2 text-base font-medium ${activePage === "promo" ? "bg-[#0B4F37] text-white font-bold" : "text-emerald-100 hover:bg-[#0B4F37]"}`} onClick={() => setIsMobileMenuOpen(false)}>Promo</Link>
            <a href="/#kontak" className="rounded-md px-3 py-2 text-base font-medium text-emerald-100 hover:bg-[#0B4F37]" onClick={() => setIsMobileMenuOpen(false)}>Kontak</a>

            {/* Tombol aksi versi mobile */}
            <div className="mt-4 flex flex-col gap-2 pt-2 border-t border-emerald-800/60">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-950 px-4 py-2.5 text-sm text-emerald-100">
                    <User className="h-4 w-4 text-emerald-400" />
                    <span className="truncate">{userEmail}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full rounded-full border border-red-500/40 py-2.5 text-center font-medium text-red-200 hover:bg-red-500/10"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="w-full rounded-full border border-white/40 py-2.5 text-center font-medium text-white hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>
                    Masuk
                  </Link>
                  <Link href="/register" className="w-full rounded-full bg-white py-2.5 text-center font-semibold text-[#0B4F37] hover:bg-emerald-50" onClick={() => setIsMobileMenuOpen(false)}>
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

