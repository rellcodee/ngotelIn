"use client";

import React, { useState, useEffect } from "react";

const getIconForFacility = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('renang') || lower.includes('pool') || lower.includes('jacuzzi')) return 'pool';
  if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('internet')) return 'wifi';
  if (lower.includes('makan') || lower.includes('restoran') || lower.includes('sarapan') || lower.includes('dapur')) return 'restaurant';
  if (lower.includes('gym') || lower.includes('fitness')) return 'fitness_center';
  if (lower.includes('spa') || lower.includes('pijat') || lower.includes('aromaterapi')) return 'spa';
  if (lower.includes('24 jam') || lower.includes('butler') || lower.includes('siaga')) return 'schedule';
  if (lower.includes('rapat') || lower.includes('meeting') || lower.includes('kerja')) return 'business_center';
  if (lower.includes('parkir') || lower.includes('valet') || lower.includes('lift')) return 'local_parking';
  if (lower.includes('ac') || lower.includes('pendingin')) return 'ac_unit';
  if (lower.includes('tv') || lower.includes('televisi')) return 'tv';
  return 'verified';
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
    <section className="py-space-3xl lg:py-space-4xl relative z-10 bg-surface-bright" id="fasilitas">
      <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="flex flex-col lg:flex-row gap-space-xl lg:gap-space-2xl">
          
          {/* Text Intro & Tabs (Sticky on Desktop) */}
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <div className="inline-flex items-center gap-space-2xs text-secondary mb-space-xs">
                <span className="material-symbols-outlined text-[20px]">spa</span>
                <span className="font-label-md text-label-md uppercase tracking-widest">Kenyamanan Maksimal</span>
              </div>
              <h2 className="font-display-xl text-headline-lg lg:text-display-xl text-primary mb-space-md tracking-tight">
                Fasilitas & Layanan Kamar
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg">
                Daftar fasilitas yang tersedia sesuai dengan tipe kelas kamar yang kamu pilih.
              </p>
              
              {/* TABS SIDEBAR */}
              {!isLoading && Object.keys(groupedFacilities).length > 0 && (
                <div className="flex flex-col gap-space-2xs bg-surface-container-lowest p-space-sm rounded-2xl border border-surface-container shadow-sm">
                  <p className="px-space-sm py-space-2xs font-label-sm text-label-sm uppercase tracking-wider text-outline">Tipe Kamar</p>
                  <div className="flex flex-row lg:flex-col gap-space-2xs overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar">
                    {Object.keys(groupedFacilities).map((type) => (
                      <button
                        key={type}
                        onClick={() => setActiveTab(type)}
                        className={`shrink-0 lg:shrink w-full flex items-center justify-between rounded-xl px-space-md py-space-sm font-label-lg text-label-lg transition-all text-left ${
                          activeTab === type
                            ? "bg-primary text-on-primary shadow-md"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                        }`}
                      >
                        <span>{type}</span>
                        <span className="material-symbols-outlined text-[18px] opacity-80 hidden lg:block">hotel_class</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grid Content */}
          <div className="lg:w-2/3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64 bg-surface-container-lowest rounded-3xl border border-surface-container">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-surface-container-high border-t-primary"></div>
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-3xl border border-surface-container p-space-lg lg:p-space-xl shadow-[0_8px_24px_rgba(14,47,118,0.06)] h-full">
                {activeTab && (
                  <div className="h-full flex flex-col">
                    <div className="mb-space-lg pb-space-md border-b border-surface-container flex items-center justify-between">
                      <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface">
                          Kamar Tipe <span className="text-primary">{activeTab}</span>
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
                          {groupedFacilities[activeTab].length} fasilitas terdaftar
                        </p>
                      </div>
                    </div>

                    {groupedFacilities[activeTab].length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-space-2xl text-center bg-surface-container-low rounded-2xl border border-surface-container">
                        <span className="material-symbols-outlined text-[48px] text-outline-variant mb-space-sm">info</span>
                        <p className="font-label-lg text-label-lg text-on-surface-variant">Belum ada fasilitas khusus untuk tipe kamar ini.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm auto-rows-max">
                        {groupedFacilities[activeTab].map((facility, fIdx) => {
                          const iconName = getIconForFacility(facility);
                          return (
                            <div
                              key={fIdx}
                              className="flex items-center gap-space-sm rounded-xl border border-surface-container-high bg-surface-container-low p-space-md transition-all hover:border-primary-fixed-dim hover:bg-primary-fixed/20 hover:shadow-sm hover:-translate-y-0.5"
                            >
                              <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">{iconName}</span>
                              </div>
                              <span className="font-label-lg text-label-lg text-on-surface">{facility}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
