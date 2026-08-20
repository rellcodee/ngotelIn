"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User, AlertCircle, RefreshCcw } from "lucide-react";
import RoomCard from "./components/RoomCard";
import ReactMarkdown from "react-markdown";

interface Message {
  id: number;
  sender: "ai" | "user";
  text: string;
  time: string;
}

export default function AiAssistantModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const MAX_INPUT_LENGTH = 300;

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
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
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

    // Mengambil jam saat ini dalam format HH:MM
    const currentTime = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    try {

      if (!textToSend) setInputText(""); // Clear input teks di form
      setIsTyping(true); // Tampilkan indikator AI sedang memproses balasan

      const res = await fetch("http://localhost:3001/ai/chat", {
        method: "POST",
        // credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ message: cleanText }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Gagal mendapatkan respon AI");
      }

      // Tambahkan balasan asli dari Gemini ke state messages
      const aiMessage: Message = {
        id: Date.now(),
        sender: "ai",
        text: resData.data.reply, // Menerima respon dari backend NestJS
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false); // Tampilkan indikator AI sedang memproses balasan

    } catch (error) {
      console.error("Error saat chat:", error);
      setErrorMessage("Gagal terhubung ke AI Assistant. Coba lagi.");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleResetChat = async () => {
    try {
      setIsTyping(true);
      await fetch("http://localhost:3001/ai/chat", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJpa29AbmdvdGVsaW4uY29tIiwic3ViIjoiMGZjMWQ2YjEtOWUwYS00NDc0LTk2NDUtNTdhZWE5OTIzOWRlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3ODY1MzUyNDAsImV4cCI6MTc4NjYyMTY0MH0.Y0saop6C3OOVJgwFDLw7Zfc4NwT2feL4hjzaRcekBAQ`
        }
      });

      // Kosongkan pesan di UI
      setMessages([]);
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage("Gagal mereset riwayat percakapan.");
    } finally {
      setIsTyping(false);
    }
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

      {!isOpen && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#0B4F37] px-5 py-3 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[#073524] active:scale-95 border-2 border-emerald-400/40 animate-pulse-ring"
          aria-label="Toggle AI Assistant"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/30 text-emerald-200">
            <Bot className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-wide">TiniBot</span>
        </button>
      )}

      {/* MODAL / POPUP CHAT AI ASSISTANT */}
      {isOpen && (

        <div className="fixed bottom-20 right-4 z-50 w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:right-6 transition-all duration-300">

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
                  <span>TiniBot</span>
                </h4>
                {/* Indikator Status Online */}
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
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
                <RefreshCcw className="h-4 w-4" />
              </button>

              {/* Tombol Tutup Window (X) */}
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

          </div>

          {isLoggedIn ? (

            <div className="">
              <div className="h-80 overflow-y-auto p-4 space-y-3.5 bg-gray-50/50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"
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
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm shadow-sm ${msg.sender === "user"
                        ? "bg-[#0B4F37] text-white rounded-br-none" // Gaya bubble pengguna (Hijau Tua)
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none" // Gaya bubble AI (Putih Bersih)
                        }`}
                    >

                      {msg.sender === "ai" ? (
                        <ReactMarkdown
                          components={{
                            // Mengubah pembungkus paragraf markdown agar menggunakan span block
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
                                  className="text-emerald-700 underline hover:text-emerald-900"
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
                        className={`mt-1 block text-[9px] ${msg.sender === "user" ? "text-emerald-200 text-right" : "text-gray-400"
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
                      className={`w-full rounded-xl bg-gray-100 px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B4F37] transition-all ${isTyping || isCooldown ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                    />
                  </div>

                  {/* Tombol Kirim Pesan dengan Proteksi Spam / Disabled State */}
                  <button
                    type="submit"
                    disabled={isTyping || isCooldown || !inputText.trim()}
                    aria-label="Kirim Pesan"
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0B4F37] text-white shadow transition-all hover:bg-[#073524] active:scale-95 ${isTyping || isCooldown || !inputText.trim()
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


          ) : (
            <div className="p-4">
              <p className="text-sm text-gray-500">Silahkan login terlebih dahulu untuk menggunakan AI Assistant.</p>
            </div>
          )}
        </div >
      )
      }
    </>
  );
}
