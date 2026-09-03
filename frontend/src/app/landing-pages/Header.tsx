"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import CustomModal from "@/components/CustomModal";

interface HeaderProps {
  activePage?: "home" | "kamar" | string;
}

export default function Header({ activePage = "home" }: HeaderProps) {
  const [activeNav, setActiveNav] = useState(activePage);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevActivePage, setPrevActivePage] = useState(activePage);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  if (activePage !== prevActivePage) {
    setPrevActivePage(activePage);
    setActiveNav(activePage);
  }
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
      // eslint-disable-next-line
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
            setModal((prev) => ({ ...prev, isOpen: false }));
            window.location.href = "/";
          },
        });
      },
      onClose: () => {
        setModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-gutter-mobile lg:px-gutter-desktop pt-space-xs">
      <div className="max-w-container-max mx-auto h-20 px-space-md lg:px-space-xl rounded-full bg-surface-bright/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] flex items-center justify-between gap-space-md">
        <Link href="/" className="flex items-center gap-space-sm group">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm transition-transform group-hover:scale-105">
            <Image
              src="/images/icon.png"
              alt="SiniBook Hotel Logo"
              width={28}
              height={28}
              className="h-6 w-auto object-contain"
            />
          </div>
          <span className="font-headline-sm text-headline-sm text-primary uppercase tracking-tight hidden sm:block">
            SiniBook
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-space-xs">
          <Link
            href="/"
            onClick={() => setActiveNav("home")}
            className={`px-space-md py-space-xs rounded-full transition-all font-label-lg text-label-lg ${
              activeNav === "home"
                ? "bg-primary-container text-on-primary font-bold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/kamar"
            onClick={() => setActiveNav("kamar")}
            className={`px-space-md py-space-xs rounded-full transition-all font-label-lg text-label-lg ${
              activeNav === "kamar"
                ? "bg-primary-container text-on-primary font-bold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            Kamar & Suites
          </Link>
          <Link
            href="/#fasilitas"
            onClick={() => setActiveNav("fasilitas")}
            className={`px-space-md py-space-xs rounded-full transition-all font-label-lg text-label-lg ${
              activeNav === "fasilitas"
                ? "bg-primary-container text-on-primary font-bold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            Fasilitas
          </Link>
          <Link
            href="/#tentang-kami"
            onClick={() => setActiveNav("tentang-kami")}
            className={`px-space-md py-space-xs rounded-full transition-all font-label-lg text-label-lg ${
              activeNav === "tentang-kami"
                ? "bg-primary-container text-on-primary font-bold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            Tentang Kami
          </Link>
          <Link
            href="/#kontak"
            onClick={() => setActiveNav("kontak")}
            className={`px-space-md py-space-xs rounded-full transition-all font-label-lg text-label-lg ${
              activeNav === "kontak"
                ? "bg-primary-container text-on-primary font-bold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            Kontak
          </Link>
        </nav>

        <div className="flex items-center gap-space-sm">
          {/* Desktop Right Action Area */}
          <div className="hidden md:flex items-center gap-space-sm">
            {isLoggedIn ? (
              <div className="relative group flex items-center">
                {/* Profile Button Trigger */}
                <button
                  className="flex items-center gap-space-xs bg-surface-container-lowest border border-outline-variant/30 px-1 py-1 pr-space-md rounded-full hover:bg-surface-container-low hover:border-outline-variant/60 transition-all focus:outline-none"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary font-bold text-sm uppercase shadow-sm">
                    {userName ? userName.charAt(0) : "U"}
                  </div>
                  <span className="font-label-md text-label-md text-on-surface max-w-[100px] truncate">
                    {userName}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-300 group-hover:-rotate-180 ml-1">
                    expand_more
                  </span>
                </button>

                {/* Dropdown Menu (Appears on Hover) */}
                <div className="absolute top-full right-0 mt-2 w-52 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col p-1.5 z-50">
                  <div className="px-3 py-2">
                    <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-1">Akun Saya</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px] text-primary">dashboard</span>
                    <span className="font-label-md text-label-md">Dashboard Profil</span>
                  </Link>
                  <div className="h-px bg-outline-variant/20 my-1 mx-2"></div>
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-error/10 text-error transition-colors w-full text-left"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    <span className="font-label-md text-label-md">Keluar Akun</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-space-sm">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center font-label-lg text-label-lg text-on-surface-variant hover:text-primary px-space-md py-space-xs transition-all"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center bg-primary hover:bg-on-surface text-on-primary font-label-lg text-label-lg px-space-lg py-space-xs rounded-full shadow-[0_4px_12px_rgba(14,47,118,0.25)] transition-all"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-24 inset-x-gutter-mobile bg-surface-bright rounded-2xl shadow-xl p-space-md flex flex-col gap-space-md lg:hidden border border-surface-container-highest">
          <nav className="flex flex-col gap-space-xs">
            <Link
              href="/"
              className={`rounded-xl px-space-md py-space-sm font-label-lg text-label-lg ${activeNav === "home" ? "bg-primary-container text-on-primary font-bold" : "text-on-surface hover:bg-surface-container"}`}
              onClick={() => { setActiveNav("home"); setIsMobileMenuOpen(false); }}
            >
              Beranda
            </Link>
            <Link
              href="/kamar"
              className={`rounded-xl px-space-md py-space-sm font-label-lg text-label-lg ${activeNav === "kamar" ? "bg-primary-container text-on-primary font-bold" : "text-on-surface hover:bg-surface-container"}`}
              onClick={() => { setActiveNav("kamar"); setIsMobileMenuOpen(false); }}
            >
              Kamar & Suites
            </Link>
            <Link
              href="/#fasilitas"
              className={`rounded-xl px-space-md py-space-sm font-label-lg text-label-lg ${activeNav === "fasilitas" ? "bg-primary-container text-on-primary font-bold" : "text-on-surface hover:bg-surface-container"}`}
              onClick={() => { setActiveNav("fasilitas"); setIsMobileMenuOpen(false); }}
            >
              Fasilitas
            </Link>
            <Link
              href="/#tentang-kami"
              className={`rounded-xl px-space-md py-space-sm font-label-lg text-label-lg ${activeNav === "tentang-kami" ? "bg-primary-container text-on-primary font-bold" : "text-on-surface hover:bg-surface-container"}`}
              onClick={() => { setActiveNav("tentang-kami"); setIsMobileMenuOpen(false); }}
            >
              Tentang Hotel
            </Link>
            <Link
              href="/#kontak"
              className={`rounded-xl px-space-md py-space-sm font-label-lg text-label-lg ${activeNav === "kontak" ? "bg-primary-container text-on-primary font-bold" : "text-on-surface hover:bg-surface-container"}`}
              onClick={() => { setActiveNav("kontak"); setIsMobileMenuOpen(false); }}
            >
              Kontak
            </Link>
          </nav>
          <div className="h-px bg-surface-container w-full" />
          <div className="flex flex-col gap-space-sm">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-space-md p-space-md rounded-xl bg-surface-container-lowest border border-surface-container"
                >
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">
                    {userName ? userName.charAt(0) : "U"}
                  </div>
                  <div>
                    <span className="block font-label-sm text-label-sm text-on-surface-variant">
                      Dashboard Member
                    </span>
                    <span className="block font-headline-sm text-on-surface">
                      {userName}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="w-full py-space-sm rounded-full border border-error/50 text-error font-label-lg hover:bg-error/10 transition-colors"
                >
                  Keluar Akun
                </button>
              </>
            ) : (
              <div className="flex gap-space-xs">
                <Link
                  href="/login"
                  className="flex-1 text-center py-space-sm rounded-full border border-outline-variant font-label-lg text-on-surface hover:bg-surface-container"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center py-space-sm rounded-full bg-primary-container text-on-primary font-label-lg hover:bg-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Daftar
                </Link>
              </div>
            )}
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
