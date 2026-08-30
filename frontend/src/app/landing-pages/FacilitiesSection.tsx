"use client";

import React, { useState, useEffect } from "react";
import {
  Wifi,
  Waves,
  Utensils,
  Dumbbell,
  Sparkles,
  Clock,
  Briefcase,
  Car,
  Building2,
  ShieldCheck,
} from "lucide-react";

// Helper icon matcher untuk menentukan ikon otomatis berdasarkan teks fasilitas
const getIconForFacility = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('renang') || lower.includes('pool') || lower.includes('jacuzzi')) return Waves;
  if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('internet')) return Wifi;
  if (lower.includes('makan') || lower.includes('restoran') || lower.includes('sarapan') || lower.includes('dapur')) return Utensils;
  if (lower.includes('gym') || lower.includes('fitness')) return Dumbbell;
  if (lower.includes('spa') || lower.includes('pijat') || lower.includes('aromaterapi')) return Sparkles;
  if (lower.includes('24 jam') || lower.includes('butler') || lower.includes('siaga')) return Clock;
  if (lower.includes('rapat') || lower.includes('meeting') || lower.includes('kerja')) return Briefcase;
  if (lower.includes('parkir') || lower.includes('valet') || lower.includes('lift')) return Car;
  return ShieldCheck;
};

export default function FacilitiesSection() {
  const [groupedFacilities, setGroupedFacilities] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch("http://localhost:3001/resources");
        const json = await response.json();
        const dataArray = Array.isArray(json) ? json : json.data || [];
        
        const groups: Record<string, Set<string>> = {};
        
        dataArray.forEach((room: any) => {
          const type = room.type || "Lainnya";
          // Capitalize first letter
          const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
          
          if (!groups[typeCapitalized]) {
            groups[typeCapitalized] = new Set();
          }
          if (room.facilities && Array.isArray(room.facilities)) {
            room.facilities.forEach((f: string) => groups[typeCapitalized].add(f));
          }
        });
        
        const finalGrouped: Record<string, string[]> = {};
        const keys = Object.keys(groups).sort(); // Sort categories alphabetically
        keys.forEach(key => {
          finalGrouped[key] = Array.from(groups[key]).sort();
        });
        
        setGroupedFacilities(finalGrouped);
        if (keys.length > 0) {
          setActiveTab(keys[0]); // Set default active tab
        }
      } catch (error) {
        console.error("Gagal load fasilitas", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  return (
    <section className="w-full bg-slate-50 py-16 sm:py-24 border-t border-gray-200/60" id="fasilitas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3.5 py-1 text-xs font-bold text-[#0B4F37] tracking-wide mb-4">
            <Building2 className="h-3.5 w-3.5" />
            <span>Fasilitas Terintegrasi</span>
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Tingkatkan Pengalaman Menginap Anda
          </h2>
          <p className="mt-4 text-base text-gray-600">
            Pilihan fasilitas eksklusif yang disesuaikan khusus untuk tiap tipe kelas kamar di SiniBook.
          </p>
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B4F37]"></div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
            
            {/* TABS SIDEBAR */}
            <div className="w-full lg:w-1/3 xl:w-1/4 bg-white rounded-3xl border border-gray-200/80 shadow-sm p-4 sm:p-5 shrink-0 flex flex-col">
              <div className="mb-3 px-1 lg:mb-4 lg:px-2 flex-shrink-0">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Kategori Kamar</h3>
                <p className="text-xs text-gray-500 mt-1 hidden sm:block">Pilih kategori untuk melihat fasilitas</p>
              </div>
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible scrollbar-none snap-x pb-1 lg:pb-0">
                {Object.keys(groupedFacilities).map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveTab(type)}
                    className={`snap-center shrink-0 w-auto min-w-[120px] lg:w-full flex items-center justify-between rounded-2xl px-5 py-3.5 text-left transition-all duration-300 ${
                      activeTab === type
                        ? "bg-[#0B4F37] text-white shadow-md lg:scale-[1.02]"
                        : "bg-transparent text-gray-600 hover:bg-gray-200/70 hover:text-gray-900"
                    }`}
                  >
                    <span className="font-bold text-sm tracking-wide">{type}</span>
                    <div className={`hidden lg:flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                      activeTab === type ? "bg-white/20" : "bg-transparent"
                    }`}>
                      <Building2 className={`h-3.5 w-3.5 ${activeTab === type ? "text-white" : "text-gray-400"}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* KONTEN FASILITAS */}
            <div className="w-full lg:w-2/3 xl:w-3/4 bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-10 flex-1">
              {activeTab && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  
                  <div className="mb-8 border-b border-gray-100 pb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-extrabold text-gray-900">
                        Fasilitas Kamar <span className="text-[#0B4F37]">{activeTab}</span>
                      </h3>
                      <p className="mt-1.5 text-sm text-gray-500">
                        {groupedFacilities[activeTab].length} fasilitas premium tersedia.
                      </p>
                    </div>
                  </div>

                  {groupedFacilities[activeTab].length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-2xl border border-gray-100">
                      <ShieldCheck className="h-10 w-10 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium text-sm">Belum ada fasilitas tercatat untuk tipe kamar ini.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {groupedFacilities[activeTab].map((facility, fIdx) => {
                        const Icon = getIconForFacility(facility);
                        return (
                          <div 
                            key={fIdx} 
                            className="group flex items-start gap-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-200 hover:-translate-y-1 shadow-sm hover:shadow-md"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0B4F37] text-white shadow-sm group-hover:scale-110 transition-transform">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="pt-0.5">
                              <span className="block text-sm font-bold text-gray-800 group-hover:text-[#0B4F37] transition-colors">{facility}</span>
                              <span className="block text-[10px] text-emerald-600 mt-1 uppercase tracking-wider font-semibold">Tersedia</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
