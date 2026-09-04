"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(
        `Terima kasih! Email ${email} telah berhasil berlangganan berita promo SiniBook.`,
      );
      setEmail("");
    }
  };

  return (
    <footer
      className="bg-[#EBF6F4] pt-16 md:pt-20 lg:pt-28 pb-8 md:pb-12 lg:pb-16 relative z-10 border-t border-primary/10"
      id="kontak"
    >
      <div className="max-w-container-max mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-10 md:gap-8 lg:gap-16 mb-12 md:mb-16 lg:mb-24">
          {/* Brand & Address */}
          <div className="lg:col-span-5 md:col-span-3 sm:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-4 md:mb-6"
            >
              <span className="material-symbols-outlined text-[28px] md:text-[32px] text-primary">
                apartment
              </span>
              <span className="font-display-xl text-[24px] md:text-[28px] text-primary tracking-tight">
                SiniBook<span className="text-secondary">.</span>
              </span>
            </Link>
            <p className="text-[14px] md:text-[15px] lg:text-[16px] text-on-surface-variant mb-6 md:mb-8 leading-relaxed max-w-sm">
              Pengalaman menginap terbaik bintang 4 dengan pelayanan ramah dan
              fasilitas modern terlengkap di Jakarta.
            </p>

            <div className="flex items-start gap-2 text-on-surface-variant mb-4">
              <span className="material-symbols-outlined text-[18px] md:text-[20px] shrink-0 mt-0.5">
                location_on
              </span>
              <p className="text-[13px] md:text-[14px] lg:text-[15px]">
                Jl. Sudirman No. 123
                <br />
                Jakarta Pusat
              </p>
            </div>
          </div>

          {/* Pintasan */}
          <div className="lg:col-span-3 lg:col-start-7 sm:col-span-1">
            <h4 className="font-bold text-[16px] md:text-[18px] text-on-surface mb-4 md:mb-6">
              Pintasan
            </h4>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <Link
                  href="/"
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/kamar"
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Kamar
                </Link>
              </li>
              <li>
                <Link
                  href="/#fasilitas"
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Fasilitas
                </Link>
              </li>
              <li>
                <Link
                  href="/#tentang-kami"
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/#ulasan"
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Testimoni
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/#kontak"
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="lg:col-span-3 sm:col-span-1">
            <h4 className="font-bold text-[16px] md:text-[18px] text-on-surface mb-4 md:mb-6">
              Hubungi Kami
            </h4>
            <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <li>
                <a
                  href="tel:+62215557890"
                  className="flex items-center gap-2 text-[14px] md:text-[15px] text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] md:text-[18px]">
                    call
                  </span>
                  +62 21 555 7890
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@sinibookhotel.com"
                  className="flex items-center gap-2 text-[14px] md:text-[15px] text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] md:text-[18px]">
                    mail
                  </span>
                  info@sinibookhotel.com
                </a>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="flex items-center gap-3">
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors border border-surface-container"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors border border-surface-container"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#youtube"
                aria-label="Youtube"
                className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors border border-surface-container"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 md:pt-10 border-t border-surface-container flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <p className="text-[13px] md:text-[14px] text-on-surface-variant text-center md:text-left">
            &copy; 2026 SiniBook. Hak Cipta Dilindungi.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-8">
            <Link
              href="/#privasi"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <Link
              href="/#syarat"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Syarat &amp; Ketentuan
            </Link>
            <Link
              href="/#bantuan"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Pusat Bantuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
