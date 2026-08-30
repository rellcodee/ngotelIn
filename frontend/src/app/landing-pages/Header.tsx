"use client"; // Menandakan bahwa komponen ini adalah Client Component di Next.js (bisa menggunakan interactivity/state)

import React, { useState, useEffect } from "react"; // Mengimpor React, useState, dan useEffect
import Link from "next/link"; // Mengimpor komponen Link dari Next.js untuk navigasi antar halaman tanpa reload
import { Building2, Menu, X, LayoutDashboard } from "lucide-react"; // Mengimpor ikon logo, hamburger menu, dan tombol tutup dari lucide-react
import Image from "next/image"; // Mengimpor komponen Image dari Next.js untuk optimasi gambar
import CustomModal from "@/components/CustomModal";

interface HeaderProps {
  activePage?: "home" | "kamar" | string; // Prop opsional untuk menentukan halaman mana yang sedang aktif
}


// Komponen Header: Menampilkan navigasi utama di bagian teratas halaman website SiniBook Hotel
export default function Header({ activePage = "home" }: HeaderProps) {
  // State untuk melacak apakah menu navigasi versi mobile sedang terbuka atau tertutup
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    type: "confirm" as "success" | "error" | "warning" | "info" | "confirm",
    title: "",
    message: "",
    onConfirm: undefined as (() => void) | undefined,
    onClose: () => {},
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    if (token) {
      setIsLoggedIn(true);
      setUserName(name || "Member");
    }
  }, []);

  const handleLogoutClick = () => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Konfirmasi Keluar",
      message: "Apakah Anda yakin ingin keluar dari akun Anda?",
      onConfirm: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        setIsLoggedIn(false);
        setUserName("");
        setModal({
          isOpen: true,
          type: "success",
          title: "Logout Berhasil",
          message: "Anda telah berhasil keluar dari akun.",
          onConfirm: undefined,
          onClose: () => {
            setModal(prev => ({ ...prev, isOpen: false }));
            window.location.href = "/";
          }
        });
      },
      onClose: () => {
        setModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    // Container utama Navbar dengan warna background Hijau Tua (#0B4F37) khas SiniBook Hotel
    <header className="sticky top-0 z-50 w-full bg-[#0B4F37] text-white shadow-md">
      {/* Wrapper pembatas lebar konten dengan padding horizontal */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* SECTION LOGO: Menampilkan logo SiniBook Hotel di sebelah kiri */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* Kotak latar ikon logo dengan warna hijau terang yang memberikan aksen modern */}
          <Image src="/images/icon.png" alt="Logo" width={120} height={100} />
        </Link>

        {/* SECTION NAVIGASI DESKTOP: Menampilkan menu navigasi utama (persis sesuai screenshot desain) */}
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
          <a href="/#fasilitas" className="text-sm font-medium text-emerald-100/90 transition-colors hover:text-white cursor-pointer">
            Fasilitas
          </a>
          {/* Link Tentang Hotel */}
          <a href="/#tentang-kami" className="text-sm font-medium text-emerald-100/90 transition-colors hover:text-white cursor-pointer">
            Tentang Hotel
          </a>
          {/* Link Kontak */}
          <a href="/#kontak" className="text-sm font-medium text-emerald-100/90 transition-colors hover:text-white">
            Kontak
          </a>
        </nav>

        {/* SECTION TOMBOL AKSI (DESKTOP): Tombol Masuk & Daftar / User Profile & Logout */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard"
                className="group relative flex items-center gap-2.5 rounded-full bg-emerald-900/30 border border-emerald-500/30 px-3 py-1.5 transition-all duration-300 hover:bg-emerald-800/50 hover:border-emerald-400 hover:shadow-md cursor-pointer"
                title="Masuk ke Dashboard"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 text-[#073524] font-bold text-sm uppercase shadow-sm transition-transform duration-300 group-hover:scale-105">
                  {userName ? userName.charAt(0) : "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-emerald-300/80 leading-none mb-0.5 group-hover:text-emerald-200 transition-colors">
                    Dashboard
                  </span>
                  <span className="text-sm font-semibold text-white max-w-[100px] truncate leading-none">
                    {userName}
                  </span>
                </div>
                <div className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                  <LayoutDashboard className="h-3.5 w-3.5 text-emerald-300" />
                </div>
              </Link>
              <button
                onClick={handleLogoutClick}
                className="rounded-full border border-rose-400/40 px-4 py-1.5 text-sm font-semibold text-rose-300 transition-all hover:bg-rose-500/10 hover:border-rose-400 hover:text-white"
              >
                Keluar
              </button>
            </div>
          ) : (
            <>
              {/* Tombol Masuk (Bordered / Transparent style dengan warna hijau khas) */}
              <button className="rounded-full border border-emerald-400/60 px-5 py-1.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white">
                <Link href="/login">Masuk</Link>
              </button>
              {/* Tombol Daftar (Solid White Pill style dengan teks hijau tua) */}
              <button className="rounded-full bg-white px-5 py-1.5 text-sm font-bold text-[#0B4F37] shadow transition-all hover:bg-emerald-50 hover:shadow-md">
                <Link href="/register">Daftar</Link>
              </button>
            </>
          )}
        </div>

        {/* TOMBOL MENU MOBILE: Tombol hamburger untuk membuka/menutup menu di layar smartphone */}
        <div className="flex items-center gap-2 md:hidden">
          {isLoggedIn && (
            <Link 
              href="/dashboard"
              className="group flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md pl-1.5 pr-3 py-1.5 active:scale-95 transition-all hover:bg-white/20 shadow-sm"
            >
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-300 text-[#073524] font-bold text-xs uppercase shadow-[0_0_10px_rgba(52,211,153,0.4)]">
                {userName ? userName.charAt(0) : "U"}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white tracking-wide">Dashboard</span>
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-200 opacity-90" />
              </div>
            </Link>
          )}
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
              {isLoggedIn ? (
                <>
                  <Link 
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center justify-between rounded-xl bg-emerald-900/40 border border-emerald-700/50 p-3 transition-all hover:bg-emerald-800/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 text-[#073524] font-bold text-lg uppercase shadow-sm">
                        {userName ? userName.charAt(0) : "U"}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-medium text-emerald-300/80">Ke Dashboard</span>
                        <span className="text-base font-semibold text-white truncate max-w-[150px]">{userName}</span>
                      </div>
                    </div>
                    <LayoutDashboard className="h-5 w-5 text-emerald-400/70 group-hover:text-emerald-300 transition-colors" />
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="mt-1 w-full rounded-full border border-rose-400/40 py-2.5 text-center font-semibold text-rose-300 hover:bg-rose-500/10 hover:text-white"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <button className="w-full rounded-full border border-white/40 py-2.5 text-center font-medium text-white hover:bg-white/10">
                    <Link href="/login" className="block w-full h-full py-1">Masuk</Link>
                  </button>
                  <button className="w-full rounded-full bg-white py-2.5 text-center font-semibold text-[#0B4F37] hover:bg-emerald-50">
                    <Link href="/register" className="block w-full h-full py-1">Daftar</Link>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <CustomModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={modal.onClose}
      />
    </header>
  );
}

