"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  SquaresFour, 
  UsersThree, 
  Key, 
  CalendarCheck, 
  SignOut,
  Sparkle,
  ChartPie
} from "@phosphor-icons/react";
import CustomModal from "@/components/CustomModal";

export default function Sidebar() {
  const pathname = usePathname();

  const [role, setRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const [modal, setModal] = useState({
    isOpen: false,
    type: "confirm" as "success" | "error" | "warning" | "info" | "confirm",
    title: "",
    message: "",
    onConfirm: undefined as (() => void) | undefined,
    onClose: () => { },
  });

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") || "admin";
    const storedName = localStorage.getItem("userName") || "Super Admin";
    setRole(storedRole);
    setUserName(storedName);
  }, []);

  const handleLogoutClick = () => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Konfirmasi Keluar",
      message: "Apakah Anda yakin ingin keluar dari panel admin?",
      onConfirm: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        setModal({
          isOpen: true,
          type: "success",
          title: "Logout Berhasil",
          message: "Anda telah keluar dari akun.",
          onConfirm: undefined,
          onClose: () => {
            setModal(prev => ({ ...prev, isOpen: false }));
            window.location.href = "/login";
          }
        });
      },
      onClose: () => {
        setModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const adminMenus = [
    { name: "Dashboard Utama", href: "/admin", icon: SquaresFour },
    { name: "Kelola Kamar", href: "/admin/kamar", icon: Key },
    { name: "Kelola Pengguna", href: "/admin/pengguna", icon: UsersThree },
    { name: "Daftar Reservasi", href: "/admin/reservasi", icon: CalendarCheck },
  ];

  const staffMenus = [
    { name: "Dashboard Staff", href: "/staff", icon: SquaresFour },
    { name: "Status Kamar", href: "/staff/kamar", icon: Key },
    { name: "Daftar Reservasi", href: "/staff/reservasi", icon: CalendarCheck },
  ];

  const menus = role === "admin" ? adminMenus : staffMenus;

  return (
    <>
      <aside className="flex h-screen w-72 flex-col bg-gradient-to-b from-[#001a52] via-[#08205c] to-[#041238] text-slate-200 border-r border-slate-800/60 hidden md:flex sticky top-0 font-sans shadow-2xl z-30 select-none">
        {/* BRAND LOGO HEADER */}
        <div className="flex h-24 items-center justify-between px-7 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 border border-white/20 shadow-md">
              <Image 
                src="/images/icon.png" 
                alt="SiniBook Logo" 
                width={26}
                height={26}
                className="h-6 w-auto object-contain brightness-0 invert drop-shadow-md" 
                priority
              />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-wider uppercase font-headline">SiniBook</span>
              <span className="block text-[9px] text-blue-200 font-semibold tracking-widest uppercase">Admin Portal</span>
            </div>
          </Link>
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </div>

        {/* PROFIL RINGKAS ADMIN / STAFF */}
        <div className="px-6 py-5 border-b border-white/10 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 text-white font-extrabold text-base shadow-lg border border-white/30">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#001a52]" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white truncate tracking-wide">{userName}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Sparkle weight="fill" className="h-3 w-3 text-amber-400" />
                <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider capitalize">
                  {role} Panel
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGASI MENU UTAMA (JOBIE CURVED STYLE) */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 scrollbar-none">
          <p className="px-4 text-[11px] font-bold tracking-widest text-blue-300/60 uppercase mb-4">
            Menu Utama
          </p>
          <ul className="space-y-2">
            {menus.map((menu) => {
              const isActive = pathname === menu.href;
              const Icon = menu.icon;
              return (
                <li key={menu.name}>
                  <Link
                    href={menu.href}
                    className={`relative flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-white text-[#001a52] shadow-[0_8px_20px_rgba(0,0,0,0.15)] font-extrabold translate-x-1"
                        : "text-slate-300 hover:bg-white/10 hover:text-white hover:translate-x-1"
                    }`}
                  >
                    <Icon 
                      weight={isActive ? "bold" : "regular"} 
                      className={`h-5 w-5 transition-transform ${isActive ? "text-[#001a52] scale-110" : "text-blue-300/80"}`} 
                    />
                    <span className="tracking-wide">{menu.name}</span>

                    {/* Active Curved Indicator Dot */}
                    {isActive && (
                      <span className="absolute right-3.5 h-2.5 w-2.5 rounded-full bg-[#001a52] shadow-xs" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* LOGOUT & FOOTER */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button
            onClick={handleLogoutClick}
            className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-3">
              <SignOut weight="bold" className="h-5 w-5 text-rose-400" />
              <span>Keluar Panel</span>
            </div>
            <span className="text-[10px] font-mono bg-rose-500/20 px-2 py-0.5 rounded-full text-rose-200">ALT+Q</span>
          </button>
          <div className="mt-4 text-center">
            <p className="text-[10px] text-slate-400 font-medium">SiniBook Hotel Management v2.4</p>
            <p className="text-[9px] text-slate-500 mt-0.5">Crafted with ❤️ for SiniBook</p>
          </div>
        </div>
      </aside>

      <CustomModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={modal.onClose}
      />
    </>
  );
}

