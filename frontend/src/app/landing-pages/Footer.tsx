"use client"; // Client Component Next.js untuk interaksi form newsletter

import React, { useState } from "react"; // Mengimpor React dan useState untuk form email
import Link from "next/link"; // Mengimpor Link Next.js
import { Building2, Phone, Mail, MapPin, Send } from "lucide-react"; // Mengimpor ikon kontak dari lucide-react

// Komponen Footer: Bagian catatan kaki paling bawah dari website SiniBook Hotel
export default function Footer() {
  // State untuk menyimpan alamat email newsletter yang diinput pengguna
  const [email, setEmail] = useState("");

  // Handler pengiriman email berlangganan newsletter
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman
    if (email) {
      alert(`Terima kasih! Email ${email} telah berhasil berlangganan berita promo SiniBook.`);
      setEmail(""); // Reset input email setelah berhasil
    }
  };

  return (
    // Section Footer dengan background Hijau Tua Pekat (#073524)
    <footer className="w-full bg-[#073524] text-white pt-16 pb-8 border-t border-emerald-900/60" id="kontak">
      {/* Wrapper pembatas lebar konten */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* GRID FOOTER 4 KOLOM */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 pb-12 border-b border-emerald-800/40">
          
          {/* KOLOM 1: LOGO & INFORMASI KONTAK */}
          <div className="flex flex-col gap-4">
            {/* Logo SiniBook */}
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#126E4E] text-white">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                SiniBook
              </span>
            </div>

            {/* Deskripsi Singkat Hotel */}
            <p className="text-xs text-emerald-100/80 leading-relaxed font-light">
              Pengalaman menginap terbaik bintang 4 dengan pelayanan ramah dan fasilitas modern terlengkap di Jakarta.
            </p>

            {/* Informasi Alamat, Telepon & Email */}
            <div className="flex flex-col gap-2 pt-2 text-xs text-emerald-100/80">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Jl. Sudirman No. 123, Jakarta Pusat</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>+62 21 555 7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>info@sinibookhotel.com</span>
              </div>
            </div>
          </div>

          {/* KOLOM 2: NAVIGASI CEPAT */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Navigasi
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs text-emerald-100/80">
              <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="/kamar" className="hover:text-white transition-colors">Kamar</Link></li>
              <li><Link href="/#fasilitas" className="hover:text-white transition-colors">Fasilitas</Link></li>
              <li><Link href="/#tentang-kami" className="hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/#kontak" className="hover:text-white transition-colors">Kontak</Link></li>
            </ul>
          </div>

          {/* KOLOM 3: BANTUAN & LEGAL */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Bantuan
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs text-emerald-100/80">
              <li><Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/#privasi" className="hover:text-white transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/#syarat" className="hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="/#bantuan" className="hover:text-white transition-colors">Pusat Bantuan</Link></li>
            </ul>
          </div>

          {/* KOLOM 4: IKUTI KAMI & NEWSLETTER SUBSCRIBE */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Ikuti Kami
            </h3>
            
            {/* Ikon Sosial Media (Facebook, Instagram, Youtube Inline SVG) */}
            <div className="mt-4 flex items-center gap-3">
              {/* Facebook Icon */}
              <a href="#facebook" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-950 text-emerald-300 hover:bg-[#0B4F37] hover:text-white transition-colors">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* Instagram Icon */}
              <a href="#instagram" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-950 text-emerald-300 hover:bg-[#0B4F37] hover:text-white transition-colors">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* Youtube Icon */}
              <a href="#youtube" aria-label="Youtube" className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-950 text-emerald-300 hover:bg-[#0B4F37] hover:text-white transition-colors">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>

            {/* FORM NEWSLETTER BERLANGGANAN */}
            <p className="mt-5 text-xs text-emerald-100/80">
              Dapatkan informasi promo eksklusif terbaru dari kami:
            </p>
            <form onSubmit={handleSubscribe} className="mt-2 flex flex-col gap-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email Anda..."
                  required
                  className="w-full rounded-xl bg-emerald-950/80 border border-emerald-800 px-3.5 py-2.5 text-xs text-white placeholder-emerald-400/60 focus:border-emerald-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1 rounded-lg bg-[#0B4F37] px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors flex items-center gap-1"
                >
                  <span>Kirim</span>
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </form>
          </div>

        </div>



      </div>
    </footer>
  );
}
