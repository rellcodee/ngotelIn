"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Filter, BedDouble, Users, MapPin } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = new URL("http://localhost:3001/resources/live-status");
      if (searchQuery) url.searchParams.append("search", searchQuery);
      if (selectedType !== "all") url.searchParams.append("type", selectedType);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Gagal mengambil data kamar");
      
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      void fetchRooms();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedType]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <span className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm bg-opacity-90">Tersedia</span>;
      case "booked":
        return <span className="absolute top-4 right-4 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm bg-opacity-90">Terisi (Booked)</span>;
      case "maintenance":
        return <span className="absolute top-4 right-4 px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm bg-opacity-90">Maintenance</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Status Kamar (Live)</h1>
          <p className="text-gray-500 text-sm mt-1">
            Pantau ketersediaan seluruh kamar secara real-time.
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari nama kamar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>
        <div className="relative w-full sm:w-64 flex-shrink-0">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer transition-all"
          >
            <option value="all">Semua Tipe Kamar</option>
            <option value="standard">Standard Cozy</option>
            <option value="suite">Deluxe Suite</option>
            <option value="presidential_suite">Presidential Penthouse</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100 shadow-sm"></div>
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Kamar tidak ditemukan</h3>
          <p className="text-gray-500">Coba ubah kata kunci atau filter pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col"
            >
              {/* Image Section */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                {room.room_images && room.room_images.length > 0 ? (
                  <Image
                    src={room.room_images[0].image_url}
                    alt={room.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100">
                    <BedDouble className="w-10 h-10 text-slate-300" />
                  </div>
                )}
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
                    <BedDouble className="w-3 h-3" />
                    {room.type.replace("_", " ")}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-200/50">
                    <Users className="w-3 h-3" />
                    Max {room.capacity} Org
                  </span>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span className="truncate">{room.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
