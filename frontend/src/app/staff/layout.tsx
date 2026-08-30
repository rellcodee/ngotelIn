"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token) {
      router.push("/login");
      return;
    }

    if (role !== "staff") {
      router.push("/");
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  if (!isAuthorized) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-emerald-800 font-medium">Memverifikasi akses staff...</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-[#0B4F37] selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header for Mobile */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
          <div className="text-lg font-bold text-[#0B4F37]">Staff Panel</div>
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
