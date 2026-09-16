"use client";

import React, { useState, useEffect } from "react";
import AdminKpiCards from "@/components/dashboard/admin/AdminKpiCards";
import RevenueWaveChart from "@/components/dashboard/admin/RevenueWaveChart";
import TopRoomsWidget from "@/components/dashboard/admin/TopRoomsWidget";
import RecentTransactionsTable from "@/components/dashboard/admin/RecentTransactionsTable";
import { CalendarBlank, WarningCircle } from "@phosphor-icons/react";

interface AdminDashboardData {
  totalRevenue: number;
  thisMonthRevenue: number;
  occupancyRate: number;
  occupiedRooms: number;
  totalRooms: number;
  activeBookings: number;
  totalUsers: number;
  revenueTrend7Days: { day: string; date: string; income: number }[];
  topRooms: {
    id: string;
    name: string;
    type: string;
    imageUrl: string;
    pricePerNight: number;
    totalOrders: number;
    totalEarned: number;
  }[];
  recentTransactions: {
    id: string;
    guestName: string;
    guestEmail: string;
    roomName: string;
    roomType: string;
    amount: number;
    paymentMethod: string;
    status: string;
    date: string;
  }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/dashboard/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal mengambil data statistik admin");

      const result = await res.json();
      setData(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Terjadi kesalahan memuat dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 rounded-2xl mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-slate-200 rounded-3xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 lg:col-span-2 bg-slate-200 rounded-3xl"></div>
          <div className="h-80 bg-slate-200 rounded-3xl"></div>
        </div>
        <div className="h-64 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
          <WarningCircle size={32} weight="duotone" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Gagal Memuat Dashboard</h2>
        <p className="text-xs text-slate-500 mb-5">{errorMsg}</p>
        <button
          onClick={fetchDashboardData}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Admin
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Ringkasan performa finansial, okupansi, dan aktivitas bisnis hotel.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-sm text-xs font-bold text-slate-700">
          <CalendarBlank size={16} weight="bold" className="text-blue-600" />
          <span>{new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}</span>
        </div>
      </div>

      {/* 2. Top Overview KPI Cards */}
      <AdminKpiCards
        totalRevenue={data?.totalRevenue || 0}
        thisMonthRevenue={data?.thisMonthRevenue || 0}
        occupancyRate={data?.occupancyRate || 0}
        occupiedRooms={data?.occupiedRooms || 0}
        totalRooms={data?.totalRooms || 0}
        activeBookings={data?.activeBookings || 0}
        totalUsers={data?.totalUsers || 0}
      />

      {/* 3. Middle Section: Revenue Wave Chart & Top Performing Rooms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueWaveChart data={data?.revenueTrend7Days || []} />
        </div>
        <div className="lg:col-span-1">
          <TopRoomsWidget rooms={data?.topRooms || []} />
        </div>
      </div>

      {/* 4. Bottom Section: Recent Transactions Table */}
      <RecentTransactionsTable transactions={data?.recentTransactions || []} />
    </div>
  );
}
