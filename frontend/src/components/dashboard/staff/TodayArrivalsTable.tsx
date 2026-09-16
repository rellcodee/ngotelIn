"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  ArrowRight,
  SignIn,
  SignOut,
  NotePencil,
  CalendarBlank,
  Door,
  Bed,
  CreditCard,
} from "@phosphor-icons/react";

interface ArrivalItem {
  bookingId: string;
  scheduleId: string;
  guestName: string;
  guestEmail: string;
  roomName: string;
  roomType: string;
  roomLocation: string;
  checkIn: string;
  checkOut: string;
  bookingStatus: string;
  paymentStatus: string;
  paymentAmount: number;
  paymentMethod: string;
  notes?: string;
}

interface TodayArrivalsTableProps {
  arrivals: ArrivalItem[];
  onStatusUpdate?: (bookingId: string, newStatus: string) => Promise<void>;
}

export default function TodayArrivalsTable({
  arrivals,
  onStatusUpdate,
}: TodayArrivalsTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleAction = async (bookingId: string, newStatus: string) => {
    if (!onStatusUpdate) return;
    setUpdatingId(bookingId);
    try {
      await onStatusUpdate(bookingId, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const getBookingBadge = (status: string) => {
    switch (status) {
      case "checked_in":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200/80">
            <Door size={13} weight="bold" className="text-blue-600" />
            Sedang Menginap
          </span>
        );
      case "approved":
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/80">
            <CheckCircle size={14} weight="fill" className="text-emerald-600" />
            Siap Check-In
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">
            Selesai Menginap
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200/80">
            <Clock size={13} weight="fill" className="text-amber-500" />
            Menunggu Bayar
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    if (status === "settlement" || status === "paid" || status === "success") {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          LUNAS
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        PENDING
      </span>
    );
  };

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7 shadow-sm border border-slate-200/80">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900">
              Kedatangan & Kepulangan Hari Ini
            </h2>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-extrabold text-blue-700 border border-blue-100">
              {arrivals.length} Tamu
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Jadwal operasional front desk untuk alur tamu hotel hari ini
          </p>
        </div>
        <Link
          href="/staff/reservasi"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 group"
        >
          <span>Buka Jadwal Lengkap</span>
          <ArrowRight size={14} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {arrivals.length === 0 ? (
        <div className="py-14 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400 shadow-sm border border-slate-100">
            <CalendarBlank size={24} weight="duotone" />
          </div>
          <p className="text-sm font-bold text-slate-700">Tidak Ada Tamu Hari Ini</p>
          <p className="text-xs text-slate-400 mt-1">
            Tidak ada jadwal kedatangan atau kepulangan tamu pada tanggal hari ini.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold tracking-wider uppercase text-slate-600">
                  <th className="py-3.5 px-4">Tamu & Kontak</th>
                  <th className="py-3.5 px-4">Kamar & Tipe</th>
                  <th className="py-3.5 px-4">Jadwal Operasional</th>
                  <th className="py-3.5 px-4">Pembayaran</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {arrivals.map((item, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <tr
                      key={item.bookingId}
                      className={`transition-colors hover:bg-blue-50/40 ${
                        isEven ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      {/* 1. Tamu & Kontak */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-xs font-bold uppercase shrink-0 shadow-sm">
                            {item.guestName ? item.guestName.charAt(0) : "G"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs truncate">
                              {item.guestName}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {item.guestEmail}
                            </p>
                            {item.notes && item.notes !== "-" && (
                              <div className="inline-flex items-center gap-1 mt-1 text-[10px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/70 max-w-xs truncate font-medium">
                                <NotePencil size={11} weight="bold" className="shrink-0 text-amber-600" />
                                <span className="truncate">{item.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 2. Kamar & Tipe */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2">
                          <div className="p-1 rounded-lg bg-slate-100 text-slate-600 mt-0.5">
                            <Bed size={14} weight="bold" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 truncate">
                              {item.roomName}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                {item.roomType.replace(/_/g, " ")}
                              </span>
                              <span className="text-[11px] text-slate-400">•</span>
                              <span className="text-[11px] text-slate-500">
                                {item.roomLocation}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. Jadwal Operasional */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                              IN
                            </span>
                            <span className="font-medium text-slate-700">
                              {new Date(item.checkIn).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                              OUT
                            </span>
                            <span className="font-medium text-slate-700">
                              {new Date(item.checkOut).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 4. Pembayaran */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1 items-start">
                          {getPaymentBadge(item.paymentStatus)}
                          <span className="text-xs font-extrabold text-slate-900">
                            Rp {item.paymentAmount.toLocaleString("id-ID")}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {item.paymentMethod || "Transfer / VA"}
                          </span>
                        </div>
                      </td>

                      {/* 5. Status Booking */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getBookingBadge(item.bookingStatus)}
                      </td>

                      {/* 6. Aksi Cepat */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {item.bookingStatus === "approved" || item.bookingStatus === "confirmed" ? (
                          <button
                            onClick={() => handleAction(item.bookingId, "checked_in")}
                            disabled={updatingId === item.bookingId}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-sm transition-all hover:shadow active:scale-95 disabled:opacity-50"
                          >
                            <SignIn size={14} weight="bold" />
                            <span>Check-In</span>
                          </button>
                        ) : item.bookingStatus === "checked_in" ? (
                          <button
                            onClick={() => handleAction(item.bookingId, "completed")}
                            disabled={updatingId === item.bookingId}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-bold shadow-sm transition-all hover:shadow active:scale-95 disabled:opacity-50"
                          >
                            <SignOut size={14} weight="bold" />
                            <span>Check-Out</span>
                          </button>
                        ) : (
                          <Link
                            href="/staff/reservasi"
                            className="inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-semibold transition-colors"
                          >
                            <span>Detail</span>
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
