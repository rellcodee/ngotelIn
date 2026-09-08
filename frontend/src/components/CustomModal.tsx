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

    // Determine icon and theme colors based on type
    let iconName = 'info';
    let iconColor = 'text-blue-500';
    let iconBg = 'bg-blue-50 border border-blue-100';
    let primaryButtonBg = 'bg-[#1D4ED8] hover:bg-[#1E3A8A] text-white focus:ring-[#1D4ED8]';

    switch (type) {
        case 'success':
            iconName = 'check_circle';
            iconColor = 'text-emerald-600';
            iconBg = 'bg-emerald-50 border border-emerald-100';
            primaryButtonBg = 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500';
            break;
        case 'error':
            iconName = 'error';
            iconColor = 'text-rose-600';
            iconBg = 'bg-rose-50 border border-rose-100';
            primaryButtonBg = 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500';
            break;
        case 'warning':
            iconName = 'warning';
            iconColor = 'text-amber-600';
            iconBg = 'bg-amber-50 border border-amber-100';
            primaryButtonBg = 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500';
            break;
        case 'confirm':
            iconName = 'info';
            iconColor = 'text-[#1D4ED8]';
            iconBg = 'bg-emerald-50 border border-emerald-100';
            primaryButtonBg = 'bg-[#1D4ED8] hover:bg-[#1E3A8A] text-white focus:ring-[#1D4ED8]';
            break;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with backdrop-blur */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
                onClick={type !== 'confirm' && !isLoading ? onClose : undefined}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 scale-95 animate-scale-in border border-gray-100">

                {/* Close Button (only for non-confirm and non-loading modals) */}
                {type !== 'confirm' && !isLoading && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                )}

                {/* Modal Content */}
                <div className="flex flex-col items-center text-center">
                    {/* Icon Section */}
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full ${iconBg} mb-4 shrink-0`}>
                        <span className={`material-symbols-outlined text-[32px] ${iconColor}`}>{iconName}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed whitespace-pre-line">
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
                                    className="flex-1 rounded-xl border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={onConfirm}
                                    className={`flex-1 rounded-xl py-3 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${primaryButtonBg}`}
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
                                className={`w-full max-w-[200px] rounded-xl py-3 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all active:scale-[0.98] ${primaryButtonBg}`}
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
