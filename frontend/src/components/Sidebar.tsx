"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Users, 
  Key, 
  CalendarCheck, 
  LogOut,
  Building2
} from "lucide-react";
import CustomModal from "@/components/CustomModal";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [role, setRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [modal, setModal] = useState({
    isOpen: false,
    type: "confirm" as "success" | "error" | "warning" | "info" | "confirm",
    title: "",
    message: "",
    onConfirm: undefined as (() => void) | undefined,
    onClose: () => {},
  });

  useEffect(() => {
    // Membaca data dari localStorage saat di-mount (Client-side only)
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

  // Menentukan menu berdasarkan role
  const adminMenus = [
    { name: "Dashboard Utama", href: "/admin", icon: LayoutDashboard },
    { name: "Kelola Kamar", href: "/admin/kamar", icon: Key },
    { name: "Kelola Pengguna", href: "/admin/pengguna", icon: Users },
    { name: "Daftar Reservasi", href: "/admin/reservasi", icon: CalendarCheck },
  ];

  const staffMenus = [
    { name: "Dashboard Staff", href: "/staff", icon: LayoutDashboard },
    { name: "Status Kamar", href: "/staff/kamar", icon: Key },
    { name: "Daftar Reservasi", href: "/staff/reservasi", icon: CalendarCheck },
  ];

  const menus = role === "admin" ? adminMenus : staffMenus;

  return (
    <>
      <div className="flex h-screen w-64 flex-col bg-[#073524] text-white shadow-xl hidden md:flex sticky top-0">
        {/* LOGO */}
        <div className="flex h-20 items-center px-6 border-b border-emerald-800/50">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
             <Image src="/images/icon.png" alt="SiniBook Logo" width={110} height={40} className="object-contain" />
          </Link>
        </div>

        {/* PROFIL SINGKAT */}
        <div className="px-6 py-6 border-b border-emerald-800/50">
           <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 text-[#073524] font-bold text-lg uppercase shadow-[0_0_10px_rgba(52,211,153,0.4)]">
                {userName.charAt(0)}
             </div>
             <div>
                <p className="text-sm font-bold text-white truncate max-w-[120px]">{userName}</p>
                <p className="text-xs text-emerald-300 font-medium uppercase tracking-wider">{role}</p>
             </div>
           </div>
        </div>

        {/* NAVIGASI MENU */}
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-2">
            {menus.map((menu) => {
              const isActive = pathname === menu.href;
              const Icon = menu.icon;
              return (
                <li key={menu.name}>
                  <Link
                    href={menu.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-emerald-600/30 text-emerald-100 border border-emerald-500/30 shadow-inner" 
                        : "text-emerald-100/70 hover:bg-emerald-800/40 hover:text-white"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-emerald-400" : "text-emerald-300/50"}`} />
                    {menu.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t border-emerald-800/50">
          <button
            onClick={handleLogoutClick}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-300 transition-all hover:bg-rose-500/10 hover:text-white border border-transparent hover:border-rose-500/30"
          >
            <LogOut className="h-5 w-5" />
            Keluar Panel
          </button>
        </div>
      </div>

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
