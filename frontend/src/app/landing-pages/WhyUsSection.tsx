"use client";

import React from "react";

export const whyUsData = [
  {
    id: 1,
    icon: "location_on",
    title: "Lokasi Strategis",
    description: "Dekat pusat kota dan akses transportasi mudah.",
  },
  {
    id: 2,
    icon: "bed",
    title: "Kamar Nyaman",
    description: "Kasur empuk dengan seprai berkualitas premium.",
  },
  {
    id: 3,
    icon: "cleaning_services",
    title: "Kebersihan Terjamin",
    description: "Kamar selalu steril dan bersih setiap hari.",
  },
  {
    id: 4,
    icon: "support_agent",
    title: "Tini Bot",
    description: "Siap membantu 24/7 untuk info hotel.",
  },
  {
    id: 5,
    icon: "security",
    title: "Keamanan 24 Jam",
    description: "Akses kunci kartu digital dan pengawasan CCTV.",
  },
];

export default function WhyUsSection() {
  return (
    <section
      className="py-16 md:py-20 lg:py-28 bg-surface relative z-10"
      id="experience"
    >
      <div className="max-w-container-max mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="font-display-xl font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-primary mb-3 md:mb-5 tracking-tight">
            Mengapa Memilih SiniBook?
          </h2>
          <p className="font-body-lg text-[14px] sm:text-[16px] md:text-[18px] text-on-surface-variant">
            Berbagai keunggulan yang membuat pengalaman menginap Anda makin
            istimewa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {whyUsData.map((item, index) => (
            <div
              key={item.id}
              className={`bg-surface-container-lowest rounded-2xl md:rounded-[2rem] p-6 sm:p-8 lg:p-10 border border-surface-container shadow-[0_8px_24px_rgba(14,47,118,0.06)] hover:shadow-[0_16px_40px_rgba(14,47,118,0.12)] hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center justify-center group ${
                index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
              } ${index === 4 ? "sm:col-span-2 lg:col-span-2" : ""}`}
            >
              <div
                className={`rounded-full bg-surface-container-low flex items-center justify-center text-primary mb-4 md:mb-6 lg:mb-8 group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300 ${
                  index === 0 ? "w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28" : "w-16 h-16 md:w-20 md:h-20"
                }`}
              >
                <span
                  className={`material-symbols-outlined ${
                    index === 0 ? "text-[36px] md:text-[48px] lg:text-[56px]" : "text-[28px] md:text-[36px]"
                  }`}
                >
                  {item.icon}
                </span>
              </div>
              <h3
                className={`font-bold text-on-surface mb-2 md:mb-3 ${
                  index === 0
                    ? "text-[20px] md:text-[24px] lg:text-[32px]"
                    : "text-[18px] md:text-[20px]"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`text-on-surface-variant leading-relaxed ${
                  index === 0
                    ? "text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] max-w-md"
                    : "text-[14px] md:text-[15px]"
                }`}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
