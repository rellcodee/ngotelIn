"use client";

import React, { useState, useRef, useEffect } from "react";

import RoomCard from "./components/RoomCard";
import ReactMarkdown from "react-markdown";
import { usePathname } from "next/navigation";

interface Message {
  id: number;
  sender: "ai" | "user";
  text: string;
  time: string;
}

export default function AiAssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const MAX_INPUT_LENGTH = 300;

  const pathname = usePathname();

  const INITIAL_SUGGESTIONS = [
    "Rekomendasi kamar",
    "Jam Check-in & Out",
    "Info Sarapan & Parkir",
    "Lokasi & Kontak",
  ];

  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // FUNGSI VALIDASI KEAMANAN FE: Sanitasi Teks dari Tag HTML Berbahaya (Anti-XSS)
  const sanitizeInput = (rawText: string): string => {
    return rawText
      .replace(/</g, "&lt;") // Mengubah simbol '<' menjadi &lt; agar tag HTML tidak dieksekusi
      .replace(/>/g, "&gt;") // Mengubah simbol '>' menjadi &gt;
      .trim(); // Menghapus spasi kosong berlebih di awal & akhir kalimat
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus(); // Pengecekan pertama kali

    // Polling setiap 1 detik untuk mengecek apakah user baru saja login/logout
    const intervalId = setInterval(checkLoginStatus, 1000);

    return () => clearInterval(intervalId); // Cleanup saat unmount
  }, []);

  // FUNGSI UTAMA: Mengirim Pesan dengan Validasi Keamanan Berlapis (FE Validation)
  const handleSendMessage = async (textToSend?: string) => {
    // PROTEKSI 1 (ANTI-SPAM / COOLDOWN)
    if (isTyping || isCooldown) return;

    const rawText = textToSend || inputText;

    // PROTEKSI 2 (SANATISASI INPUT)
    const cleanText = sanitizeInput(rawText);

    // PROTEKSI 3 (VALIDASI TEKS KOSONG)
    if (!cleanText) {
      setErrorMessage("Pesan tidak boleh kosong!");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    // PROTEKSI 4 (VALIDASI PANJANG TEKS Max 300) 
    if (cleanText.length > MAX_INPUT_LENGTH) {
      setErrorMessage(`Pesan terlalu panjang! Maksimal ${MAX_INPUT_LENGTH} karakter.`);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text: cleanText, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) }]);
    // Reset pesan error jika seluruh validasi FE lolos
    setErrorMessage(null);

    // AKTIFKAN COOLDOWN ANTI-SPAM (Mencegah klik beruntun dalam jeda 1.5 detik)
    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 1500);

    try {
      if (!textToSend) setInputText(""); // Clear input teks di form
      setIsTyping(true); // Tampilkan indikator AI sedang memproses balasan

      const res = await fetch("http://localhost:3001/ai-bot/chat", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({ message: cleanText, user_id: `${localStorage.getItem("user_id") || ""}` }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Gagal mendapatkan respon AI");
      }

      const fullReply = resData.reply || "";
      const aiMessageId = Date.now();
      const aiTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

      if (resData.suggestions && Array.isArray(resData.suggestions) && resData.suggestions.length > 0) {
        setCurrentSuggestions(resData.suggestions);
      }

      // Matikan indikator "sedang mengetik", ganti dengan entri pesan AI baru
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: aiMessageId, sender: "ai", text: "", time: aiTime }]);

      // Simulasi Efek Typewriter: Tampilkan pesan kata demi kata (word-by-word)
      const words = fullReply.split(" ");
      let wordIdx = 0;

      const typewriterInterval = setInterval(() => {
        if (wordIdx < words.length) {
          const currentChunk = words.slice(0, wordIdx + 1).join(" ");
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId ? { ...msg, text: currentChunk } : msg
            )
          );
          wordIdx++;
        } else {
          clearInterval(typewriterInterval);
        }
      }, 35); // Jeda 35ms per kata untuk animasi halus

    } catch (error) {
      console.error("Error saat chat:", error);
      setIsTyping(false);
      setErrorMessage("Gagal terhubung ke AI Assistant. Coba lagi.");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleResetChat = async () => {
    try {
      setIsTyping(true);
      await fetch("http://localhost:3001/ai-bot/chat", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
        }
      });

      // Kosongkan pesan di UI
      setMessages([]);
      setCurrentSuggestions(INITIAL_SUGGESTIONS);
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage("Gagal mereset riwayat percakapan.");
    } finally {
      setIsTyping(false);
    }
  };

  const closeBot = () => {
    setIsOpen(false);
  };

  // Sembunyikan bot jika berada di halaman admin, staff, login, atau register
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/staff") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <>
      {/* FLOATING ACTION BUTTON (Tombol Melayang di Pojok Kanan Bawah untuk Membuka/Menutup AI Assistant) */}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#1E3A8A] px-5 py-3 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[#1E3A8A] active:scale-95 border-2 border-emerald-400/40 animate-pulse-ring"
          aria-label="Toggle AI Assistant"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#1E3A8A]">
            <span className="material-symbols-outlined text-[16px]">support_agent</span>
          </div>
          <span className="text-sm font-bold tracking-wide">TiniBot</span>
        </button>
      )}

      {/* MODAL / POPUP CHAT AI ASSISTANT */}
      {isOpen && (

        <div className="fixed bottom-20 right-4 z-50 w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_20px_50px_rgba(0,26,82,0.25)] sm:right-6 transition-all duration-300">

          {/* HEADER CHAT WINDOW (Warna latar putih dengan ikon AI & Tombol Tutup X) */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              {/* Avatar Bot AI */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E3A8A] text-white shadow-sm">
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
              </div>
              <div>
                {/* Judul AI Assistant */}
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1 font-display">
                  <span>TiniBot</span>
                </h4>
                {/* Indikator Status Online */}
                <span className="text-[10px] text-[#1D4ED8] font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
                  Ramah & Siap Membantu
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">

              <button
                onClick={handleResetChat}
                title="Reset Percakapan"
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
              </button>

              {/* Tombol Tutup Window (X) */}
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

          </div>

          <div className="">
            <div className="h-80 overflow-y-auto p-4 space-y-3.5 bg-gray-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  {/* Avatar AI (tampil jika pengirim adalah AI) */}
                  {/* Avatar AI (tampil jika pengirim adalah AI) */}
                  {msg.sender === "ai" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1E3A8A] text-white text-xs mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">support_agent</span>
                    </div>
                  )}

                  {/* Bubble Balon Teks Pesan */}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm shadow-sm ${msg.sender === "user"
                      ? "bg-[#1D4ED8] text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                      }`}
                  >
                    {msg.sender === "ai" ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <span className="block mb-2 last:mb-0">{children}</span>,
                          a: ({ node, href, children }) => {
                            const isRoomLink = href && href.startsWith("/rooms/");

                            if (isRoomLink) {
                              const roomId = href.replace("/rooms/", "");
                              const roomName = String(children);
                              return <RoomCard roomId={roomId} roomName={roomName} />;
                            }

                            return (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#1D4ED8] underline hover:text-[#001a52]"
                              >
                                {children}
                              </a>
                            );
                          },
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                    )}

                    <span
                      className={`mt-1 block text-[9px] ${msg.sender === "user" ? "text-blue-100 text-right" : "text-gray-400"
                        }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                  {/* Avatar User (tampil jika pengirim adalah User) */}
                  {msg.sender === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-white text-xs mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">person</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Indikator Typing saat AI sedang memikirkan balasan */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1D4ED8] text-white">
                    <span className="material-symbols-outlined text-[16px] animate-bounce">smart_toy</span>
                  </div>
                  <span className="italic">AI Assistant sedang mengetik...</span>
                </div>
              )}

              {/* QUICK SUGGESTION PILLS: Pilihan Cepat Pertanyaan Dinamis */}
              {!isTyping && currentSuggestions && currentSuggestions.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-gray-400 mb-2">Saran pertanyaan / pilihan:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        disabled={isCooldown || isTyping}
                        onClick={() => handleSendMessage(suggestion)}
                        className="rounded-full border border-blue-200 bg-white px-3 py-1 text-[11px] font-medium text-[#1D4ED8] shadow-sm transition-all hover:bg-[#1D4ED8] hover:text-white hover:border-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <span className="material-symbols-outlined text-[14px] shrink-0">error</span>
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
                    className={`w-full rounded-xl bg-gray-100 px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1D4ED8] transition-all ${isTyping || isCooldown ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                  />
                </div>

                {/* Tombol Kirim Pesan dengan Proteksi Spam / Disabled State */}
                <button
                  type="submit"
                  disabled={isTyping || isCooldown || !inputText.trim()}
                  aria-label="Kirim Pesan"
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#1D4ED8] text-white shadow transition-all hover:bg-[#1E3A8A] active:scale-95 ${isTyping || isCooldown || !inputText.trim()
                    ? "opacity-40 cursor-not-allowed hover:bg-[#1D4ED8]"
                    : ""
                    }`}
                >
                  <span className="material-symbols-outlined text-[14px]">send</span>
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
        </div>
      )}
    </>
  );
}
