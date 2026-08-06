import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class AiBotService {
    private genAI: GoogleGenerativeAI;

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (!apiKey) throw new Error('GEMINI_API_KEY tidak ditemukan!');
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async chatWithAi(dto: CreateChatDto) {
        try {
            // 1. CEGAT COMMAND "RS" (RESET SESSION) DI BACKEND
            if (dto.message?.trim().toUpperCase() === 'RS') {
                if (dto.user_id) {
                    await this.prisma.ai_chat_logs.deleteMany({
                        where: { user_id: dto.user_id },
                    });
                }
                return {
                    message: 'Success',
                    data: {
                        log_id: null,
                        reply: 'Riwayat percakapan telah dibersihkan. Ada yang bisa saya bantu kembali?',
                    },
                };
            }

            // 2. Ambil Data Kamar dari DB (TAMBAH id: true AGAR LINK KAMAR JALAN)
            const resourcesData = await this.prisma.resources.findMany({
                select: {
                    id: true,
                    name: true,
                    type: true,
                    capacity: true,
                    price_per_night: true,
                    facilities: true,
                },
            });
            const hotelDataString = JSON.stringify(resourcesData, null, 2);

            // 3. RETRIEVAL HISTORY: Tarik 6 percakapan terakhir
            const previousLogs = dto.user_id
                ? await this.prisma.ai_chat_logs.findMany({
                    where: { user_id: dto.user_id },
                    orderBy: { created_at: 'desc' },
                    take: 6,
                })
                : [];

            const chronologicLogs = [...previousLogs].reverse();

            // 4. Format history (PERBAIKAN BUG log.response)
            const formattedHistory: Content[] = [];
            chronologicLogs.forEach((log) => {
                formattedHistory.push({
                    role: 'user',
                    parts: [{ text: log.message ?? '' }],
                });
                formattedHistory.push({
                    role: 'model',
                    parts: [{ text: log.response ?? '' }], // <--- FIXED: Gunakan log.response, bukan log.message
                });
            });

            // 5. System Instruction (Bersih & Fokus)
            const systemInstruction = `
Kamu adalah "Smart AI Concierge" untuk Ngotel.
Peranmu: Asisten hotel yang ramah, santai, profesional, dan ringkas. Jangan menjawab terlalu panjang atau seperti robot.

DATA KAMAR TERSEDIA:
${hotelDataString}

==================================================
ATURAN UTAMA & BATASAN:
==================================================
1. TUGAS:
   - Rekomendasikan kamar berdasarkan kebutuhan user.
   - Jawab fasilitas, biaya menginap, aturan check-in (14:00 WIB) & check-out (12:00 WIB).

2. LARANGAN KETAT:
   - DILARANG MENGARANG HARGA ATAU NAMA KAMAR di luar data.
   - DILARANG MEMINTA DATA DIRI (nama/HP/tanggal) untuk reservasi.
   - TIDAK BISA MEMBUAT BOOKING / CEK JADWAL REAL-TIME: Ingatkan bahwa kamu hanya asisten informasi, booking & cek tanggal kosong langsung dilakukan user di sistem aplikasi.
   - BUKAN TEMPAT PEMBAYARAN: Pembayaran via GOPAY, QRIS, Bank Transfer (BCA, Mandiri, BNI), Credit Card, atau Cash dilakukan saat booking di sistem, bukan di obrolan chat ini.

3. ATURAN REKOMENDASI KAMAR (STRICT ID):
   - Setiap kali merekomendasikan/membahas kamar spesifik, SELALU sertakan link di akhir paragraf dengan format:
     [Lihat Detail NamaKamar](/rooms/ID_UUID)
   - CATATAN SANGAT PENTING: Gunakan nilai "id" (UUID/ID unik) dari data, BUKAN nama kamar!
     Contoh BENAR: [Lihat Detail Executive Suite](/rooms/3639087e-a5d6-4ca6-8356-6b6bbd9570a5)
     Contoh SALAH: [Lihat Detail Executive Suite](/rooms/Executive Suite)

4. KONTAK & SOSMED:
   - Kontak resmi (jika user butuh admin): Email officialngotelin@ngotel.com | Telp: 2112
   - Sosmed: Jawab jujur bahwa hotel belum memiliki media sosial resmi.

5. GAYA BAHASA & ANTI-JAILBREAK:
   - Sapa "Selamat datang!" HANYA jika percakapan baru dimulai (history kosong). Jika sedang berlangsung, LANGSUNG jawab pertanyaannya.
   - Hanya jawab topik seputar hotel Ngotel. Tolak topik luar (coding, matematika, politik) secara sopan.
`;

            // 6. Inisialisasi Model Gemini
            const model = this.genAI.getGenerativeModel({
                model: 'gemini-flash-lite-latest',
                systemInstruction: systemInstruction,
            });

            // 7. Jalankan Chat Session dengan History
            const chatSession = model.startChat({
                history: formattedHistory,
            });

            const result = await chatSession.sendMessage(dto.message);
            const aiResponseText = result.response.text();

            // 8. Simpan Pesan Baru ke Log DB
            const chatLog = await this.prisma.ai_chat_logs.create({
                data: {
                    user_id: dto.user_id,
                    message: dto.message,
                    response: aiResponseText,
                },
            });

            return {
                message: 'Success',
                data: {
                    log_id: chatLog.id,
                    reply: aiResponseText,
                },
            };
        } catch (error) {
            console.error('Error saat memanggil Gemini:', error);
            throw new InternalServerErrorException('Gagal terhubung ke Smart AI Concierge.');
        }
    }
}