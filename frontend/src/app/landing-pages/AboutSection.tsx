"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function AboutSection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <>
      <section
        className="py-space-3xl lg:py-space-4xl bg-surface-container-lowest relative overflow-hidden"
        id="tentang-kami"
      >
        <div className="absolute -right-64 top-0 w-[800px] h-[800px] rounded-full bg-secondary-container/30 blur-3xl pointer-events-none"></div>
        <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl lg:gap-space-3xl items-center">
            {/* Visual Left Side */}
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden border border-surface-container shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
                  alt="NgotelIn Video Preview"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center transition-colors hover:bg-primary/10">
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="w-20 h-20 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center text-primary hover:scale-110 hover:text-on-surface transition-all shadow-[0_8px_32px_rgba(14,47,118,0.2)]"
                    aria-label="Putar Video Hotel"
                  >
                    <span
                      className="material-symbols-outlined text-[36px] ml-2"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      play_arrow
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Right Side */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-space-2xs text-secondary mb-space-sm">
                <span className="material-symbols-outlined text-[20px]">
                  import_contacts
                </span>
                <span className="font-label-md text-label-md uppercase tracking-widest">
                  Profil Hotel
                </span>
              </div>
              <h2 className="font-display-xl text-headline-lg lg:text-display-xl text-primary mb-space-md tracking-tight">
                Tentang NgotelIn
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg">
                NgotelIn merupakan hotel bintang 4 yang berlokasi di pusat kota
                Jakarta. Kami berkomitmen memberikan pengalaman menginap terbaik
                dengan fasilitas modern dan kenyamanan maksimal bagi para tamu.
              </p>

              <div className="flex flex-col gap-space-md mb-space-xl">
                {/* Point 1 */}
                <div className="flex gap-space-sm items-start">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-primary-container flex items-center justify-center text-primary mt-1">
                    <span className="material-symbols-outlined text-[24px]">
                      room_service
                    </span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">
                      Layanan Kamar 24 Jam
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Siap melayani kebutuhan Anda kapan saja.
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex gap-space-sm items-start">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-primary-container flex items-center justify-center text-primary mt-1">
                    <span className="material-symbols-outlined text-[24px]">
                      restaurant
                    </span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">
                      Restoran & Bar Mewah
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Sajian kuliner lezat dari koki berpengalaman.
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex gap-space-sm items-start">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-primary-container flex items-center justify-center text-primary mt-1">
                    <span className="material-symbols-outlined text-[24px]">
                      pool
                    </span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">
                      Kolam Renang Outdoor
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Fasilitas relaksasi menyegarkan di area terbuka.
                    </p>
                  </div>
                </div>

                {/* Point 4 */}
                <div className="flex gap-space-sm items-start">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-primary-container flex items-center justify-center text-primary mt-1">
                    <span className="material-symbols-outlined text-[24px]">
                      thumb_up
                    </span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">
                      Pengalaman Memuaskan
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Testimoni luar biasa dari tamu-tamu kami.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPUP MODAL VIDEO */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl border border-surface-container">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-full bg-surface-container-lowest/20 p-2 text-surface-container-lowest hover:bg-surface-container-lowest/40 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">
                close
              </span>
            </button>
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/UJEUwEJ6gH4?si=Dm_7bO7lEkqq_XpO?autoplay=1"
                title="NgotelIn Video Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
