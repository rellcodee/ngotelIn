"use client";

import React from "react";
import { SignIn, SignOut, Door, Wrench } from "@phosphor-icons/react";

interface StaffKpiCardsProps {
  checkInTodayCount: number;
  checkedInTodayCount: number;
  checkOutTodayCount: number;
  inHouseCount: number;
  maintenanceCount: number;
}

export default function StaffKpiCards({
  checkInTodayCount,
  checkedInTodayCount,
  checkOutTodayCount,
  inHouseCount,
  maintenanceCount,
}: StaffKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. CHECK-IN HARI INI (HERO CARD) */}
      <div className="relative overflow-hidden rounded-3xl bg-blue-600 p-6 text-white shadow-xl shadow-blue-600/15 border border-blue-500 transition-all hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-blue-100 uppercase">
            Check-In Hari Ini
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md text-white">
            <SignIn size={22} weight="bold" />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-3xl font-extrabold tracking-tight text-white">
            {checkInTodayCount}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-blue-100 font-medium">
            <span className="inline-flex items-center rounded-full bg-blue-700/60 px-2.5 py-0.5 text-[11px] font-bold text-white border border-blue-400/30">
              {checkedInTodayCount} Tamu Sudah Tiba
            </span>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* 2. CHECK-OUT HARI INI */}
      <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80 transition-all hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Check-Out Hari Ini
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <SignOut size={22} weight="duotone" />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-3xl font-extrabold text-slate-900">
            {checkOutTodayCount}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-500">
            Jadwal kepulangan hari ini
          </p>
        </div>
      </div>

      {/* 3. TAMU MENGINAP (IN-HOUSE) */}
      <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80 transition-all hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Tamu Menginap
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-blue-600">
            <Door size={22} weight="duotone" />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-3xl font-extrabold text-slate-900">
            {inHouseCount}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-500">
            Kamar aktif berpenghuni
          </p>
        </div>
      </div>

      {/* 4. KAMAR MAINTENANCE */}
      <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80 transition-all hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Perlu Pemeliharaan
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-rose-600">
            <Wrench size={22} weight="duotone" />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-3xl font-extrabold text-slate-900">
            {maintenanceCount}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-500">
            Kamar maintenance / service
          </p>
        </div>
      </div>
    </div>
  );
}
