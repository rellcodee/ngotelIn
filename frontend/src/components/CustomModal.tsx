'use client';

import React, { useEffect } from 'react';


interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void | Promise<void>;
    isLoading?: boolean;
}

export default function CustomModal({
    isOpen,
    onClose,
    type,
    title,
    message,
    confirmText = 'Ya',
    cancelText = 'Batal',
    onConfirm,
    isLoading = false,
}: CustomModalProps) {
    // Prevent scrolling behind modal when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Determine icon and theme colors based on type matching Landing Page design system (#001a52, #1D4ED8)
    let iconName = 'info';
    let iconColor = 'text-[#1D4ED8]';
    let iconBg = 'bg-gradient-to-b from-blue-50 via-slate-50 to-blue-100/90 border border-blue-200/80 shadow-[0_8px_20px_-6px_rgba(0,26,82,0.18),inset_0_2px_4px_rgba(255,255,255,0.9)]';
    let topBarBg = 'bg-gradient-to-r from-[#001a52] via-[#1D4ED8] to-[#001a52]';
    let primaryButtonBg = 'bg-gradient-to-r from-[#001a52] via-[#0e2f76] to-[#1D4ED8] hover:from-[#001440] hover:to-[#1E3A8A] text-white shadow-[0_6px_20px_rgba(0,26,82,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-blue-400/30';

    switch (type) {
        case 'success':
            iconName = 'check_circle';
            iconColor = 'text-[#1D4ED8]';
            iconBg = 'bg-gradient-to-b from-blue-50 via-indigo-50 to-blue-100/90 border border-blue-200/80 shadow-[0_8px_20px_-6px_rgba(29,78,216,0.25),inset_0_2px_4px_rgba(255,255,255,0.9)]';
            topBarBg = 'bg-gradient-to-r from-[#001a52] via-[#1D4ED8] to-[#001a52]';
            primaryButtonBg = 'bg-gradient-to-r from-[#001a52] via-[#0e2f76] to-[#1D4ED8] hover:from-[#001440] hover:to-[#1E3A8A] text-white shadow-[0_6px_20px_rgba(0,26,82,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-blue-400/30';
            break;
        case 'error':
            iconName = 'error';
            iconColor = 'text-rose-600';
            iconBg = 'bg-gradient-to-b from-rose-50 via-pink-50 to-rose-100/90 border border-rose-200/80 shadow-[0_8px_20px_-6px_rgba(225,29,72,0.25),inset_0_2px_4px_rgba(255,255,255,0.9)]';
            topBarBg = 'bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700';
            primaryButtonBg = 'bg-gradient-to-r from-rose-700 via-rose-600 to-pink-600 hover:from-rose-800 hover:to-rose-700 text-white shadow-[0_6px_20px_rgba(225,29,72,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-rose-400/30';
            break;
        case 'warning':
            iconName = 'warning';
            iconColor = 'text-amber-600';
            iconBg = 'bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100/90 border border-amber-200/80 shadow-[0_8px_20px_-6px_rgba(217,119,6,0.25),inset_0_2px_4px_rgba(255,255,255,0.9)]';
            topBarBg = 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700';
            primaryButtonBg = 'bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 hover:from-amber-800 hover:to-amber-700 text-white shadow-[0_6px_20px_rgba(217,119,6,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-amber-400/30';
            break;
        case 'confirm':
            iconName = 'help';
            iconColor = 'text-[#1D4ED8]';
            iconBg = 'bg-gradient-to-b from-blue-50 via-indigo-50 to-blue-100/90 border border-blue-200/80 shadow-[0_8px_20px_-6px_rgba(29,78,216,0.25),inset_0_2px_4px_rgba(255,255,255,0.9)]';
            topBarBg = 'bg-gradient-to-r from-[#001a52] via-[#1D4ED8] to-[#001a52]';
            primaryButtonBg = 'bg-gradient-to-r from-[#001a52] via-[#0e2f76] to-[#1D4ED8] hover:from-[#001440] hover:to-[#1E3A8A] text-white shadow-[0_6px_20px_rgba(0,26,82,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-blue-400/30';
            break;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with backdrop-blur and soft dark overlay */}
            <div
                className="absolute inset-0 bg-slate-950/65 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
                onClick={type !== 'confirm' && !isLoading ? onClose : undefined}
            />

            {/* 3D Styled Modal Container */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-7 shadow-[0_25px_60px_-15px_rgba(0,26,82,0.35),0_10px_25px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 animate-scale-in border border-slate-100 ring-1 ring-black/5">

                {/* 3D Top Accent Bar */}
                <div className={`absolute top-0 inset-x-0 h-1.5 ${topBarBg}`} />

                {/* Close Button (only for non-confirm and non-loading modals) */}
                {type !== 'confirm' && !isLoading && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors rounded-full p-1.5 hover:bg-slate-100 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                )}

                {/* Modal Content */}
                <div className="flex flex-col items-center text-center pt-2">
                    {/* 3D Icon Section */}
                    <div className="relative mb-5">
                        <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-sm" />
                        <div className={`relative flex h-20 w-20 items-center justify-center rounded-2xl ${iconBg} shrink-0 transform hover:scale-105 transition-transform duration-300`}>
                            <span className={`material-symbols-outlined text-[38px] ${iconColor} drop-shadow-[0_4px_6px_rgba(0,26,82,0.2)]`}>
                                {iconName}
                            </span>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-extrabold text-slate-900 mb-2 leading-tight tracking-tight font-display">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-sm text-slate-600 mb-7 leading-relaxed whitespace-pre-line font-medium px-2">
                        {message}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex w-full gap-3 justify-center">
                        {type === 'confirm' ? (
                            <>
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={onClose}
                                    className="flex-1 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50 py-3.5 px-4 text-sm font-bold text-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] hover:bg-slate-100 hover:text-slate-900 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={onConfirm}
                                    className={`flex-1 rounded-2xl py-3.5 px-4 text-sm font-bold transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${primaryButtonBg}`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Memproses...</span>
                                        </>
                                    ) : (
                                        <span>{confirmText}</span>
                                    )}
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={onClose}
                                className={`w-full max-w-[220px] rounded-2xl py-3.5 px-6 text-sm font-bold transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${primaryButtonBg}`}
                            >
                                OK
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
