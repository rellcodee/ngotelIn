// Halaman Register SiniBook Hotel (/register)
// Menghubungkan form pendaftaran user baru ke API backend NestJS dan melakukan validasi input

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Building2,
  Check,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. Validasi input wajib diisi
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Semua kolom input wajib diisi!");
      return;
    }

    // 2. Validasi panjang password minimal 8 karakter (sesuai DTO backend)
    if (password.length < 8) {
      setErrorMessage("Password minimal harus terdiri dari 8 karakter!");
      return;
    }

    // 3. Validasi kesesuaian password & konfirmasi password
    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi password tidak cocok dengan password!");
      return;
    }

    // 4. Validasi persetujuan syarat ketentuan
    if (!agreeTerms) {
      setErrorMessage("Anda harus menyetujui Syarat & Ketentuan SiniBook!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "user", // Default role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response dari NestJS (biasanya ConflictException "Email sudah terdaftar!")
        throw new Error(data.message || "Pendaftaran gagal! Silakan periksa kembali data Anda.");
      }

      // Pendaftaran berhasil
      setSuccessMessage("Pendaftaran berhasil! Mengalihkan ke halaman Login...");
      
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAgreeTerms(false);

      // Redirect ke halaman login setelah 2 detik
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || "Gagal terhubung ke server backend!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 flex items-center justify-center p-4 selection:bg-[#0B4F37] selection:text-white">
      {/* Wrapper Card Register (Layout split 2 kolom di layar besar) */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-2">
        
        {/* KOLOM KIRI: VISUAL BRANDING (Hanya tampil di desktop md+) */}
        <div className="relative hidden md:block overflow-hidden bg-[#073524] p-12 text-white flex flex-col justify-between">
          {/* Background Image Pool */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80"
              alt="SiniBook Hotel Pool"
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
                Daftar Akun Baru & Dapatkan Penawaran Spesial
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-emerald-100/80 font-light leading-relaxed">
                Bergabunglah sebagai member SiniBook untuk menikmati akses prioritas ke infinity pool, spa eksklusif, serta jaminan harga kamar termurah.
              </p>
            </div>

            {/* Bottom info */}
            <div className="text-[11px] text-emerald-200/50">
              © 2024 SiniBook Hotel. Semua hak dilindungi.
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: FORM REGISTER */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          {/* Header Mobile Logo & Back Link */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/login" className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Login</span>
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
              Registrasi Akun
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-400 font-light">
              Lengkapi data formulir di bawah ini dengan benar.
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

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Nama Lengkap
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  required
                  disabled={isLoading}
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-4 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:border-[#0B4F37] focus:bg-white focus:outline-none transition-all disabled:opacity-50"
                />
              </div>
            </div>

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
              <label htmlFor="password" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
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

            {/* Input Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Konfirmasi Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password Anda"
                  required
                  disabled={isLoading}
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 pl-11 pr-11 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:border-[#0B4F37] focus:bg-white focus:outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="agree"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#0B4F37] focus:ring-[#0B4F37] cursor-pointer mt-0.5"
              />
              <label htmlFor="agree" className="text-xs text-gray-500 font-light cursor-pointer select-none leading-relaxed">
                Saya menyetujui <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Kebijakan Layanan SiniBook: Semua transaksi bersifat final."); }} className="font-semibold text-[#0B4F37] hover:underline">Syarat & Ketentuan</a> yang berlaku di SiniBook Hotel.
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
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
                    <span>Pendaftaran...</span>
                  </span>
                ) : (
                  <span>Daftar Akun Baru</span>
                )}
              </button>
            </div>

          </form>

          {/* Redirect to Login Link */}
          <div className="mt-8 text-center text-xs text-gray-500 font-light">
            Sudah memiliki akun SiniBook?{" "}
            <Link href="/login" className="font-bold text-[#0B4F37] hover:text-[#073524] transition-colors">
              Masuk Sini
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
