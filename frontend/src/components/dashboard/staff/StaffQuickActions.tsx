"use client";

import React from "react";
import Link from "next/link";
import { Bed, CalendarCheck, ArrowsClockwise } from "@phosphor-icons/react";

interface StaffQuickActionsProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function StaffQuickActions({
  onRefresh,
  isRefreshing,
}: StaffQuickActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* 1. Kelola Kamar */}
      <Link
        href="/staff/kamar"
        className="flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 shadow-sm border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 transition-all active:scale-95"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-blue-600">
          <Bed size={17} weight="duotone" />
        </div>
        <span>Pantau Status Kamar</span>
      </Link>

      {/* 2. Kelola Reservasi */}
      <Link
        href="/staff/reservasi"
        className="flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 shadow-sm border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 transition-all active:scale-95"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-blue-600">
          <CalendarCheck size={17} weight="duotone" />
        </div>
        <span>Jadwal & Reservasi Lengkap</span>
      </Link>

      {/* 3. Tombol Refresh Realtime */}
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95 ml-auto"
      >
        <ArrowsClockwise
          size={16}
          weight="bold"
          className={isRefreshing ? "animate-spin" : ""}
        />
        <span>{isRefreshing ? "Menyegarkan..." : "Segarkan Data"}</span>
      </button>
    </div>
  );
}
