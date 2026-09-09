"use client";

import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import CustomModal from "@/components/CustomModal";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    type: "success" as "success" | "error" | "warning" | "info" | "confirm",
    title: "",
    message: "",
    confirmText: "Ya",
    cancelText: "Batal",
    onConfirm: undefined as (() => void) | undefined,
    onClose: () => {},
  });

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const idToken = credentialResponse.credential;

      const response = await fetch("http://localhost:3001/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: idToken,
        }),
      });
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Gagal registrasi dengan Google");
      }

      const { access_token, user } = resData;
      localStorage.setItem("token", access_token);
      localStorage.setItem("userName", user.name);
      setModal({
        isOpen: true,
        type: "success",
        title: "Registrasi Berhasil",
        message: `Registrasi berhasil! Selamat datang, ${user.name}!`,
        confirmText: "Ya",
        cancelText: "Batal",
        onConfirm: undefined,
        onClose: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          router.push("/");
        },
      });
    } catch (error: any) {
      console.error("Gagal registrasi di backend:", error);
      setErrorMsg(error.message || "Gagal otentikasi dengan server");
    } finally {
      setIsLoading(false);
    }
  };

  const performRegistration = async () => {
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const regResponse = await fetch("http://localhost:3001/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
        }),
      });

      const regData = await regResponse.json();
      if (!regResponse.ok) {
        throw new Error(regData.message || "Pendaftaran gagal");
      }

      setSuccessMsg("Pendaftaran berhasil! Mencoba masuk secara otomatis...");

      const loginResponse = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const loginData = await loginResponse.json();
      if (loginResponse.ok) {
        const { access_token, user } = loginData;
        localStorage.setItem("token", access_token);
        localStorage.setItem("userName", user?.name || username);
        setModal({
          isOpen: true,
          type: "success",
          title: "Pendaftaran Berhasil",
          message: `Selamat datang, ${user?.name || username}!`,
          confirmText: "Ya",
          cancelText: "Batal",
          onConfirm: undefined,
          onClose: () => {
            setModal((prev) => ({ ...prev, isOpen: false }));
            router.push("/");
          },
        });
      } else {
        setModal({
          isOpen: true,
          type: "success",
          title: "Pendaftaran Berhasil",
          message:
            "Pendaftaran berhasil! Silakan masuk menggunakan akun baru Anda.",
          confirmText: "Ya",
          cancelText: "Batal",
          onConfirm: undefined,
          onClose: () => {
            setModal((prev) => ({ ...prev, isOpen: false }));
            router.push("/login");
          },
        });
      }
    } catch (error: any) {
      console.error("Gagal registrasi:", error);
      setErrorMsg(error.message || "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setErrorMsg("Semua data form wajib diisi");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password minimal harus 8 karakter");
      return;
    }

    setModal({
      isOpen: true,
      type: "confirm",
      title: "Konfirmasi Pendaftaran",
      message:
        "Apakah Anda yakin data pendaftaran yang dimasukkan sudah benar?",
      confirmText: "Ya, Daftar",
      cancelText: "Batal",
      onConfirm: () => {
        setModal((prev) => ({ ...prev, isOpen: false }));
        performRegistration();
      },
      onClose: () => {
        setModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#E6F0F2] via-[#F0F6F8] to-[#E2ECF0] font-sans selection:bg-[#001a52] selection:text-white p-3 sm:p-4 lg:p-5 relative overflow-hidden [perspective:1200px]">
      {/* Ambient 3D Glowing Orbs in Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#001a52]/15 to-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-10000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tl from-emerald-500/15 to-teal-400/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-10000" />

      {/* Main Outer Container Card with 3D Depth Elevation & Soft Shadow */}
      <div className="relative z-10 w-full px-4 sm:w-[80vw] lg:w-[90vw] min-h-[100dvh] lg:min-h-0 lg:h-[90vh] bg-transparent lg:bg-white/90 lg:backdrop-blur-xl rounded-none lg:rounded-[2.5rem] lg:shadow-[0_35px_90px_-20px_rgba(0,26,82,0.22),0_15px_35px_-15px_rgba(0,0,0,0.08)] lg:border border-white/80 p-0 lg:p-5 flex flex-col lg:flex-row gap-4 lg:gap-5 transition-all duration-700 lg:hover:shadow-[0_45px_110px_-20px_rgba(0,26,82,0.28)] justify-center items-center lg:items-stretch overflow-y-auto lg:overflow-hidden">
        {/* LEFT PANEL: 3D Inset Visual Hero Box */}
        <div className="relative hidden lg:flex w-full lg:flex-1 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.2rem] bg-[#001a52] p-5 sm:p-8 lg:p-10 xl:p-12 text-white flex-col justify-between overflow-hidden group min-h-[220px] sm:min-h-[300px] lg:min-h-0 shadow-[0_20px_50px_rgba(0,26,82,0.4)] border border-white/10 shrink-0 lg:shrink">
          {/* Hotel Background Image with 3D Zoom Effect */}
          <Image
            src="/images/hero-hotel.png"
            alt="SiniBook Luxury Resort"
            fill
            className="object-cover object-center brightness-[0.78] scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
            priority
          />

          {/* Rich 3D Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001a52] via-[#001a52]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001a52]/50 via-transparent to-transparent" />

          {/* Ambient Glow Orb Inside Card */}
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar: Logo & 3D Glass Pill Back Button */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <Link
              href="/"
              className="inline-block transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <Image
                src="/images/icon.png"
                alt="SiniBook Logo"
                width={120}
                height={36}
                className="w-24 sm:w-[135px] 2xl:w-[180px] h-auto object-contain brightness-0 invert drop-shadow-md"
                priority
              />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 2xl:px-6 py-1.5 sm:py-2 2xl:py-3 rounded-full bg-white/20 hover:bg-white/35 text-white text-[11px] sm:text-xs 2xl:text-sm font-semibold backdrop-blur-xl border border-white/30 transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 shrink-0"
            >
              <span className="material-symbols-outlined text-[14px] sm:text-[15px] 2xl:text-[18px]">
                arrow_back
              </span>
              <span>Beranda</span>
            </Link>
          </div>

          {/* 3D Floating Hero Content */}
          <div className="relative z-10 my-auto py-3 sm:py-6 max-w-md 2xl:max-w-2xl space-y-2 sm:space-y-4 2xl:space-y-8">
            <h1 className="text-xl sm:text-3xl lg:text-4xl 2xl:text-[4rem] 2xl:leading-[1.1] font-extrabold tracking-tight leading-snug drop-shadow-md">
              Gabung & Nikmati Layanan <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A5C3FF] via-white to-[#90B5FF]">
                Terbaik SiniBook
              </span>
            </h1>
            <p className="hidden sm:block text-slate-200/90 text-xs sm:text-sm 2xl:text-xl 2xl:leading-relaxed leading-relaxed drop-shadow-xs">
              Buat akun Anda sekarang untuk memulai reservasi kamar instan,
              terhubung dengan Concierge Tamu, dan menikmati harga penawaran
              eksklusif.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: 3D Form Container */}
        <div className="relative flex w-full max-w-md sm:max-w-lg lg:max-w-none lg:w-[450px] xl:w-[500px] 2xl:w-[600px] shrink-0 flex-col justify-center bg-white/95 lg:bg-white p-5 sm:p-8 lg:p-10 xl:p-12 2xl:p-16 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.2rem] my-auto lg:my-0 shadow-[0_20px_50px_rgba(0,26,82,0.1)] lg:shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl lg:backdrop-blur-none border border-white/60 lg:border-none overflow-y-auto">
          <div>
            {/* Top Utility Row: 3D Pill Switcher Right Aligned */}
            <div className="flex justify-between lg:justify-end items-center mb-6 2xl:mb-8 pb-3 2xl:pb-4 border-b border-slate-100/90">
              {/* Mobile Back Button (Visible only on < lg) */}
              <Link
                href="/"
                className="lg:hidden flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-[#001a52] text-[11px] sm:text-xs font-bold transition-all shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-slate-200/60"
              >
                <span className="material-symbols-outlined text-[14px]">
                  arrow_back
                </span>
                <span>Beranda</span>
              </Link>

              {/* 3D Inset Pill Switcher */}
              <div className="bg-slate-100/90 p-1 rounded-full flex items-center gap-1 border border-slate-200/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] shrink-0">
                <Link
                  href="/login"
                  className="px-4 py-1.5 2xl:py-2 2xl:px-6 rounded-full text-xs 2xl:text-sm font-bold text-slate-600 hover:text-[#001a52] transition-all"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 2xl:py-2 2xl:px-6 rounded-full text-xs 2xl:text-sm font-extrabold bg-gradient-to-r from-[#001a52] to-[#092b77] text-white shadow-[0_4px_12px_rgba(0,26,82,0.3)] transition-all"
                >
                  Daftar
                </Link>
              </div>
            </div>

            {/* Title Section (Spacious & Clean) */}
            <div className="mb-6 2xl:mb-8 text-center lg:text-left">
              {/* Mobile Logo */}
              <Image
                src="/images/icon.png"
                alt="SiniBook Logo"
                width={140}
                height={42}
                className="lg:hidden mx-auto mb-4 h-auto object-contain brightness-0 drop-shadow-sm opacity-90"
                priority
              />
              <h2 className="text-2xl sm:text-3xl 2xl:text-4xl font-extrabold text-[#001a52] tracking-tight">
                Buat Akun Baru
              </h2>
              <p className="text-xs 2xl:text-sm text-slate-500 font-medium mt-1.5 2xl:mt-2.5">
                Daftarkan diri Anda untuk mulai memesan kamar
              </p>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="mb-5 rounded-2xl bg-red-50 p-3.5 text-xs font-semibold text-red-800 border border-red-100 shadow-sm flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Alert */}
            {successMsg && (
              <div className="mb-5 rounded-2xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 border border-emerald-100 shadow-sm flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0 animate-ping" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-xs 2xl:text-sm font-bold text-[#001a52] mb-1.5 2xl:mb-2.5"
                >
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 2xl:pl-4">
                    <span className="material-symbols-outlined text-[18px] 2xl:text-[22px] text-slate-400">
                      person
                    </span>
                  </div>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="block w-full rounded-2xl border border-slate-200/90 bg-slate-50/80 py-3 2xl:py-4 pl-10 2xl:pl-12 pr-4 text-sm 2xl:text-base text-slate-900 placeholder-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus:border-[#001a52] focus:bg-white focus:shadow-[0_8px_20px_rgba(0,26,82,0.1)] focus:-translate-y-0.5 outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs 2xl:text-sm font-bold text-[#001a52] mb-1.5 2xl:mb-2.5"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 2xl:pl-4">
                    <span className="material-symbols-outlined text-[18px] 2xl:text-[22px] text-slate-400">
                      mail
                    </span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="block w-full rounded-2xl border border-slate-200/90 bg-slate-50/80 py-3 2xl:py-4 pl-10 2xl:pl-12 pr-4 text-sm 2xl:text-base text-slate-900 placeholder-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus:border-[#001a52] focus:bg-white focus:shadow-[0_8px_20px_rgba(0,26,82,0.1)] focus:-translate-y-0.5 outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs 2xl:text-sm font-bold text-[#001a52] mb-1.5 2xl:mb-2.5"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 2xl:pl-4">
                    <span className="material-symbols-outlined text-[18px] 2xl:text-[22px] text-slate-400">
                      lock
                    </span>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="block w-full rounded-2xl border border-slate-200/90 bg-slate-50/80 py-3 2xl:py-4 pl-10 2xl:pl-12 pr-10 2xl:pr-12 text-sm 2xl:text-base text-slate-900 placeholder-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus:border-[#001a52] focus:bg-white focus:shadow-[0_8px_20px_rgba(0,26,82,0.1)] focus:-translate-y-0.5 outline-none transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 2xl:pr-4 text-slate-400 hover:text-[#001a52] transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <span className="material-symbols-outlined text-[18px] 2xl:text-[22px]">
                        visibility_off
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px] 2xl:text-[22px]">
                        visibility
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* 3D Gradient Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-gradient-to-r from-[#001a52] via-[#092b77] to-[#001a52] hover:from-[#001542] hover:to-[#001542] text-white py-3.5 2xl:py-4 px-6 font-extrabold text-sm 2xl:text-base shadow-[0_12px_28px_-6px_rgba(0,26,82,0.45)] hover:shadow-[0_18px_36px_-6px_rgba(0,26,82,0.55)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_4px_12px_rgba(0,26,82,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer mt-3 2xl:mt-5"
              >
                {isLoading ? (
                  <span>Memproses...</span>
                ) : (
                  <>
                    <span>Daftar Sekarang</span>
                    <span className="material-symbols-outlined text-[18px] 2xl:text-[22px]">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                <span className="bg-white px-3">atau</span>
              </div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.error("Google Sign-In gagal");
                  setErrorMsg("Gagal otentikasi Google");
                }}
              />
            </div>
          </div>

          {/* Bottom Area: Account Redirect & 3D Social Icons */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col items-center gap-2.5">
            <p className="text-xs 2xl:text-sm text-slate-600 font-medium">
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="font-extrabold text-[#001a52] hover:underline"
              >
                Masuk Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>

      <CustomModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onConfirm={modal.onConfirm}
        onClose={modal.onClose}
      />
    </div>
  );
}
