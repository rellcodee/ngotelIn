"use client";

import React, { useState, useEffect } from "react";
import StaffKpiCards from "@/components/dashboard/staff/StaffKpiCards";
import StaffQuickActions from "@/components/dashboard/staff/StaffQuickActions";
import TodayArrivalsTable from "@/components/dashboard/staff/TodayArrivalsTable";
import RoomOccupancyWidget from "@/components/dashboard/staff/RoomOccupancyWidget";
import { Clock, WarningCircle, User } from "@phosphor-icons/react";

interface StaffDashboardData {
  checkInTodayCount: number;
  checkedInTodayCount: number;
  checkOutTodayCount: number;
  inHouseCount: number;
  totalRooms: number;
  roomOverview: {
    total: number;
    available: number;
    booked: number;
    maintenance: number;
  };
  todayArrivals: {
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
  }[];
}

export default function StaffDashboardPage() {
  const [data, setData] = useState<StaffDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchStaffData = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/dashboard/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal mengambil data operasional staff");

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
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchStaffData();
  }, []);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal mengubah status booking");
      }

      await fetchStaffData(true);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 rounded-2xl mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-slate-200 rounded-3xl"></div>
          ))}
        </div>
        <div className="h-12 w-full bg-slate-200 rounded-2xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 lg:col-span-2 bg-slate-200 rounded-3xl"></div>
          <div className="h-80 bg-slate-200 rounded-3xl"></div>
        </div>
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
          onClick={() => fetchStaffData()}
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
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center bg-blue-100 p-2.5 rounded-2xl border border-blue-200/60 shadow-sm text-blue-600">
              <User size={22} weight="bold" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Staff Workspace
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring operasional harian & pelayanan tamu hotel
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-sm text-xs font-bold text-slate-700">
          <Clock size={16} weight="bold" className="text-blue-600" />
          <span>{new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}</span>
        </div>
      </div>

      {/* 2. Operational KPI Cards */}
      <StaffKpiCards
        checkInTodayCount={data?.checkInTodayCount || 0}
        checkedInTodayCount={data?.checkedInTodayCount || 0}
        checkOutTodayCount={data?.checkOutTodayCount || 0}
        inHouseCount={data?.inHouseCount || 0}
        maintenanceCount={data?.roomOverview.maintenance || 0}
      />

      {/* 3. Quick Action Shortcut Pills */}
      <StaffQuickActions
        onRefresh={() => fetchStaffData(true)}
        isRefreshing={isRefreshing}
      />

      {/* 4. Main Section: Today Arrivals Table & Room Occupancy Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TodayArrivalsTable
            arrivals={data?.todayArrivals || []}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
        <div className="lg:col-span-1">
          <RoomOccupancyWidget
            overview={
              data?.roomOverview || {
                total: 0,
                available: 0,
                booked: 0,
                maintenance: 0,
              }
            }
          />
        </div>
      </div>
    </div>
  );
}
