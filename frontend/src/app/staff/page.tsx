"use client";

import React from "react";
import { Key, CalendarCheck, CheckCircle2, Clock } from "lucide-react";

export default function StaffDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Staff</h1>
        <p className="text-gray-500 mt-1">Pantau jadwal hari ini dan pastikan kenyamanan tamu.</p>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: "Check-in Hari Ini", value: "8", icon: CalendarCheck, color: "text-emerald-600", bg: "bg-emerald-100/50" },
          { name: "Check-out Hari Ini", value: "5", icon: Clock, color: "text-amber-600", bg: "bg-amber-100/50" },
          { name: "Kamar Perlu Dibersihkan", value: "3", icon: Key, color: "text-rose-600", bg: "bg-rose-100/50" },
          { name: "Tugas Selesai", value: "12", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-100/50" },
        ].map((stat) => (
          <div key={stat.name} className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 transition-transform hover:-translate-y-1">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Content Area placeholder */}
      <div className="mt-8 rounded-2xl bg-white p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 min-h-[400px] flex flex-col items-center justify-center border-dashed border-2">
        <CalendarCheck className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-600">Daftar Kedatangan</h3>
        <p className="text-gray-400 text-sm mt-1 text-center max-w-sm">Tabel daftar kedatangan tamu hari ini akan muncul di sini.</p>
      </div>
    </div>
  );
}
