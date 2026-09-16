"use client";

import React, { useState, useEffect, useMemo } from "react";
import PillPagination from "@/components/PillPagination";
import SearchInput from "@/components/SearchInput";

interface RoomImage {
  id: string;
  image_url: string;
  is_primary: boolean;
}

interface Room {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  current_status: string; // available, booked, maintenance
  room_images: RoomImage[];
}

export default function StaffKamarPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // State Filter & Paginasi
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // 8 Card per halaman (2 baris x 4 kolom)

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/resources/live-status", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal mengambil data kamar");

      const data = await res.json();
      setRooms(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Terjadi kesalahan saat memuat data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchRooms();
  }, []);

  // List tipe kamar unik dari database
  const availableTypes = useMemo(() => {
    const types = new Set(rooms.map((r) => r.type).filter(Boolean));
    return Array.from(types);
  }, [rooms]);

  // Filter kamar berdasarkan Search, Status, dan Tipe secara instan di memory
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchSearch =
        !searchQuery.trim() ||
        room.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        room.location.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const roomStatus = room.current_status || "available";
      const matchStatus =
        statusFilter === "all" || roomStatus === statusFilter;

      const matchType =
        typeFilter === "all" ||
        room.type.toLowerCase() === typeFilter.toLowerCase();

      return matchSearch && matchStatus && matchType;
    });
  }, [rooms, searchQuery, statusFilter, typeFilter]);

  const totalItems = filteredRooms.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Kamar yang ditampilkan pada halaman saat ini
  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRooms.slice(startIndex, startIndex + pageSize);
  }, [filteredRooms, currentPage, pageSize]);

  // Reset pagination ke page 1 saat filter atau search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  const isFilterActive =
    searchQuery.trim() !== "" || statusFilter !== "all" || typeFilter !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-500 text-white text-[11px] font-bold rounded-lg shadow-md uppercase tracking-wide z-10">
            Tersedia
          </span>
        );
      case "booked":
        return (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-blue-500 text-white text-[11px] font-bold rounded-lg shadow-md uppercase tracking-wide z-10">
            Terisi (Booked)
          </span>
        );
      case "maintenance":
        return (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-rose-500 text-white text-[11px] font-bold rounded-lg shadow-md uppercase tracking-wide z-10">
            Maintenance
          </span>
        );
      default:
        return null;
    }
  };

  const getPrimaryImage = (images: RoomImage[]) => {
    if (!images || images.length === 0)
      return "https://placehold.co/600x400?text=No+Image";

    const primary = images.find((img) => img.is_primary) || images[0];
    const imageUrl = primary?.image_url;

    if (!imageUrl) return "https://placehold.co/600x400?text=No+Image";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `http://localhost:3001${imageUrl}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Status Kamar (Live)</h1>
          <p className="text-gray-500 text-sm mt-1">
            Pantau ketersediaan seluruh kamar secara real-time.
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Cari nama kamar, lokasi, atau lantai..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Status Ketersediaan */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="available">Tersedia</option>
              <option value="booked">Terisi (Booked)</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {/* Filter Tipe Kamar */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 hidden sm:inline">Tipe:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all cursor-pointer capitalize"
            >
              <option value="all">Semua Tipe</option>
              {availableTypes.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Reset Filter jika aktif */}
          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
              title="Reset Filter"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* GRID CONTENT */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100 shadow-sm"></div>
          ))}
        </div>
      ) : errorMsg ? (
        <div className="p-10 text-center text-red-500 bg-white rounded-xl border border-gray-100">
          {errorMsg}
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px] text-gray-400">search</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Belum Ada Kamar</h3>
          <p className="text-gray-500 text-sm">Data kamar belum tersedia di sistem.</p>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px] text-gray-400">search_off</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Kamar Tidak Ditemukan</h3>
          <p className="text-gray-500 text-sm mb-4">Coba ubah kata kunci atau filter pencarian Anda.</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-xl hover:bg-emerald-100 transition-colors"
          >
            Hapus Semua Filter
          </button>
        </div>
      ) : (
        <>
          {/* Layout Grid: 4 Kolom x 2 Baris = 8 Kamar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedRooms.map((room) => (
              <div
                key={room.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <img
                    src={getPrimaryImage(room.room_images)}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Found";
                    }}
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {getStatusBadge(room.current_status)}
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg truncate pr-2">
                      {room.name}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-emerald-100/50">
                      <span className="material-symbols-outlined text-[12px]">bed</span>
                      {room.type.replace(/_/g, " ")}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-200/50">
                      <span className="material-symbols-outlined text-[12px]">group</span>
                      Max {room.capacity} Org
                    </span>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <span className="material-symbols-outlined text-[16px] text-emerald-500">location_on</span>
                      <span className="truncate">{room.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION COMPONENT */}
          {totalItems > 0 && (
            <div className="pt-4 pb-2">
              <PillPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
