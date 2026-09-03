"use client";

import React, { useState } from "react";

const faqData = [
  {
    id: 1,
    question: "Jam berapa waktu check-in dan check-out di NgotelIn?",
    answer: "Waktu check-in resmi mulai pukul 14:00 WIB dan check-out maksimal pukul 12:00 WIB. Resepsionis kami beroperasi 24 jam untuk melayani kedatangan Anda kapan pun.",
  },
  {
    id: 2,
    question: "Apakah seluruh pemesanan kamar sudah termasuk sarapan gratis?",
    answer: "Ya, seluruh reservasi kamar di NgotelIn sudah termasuk prasmanan sarapan gratis untuk 2 orang tamu di Restoran Utama kami.",
  },
  {
    id: 3,
    question: "Bagaimana kebijakan pembatalan pesanan / refund?",
    answer: "Kami menyediakan jaminan pembatalan gratis tanpa biaya hingga H-1 (24 jam) sebelum tanggal check-in yang telah Anda pilih.",
  },
  {
    id: 4,
    question: "Apakah tersedia fasilitas layanan antar-jemput bandara?",
    answer: "Ya, kami menyediakan layanan shuttle bus dan mobil privat untuk antar-jemput bandara 24 jam. Anda dapat memesannya saat proses pendaftaran.",
  },
  {
    id: 5,
    question: "Fasilitas apa saja yang dapat diakses gratis oleh tamu?",
    answer: "Seluruh tamu menginap berhak mengakses Kolam Renang Rooftop outdoor, Fitness Center 24 Jam, serta koneksi Wi-Fi cepat tanpa batas di seluruh area hotel.",
  },
];

export default function FaqSection() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section className="py-space-3xl lg:py-space-4xl bg-surface-container-lowest relative z-10" id="faq">
      <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-start">
          
          {/* KOLOM KIRI: JUDUL & KONTAK */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-space-2xs text-secondary mb-space-xs">
              <span className="material-symbols-outlined text-[20px]">help_center</span>
              <span className="font-label-md text-label-md uppercase tracking-widest">Pusat Bantuan</span>
            </div>
            <h2 className="font-display-xl text-headline-lg lg:text-display-xl text-primary mb-space-md tracking-tight">
              Pertanyaan Umum.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg">
              Temukan jawaban cepat mengenai layanan, fasilitas, dan prosedur menginap di NgotelIn.
            </p>
            
            <div className="bg-surface-container-low p-space-lg rounded-2xl border border-surface-container mt-space-xl">
              <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">Butuh bantuan lain?</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">Tim kami siap membantu Anda 24/7.</p>
              <a href="#" className="inline-flex items-center justify-center w-full gap-space-2xs px-space-md py-space-sm rounded-full bg-primary text-on-primary font-label-lg text-label-lg transition-colors hover:shadow-md">
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Hubungi Kami</span>
              </a>
            </div>
          </div>

          {/* KOLOM KANAN: ACCORDION FAQ */}
          <div className="lg:col-span-8 space-y-space-md">
            {faqData.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className={`bg-surface border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md ${isOpen ? "border-primary/30 shadow-sm" : "border-surface-container"}`}
                >
                  <button 
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-space-lg py-space-md flex items-center justify-between text-left gap-space-md group bg-transparent border-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className={`font-headline-sm text-headline-sm transition-colors ${isOpen ? "text-primary" : "text-on-surface group-hover:text-primary"}`}>
                      {faq.question}
                    </span>
                    <span className={`material-symbols-outlined icon text-outline transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-primary" : ""}`}>
                      expand_more
                    </span>
                  </button>
                  
                  {/* ISI JAWABAN */}
                  <div 
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-space-lg pb-space-lg">
                        <p className="font-body-md text-body-md text-on-surface-variant pt-space-xs border-t border-surface-container">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
