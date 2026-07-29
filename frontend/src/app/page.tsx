// Halaman Utama Website SiniBook Hotel (Landing Page)
// Berisi gabungan seluruh komponen frontend modern persis sesuai desain mockup

import React from "react"; // Mengimpor React
import Header from "./landing-pages/Header"; // Mengimpor komponen Navigasi Header
import HeroSection from "./landing-pages/HeroSection"; // Mengimpor komponen Banner Hero & Form Pencarian
import PromoSection from "./landing-pages/PromoSection"; // Mengimpor komponen Kartu Promo Spesial
import WhyUsSection from "./landing-pages/WhyUsSection"; // Mengimpor komponen 5 Keunggulan Hotel
import FacilitiesSection from "./landing-pages/FacilitiesSection"; // Mengimpor komponen Fasilitas Hotel
import AboutSection from "./landing-pages/AboutSection"; // Mengimpor komponen Profil Tentang Kami & Video Tour
import TestimonialSection from "./landing-pages/TestimonialSection"; // Mengimpor komponen Testimoni Tamu
import FaqSection from "./landing-pages/FaqSection"; // Mengimpor komponen FAQ Pertanyaan Populer
import Footer from "./landing-pages/Footer"; // Mengimpor komponen Footer & Newsletter
import AiAssistantModal from "./landing-pages/AiAssistantModal"; // Mengimpor komponen AI Assistant Floating Widget

// Komponen Home: Entry point utama halaman beranda website
export default function Home() {
  return (
    // Pembungkus utama layout halaman web
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#0B4F37] selection:text-white">
      
      {/* 1. Navigasi Header bagian paling atas */}
      <Header />

      {/* Main Content Area */}
      <main className="w-full flex-1">
        {/* 2. Banner Utama Hero & Form Pencarian Tanggal/Kamar */}
        <HeroSection />

        {/* 3. Section Promo Spesial (3 Kartu Promo) */}
        <PromoSection />

        {/* 4. Section Mengapa Memilih SiniBook Hotel (5 Keunggulan) */}
        <WhyUsSection />

        {/* 5. Section Fasilitas Hotel (6 Fasilitas Mewah) */}
        <FacilitiesSection />

        {/* 6. Section Tentang SiniBook Hotel & Preview Video */}
        <AboutSection />

        {/* 7. Section Testimoni Tamu (4 Ulasan Tamu) */}
        <TestimonialSection />

        {/* 8. Section Pertanyaan Populer FAQ (#faq) */}
        <FaqSection />
      </main>

      {/* 8. Catatan Kaki Footer di bagian bawah */}
      <Footer />

      {/* 9. Floating Widget AI Assistant (Tampilan Sesuai Gambar Design Screenshot 2) */}
      <AiAssistantModal />

    </div>
  );
}
