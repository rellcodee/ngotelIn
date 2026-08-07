// Halaman Tentang Hotel SiniBook Hotel (/about)
// Menampilkan profil lengkap, sejarah, visi misi, keunggulan, statistik, dan video tour hotel

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Users,
  CheckCircle2,
  MapPin,
  Sparkles,
  Clock,
  ShieldCheck,
  Coffee,
  Heart,
  Play,
  X,
  ArrowRight,
  BookOpen,
} from "lucide-react";

import Header from "../landing-pages/Header";
import Footer from "../landing-pages/Footer";


export default function AboutPage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-[#0B4F37] selection:text-white">
      {/* 1. Header Navigation */}
      <Header activePage="about" />

      <main className="w-full flex-1">
        {/* 2. Hero Banner */}
        <section className="relative w-full overflow-hidden bg-[#073524] py-24 sm:py-28 md:py-32 text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
              alt="Tentang SiniBook Hotel"
              fill
              priority
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B4F37]/20 via-[#073524]/50 to-[#073524]/85" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md border border-emerald-400/30 mb-4">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Profil SiniBook Hotel</span>
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-white">
              Kemewahan & Kenyamanan Sejati
            </h1>

            <p className="mt-4 text-sm sm:text-base md:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto font-light">
              Mengenal lebih dekat SiniBook Hotel, hotel bintang 4 premium di jantung kota Jakarta yang menggabungkan pelayanan hangat khas Indonesia dengan fasilitas kelas dunia.
            </p>
          </div>
        </section>

        {/* 3. Sejarah & Visi Misi Section */}
        <section className="w-full py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
              
              {/* Kolom Kiri: Sejarah */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl border-b-2 border-emerald-500 pb-3 inline-block">
                  Sejarah & Komitmen Kami
                </h2>
                <p className="mt-6 text-sm sm:text-base text-gray-600 leading-relaxed font-light">
                  Didirikan pada tahun 2019, SiniBook Hotel lahir dari visi untuk menciptakan tempat perlindungan perkotaan (*urban sanctuary*) yang menyajikan ketenangan di tengah hiruk-pikuk kota metropolitan Jakarta. Kami memulai perjalanan dengan komitmen sederhana: mengutamakan kepuasan tamu di atas segalanya.
                </p>
                <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed font-light">
                  Hingga hari ini, kami terus berinovasi dalam meningkatkan standar pelayanan kami. Dari arsitektur ramah lingkungan hingga integrasi teknologi asisten AI untuk kemudahan menginap, kami memastikan setiap detik waktu yang Anda habiskan bersama kami bernilai luar biasa.
                </p>
              </div>

              {/* Kolom Kanan: Visi & Misi */}
              <div className="space-y-6">
                {/* Visi */}
                <div className="rounded-2xl bg-emerald-50/50 p-6 border border-emerald-100/80">
                  <h3 className="text-lg font-bold text-[#0B4F37] flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5" />
                    <span>Visi Kami</span>
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-light">
                    Menjadi hotel pilihan utama di Jakarta yang dikenal secara internasional atas keunggulan layanan, kenyamanan premium, dan inovasi ramah lingkungan yang berkelanjutan.
                  </p>
                </div>

                {/* Misi */}
                <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200/60">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    <span>Misi Kami</span>
                  </h3>
                  <ul className="text-sm text-gray-600 leading-relaxed font-light space-y-2 list-disc pl-4">
                    <li>Menyediakan akomodasi bintang 4 premium dengan kebersihan dan keamanan berstandar tinggi.</li>
                    <li>Menyajikan hidangan lokal dan internasional bercita rasa tinggi melalui chef profesional.</li>
                    <li>Melatih staf hotel secara berkelanjutan demi menciptakan keramahtamahan prima.</li>
                    <li>Mendukung kelestarian lingkungan dengan program efisiensi energi di seluruh operasional hotel.</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Statistik Hotel Section */}
        <section className="w-full py-12 sm:py-16 bg-[#0B4F37] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
              
              {/* Stat 1 */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">5+</div>
                <div className="mt-2 text-xs sm:text-sm font-medium text-emerald-100/80">Tahun Melayani</div>
              </div>

              {/* Stat 2 */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">150+</div>
                <div className="mt-2 text-xs sm:text-sm font-medium text-emerald-100/80">Kamar Premium</div>
              </div>

              {/* Stat 3 */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">20.000+</div>
                <div className="mt-2 text-xs sm:text-sm font-medium text-emerald-100/80">Tamu Bahagia</div>
              </div>

              {/* Stat 4 */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">5+</div>
                <div className="mt-2 text-xs sm:text-sm font-medium text-emerald-100/80">Penghargaan Nasional</div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. Keunggulan Kami Section */}
        <section className="w-full py-16 sm:py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Mengapa Memilih SiniBook Hotel?
              </h2>
              <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto font-light">
                Keunggulan utama kami yang dirancang khusus untuk memastikan kenyamanan menginap yang memuaskan.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Poin 1 */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#0B4F37]">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-950 text-sm sm:text-base">Layanan Kamar 24 Jam</h3>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed font-light">Staf kami selalu siap sedia membantu menyajikan hidangan hangat atau keperluan kamar Anda kapan pun dibutuhkan.</p>
                </div>
              </div>

              {/* Poin 2 */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#0B4F37]">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-950 text-sm sm:text-base">Lokasi Strategis</h3>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed font-light">Berada tepat di pusat kota Jakarta, memberikan akses mudah ke berbagai pusat bisnis, perbelanjaan, dan hiburan.</p>
                </div>
              </div>

              {/* Poin 3 */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#0B4F37]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-950 text-sm sm:text-base">Kebersihan Terjamin</h3>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed font-light">Kami menerapkan standar sanitasi dan kebersihan yang ketat untuk menjamin keamanan dan kenyamanan menginap Anda.</p>
                </div>
              </div>

              {/* Poin 4 */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#0B4F37]">
                  <Coffee className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-950 text-sm sm:text-base">Koki Berkelas Internasional</h3>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed font-light">Nikmati hidangan legendaris bercita rasa tinggi buatan koki pemenang penghargaan di SiniRestaurant.</p>
                </div>
              </div>

              {/* Poin 5 */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#0B4F37]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-950 text-sm sm:text-base">Fasilitas Lengkap</h3>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed font-light">Dari rooftop infinity pool, gym dengan pemandangan kota, hingga spa holistik untuk menyegarkan pikiran Anda.</p>
                </div>
              </div>

              {/* Poin 6 */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#0B4F37]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-950 text-sm sm:text-base">Keamanan 24/7</h3>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed font-light">Sistem keamanan terintegrasi dengan kartu akses kamar privat, CCTV 24 jam, dan petugas keamanan profesional.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Video Tour Hotel Section */}
        <section className="w-full py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Intip Suasana Menginap Melalui Video Tour Kami
                </h2>
                <p className="mt-4 text-sm sm:text-base text-gray-500 leading-relaxed font-light">
                  Lihat langsung keindahan lobi hotel yang megah, detail interior kamar yang nyaman, pemandangan rooftop pool yang menakjubkan, dan kemewahan restoran kami melalui tur video singkat ini.
                </p>
                <div className="mt-6 flex flex-wrap gap-4 items-center">
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="flex items-center gap-2 rounded-full bg-[#0B4F37] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#073524] hover:shadow-lg active:scale-95"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>Putar Video Tour</span>
                  </button>
                  <Link
                    href="/kamar"
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#0B4F37] hover:text-[#073524] group"
                  >
                    <span>Pesan Kamar Sekarang</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Video Thumbnail */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-100">
                <div className="relative h-[320px] sm:h-[360px] w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
                    alt="SiniBook Hotel Video Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 transition-opacity hover:bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsVideoModalOpen(true)}
                      className="group flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-[#0B4F37] shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95"
                      aria-label="Putar Video Hotel"
                    >
                      <Play className="h-8 w-8 fill-current ml-1 transition-transform group-hover:scale-110" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Popup Modal Video */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/40"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="SiniBook Hotel Video Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. Footer */}
      <Footer />


    </div>
  );
}
