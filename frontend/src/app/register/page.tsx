'use client';

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import CustomModal from '@/components/CustomModal';

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [modal, setModal] = useState({
        isOpen: false,
        type: 'success' as 'success' | 'error' | 'warning' | 'info' | 'confirm',
        title: '',
        message: '',
        confirmText: 'Ya',
        cancelText: 'Batal',
        onConfirm: undefined as (() => void) | undefined,
        onClose: () => { },
    });

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        setErrorMsg('');
        setSuccessMsg('');
        try {
            const idToken = credentialResponse.credential;

            const response = await fetch('http://localhost:3001/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_token: idToken,
                }),
            });
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Gagal registrasi dengan Google');
            }

            const { access_token, user } = resData;
            localStorage.setItem('token', access_token);
            localStorage.setItem('userName', user.name);
            setModal({
                isOpen: true,
                type: 'success',
                title: 'Registrasi Berhasil',
                message: `Registrasi berhasil! Selamat datang, ${user.name}!`,
                confirmText: 'Ya',
                cancelText: 'Batal',
                onConfirm: undefined,
                onClose: () => {
                    setModal(prev => ({ ...prev, isOpen: false }));
                    router.push('/');
                }
            });

        } catch (error: any) {
            console.error('Gagal registrasi di backend:', error);
            setErrorMsg(error.message || 'Gagal otentikasi dengan server');
        } finally {
            setIsLoading(false);
        }
    };

    const performRegistration = async () => {
        setIsLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const regResponse = await fetch('http://localhost:3001/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: username,
                    email,
                    password,
                }),
            });

            const regData = await regResponse.json();
            if (!regResponse.ok) {
                throw new Error(regData.message || 'Pendaftaran gagal');
            }

            setSuccessMsg('Pendaftaran berhasil! Mencoba masuk secara otomatis...');

            const loginResponse = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const loginData = await loginResponse.json();
            if (loginResponse.ok) {
                const { access_token, user } = loginData;
                localStorage.setItem('token', access_token);
                localStorage.setItem('userName', user?.name || username);
                setModal({
                    isOpen: true,
                    type: 'success',
                    title: 'Pendaftaran Berhasil',
                    message: `Selamat datang, ${user?.name || username}!`,
                    confirmText: 'Ya',
                    cancelText: 'Batal',
                    onConfirm: undefined,
                    onClose: () => {
                        setModal(prev => ({ ...prev, isOpen: false }));
                        router.push('/');
                    }
                });
            } else {
                setModal({
                    isOpen: true,
                    type: 'success',
                    title: 'Pendaftaran Berhasil',
                    message: 'Pendaftaran berhasil! Silakan masuk menggunakan akun baru Anda.',
                    confirmText: 'Ya',
                    cancelText: 'Batal',
                    onConfirm: undefined,
                    onClose: () => {
                        setModal(prev => ({ ...prev, isOpen: false }));
                        router.push('/login');
                    }
                });
            }
        } catch (error: any) {
            console.error('Gagal registrasi:', error);
            setErrorMsg(error.message || 'Pendaftaran gagal. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !email || !password) {
            setErrorMsg('Semua data form wajib diisi');
            return;
        }

        if (password.length < 8) {
            setErrorMsg('Password minimal harus 8 karakter');
            return;
        }

        setModal({
            isOpen: true,
            type: 'confirm',
            title: 'Konfirmasi Pendaftaran',
            message: 'Apakah Anda yakin data pendaftaran yang dimasukkan sudah benar?',
            confirmText: 'Ya, Daftar',
            cancelText: 'Batal',
            onConfirm: () => {
                setModal(prev => ({ ...prev, isOpen: false }));
                performRegistration();
            },
            onClose: () => {
                setModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#E6F0F2] via-[#F0F6F8] to-[#E2ECF0] font-sans selection:bg-[#001a52] selection:text-white p-3 sm:p-6 lg:p-8 items-center justify-center relative overflow-hidden [perspective:1200px]">
            {/* Ambient 3D Glowing Orbs in Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#001a52]/15 to-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-10000" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tl from-emerald-500/15 to-teal-400/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-10000" />

            {/* Main Outer Container Card with 3D Depth Elevation & Soft Shadow */}
            <div className="relative z-10 w-full max-w-[1080px] bg-white/90 backdrop-blur-xl rounded-[1.8rem] sm:rounded-[2.5rem] shadow-[0_35px_90px_-20px_rgba(0,26,82,0.22),0_15px_35px_-15px_rgba(0,0,0,0.08)] border border-white/80 p-2.5 sm:p-4 lg:p-5 flex flex-col lg:flex-row min-h-0 lg:min-h-[680px] transition-all duration-700 hover:shadow-[0_45px_110px_-20px_rgba(0,26,82,0.28)]">

                {/* LEFT PANEL: 3D Inset Visual Hero Box */}
                <div className="relative w-full lg:w-[48%] rounded-[1.5rem] sm:rounded-[2rem] bg-[#001a52] p-5 sm:p-8 lg:p-10 text-white flex flex-col justify-between overflow-hidden group min-h-[220px] sm:min-h-[300px] lg:min-h-[640px] shadow-[0_20px_50px_rgba(0,26,82,0.4)] border border-white/10">
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
                        <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105 active:scale-95">
                            <Image src="/images/icon.png" alt="SiniBook Logo" width={120} height={36} className="w-24 sm:w-[135px] h-auto object-contain brightness-0 invert drop-shadow-md" priority />
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 hover:bg-white/35 text-white text-[11px] sm:text-xs font-semibold backdrop-blur-xl border border-white/30 transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 shrink-0"
                        >
                            <span className="material-symbols-outlined text-[14px] sm:text-[15px]">arrow_back</span>
                            <span>Beranda</span>
                        </Link>
                    </div>

                    {/* 3D Floating Hero Content */}
                    <div className="relative z-10 my-auto py-3 sm:py-6 max-w-md space-y-2 sm:space-y-4">
                        {/* Floating 3D Badge */}
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/15 border border-white/25 text-[10px] sm:text-[11px] font-extrabold text-emerald-300 backdrop-blur-md uppercase tracking-wider shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-[13px] sm:text-[14px]">stars</span>
                            <span>Gabung Tamu Spesial</span>
                        </div>
                        <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug drop-shadow-md">
                            Gabung & Nikmati Layanan <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A5C3FF] via-white to-[#90B5FF]">Terbaik SiniBook</span>
                        </h1>
                        <p className="hidden sm:block text-slate-200/90 text-xs sm:text-sm leading-relaxed drop-shadow-xs">
                            Buat akun Anda sekarang untuk memulai reservasi kamar instan, terhubung dengan Concierge Tamu, dan menikmati harga penawaran eksklusif.
                        </p>
                    </div>
                </div>

                {/* RIGHT PANEL: 3D Form Container */}
                <div className="relative flex w-full lg:w-[52%] flex-col justify-between bg-white p-4 sm:p-8 lg:p-10 rounded-[1.5rem] sm:rounded-[2rem] mt-2.5 lg:mt-0">
                    <div>
                        {/* Top Utility Row: 3D Pill Switcher Right Aligned */}
                        <div className="flex justify-end mb-6 pb-3 border-b border-slate-100/90">
                            {/* 3D Inset Pill Switcher */}
                            <div className="bg-slate-100/90 p-1 rounded-full flex items-center gap-1 border border-slate-200/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] shrink-0">
                                <Link
                                    href="/login"
                                    className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-[#001a52] transition-all"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-[#001a52] to-[#092b77] text-white shadow-[0_4px_12px_rgba(0,26,82,0.3)] transition-all"
                                >
                                    Daftar
                                </Link>
                            </div>
                        </div>

                        {/* Title Section (Spacious & Clean) */}
                        <div className="mb-6">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#001a52] tracking-tight">
                                Buat Akun Baru
                            </h2>
                            <p className="text-xs text-slate-500 font-medium mt-1.5">
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
                                <label htmlFor="username" className="block text-xs font-bold text-[#001a52] mb-1.5">
                                    Nama Lengkap
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <span className="material-symbols-outlined text-[18px] text-slate-400">person</span>
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Contoh: Budi Santoso"
                                        className="block w-full rounded-2xl border border-slate-200/90 bg-slate-50/80 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus:border-[#001a52] focus:bg-white focus:shadow-[0_8px_20px_rgba(0,26,82,0.1)] focus:-translate-y-0.5 outline-none transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-[#001a52] mb-1.5">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <span className="material-symbols-outlined text-[18px] text-slate-400">mail</span>
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="nama@email.com"
                                        className="block w-full rounded-2xl border border-slate-200/90 bg-slate-50/80 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus:border-[#001a52] focus:bg-white focus:shadow-[0_8px_20px_rgba(0,26,82,0.1)] focus:-translate-y-0.5 outline-none transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-xs font-bold text-[#001a52] mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <span className="material-symbols-outlined text-[18px] text-slate-400">lock</span>
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Minimal 8 karakter"
                                        className="block w-full rounded-2xl border border-slate-200/90 bg-slate-50/80 py-3 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus:border-[#001a52] focus:bg-white focus:shadow-[0_8px_20px_rgba(0,26,82,0.1)] focus:-translate-y-0.5 outline-none transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-[#001a52] transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <span className="material-symbols-outlined text-[18px]">visibility_off</span> : <span className="material-symbols-outlined text-[18px]">visibility</span>}
                                    </button>
                                </div>
                            </div>

                            {/* 3D Gradient Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-full bg-gradient-to-r from-[#001a52] via-[#092b77] to-[#001a52] hover:from-[#001542] hover:to-[#001542] text-white py-3.5 px-6 font-extrabold text-sm shadow-[0_12px_28px_-6px_rgba(0,26,82,0.45)] hover:shadow-[0_18px_36px_-6px_rgba(0,26,82,0.55)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_4px_12px_rgba(0,26,82,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer mt-3"
                            >
                                {isLoading ? (
                                    <span>Memproses...</span>
                                ) : (
                                    <>
                                        <span>Daftar Sekarang</span>
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
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
                                    console.error('Google Sign-In gagal');
                                    setErrorMsg('Gagal otentikasi Google');
                                }}
                            />
                        </div>
                    </div>

                    {/* Bottom Area: Account Redirect & 3D Social Icons */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col items-center gap-2.5">
                        <p className="text-xs text-slate-600 font-medium">
                            Sudah memiliki akun?{' '}
                            <Link href="/login" className="font-extrabold text-[#001a52] hover:underline">
                                Masuk Sekarang
                            </Link>
                        </p>

                        {/* 3D Floating Social Icons Footer */}
                        <div className="flex items-center gap-3 text-slate-400 pt-0.5">
                            <a href="#" className="p-2 rounded-full hover:bg-slate-100 hover:text-[#001a52] hover:shadow-md hover:-translate-y-0.5 transition-all"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                            <a href="#" className="p-2 rounded-full hover:bg-slate-100 hover:text-[#001a52] hover:shadow-md hover:-translate-y-0.5 transition-all"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-0.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/></svg></a>
                            <a href="#" className="p-2 rounded-full hover:bg-slate-100 hover:text-[#001a52] hover:shadow-md hover:-translate-y-0.5 transition-all"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
                            <a href="#" className="p-2 rounded-full hover:bg-slate-100 hover:text-[#001a52] hover:shadow-md hover:-translate-y-0.5 transition-all"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                        </div>
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