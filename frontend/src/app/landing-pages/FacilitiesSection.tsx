"use client";

import React, { useState, useEffect } from "react";
import {
  WifiHigh,
  Waves,
  ForkKnife,
  Barbell,
  Sparkle,
  Clock,
  Briefcase,
  Car,
  ShieldCheck,
  Buildings,
} from "@phosphor-icons/react";

const getIconForFacility = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('renang') || lower.includes('pool') || lower.includes('jacuzzi')) return Waves;
  if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('internet')) return WifiHigh;
  if (lower.includes('makan') || lower.includes('restoran') || lower.includes('sarapan') || lower.includes('dapur')) return ForkKnife;
  if (lower.includes('gym') || lower.includes('fitness')) return Barbell;
  if (lower.includes('spa') || lower.includes('pijat') || lower.includes('aromaterapi')) return Sparkle;
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
          const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);

          if (!groups[typeCapitalized]) {
            groups[typeCapitalized] = new Set();
          }
          if (room.facilities && Array.isArray(room.facilities)) {
            room.facilities.forEach((f: string) => groups[typeCapitalized].add(f));
          }
        });

        const finalGrouped: Record<string, string[]> = {};
        const keys = Object.keys(groups).sort();
        keys.forEach(key => {
          finalGrouped[key] = Array.from(groups[key]).sort();
        });

        setGroupedFacilities(finalGrouped);
        if (keys.length > 0) {
          setActiveTab(keys[0]);
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
    <section className="w-full bg-slate-50/60 py-20 border-t border-slate-200/80 font-sans" id="fasilitas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION (CLEAN HUMAN DESIGN - NO AI BADGES) */}
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Fasilitas & Layanan Kamar
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Daftar fasilitas yang tersedia sesuai dengan tipe kelas kamar yang kamu pilih.
          </p>
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-9 w-9 border-2 border-slate-300 border-t-blue-600"></div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

            {/* TABS SIDEBAR (CLEAN HUMAN CARD) */}
            <div className="w-full lg:w-64 shrink-0 bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
              <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tipe Kamar</p>
              <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
                {Object.keys(groupedFacilities).map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveTab(type)}
                    className={`w-full flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors text-left ${
                      activeTab === type
                        ? "bg-blue-600 text-white font-semibold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span>{type}</span>
                    <Buildings weight="duotone" className={`h-4 w-4 ${activeTab === type ? "text-white" : "text-slate-400"}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* KONTEN FASILITAS (CLEAN GRID) */}
            <div className="flex-1 w-full bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              {activeTab && (
                <div>
                  <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Kamar Tipe <span className="text-blue-600">{activeTab}</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {groupedFacilities[activeTab].length} fasilitas terdaftar
                      </p>
                    </div>
                  </div>

                  {groupedFacilities[activeTab].length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-lg border border-slate-100">
                      <ShieldCheck weight="duotone" className="h-8 w-8 text-slate-300 mb-2" />
                      <p className="text-slate-500 font-medium text-xs">Belum ada fasilitas khusus untuk tipe kamar ini.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                      {groupedFacilities[activeTab].map((facility, fIdx) => {
                        const Icon = getIconForFacility(facility);
                        return (
                          <div
                            key={fIdx}
                            className="flex items-center gap-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 transition-colors hover:border-blue-300 hover:bg-blue-50/30"
                          >
                            <Icon weight="duotone" className="h-5 w-5 text-blue-600 shrink-0" />
                            <span className="text-sm font-medium text-slate-800">{facility}</span>
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
