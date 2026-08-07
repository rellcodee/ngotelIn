"use client"; // Client Component untuk mengelola state obrolan AI Assistant dan popup modal

import React, { useState, useRef, useEffect } from "react"; // Mengimpor React, useState, useRef, useEffect
import { Bot, X, Send, Sparkles, User, AlertCircle } from "lucide-react"; // Mengimpor ikon-ikon pendukung UI dari lucide-react

// Tipe data struktur pesan chat
interface Message {
  id: number;
  sender: "ai" | "user"; // Pengirim pesan (ai atau user)
  text: string; // Isi teks pesan
  time: string; // Jam pengiriman pesan
}

// Komponen AiAssistantModal: Widget & Popup AI Assistant dengan Validasi Keamanan Frontend
export default function AiAssistantModal() {
  // 1. STATE DASAR MODAL CHAT
  const [isOpen, setIsOpen] = useState(false);       // Logika: apakah modal sedang "seharusnya" terbuka
  const [isVisible, setIsVisible] = useState(false); // DOM: apakah modal masih ter-render (untuk animasi keluar)
  const [isAnimating, setIsAnimating] = useState(false); // Sedang dalam transisi animasi buka/tutup
  const [inputText, setInputText] = useState(""); // State untuk menyimpan teks input pengguna
  const [isTyping, setIsTyping] = useState(false); // State indikator AI sedang memproses balasan (loading state)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Ref timer untuk cleanup animasi tutup

  // State array pesan percakapan (default diawali pesan salam dari AI Assistant)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Halo! Ada yang bisa saya bantu hari ini?",
      time: "Baru saja",
    },
  ]);

  // 2. STATE VALIDASI KEAMANAN FRONTEND (DOUBLE PROTECTION FE & BE)
  const [isCooldown, setIsCooldown] = useState(false); // Validasi Anti-Spam: Mencegah spam klik tombol kirim
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Validasi Feedback: Menampilkan notifikasi error keamanan
  const MAX_INPUT_LENGTH = 300; // Validasi Batas Input: Maksimal 300 karakter per pesan

  // Reference ke elemen paling bawah chat untuk otomatis auto-scroll ke bawah saat pesan baru masuk
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // =========================================================================
  // FUNGSI TOGGLE MODAL: Buka/tutup dengan animasi smooth & cegah ghost click
  // =========================================================================
  const handleToggle = () => {
    if (isAnimating) return; // Blokir klik saat sedang animasi agar tidak ghost click

    if (!isOpen) {
      // --- BUKA MODAL ---
      setIsOpen(true);
      setIsVisible(true); // Mount modal ke DOM dulu
      setIsAnimating(true);
      // Tunda sedikit agar browser sempat render, lalu jalankan animasi masuk
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(false); // Selesai animasi buka
        });
      });
    } else {
      // --- TUTUP MODAL ---
      setIsOpen(false);    // Ubah state → trigger kelas CSS animasi keluar
      setIsAnimating(true); // Blokir klik selama animasi tutup
      // Setelah durasi animasi selesai, baru unmount dari DOM
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        setIsVisible(false);   // Unmount modal dari DOM
        setIsAnimating(false); // Selesai animasi tutup
      }, 300); // Harus sama dengan durasi transition CSS (300ms)
    }
  };

  // Cleanup timer saat komponen unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Efek untuk mengaktifkan auto-scroll setiap kali pesan diperbarui
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // =========================================================================
  // FUNGSI VALIDASI KEAMANAN FE: Sanitasi Teks dari Tag HTML Berbahaya (Anti-XSS)
  // =========================================================================
  const sanitizeInput = (rawText: string): string => {
    return rawText
      .replace(/</g, "&lt;") // Mengubah simbol '<' menjadi &lt; agar tag HTML tidak dieksekusi
      .replace(/>/g, "&gt;") // Mengubah simbol '>' menjadi &gt;
      .trim(); // Menghapus spasi kosong berlebih di awal & akhir kalimat
  };

  // =========================================================================
  // FUNGSI UTAMA: Mengirim Pesan dengan Validasi Keamanan Berlapis (FE Validation)
  // =========================================================================
  const handleSendMessage = (textToSend?: string) => {
    // PROTEKSI 1 (ANTI-SPAM / COOLDOWN): Tolak pengiriman jika AI sedang mengetik atau masih dalam jeda cooldown
    if (isTyping || isCooldown) return;

    const rawText = textToSend || inputText;
    
    // PROTEKSI 2 (SANATISASI INPUT): Bersihkan teks dari karakter HTML berbahaya
    const cleanText = sanitizeInput(rawText);

    // PROTEKSI 3 (VALIDASI TEKS KOSONG): Cegah pengiriman jika input kosong atau spasi saja
    if (!cleanText) {
      setErrorMessage("Pesan tidak boleh kosong!");
      setTimeout(() => setErrorMessage(null), 3000); // Sembunyikan notifikasi setelah 3 detik
      return;
    }

    // PROTEKSI 4 (VALIDASI PANJANG TEKS): Cegah pesan yang terlalu panjang (Max 300 karakter)
    if (cleanText.length > MAX_INPUT_LENGTH) {
      setErrorMessage(`Pesan terlalu panjang! Maksimal ${MAX_INPUT_LENGTH} karakter.`);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    // Reset pesan error jika seluruh validasi FE lolos
    setErrorMessage(null);

    // AKTIFKAN COOLDOWN ANTI-SPAM (Mencegah klik beruntun dalam jeda 1.5 detik)
    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 1500);

    // Mengambil jam saat ini dalam format HH:MM
    const currentTime = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Menambahkan pesan pengguna ke dalam antrean percakapan
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: cleanText,
      time: currentTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText(""); // Clear input teks di form
    setIsTyping(true); // Tampilkan indikator AI sedang memproses balasan

    // Simulasi jawaban pintar dari AI Assistant SiniBook (Frontend Mock Answer)
    setTimeout(() => {
      let aiResponseText = "Terima kasih telah bertanya! Ada hal lain tentang SiniBook Hotel yang bisa saya bantu?";
      const lowerText = cleanText.toLowerCase();

      if (lowerText.includes("kamar") || lowerText.includes("rekomendasi")) {
        aiResponseText = "Kami merekomendasikan Kamar Deluxe Suite dengan pemandangan kota yang memukau, dilengkapi tempat tidur King Size dan Wi-Fi cepat.";
      } else if (lowerText.includes("promo") || lowerText.includes("harga")) {
        aiResponseText = "Saat ini ada Promo Early Bird Diskon Hingga 30% dan Weekend Sale Diskon 20%. Silakan pesan sekarang untuk klaim diskon!";
      } else if (lowerText.includes("fasilitas")) {
        aiResponseText = "SiniBook Hotel memiliki Kolam Renang Outdoor, Restoran Mewah, Fitness Center 24 Jam, Spa & Massage, serta Ruang Rapat Modern.";
      } else if (lowerText.includes("lokasi") || lowerText.includes("akses")) {
        aiResponseText = "SiniBook Hotel berlokasi sangat strategis di Jl. Sudirman No. 123, Pusat Kota Jakarta, hanya 5 menit dari stasiun MRT dan pusat perbelanjaan.";
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        text: aiResponseText,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false); // Matikan indikator mengetik
    }, 800);
  };

  // Quick suggestion pills (Tombol saran pertanyaan cepat)
  const quickSuggestions = [
    "Rekomendasi kamar",
    "Harga promo hari ini",
    "Fasilitas hotel",
    "Lokasi & akses",
  ];

  return (
    <>
      {/* FLOATING ACTION BUTTON (Tombol Melayang di Pojok Kanan Bawah untuk Membuka/Menutup AI Assistant) */}
      <button
        onClick={handleToggle}
        disabled={isAnimating} // Blokir klik saat animasi berjalan → cegah ghost click
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#0B4F37] px-5 py-3 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[#073524] active:scale-95 border-2 border-emerald-400/40 animate-pulse-ring disabled:pointer-events-none"
        aria-label="Toggle AI Assistant"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/30 text-emerald-200">
          <Bot className="h-4 w-4" />
        </div>
        <span className="text-sm font-bold tracking-wide">AI Assistant</span>
      </button>

      {/* MODAL / POPUP CHAT AI ASSISTANT */}
      {/* isVisible: tetap di DOM selama animasi tutup; isOpen: menentukan kelas animasi masuk/keluar */}
      {isVisible && (
        <div
          className={`fixed bottom-20 right-4 z-[60] w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:right-6 transition-all duration-300 ease-out ${
            isOpen
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"   // State terbuka: tampil penuh
              : "opacity-0 translate-y-4 scale-95 pointer-events-none"       // State menutup: fade + slide down
          }`}
        >
          
          {/* HEADER CHAT WINDOW (Warna latar putih dengan ikon AI hijau & Tombol Tutup X) */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              {/* Avatar Bot AI dengan latar hijau lingkaran */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B4F37] text-white shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                {/* Judul AI Assistant */}
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1">
                  <span>AI Assistant</span>
                  <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                </h4>
                {/* Indikator Status Online */}
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Online & Siap Membantu
                </span>
              </div>
            </div>

            {/* Tombol Tutup Window (X) */}
            <button
              onClick={handleToggle}
              disabled={isAnimating}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:pointer-events-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* AREA PESAN PERCAKAPAN (BODY CHAT) */}
          <div className="h-80 overflow-y-auto p-4 space-y-3.5 bg-gray-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar AI (tampil jika pengirim adalah AI) */}
                {msg.sender === "ai" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0B4F37] text-white text-xs mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                {/* Bubble Balon Teks Pesan */}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-[#0B4F37] text-white rounded-br-none" // Gaya bubble pengguna (Hijau Tua)
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-none" // Gaya bubble AI (Putih Bersih)
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                  <span
                    className={`mt-1 block text-[9px] ${
                      msg.sender === "user" ? "text-emerald-200 text-right" : "text-gray-400"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>

                {/* Avatar User (tampil jika pengirim adalah User) */}
                {msg.sender === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-700 text-white text-xs mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Indikator Typing saat AI sedang memikirkan balasan */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B4F37] text-white">
                  <Bot className="h-4 w-4 animate-bounce" />
                </div>
                <span className="italic">AI Assistant sedang mengetik...</span>
              </div>
            )}

            {/* QUICK SUGGESTION PILLS: Pilihan Cepat Pertanyaan */}
            {messages.length <= 3 && !isTyping && (
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-gray-400 mb-2">Saran pertanyaan cepat:</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      disabled={isCooldown || isTyping}
                      onClick={() => handleSendMessage(suggestion)}
                      className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-[11px] font-medium text-[#0B4F37] shadow-sm transition-all hover:bg-[#0B4F37] hover:text-white hover:border-[#0B4F37] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* FOOTER FORM INPUT CHAT DENGAN VALIDASI SEKURITAS FE */}
          <div className="border-t border-gray-100 bg-white p-3">
            {/* NOTIFIKASI ERROR VALIDASI (Tampil jika ada kesalahan input / batas karakter) */}
            {errorMessage && (
              <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1.5 text-[11px] font-medium text-rose-600 border border-rose-200 animate-fade-in">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Input field pertanyaan dengan batasan maxLength dan disabled saat cooldown */}
              <div className="relative w-full">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (errorMessage) setErrorMessage(null); // Clear error saat pengguna mengetik ulang
                  }}
                  maxLength={MAX_INPUT_LENGTH} // Proteksi FE 1: Batas Maksimal 300 Karakter
                  disabled={isTyping || isCooldown} // Proteksi FE 2: Disabled saat cooldown / AI ngetik
                  placeholder={
                    isCooldown
                      ? "Harap tunggu sebentar..."
                      : "Tanyakan sesuatu tentang hotel..."
                  }
                  className={`w-full rounded-xl bg-gray-100 px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B4F37] transition-all ${
                    isTyping || isCooldown ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              {/* Tombol Kirim Pesan dengan Proteksi Spam / Disabled State */}
              <button
                type="submit"
                disabled={isTyping || isCooldown || !inputText.trim()}
                aria-label="Kirim Pesan"
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0B4F37] text-white shadow transition-all hover:bg-[#073524] active:scale-95 ${
                  isTyping || isCooldown || !inputText.trim()
                    ? "opacity-40 cursor-not-allowed hover:bg-[#0B4F37]"
                    : ""
                }`}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* HINT INDIKATOR MAKSIMAL KARAKTER */}
            <div className="mt-1 flex items-center justify-end px-1">
              <span className="text-[9px] text-gray-400">
                {inputText.length}/{MAX_INPUT_LENGTH} karakter
              </span>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
