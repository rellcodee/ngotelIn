"use client";

import React, { useState, useEffect } from "react";

const getIconForFacility = (name: string) => {
  const lower = name.toLowerCase();
  if (
    lower.includes("renang") ||
    lower.includes("pool") ||
    lower.includes("jacuzzi")
  )
    return "pool";
  if (
    lower.includes("wi-fi") ||
    lower.includes("wifi") ||
    lower.includes("internet")
  )
    return "wifi";
  if (
    lower.includes("makan") ||
    lower.includes("restoran") ||
    lower.includes("sarapan") ||
    lower.includes("dapur")
  )
    return "restaurant";
  if (lower.includes("gym") || lower.includes("fitness"))
    return "fitness_center";
  if (
    lower.includes("spa") ||
    lower.includes("pijat") ||
    lower.includes("aromaterapi")
  )
    return "spa";
  if (
    lower.includes("24 jam") ||
    lower.includes("butler") ||
    lower.includes("siaga")
  )
    return "schedule";
  if (
    lower.includes("rapat") ||
    lower.includes("meeting") ||
    lower.includes("kerja")
  )
    return "business_center";
  if (
    lower.includes("parkir") ||
    lower.includes("valet") ||
    lower.includes("lift")
  )
    return "local_parking";
  if (lower.includes("ac") || lower.includes("pendingin")) return "ac_unit";
  if (lower.includes("tv") || lower.includes("televisi")) return "tv";
  return "verified";
};

export default function FacilitiesSection() {
  const [groupedFacilities, setGroupedFacilities] = useState<
    Record<string, string[]>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch("http://localhost:3001/resources/facilities");
        const groupedData = await response.json();

        setGroupedFacilities(groupedData);
        
        const keys = Object.keys(groupedData);
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
    <section
      className="py-16 md:py-20 lg:py-28 relative z-10 bg-surface-bright"
      id="fasilitas"
    >
      <div className="max-w-container-max mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Text Intro & Tabs (Sticky on Desktop) */}
          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-32">
              <h2 className="font-display-xl font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-primary mb-6 md:mb-8 tracking-tight">
                Layanan Kamar
              </h2>
              <p className="font-body-lg text-[14px] sm:text-[16px] md:text-[18px] text-on-surface-variant mb-6 md:mb-8 lg:mb-10">
                Pilihan tipe kamar kami dirancang untuk memenuhi kebutuhan Anda,
                mulai dari kamar standar hingga kamar suite.
              </p>

              {/* TABS SIDEBAR */}
              {!isLoading && Object.keys(groupedFacilities).length > 0 && (
                <div className="flex flex-col gap-3 md:gap-4 bg-surface-container-lowest p-4 md:p-6 rounded-2xl border border-surface-container shadow-sm">
                  <p className="px-2 font-bold text-[12px] md:text-[14px] uppercase tracking-wider text-outline">
                    Tipe Kamar
                  </p>

                  {/* MOBILE DROPDOWN */}
                  <div className="block lg:hidden">
                    <div className="relative">
                      <select
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                        className="w-full appearance-none bg-primary text-on-primary font-bold text-[15px] sm:text-[16px] rounded-xl px-5 py-4 shadow-md outline-none cursor-pointer"
                      >
                        {Object.keys(groupedFacilities).map((type) => (
                          <option
                            key={type}
                            value={type}
                            className="bg-white text-on-surface"
                          >
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-primary">
                        <span className="material-symbols-outlined text-[24px]">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DESKTOP BUTTONS */}
                  <div className="hidden lg:flex flex-col gap-2">
                    {Object.keys(groupedFacilities).map((type) => (
                      <button
                        key={type}
                        onClick={() => setActiveTab(type)}
                        className={`w-full flex items-center justify-between rounded-xl px-5 py-3.5 font-bold text-[15px] transition-all text-left ${
                          activeTab === type
                            ? "bg-primary text-on-primary shadow-md"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                        }`}
                      >
                        <span>{type}</span>
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
              <div className="bg-surface-container-lowest rounded-2xl md:rounded-3xl border border-surface-container p-6 md:p-8 lg:p-10 shadow-[0_8px_24px_rgba(14,47,118,0.06)] h-full">
                {activeTab && (
                  <div className="h-full flex flex-col">
                    <div className="mb-6 md:mb-8 pb-4 md:pb-6 border-b border-surface-container flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-[22px] sm:text-[24px] md:text-[28px] lg:text-[32px] text-on-surface tracking-tight leading-tight">
                          Kamar Tipe <br className="hidden sm:block" />
                          <span className="text-primary">{activeTab}</span>
                        </h3>
                        <p className="text-[14px] md:text-[15px] text-on-surface-variant mt-1 md:mt-2">
                          {groupedFacilities[activeTab].length} fasilitas
                          terdaftar
                        </p>
                      </div>
                    </div>

                    {groupedFacilities[activeTab].length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-12 md:py-16 text-center bg-surface-container-low rounded-2xl border border-surface-container">
                        <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">
                          info
                        </span>
                        <p className="font-bold text-[15px] md:text-[16px] text-on-surface-variant">
                          Belum ada fasilitas khusus untuk tipe kamar ini.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 auto-rows-max">
                        {groupedFacilities[activeTab].map((facility, fIdx) => {
                          const iconName = getIconForFacility(facility);
                          return (
                            <div
                              key={fIdx}
                              className="flex items-center gap-3 md:gap-4 rounded-xl border border-surface-container-high bg-surface-container-low p-3 md:p-4 transition-all hover:border-primary-fixed-dim hover:bg-primary-fixed/20 hover:shadow-sm hover:-translate-y-0.5"
                            >
                              <div className="w-10 h-10 shrink-0 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">
                                  {iconName}
                                </span>
                              </div>
                              <span className="font-bold text-[14px] md:text-[15px] text-on-surface leading-snug">
                                {facility}
                              </span>
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
