"use client";

import React from "react";
import Image from "next/image";
import { whyUsData } from "./WhyUsSection";

export default function HeroSection() {
  return (
    <section className="relative w-full pt-28 md:pt-32 lg:pt-36 pb-16 md:pb-20 lg:pb-28 bg-surface-bright flex flex-col items-center">
      {/* Main Hero Container */}
      <div className="relative w-full max-w-container-max mx-auto rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] overflow-hidden bg-[#EBF6F4] min-h-[450px] sm:min-h-[500px] md:min-h-[550px] lg:min-h-[640px] flex items-center shadow-sm">
        {/* Background Image Layer (Right Side) */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[70%] lg:w-[65%] z-0">
          <Image
            src="/images/hero-hotel.png"
            alt="Hotel Resort"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient Overlay for blending image with the left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EBF6F4] via-[#EBF6F4]/90 md:via-[#EBF6F4]/70 to-transparent w-full lg:w-[95%]"></div>
          {/* Mobile bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#EBF6F4] via-[#EBF6F4]/40 to-transparent md:hidden"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full px-5 sm:px-8 md:px-12 lg:px-16 py-12 md:py-16 lg:py-0">
          <div className="max-w-[280px] sm:max-w-md md:max-w-xl lg:max-w-2xl">
            <h1 className="font-display-xl text-[32px] sm:text-[40px] md:text-[48px] lg:text-[64px] text-primary font-bold leading-[1.1] tracking-tight mb-4 md:mb-5 lg:mb-6">
              Reservasi Kamar <br className="hidden md:block" /> Hotel{" "}
              <span className="text-primary">Nyaman & Praktis</span>
            </h1>

            <p className="font-body-lg text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] text-on-surface-variant max-w-lg mb-6 md:mb-8 lg:mb-10 leading-relaxed">
              Temukan berbagai pilihan tipe kamar dengan fasilitas lengkap untuk
              keperluan bisnis maupun liburan keluarga. Jaminan harga jujur dan
              koneksi stabil.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
              <a
                className="group inline-flex justify-center items-center gap-2 px-5 py-3 md:px-6 md:py-3.5 rounded-full bg-primary hover:bg-primary/90 text-on-primary text-[14px] md:text-[16px] font-bold shadow-md hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-300"
                href="/kamar"
              >
                <span>Melihat Kamar</span>
                <span className="material-symbols-outlined text-[18px] md:text-[20px] group-hover:translate-x-1 transition-transform duration-300">
                  arrow_forward
                </span>
              </a>
              <a
                href="#ai-assistant"
                className="group/ai flex justify-center items-center gap-2.5 md:gap-3 pr-5 p-1.5 md:pr-6 md:p-1.5 rounded-full bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer border border-surface-container-low"
              >
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-surface-container-high group-hover/ai:bg-primary group-hover/ai:text-white group-hover/ai:scale-110 flex items-center justify-center text-primary transition-all duration-300">
                  <span className="material-symbols-outlined text-[18px] md:text-[22px] group-hover/ai:animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                    support_agent
                  </span>
                </div>
                <span className="text-[14px] md:text-[16px] font-bold text-on-surface group-hover/ai:text-primary transition-colors">
                  AI Assistant
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING FEATURES CARD */}
      <div className="relative z-20 w-full max-w-container-max mx-auto px-4 md:px-8 mt-6 md:-mt-10 lg:-mt-16 group/card">
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] py-5 px-3 sm:px-6 md:py-6 md:px-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_24px_80px_rgba(14,108,76,0.1)] group-hover/card:-translate-y-2 transition-all duration-500 border border-surface-container-low">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-surface-container gap-y-4 lg:gap-y-0">
            {whyUsData.slice(0, 4).map((item, index) => (
              <div key={item.id} className={`flex items-center gap-3 sm:gap-4 px-2 sm:px-4 md:px-6 group cursor-pointer hover:-translate-y-1 transition-transform duration-300 ${index > 1 ? 'pt-4 lg:pt-0' : index > 0 && index < 2 ? 'pt-0' : ''}`}>
                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                  <span
                    className="material-symbols-outlined text-[20px] md:text-[24px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {item.icon}
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <h4 className="text-[13px] sm:text-[14px] md:text-[15px] font-bold text-on-surface tracking-tight mb-0.5">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
