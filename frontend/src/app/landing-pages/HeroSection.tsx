"use client";

import React from "react";
import Image from "next/image";

export default function HeroSection() {

  return (
    <>
      <section className="relative w-full min-h-[100svh] flex flex-col justify-center overflow-hidden -mt-20 pt-32 lg:pt-40 pb-space-2xl lg:pb-space-4xl bg-gradient-to-b from-surface-bright via-background to-surface-container-low">
        {/* Atmospheric Ambient Glows & Cycladic Curves */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 -right-24 w-[500px] h-[500px] rounded-full bg-surface-tint/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop relative z-10">
          {/* Main Hero Content Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-space-2xl items-center mb-16 lg:mb-24">
            {/* Text Column */}
            <div className="lg:col-span-7 flex flex-col items-start gap-space-md">
              <h1 className="font-display-xl text-display-xl-mobile lg:text-display-xl text-primary tracking-tight">
                Reservasi Kamar Hotel Nyaman & Praktis
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Temukan berbagai pilihan tipe kamar dengan fasilitas lengkap
                untuk keperluan bisnis maupun liburan keluarga. Jaminan harga
                jujur dan koneksi stabil.
              </p>
              <div className="flex flex-wrap items-center gap-space-sm pt-space-2xs">
                <a
                  className="group inline-flex items-center gap-space-xs px-space-xl py-space-sm rounded-full bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg shadow-[0_8px_20px_rgba(14,47,118,0.22)] hover:shadow-[0_12px_28px_rgba(14,47,118,0.3)] hover:-translate-y-1 transition-all duration-300"
                  href="#quick-booking"
                >
                  <span>Eksplor Kamar & Suites</span>
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
                    arrow_outward
                  </span>
                </a>
                <a
                  href="#ai-assistant"
                  className="group/ai flex items-center gap-space-xs px-space-md py-space-sm rounded-full bg-surface-container-lowest text-primary shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:text-primary transition-all duration-300 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px] group-hover/ai:animate-pulse">
                    smart_toy
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface group-hover/ai:text-primary transition-colors">
                    Tanya AI Asisten
                  </span>
                </a>
              </div>
            </div>

            {/* Hero Visual Showcase / Stacked Cards */}
            <div className="lg:col-span-5 relative group">
              {/* Main Architectural Frame */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl bg-surface-container-lowest p-space-xs hover:shadow-[0_20px_40px_rgba(14,47,118,0.2)] transition-shadow duration-500">
                <div className="relative w-full h-[400px] lg:h-[480px] xl:h-[540px] rounded-lg overflow-hidden">
                  <Image
                    src="/images/hero-hotel.png"
                    alt="SiniBook Hotel"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* VIP Ticket / Boarding Pass Floating Card */}
                  <div className="absolute bottom-space-md left-space-md right-space-md flex shadow-2xl transform group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500">
                    
                    {/* Main Ticket Body */}
                    <div className="flex-1 bg-surface-bright/95 backdrop-blur-xl p-space-md rounded-l-2xl border-r-[3px] border-dashed border-outline-variant/60 relative">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="material-symbols-outlined text-[14px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>local_activity</span>
                        <span className="font-label-sm text-[10px] text-secondary tracking-widest uppercase font-bold">
                          VIP BOARDING PASS
                        </span>
                      </div>
                      <p className="font-headline-sm text-headline-sm text-primary leading-none tracking-tight">
                        SiniBook Hotel
                      </p>
                      
                      {/* Fake Barcode Graphic */}
                      <div className="flex items-end gap-[3px] h-5 mt-3 opacity-50">
                        <div className="w-1.5 h-full bg-on-surface-variant"></div>
                        <div className="w-[1px] h-full bg-on-surface-variant"></div>
                        <div className="w-1 h-full bg-on-surface-variant"></div>
                        <div className="w-2 h-full bg-on-surface-variant"></div>
                        <div className="w-[1px] h-full bg-on-surface-variant"></div>
                        <div className="w-1.5 h-full bg-on-surface-variant"></div>
                        <div className="w-1 h-full bg-on-surface-variant"></div>
                        <div className="w-[2px] h-full bg-on-surface-variant"></div>
                        <div className="w-2 h-full bg-on-surface-variant"></div>
                        <span className="font-mono text-[9px] text-on-surface-variant ml-2 leading-none font-bold">SNB-001</span>
                      </div>
                    </div>

                    {/* Ticket Stub / Tear-off portion */}
                    <div className="w-[100px] bg-surface-bright/95 backdrop-blur-xl rounded-r-2xl flex flex-col items-center justify-center relative overflow-hidden">
                      <p className="font-label-sm text-[9px] text-secondary uppercase tracking-widest font-bold rotate-90 absolute -right-6 top-1/2 -translate-y-1/2 opacity-40 whitespace-nowrap origin-center">
                        ADMIT ONE
                      </p>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(14,47,118,0.3)] transition-all duration-300 z-10">
                        <span className="material-symbols-outlined text-[24px]">
                          location_on
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING STATS / SOCIAL PROOF BAR */}
          <div className="w-full bg-surface-container-lowest rounded-2xl lg:rounded-full p-space-md lg:py-space-md lg:px-space-xl shadow-[0_16px_36px_rgba(14,47,118,0.08)] border border-surface-container-highest">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant/30 gap-y-space-md">
              {/* Stat 1 */}
              <div className="flex flex-col items-center justify-center py-space-sm group cursor-default">
                <div className="flex items-center gap-space-xs text-primary mb-1">
                  <span className="material-symbols-outlined text-[28px] group-hover:scale-110 transition-transform duration-300">bedroom_parent</span>
                  <span className="font-display-xl-mobile text-[32px] lg:text-headline-lg font-bold tracking-tight">150+</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Kamar Premium</span>
              </div>
              
              {/* Stat 2 */}
              <div className="flex flex-col items-center justify-center py-space-sm group cursor-default">
                <div className="flex items-center gap-space-xs text-primary mb-1">
                  <span className="material-symbols-outlined text-[28px] text-amber-500 group-hover:scale-110 transition-transform duration-300">star</span>
                  <span className="font-display-xl-mobile text-[32px] lg:text-headline-lg font-bold tracking-tight">4.9/5</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Rating Tamu</span>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center justify-center py-space-sm group cursor-default">
                <div className="flex items-center gap-space-xs text-primary mb-1">
                  <span className="material-symbols-outlined text-[28px] group-hover:scale-110 transition-transform duration-300">room_service</span>
                  <span className="font-display-xl-mobile text-[32px] lg:text-headline-lg font-bold tracking-tight">24/7</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Layanan Kamar</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
