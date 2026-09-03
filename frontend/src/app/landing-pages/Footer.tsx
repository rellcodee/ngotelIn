"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Terima kasih! Email ${email} telah berhasil berlangganan berita promo NgotelIn.`);
      setEmail("");
    }
  };

  return (
    <footer className="bg-surface-container-lowest pt-space-4xl pb-space-lg relative z-10 border-t border-surface-container" id="kontak">
      <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-2xl mb-space-3xl">
          
          {/* Brand & Address */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-space-md">
              <span className="material-symbols-outlined text-[32px] text-primary">apartment</span>
              <span className="font-display-xl text-headline-md text-primary tracking-tight">NgotelIn<span className="text-secondary">.</span></span>
            </Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-lg leading-relaxed">
              Pengalaman menginap terbaik bintang 4 dengan pelayanan ramah dan fasilitas modern terlengkap di Jakarta.
            </p>
            
            <div className="flex items-start gap-space-2xs text-on-surface-variant mb-space-sm">
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">location_on</span>
              <p className="font-body-sm text-body-sm">Jl. Sudirman No. 123<br />Jakarta Pusat</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-lg">Pintasan</h4>
            <ul className="space-y-space-sm">
              <li><Link href="/" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Beranda</Link></li>
              <li><Link href="/kamar" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Kamar</Link></li>
              <li><Link href="/#fasilitas" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Fasilitas</Link></li>
              <li><Link href="/#tentang-kami" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Tentang Kami</Link></li>
              <li><Link href="/#faq" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/#kontak" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Kontak</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-lg">Hubungi Kami</h4>
            <ul className="space-y-space-md mb-space-xl">
              <li>
                <a href="tel:+62215557890" className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  +62 21 555 7890
                </a>
              </li>
              <li>
                <a href="mailto:info@sinibookhotel.com" className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  info@sinibookhotel.com
                </a>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="flex items-center gap-space-sm">
              <a href="#facebook" aria-label="Facebook" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors border border-surface-container">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#instagram" aria-label="Instagram" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors border border-surface-container">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#youtube" aria-label="Youtube" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors border border-surface-container">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-lg">Buletin Eksklusif</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">Berlangganan untuk menerima penawaran khusus dan promo eksklusif.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-space-xs">
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Alamat email Anda" 
                  required
                  className="w-full bg-surface border border-surface-container rounded-full px-space-lg py-space-sm font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                />
              </div>
              <button type="submit" className="w-full bg-primary text-on-primary rounded-full px-space-lg py-space-sm font-label-lg text-label-lg transition-colors hover:shadow-md hover:-translate-y-0.5">
                Berlangganan
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-space-xl border-t border-surface-container flex flex-col md:flex-row items-center justify-between gap-space-md">
          <p className="font-body-sm text-body-sm text-on-surface-variant">&copy; 2024 NgotelIn. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-space-lg">
            <Link href="/#privasi" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Kebijakan Privasi</Link>
            <Link href="/#syarat" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Syarat &amp; Ketentuan</Link>
            <Link href="/#bantuan" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Pusat Bantuan</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
