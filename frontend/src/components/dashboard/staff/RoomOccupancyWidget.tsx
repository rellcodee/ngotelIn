"use client";

import React from "react";
import Link from "next/link";
import { CaretRight, ArrowRight, Bed, Door, Wrench, Sparkle } from "@phosphor-icons/react";

interface RoomOverview {
  total: number;
  available: number;
  booked: number;
  maintenance: number;
}

interface RoomOccupancyWidgetProps {
  overview: RoomOverview;
}

export default function RoomOccupancyWidget({
  overview,
}: RoomOccupancyWidgetProps) {
  const { total, available, booked, maintenance } = overview || {
    total: 0,
    available: 0,
    booked: 0,
    maintenance: 0,
  };

  const availablePct = total > 0 ? Math.round((available / total) * 100) : 0;
  const bookedPct = total > 0 ? Math.round((booked / total) * 100) : 0;
  const maintenancePct = total > 0 ? Math.round((maintenance / total) * 100) : 0;

  return (
    <div className="relative flex flex-col justify-between rounded-3xl bg-slate-900 p-6 sm:p-7 text-white shadow-xl border border-slate-800 overflow-hidden">
      {/* Subtle Ambient Glow Background */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkle size={13} weight="fill" />
              <span>Status Operasional</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Ketersediaan Kamar</h2>
            <p className="text-xs text-slate-400 mt-0.5">Live status okupansi unit saat ini</p>
          </div>
          <Link
            href="/staff/kamar"
            className="text-xs font-semibold text-blue-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-sm"
          >
            <span>Live Map</span>
            <CaretRight size={13} weight="bold" />
          </Link>
        </div>

        {/* Visual Multi-Segment Bar */}
        <div className="my-5 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
          <div className="flex justify-between items-baseline text-xs mb-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-white font-extrabold text-lg">{total}</span>
              <span className="text-slate-400 text-xs font-medium">Total Kamar</span>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-lg">
              {availablePct}% Siap Sewa
            </span>
          </div>

          <div className="h-3.5 w-full rounded-full bg-slate-950/80 flex overflow-hidden p-0.5 gap-1 border border-slate-800">
            {/* Tersedia (Biru Terang) */}
            <div
              className="h-full rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-500"
              style={{ width: `${availablePct}%` }}
              title={`Tersedia: ${available} (${availablePct}%)`}
            />
            {/* Terisi (Slate/Indigo) */}
            <div
              className="h-full rounded-full bg-slate-500 transition-all duration-500"
              style={{ width: `${bookedPct}%` }}
              title={`Terisi: ${booked} (${bookedPct}%)`}
            />
            {/* Maintenance (Rose) */}
            <div
              className="h-full rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)] transition-all duration-500"
              style={{ width: `${maintenancePct}%` }}
              title={`Maintenance: ${maintenance} (${maintenancePct}%)`}
            />
          </div>
        </div>

        {/* Legend Breakdown List */}
        <div className="space-y-2.5 pt-1">
          {/* 1. Tersedia */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-blue-500/25 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Bed size={17} weight="duotone" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Tersedia (Ready)</p>
                <p className="text-[10px] text-slate-400">Siap untuk check-in</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-blue-400">{available} Kamar</span>
              <span className="block text-[10px] text-slate-400 font-medium">{availablePct}%</span>
            </div>
          </div>

          {/* 2. Terisi */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-700 text-slate-300 border border-slate-600">
                <Door size={17} weight="duotone" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Terisi (In-House)</p>
                <p className="text-[10px] text-slate-400">Tamu sedang menginap</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-white">{booked} Kamar</span>
              <span className="block text-[10px] text-slate-400 font-medium">{bookedPct}%</span>
            </div>
          </div>

          {/* 3. Maintenance */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-rose-500/25 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Wrench size={17} weight="duotone" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Perbaikan / Housekeeping</p>
                <p className="text-[10px] text-slate-400">Dalam pembersihan</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-rose-400">{maintenance} Kamar</span>
              <span className="block text-[10px] text-slate-400 font-medium">{maintenancePct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80">
        <Link
          href="/staff/kamar"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all shadow-sm group"
        >
          <span>Buka Panel Kontrol Kamar</span>
          <ArrowRight size={14} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
