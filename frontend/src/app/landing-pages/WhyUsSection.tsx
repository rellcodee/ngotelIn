"use client";

import React from "react";

const whyUsData = [
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
    title: "Staf Profesional",
    description: "Siap membantu 24 jam dengan ramah dan cekatan.",
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
    <section className="py-space-3xl lg:py-space-4xl bg-surface relative z-10" id="experience">
      <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop">
        
        <div className="text-center max-w-3xl mx-auto mb-space-2xl">
          <div className="inline-flex items-center justify-center gap-space-2xs text-secondary mb-space-sm">
            <span className="material-symbols-outlined text-[20px]">award_star</span>
            <span className="font-label-md text-label-md uppercase tracking-widest">Keunggulan Kami</span>
          </div>
          <h2 className="font-display-xl text-headline-lg lg:text-display-xl text-primary mb-space-md tracking-tight">
            Mengapa Memilih NgotelIn?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Berbagai keunggulan yang membuat pengalaman menginap Anda makin istimewa.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-space-lg">
          {whyUsData.map((item) => (
            <div
              key={item.id}
              className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.067rem)] bg-surface-container-lowest rounded-[2rem] p-space-xl border border-surface-container shadow-[0_8px_24px_rgba(14,47,118,0.06)] hover:shadow-[0_16px_40px_rgba(14,47,118,0.12)] hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center group"
            >
              <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center text-primary mb-space-lg group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300">
                <span className="material-symbols-outlined text-[36px]">{item.icon}</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-space-sm">
                {item.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
