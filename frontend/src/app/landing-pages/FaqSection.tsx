"use client";

import React, { useState } from "react";

const faqData = [
  {
    id: 1,
    question: "Jam berapa waktu check-in dan check-out di SiniBook?",
    answer:
      "Waktu check-in resmi mulai pukul 14:00 WIB dan check-out maksimal pukul 12:00 WIB. Resepsionis kami beroperasi 24 jam untuk melayani kedatangan Anda kapan pun.",
  },
  {
    id: 2,
    question: "Apakah seluruh pemesanan kamar sudah termasuk sarapan gratis?",
    answer:
      "Ya, seluruh reservasi kamar di SiniBook sudah termasuk prasmanan sarapan gratis untuk 2 orang tamu di Restoran Utama kami.",
  },
  {
    id: 3,
    question: "Bagaimana kebijakan pembatalan pesanan / refund?",
    answer:
      "Kami menyediakan jaminan pembatalan gratis tanpa biaya hingga H-1 (24 jam) sebelum tanggal check-in yang telah Anda pilih.",
  },
  {
    id: 4,
    question: "Apakah tersedia fasilitas layanan antar-jemput bandara?",
    answer:
      "Ya, kami menyediakan layanan shuttle bus dan mobil privat untuk antar-jemput bandara 24 jam. Anda dapat memesannya saat proses pendaftaran.",
  },
  {
    id: 5,
    question: "Fasilitas apa saja yang dapat diakses gratis oleh tamu?",
    answer:
      "Seluruh tamu menginap berhak mengakses Kolam Renang Rooftop outdoor, Fitness Center 24 Jam, serta koneksi Wi-Fi cepat tanpa batas di seluruh area hotel.",
  },
];

export default function FaqSection() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section
      className="py-16 md:py-20 lg:py-28 bg-surface-container-lowest relative z-10"
      id="faq"
    >
      <div className="max-w-container-max mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* KOLOM KIRI: JUDUL & KONTAK */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <h2 className="font-display-xl font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-primary mb-3 md:mb-5 tracking-tight">
              Pertanyaan Umum.
            </h2>
            <p className="font-body-lg text-[14px] sm:text-[16px] md:text-[18px] text-on-surface-variant mb-6 md:mb-8 lg:mb-10">
              Temukan jawaban cepat mengenai layanan, fasilitas, dan prosedur
              menginap di SiniBook.
            </p>

            <div className="bg-surface-container-low p-6 md:p-8 rounded-2xl border border-surface-container mt-6 md:mt-10 lg:mt-12">
              <h4 className="font-bold text-[18px] md:text-[20px] text-on-surface mb-2">
                Butuh bantuan lain?
              </h4>
              <p className="text-[13px] md:text-[14px] text-on-surface-variant mb-4 md:mb-6">
                Tim kami siap membantu Anda 24/7.
              </p>
              <a
                href="#"
                className="inline-flex items-center justify-center w-full gap-2 px-5 py-3 md:px-6 md:py-3.5 rounded-full bg-primary text-on-primary font-bold text-[14px] md:text-[16px] transition-all hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                  chat
                </span>
                <span>Hubungi Kami</span>
              </a>
            </div>
          </div>

          {/* KOLOM KANAN: ACCORDION FAQ */}
          <div className="lg:col-span-8 space-y-3 md:space-y-4 lg:space-y-5">
            {faqData.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`bg-surface border rounded-2xl md:rounded-[1.25rem] overflow-hidden transition-all duration-300 hover:shadow-md ${isOpen ? "border-primary/30 shadow-sm" : "border-surface-container"}`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-5 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6 flex items-center justify-between text-left gap-4 md:gap-6 group bg-transparent border-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`font-bold text-[15px] sm:text-[16px] md:text-[18px] transition-colors leading-snug ${isOpen ? "text-primary" : "text-on-surface group-hover:text-primary"}`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`material-symbols-outlined icon text-outline text-[20px] md:text-[24px] transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-primary" : ""}`}
                    >
                      expand_more
                    </span>
                  </button>

                  {/* ISI JAWABAN */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 md:px-6 lg:px-8 pb-5 md:pb-6 lg:pb-8">
                        <p className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] text-on-surface-variant pt-4 md:pt-5 lg:pt-6 border-t border-surface-container leading-relaxed">
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
