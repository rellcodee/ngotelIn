"use client";

import React from "react";
import Link from "next/link";
import { CaretRight, CheckCircle, Bed } from "@phosphor-icons/react";

interface TopRoom {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  pricePerNight: number;
  totalOrders: number;
  totalEarned: number;
}

interface TopRoomsWidgetProps {
  rooms: TopRoom[];
}

export default function TopRoomsWidget({ rooms }: TopRoomsWidgetProps) {
  return (
    <div className="flex flex-col justify-between rounded-3xl bg-white p-6 sm:p-7 shadow-sm border border-slate-200/80">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Kamar Terpopuler</h2>
            <p className="text-xs text-slate-500 mt-0.5">Tipe kamar paling sering dipesan</p>
          </div>
          <Link
            href="/admin/kamar"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-0.5"
          >
            <span>Semua</span>
            <CaretRight size={14} weight="bold" />
          </Link>
        </div>

        {/* List Kamar Terpopuler */}
        {rooms.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Belum ada transaksi pemesanan kamar tercatat.
          </div>
        ) : (
          <div className="space-y-3.5">
            {rooms.map((room, idx) => (
              <div
                key={room.id || idx}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50/80 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail Foto */}
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                    <img
                      src={room.imageUrl}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/600x400?text=Room";
                      }}
                    />
                    <div className="absolute top-1 left-1 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-extrabold px-1 rounded">
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Info Kamar */}
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {room.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 capitalize">
                      {room.type.replace(/_/g, " ")} • {room.totalOrders}x dipesan
                    </p>
                  </div>
                </div>

                {/* Total Uang Dihasilkan */}
                <div className="text-right shrink-0 pl-3">
                  <span className="block text-xs sm:text-sm font-extrabold text-blue-600">
                    Rp {room.totalEarned.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Rp {room.pricePerNight.toLocaleString("id-ID")}/mlm
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mini Footer: Info Sistem Operasional */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} weight="fill" className="text-emerald-500" />
          <span className="text-xs font-semibold text-slate-700">Sistem NgoteLIn</span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">Status: Operasional Aktif</span>
      </div>
    </div>
  );
}
