"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  SquaresFour, 
  UsersThree, 
  Key, 
  CalendarCheck, 
  SignOut,
  Buildings
} from "@phosphor-icons/react";
import CustomModal from "@/components/CustomModal";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

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
    const storedRole = localStorage.getItem("userRole") || "user";
    const storedName = localStorage.getItem("userName") || "Pengguna";
    setRole(storedRole);
    setUserName(storedName);
  }, []);

  const handleLogoutClick = () => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Konfirmasi Keluar",
      message: "Apakah Anda yakin ingin keluar dari panel ini?",
      onConfirm: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        setModal({
          isOpen: true,
          type: "success",
          title: "Logout Berhasil",
          message: "Anda telah berhasil keluar dari akun.",
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
      <aside className="flex h-screen w-64 flex-col bg-[#0F172A] text-slate-200 border-r border-slate-800 hidden md:flex sticky top-0 font-sans">
        {/* LOGO */}
        <div className="flex h-20 items-center px-6 border-b border-slate-800/80">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <Image src="/images/icon.png" alt="SiniBook Logo" width={110} height={40} className="object-contain" />
          </Link>
        </div>

        {/* PROFIL SINGKAT */}
        <div className="px-6 py-5 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-semibold text-sm uppercase shadow-sm">
              {userName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <p className="text-[11px] text-slate-400 font-medium capitalize">{role} Panel</p>
            </div>
          </div>
        </div>

        {/* NAVIGASI MENU */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase mb-3">Menu Utama</p>
          <ul className="space-y-1">
            {menus.map((menu) => {
              const isActive = pathname === menu.href;
              const Icon = menu.icon;
              return (
                <li key={menu.name}>
                  <Link
                    href={menu.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm font-semibold"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                    }`}
                  >
                    <Icon weight={isActive ? "bold" : "duotone"} className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                    {menu.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogoutClick}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-950/30 hover:text-rose-300"
          >
            <SignOut weight="duotone" className="h-5 w-5" />
            Keluar Panel
          </button>
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
