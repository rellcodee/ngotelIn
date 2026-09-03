'use client';

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
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
            // 1. Panggil endpoint registrasi user di backend
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

            // 2. Auto-login setelah pendaftaran sukses
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
                // Jika auto-login gagal, arahkan ke halaman masuk
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

        // Show confirmation popup before registering
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
        <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-[#1D4ED8] selection:text-white">
            {/* LEFT PANEL: Brand Showcase (Hidden on Mobile) */}
            <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-[#1D4ED8] to-[#1E3A8A] p-12 text-white lg:flex overflow-hidden">
                {/* Decorative background shapes */}
                <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-800/20 blur-3xl" />
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

                {/* Logo top-left */}
                <div className="relative z-10">
                    <Link href="/" className="inline-block transition-transform hover:scale-105">
                        <Image src="/images/icon.png" alt="SiniBook Logo" width={130} height={40} className="object-contain" priority />
                    </Link>
                </div>

                {/* Tagline & Features list */}
                <div className="relative z-10 my-auto max-w-md space-y-6">
                    <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
                        Gabung & Nikmati Layanan Terbaik SiniBook
                    </h1>
                    <p className="text-emerald-100/80 leading-relaxed text-sm">
                        Buat akun Anda sekarang untuk memulai reservasi kamar secara instan, berinteraksi dengan AI concierge kami, dan menikmati penawaran istimewa.
                    </p>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                            <span className="text-sm font-medium">Reservasi instan dan pelacakan pesanan real-time</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                            <span className="text-sm font-medium">Rekomendasi kamar cerdas berbasis AI</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                            <span className="text-sm font-medium">Diskon eksklusif hingga 30% untuk pengguna baru</span>
                        </div>
                    </div>
                </div>

                {/* Footer copyright */}
                <div className="relative z-10 text-xs text-emerald-200/50">
                    &copy; {new Date().getFullYear()} SiniBook Hotel. Hak Cipta Dilindungi.
                </div>
            </div>

            {/* RIGHT PANEL: Registration Form */}
            <div className="relative flex w-full flex-col justify-center bg-[#F4F8F5]/30 px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20">
                {/* Back to Home Link */}
                <div className="absolute top-6 left-6">
                    <Link href="/" className="group flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-[#1D4ED8]">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span>Kembali ke Beranda</span>
                    </Link>
                </div>

                <div className="mx-auto w-full max-w-md">
                    {/* Header info */}
                    <div className="mb-8 text-center lg:text-left">
                        {/* Mobile Logo */}
                        <div className="mb-6 flex justify-center lg:hidden">
                            <Link href="/">
                                <Image src="/images/icon.png" alt="SiniBook Logo" width={120} height={36} className="object-contain" />
                            </Link>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Buat Akun Baru
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Daftarkan diri Anda untuk mulai memesan kamar
                        </p>
                    </div>

                    {/* Alert Error */}
                    {errorMsg && (
                        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-800 border border-red-100 flex items-center gap-2 animate-pulse-ring">
                            <span className="h-2 w-2 rounded-full bg-red-600 shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Alert Success */}
                    {successMsg && (
                        <div className="mb-6 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800 border border-emerald-100 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0 animate-ping" />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <User className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Contoh: budisudi"
                                    className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Contoh: budi@gmail.com"
                                    className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-10 text-sm placeholder-gray-400 focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl bg-[#1D4ED8] py-3 text-sm font-bold text-white shadow-md hover:bg-[#1E3A8A] hover:shadow-lg transition-all active:scale-[0.98] disabled:bg-[#1D4ED8]/50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <span>Daftar Sekarang</span>
                            )}
                        </button>
                    </form>

                    {/* Divider OR */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs text-gray-500 font-medium">
                            <span className="bg-[#FDFEFE] px-4">atau daftar dengan</span>
                        </div>
                    </div>

                    {/* Google Login Component */}
                    <div className="flex justify-center w-full">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                console.error('Google Sign-In Pop-up gagal atau ditutup user');
                                setErrorMsg('Gagal melakukan otentikasi dengan Google');
                            }}
                        />
                    </div>

                    {/* Redirect to Login */}
                    <div className="mt-8 text-center text-sm text-gray-600">
                        Sudah memiliki akun?{' '}
                        <Link href="/login" className="font-bold text-[#1D4ED8] hover:text-[#1E3A8A] transition-colors">
                            Masuk Sekarang
                        </Link>
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