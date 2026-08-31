"use client";

import React from "react";

export default function StaffReservasiPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kelola Reservasi</h1>
          <p className="text-gray-500 mt-1">Atur status check-in, check-out, dan jadwal reservasi tamu.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-gray-500 text-center py-10">Area Tabel Kelola Reservasi akan diletakkan di sini.</p>
      </div>
    </div>
  );
}
