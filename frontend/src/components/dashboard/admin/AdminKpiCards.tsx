"use client";

import React from "react";
import {
  CurrencyDollar,
  Bed,
  CalendarCheck,
  UsersThree,
} from "@phosphor-icons/react";

interface AdminKpiCardsProps {
  totalRevenue: number;
  thisMonthRevenue: number;
  occupancyRate: number;
  occupiedRooms: number;
  totalRooms: number;
  activeBookings: number;
  totalUsers: number;
}

export default function AdminKpiCards({
  totalRevenue,
  thisMonthRevenue,
  occupancyRate,
  occupiedRooms,
  totalRooms,
  activeBookings,
  totalUsers,
}: AdminKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. HERO PRIMARY CARD (Total Pendapatan) */}
      <div className="relative overflow-hidden rounded-3xl bg-blue-600 p-6 text-white shadow-xl shadow-blue-600/15 border border-blue-500 transition-all hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-blue-100 uppercase">
            Total Pendapatan
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md text-white">
            <CurrencyDollar size={22} weight="bold" />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-blue-100 font-medium">
            <span className="inline-flex items-center rounded-full bg-blue-700/60 px-2.5 py-0.5 text-[11px] font-bold text-white border border-blue-400/30">
              Bulan ini: Rp {thisMonthRevenue.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* 2. SECONDARY CARD (Tingkat Okupansi) */}
      <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80 transition-all hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Tingkat Okupansi
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-blue-600">
            <Bed size={22} weight="duotone" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {occupancyRate}%
            </p>
            <span className="text-xs font-semibold text-slate-500">
              ({occupiedRooms}/{totalRooms} Kamar)
            </span>
          </div>

          {/* Progress Bar Okupansi */}
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, occupancyRate))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. SECONDARY CARD (Reservasi Aktif) */}
      <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80 transition-all hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Reservasi Aktif
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <CalendarCheck size={22} weight="duotone" />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {activeBookings}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-500">
            Pesanan confirmed / pending
          </p>
        </div>
      </div>

      {/* 4. SECONDARY CARD (Total Pengguna / Tamu) */}
      <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80 transition-all hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Total Tamu Terdaftar
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <UsersThree size={22} weight="duotone" />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {totalUsers}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-500">
            Akun member terverifikasi
          </p>
        </div>
      </div>
    </div>
  );
}
