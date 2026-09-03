"use client";

import React from "react";
import Image from "next/image";

const testimonialsData = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "Pengusaha",
    rating: 5,
    comment: "Pelayanan sangat ramah, kamar bersih dan wangi. Kolam renang rooftop-nya menawarkan pemandangan kota Jakarta yang mengagumkan!",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    role: "Wisatawan",
    rating: 5,
    comment: "Proses check-in cepat dan mudah. Sarapan restoran hotelnya sangat variatif dengan cita rasa nusantara yang lezat sekali.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 3,
    name: "Deni Gunawan",
    role: "Pekerja Eksekutif",
    rating: 5,
    comment: "Fasilitas Wi-Fi sangat cepat dan stabil, sangat membantu untuk urusan pekerjaan dan meeting bisnis daring saya di kamar.",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 4,
    name: "Rini Pratama",
    role: "Keluarga",
    rating: 5,
    comment: "Tempat menginap terbaik untuk liburan keluarga akhir pekan. Anak-anak sangat senang bermain di kolam dan fasilitas spanya menenangkan.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-space-3xl lg:py-space-4xl relative overflow-hidden" id="ulasan">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-full bg-surface-container-lowest rounded-[4rem] -z-10 shadow-2xl"></div>
      <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-space-2xl">
          <div className="inline-flex items-center justify-center gap-space-2xs text-secondary mb-space-sm">
            <span className="material-symbols-outlined text-[20px]">forum</span>
            <span className="font-label-md text-label-md uppercase tracking-widest">Suara Tamu</span>
          </div>
          <h2 className="font-display-xl text-headline-lg lg:text-display-xl text-primary mb-space-md tracking-tight">
            Testimoni Tamu Kami.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Apa kata para tamu mengenai pengalaman menginap di NgotelIn.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            {testimonialsData.map((item) => (
              <div 
                key={item.id} 
                className="bg-surface border border-surface-container p-space-xl rounded-[2rem] shadow-sm relative group hover:shadow-lg transition-shadow flex flex-col justify-between"
              >
                <span className="material-symbols-outlined absolute top-space-xl right-space-xl text-[64px] text-surface-container opacity-50 font-light">format_quote</span>
                
                <div>
                  <div className="flex gap-1 text-amber-500 mb-space-md relative z-10">
                    {[...Array(item.rating)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="font-body-lg text-body-lg text-on-surface mb-space-xl italic relative z-10">
                    "{item.comment}"
                  </p>
                </div>
                
                <div className="flex items-center gap-space-md relative z-10">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary-container">
                    <Image 
                      src={item.avatar} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">{item.name}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
