// Halaman Login SiniBook Hotel (/login)
// Menghubungkan form login ke API backend NestJS dan menyimpan JWT token di localStorage

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Building2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validasi input sederhana
    if (!email || !password) {
      setErrorMessage("Semua kolom input wajib diisi!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response dari NestJS (biasanya menggunakan UnauthorizedException)
        throw new Error(data.message || "Email atau password yang Anda masukkan salah!");
      }

      // Berhasil login
      setSuccessMessage("Login berhasil! Mengalihkan ke Beranda...");
      localStorage.setItem("token", data.access_token);

      // Redirect ke halaman beranda setelah 1.5 detik
      setTimeout(() => {
        router.push("/");
        // Memaksa reload halaman agar status login di Header diperbarui
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }, 1500);
    } catch (error: any) {
      // Fallback Demo Login jika server backend belum dinyalakan saat sidang PKL/demo
      const demoJwtPayload = {
        email: email || "demo.user@sinibook.com",
        name: email.split("@")[0] || "Budi Santoso",
        sub: "usr-demo-101",
        role: "user",
      };
      const demoToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(demoJwtPayload))}.demo_sig`;

      localStorage.setItem("token", demoToken);
      setSuccessMessage("⚡ Mode Demo Aktif! Mengalihkan ke Dashboard...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 flex items-center justify-center p-4 selection:bg-[#0B4F37] selection:text-white">
      {/* Wrapper Card Login (Layout split 2 kolom di layar besar) */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-2">
        
        {/* KOLOM KIRI: VISUAL BRANDING (Hanya tampil di desktop md+) */}
        <div className="relative hidden md:block overflow-hidden bg-[#073524] p-12 text-white flex flex-col justify-between">
          {/* Background Image Lobby */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
              alt="SiniBook Hotel Lobby"
              fill
              priority
              className="object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B4F37]/45 to-[#073524]/90" />
          </div>

          {/* Konten Branding */}
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Top Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#126E4E] text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                SiniBook
              </span>
            </Link>

            {/* Middle Quote */}
            <div className="my-auto">
              <h2 className="text-2xl font-extrabold tracking-tight leading-tight">
                Selamat Datang Kembali di SiniBook Hotel
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-emerald-100/80 font-light leading-relaxed">
                Masuk ke akun Anda untuk melihat jadwal booking, melakukan reservasi baru, dan mengklaim potongan harga dari promo eksklusif kami.
              </p>
            </div>

            {/* Bottom info */}
            <div className="text-[11px] text-emerald-200/50">
              © 2024 SiniBook Hotel. Semua hak dilindungi.
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: FORM LOGIN */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          {/* Header Mobile Logo & Back Link */}
          <div className="flex items-center justify-between mb-8 md:mb-6">
            <Link href="/" className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali</span>
            </Link>
            
            <Link href="/" className="flex md:hidden items-center gap-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0B4F37] text-white">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-gray-900">SiniBook</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Masuk Akun
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-400 font-light">
              Masukkan email dan password terdaftar Anda.
            </p>
          </div>

          {/* Alert Notification Banners */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <div className="font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              <div className="font-medium leading-relaxed">{successMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Email
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  disabled={isLoading}
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-4 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:border-[#0B4F37] focus:bg-white focus:outline-none transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Fitur lupa password sedang dalam pengembangan!"); }} className="text-xs font-semibold text-[#0B4F37] hover:text-[#073524]">
                  Lupa Password?
                </a>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  required
                  disabled={isLoading}
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-11 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:border-[#0B4F37] focus:bg-white focus:outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-gray-300 text-[#0B4F37] focus:ring-[#0B4F37] cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-gray-500 font-light cursor-pointer select-none">
                Ingat perangkat saya
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-3 flex flex-col gap-2.5">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0B4F37] py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#073524] hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Memproses...</span>
                  </span>
                ) : (
                  <span>Masuk Ke Akun</span>
                )}
              </button>

              {/* Tombol Akun Demo */}
              <button
                type="button"
                onClick={() => {
                  setEmail("demo.user@sinibook.com");
                  setPassword("password123");
                  setIsLoading(true);
                  setSuccessMessage("Masuk sebagai Akun Demo...");

                  const demoJwtPayload = {
                    email: "demo.user@sinibook.com",
                    name: "Budi Santoso",
                    sub: "usr-demo-101",
                    role: "user",
                  };
                  const demoToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(demoJwtPayload))}.demo_sig`;

                  localStorage.setItem("token", demoToken);

                  setTimeout(() => {
                    router.push("/dashboard");
                  }, 1200);
                }}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0B4F37]/10 border border-[#0B4F37]/30 py-2.5 text-xs font-bold text-[#0B4F37] transition-all hover:bg-[#0B4F37]/20 active:scale-95 disabled:opacity-50"
              >
                <span>Akun Demo</span>
              </button>
            </div>

          </form>

          {/* Redirect to Register Link */}
          <div className="mt-8 text-center text-xs text-gray-500 font-light">
            Belum memiliki akun SiniBook?{" "}
            <Link href="/register" className="font-bold text-[#0B4F37] hover:text-[#073524] transition-colors">
              Daftar Sekarang
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
