"use client"; // Client Component Next.js untuk interaksi accordion buka/tutup FAQ

import React, { useState } from "react"; // Mengimpor React dan useState untuk melacak accordion mana yang sedang terbuka
import { ChevronDown, HelpCircle } from "lucide-react"; // Mengimpor ikon panah bawah dan bantuan dari lucide-react

// Array data 5 pertanyaan populer FAQ SiniBook Hotel
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

// Komponen FaqSection: Menampilkan Pertanyaan Populer dengan Accordion UI interaktif
export default function FaqSection() {
  // State untuk melacak ID pertanyaan FAQ yang sedang terbuka (default terbuka nomor 1)
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  // Toggle buka/tutup accordion
  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    // Section FAQ dengan id="faq" agar terhubung langsung dengan link FAQ di Footer
    <section className="w-full bg-gray-50/80 py-16 sm:py-20 text-gray-900 border-t border-gray-100" id="faq">
      {/* Wrapper pembatas lebar konten */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION: Judul & Subtitle FAQ */}
        <div className="text-center mb-12">
          {/* Badge Ikon FAQ */}
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-[#0B4F37] shadow-sm">
            <HelpCircle className="h-6 w-6" />
          </div>
          {/* Judul Utama */}
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Pertanyaan Sering Diajukan (FAQ)
          </h2>
          {/* Subtitle */}
          <p className="mt-2 text-sm text-gray-500 sm:text-base max-w-xl mx-auto font-light">
            Temukan jawaban cepat mengenai layanan, fasilitas, dan prosedur menginap di NgotelIn.
          </p>
        </div>

        {/* DAFTAR ACCORDION FAQ */}
        <div className="space-y-4">
          {faqData.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-200 hover:border-emerald-200"
              >
                {/* TOMBOL HEADER PERTANYAAN (KLIK UNTUK TOGGLE) */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-gray-50/80"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  {/* Ikon Panah Rotate saat Terbuka */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#0B4F37] text-white" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {/* TEKS JAWABAN ACCORDION (Tampil Saat State isOpen = true) */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-light border-t border-gray-100 bg-gray-50/40">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
