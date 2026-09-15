"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { 
  MagnifyingGlass, 
  Bell, 
  ChatTeardropText, 
  User, 
  Sparkle,
  SignOut,
  House,
  CheckCircle,
  Clock,
  CaretDown
} from "@phosphor-icons/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminName, setAdminName] = useState("Super Admin");
  const [searchQuery, setSearchQuery] = useState("");

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [showMsgPopover, setShowMsgPopover] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    const storedName = localStorage.getItem("userName");

    if (!token) {
      router.push("/login");
      return;
    }

    if (role !== "admin") {
      router.push("/");
      return;
    }

    if (storedName) {
      setAdminName(storedName);
    }

    setIsAuthorized(true);
  }, [router]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifPopover(false);
      }
      if (msgRef.current && !msgRef.current.contains(e.target as Node)) {
        setShowMsgPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#001a52] text-white font-medium">
        <div className="flex items-center gap-3 bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-md border border-white/20">
          <div className="h-6 w-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
          <span className="font-semibold text-sm">Memverifikasi Hak Akses Admin SiniBook...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7FA] font-sans selection:bg-[#001a52] selection:text-white">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER BAR (JOBIE DASHBOARD STYLE WITH SINIBOOK THEME) */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between bg-white/85 backdrop-blur-xl px-6 lg:px-10 border-b border-slate-200/80 shadow-xs">
          {/* LEFT: Search Bar */}
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kamar, reservasi, atau nama tamu..."
                className="w-full rounded-2xl bg-slate-100/90 py-2.5 pl-11 pr-4 text-xs lg:text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#001a52]/30 border border-slate-200/80 transition-all shadow-xs"
              />
              <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* RIGHT: Notifications, Messages & Profile */}
          <div className="flex items-center gap-3 lg:gap-5">
            {/* Quick Messages Badge Popover */}
            <div className="relative" ref={msgRef}>
              <button 
                onClick={() => {
                  setShowMsgPopover(!showMsgPopover);
                  setShowNotifPopover(false);
                  setShowProfileMenu(false);
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition-all cursor-pointer border border-slate-200/60"
              >
                <ChatTeardropText className="h-5 w-5 text-slate-700" />
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#001a52] text-[9px] font-extrabold text-white shadow-xs">
                  18
                </span>
              </button>

              {showMsgPopover && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900">Pesan Masuk (18 Baru)</h4>
                    <span className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">Tandai Dibaca</span>
                  </div>
                  <div className="space-y-3 mt-3 max-h-60 overflow-y-auto">
                    {[
                      { sender: "Budi Santoso", msg: "Apakah kamar Suite 109 ready besok?", time: "10 mnt lalu" },
                      { sender: "Siti Rahma", msg: "Permintaan tambahan sarapan pagi", time: "25 mnt lalu" },
                      { sender: "Dewi Anggraini", msg: "Konfirmasi pembayaran VA Mandiri", time: "1 jam lalu" }
                    ].map((m, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-[#001a52] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {m.sender.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 leading-tight">{m.sender}</p>
                          <p className="text-[11px] text-slate-500 truncate">{m.msg}</p>
                          <span className="text-[9px] text-slate-400">{m.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Bell Popover */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => {
                  setShowNotifPopover(!showNotifPopover);
                  setShowMsgPopover(false);
                  setShowProfileMenu(false);
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition-all cursor-pointer border border-slate-200/60"
              >
                <Bell className="h-5 w-5 text-slate-700" />
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white shadow-xs animate-pulse">
                  52
                </span>
              </button>

              {showNotifPopover && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900">Notifikasi Sistem (52)</h4>
                    <span className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">Bersihkan</span>
                  </div>
                  <div className="space-y-3 mt-3 max-h-60 overflow-y-auto">
                    {[
                      { title: "Booking Baru #BK-882", desc: "Standard Room - Rp 400.000", status: "emerald" },
                      { title: "Pembayaran Settled Midtrans", desc: "Booking #BK-879 terkonfirmasi", status: "blue" },
                      { title: "Kamar Suite 102 Maintenance", desc: "Dikelola oleh Staff Housekeeping", status: "amber" }
                    ].map((n, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                        <CheckCircle className={`h-5 w-5 shrink-0 mt-0.5 text-${n.status}-600`} weight="fill" />
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-tight">{n.title}</p>
                          <p className="text-[11px] text-slate-500">{n.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vertical Separator */}
            <div className="h-8 w-px bg-slate-200" />

            {/* Profile Widget & Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifPopover(false);
                  setShowMsgPopover(false);
                }}
                className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 p-1.5 pr-3.5 rounded-2xl border border-slate-200/90 transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#001a52] to-blue-600 text-white font-extrabold text-sm shadow-sm">
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-extrabold text-slate-900 leading-tight">{adminName}</p>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    Super Admin
                  </span>
                </div>
                <CaretDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-14 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in duration-150">
                  <div className="p-3 bg-slate-50 rounded-xl mb-1 border border-slate-100">
                    <p className="text-xs font-extrabold text-slate-900">{adminName}</p>
                    <p className="text-[10px] text-slate-500">admin@sinibook.com</p>
                  </div>
                  <div className="space-y-0.5">
                    <Link 
                      href="/" 
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <House className="h-4 w-4 text-blue-600" />
                      <span>Kembali ke Website Utama</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                    >
                      <SignOut className="h-4 w-4 text-rose-600" />
                      <span>Keluar dari Akun</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN PAGE KONTEN */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10 scrollbar-thin scrollbar-thumb-slate-300">
          {children}
        </main>
      </div>
    </div>
  );
}


