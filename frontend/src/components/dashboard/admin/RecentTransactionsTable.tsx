"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle, Clock, XCircle, ArrowRight } from "@phosphor-icons/react";

interface TransactionItem {
  id: string;
  guestName: string;
  guestEmail: string;
  roomName: string;
  roomType: string;
  amount: number;
  paymentMethod: string;
  status: string;
  date: string;
}

interface RecentTransactionsTableProps {
  transactions: TransactionItem[];
}

export default function RecentTransactionsTable({
  transactions,
}: RecentTransactionsTableProps) {
  const getStatusBadge = (status: string) => {
    const s = status ? status.toLowerCase() : "pending";
    if (s === "settlement" || s === "paid" || s === "success" || s === "capture") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/70">
          <CheckCircle size={13} weight="fill" className="text-emerald-600" />
          Lunas
        </span>
      );
    }
    if (s === "pending") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200/70">
          <Clock size={13} weight="fill" className="text-amber-500" />
          Menunggu Bayar
        </span>
      );
    }
    if (s === "canceled" || s === "cancel" || s === "expire" || s === "deny") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200/70">
          <XCircle size={13} weight="fill" className="text-rose-500" />
          Dibatalkan
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
        {status}
      </span>
    );
  };

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7 shadow-sm border border-slate-200/80">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Transaksi Terkini</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Riwayat pembayaran terbaru melalui payment gateway
          </p>
        </div>
        <Link
          href="/admin/reservasi"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
        >
          <span>Lihat Semua Reservasi</span>
          <ArrowRight size={14} weight="bold" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">
          Belum ada data transaksi yang tercatat.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold uppercase text-slate-500">
                <th className="pb-3.5">Tamu / Pelanggan</th>
                <th className="pb-3.5">Kamar</th>
                <th className="pb-3.5">Metode</th>
                <th className="pb-3.5">Waktu</th>
                <th className="pb-3.5">Status</th>
                <th className="pb-3.5 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Tamu */}
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 text-xs font-extrabold uppercase shrink-0 border border-slate-200/60">
                        {tx.guestName ? tx.guestName.charAt(0) : "G"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{tx.guestName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{tx.guestEmail}</p>
                      </div>
                    </div>
                  </td>

                  {/* Kamar */}
                  <td className="py-3.5 pr-4">
                    <p className="font-semibold text-slate-800 truncate">{tx.roomName}</p>
                    <p className="text-[11px] text-slate-500 capitalize">{tx.roomType.replace(/_/g, " ")}</p>
                  </td>

                  {/* Metode */}
                  <td className="py-3.5 pr-4 text-xs font-medium text-slate-600 uppercase">
                    {tx.paymentMethod || "QRIS"}
                  </td>

                  {/* Waktu */}
                  <td className="py-3.5 pr-4 text-xs text-slate-500 whitespace-nowrap">
                    {tx.date ? new Date(tx.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    }) : "-"}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 pr-4 whitespace-nowrap">
                    {getStatusBadge(tx.status)}
                  </td>

                  {/* Nominal */}
                  <td className="py-3.5 text-right font-extrabold text-slate-900 whitespace-nowrap">
                    Rp {tx.amount.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
