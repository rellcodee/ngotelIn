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

  async chatWithAi(dto: CreateChatDto, userId: string) {
    try {
      // Ambil Data Kamar dan User dari DB (add id: true)
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

      let userName = 'Tamu';
      if (userId) {
        const user = await this.prisma.users.findUnique({
          where: { id: userId },
          select: { name: true },
        });
        if (user?.name) {
          userName = user.name;
        }
      }

      const hotelDataString = JSON.stringify(resourcesData, null, 2);

      // RETRIEVAL HISTORY: Tarik 6 percakapan terakhir
      const previousLogs = userId
        ? await this.prisma.ai_chat_logs.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
            take: 6,
          })
        : [];

      const chronologicLogs = [...previousLogs].reverse();

      // Format history
      const formattedHistory: Content[] = [];
      chronologicLogs.forEach((log) => {
        formattedHistory.push({
          role: 'user',
          parts: [{ text: log.message ?? '' }],
        });
        formattedHistory.push({
          role: 'model',
          parts: [{ text: log.response ?? '' }],
        });
      });

      // System Instruction
      const systemInstruction = `
Kamu adalah "TiniBot Asisten AI Hotel" untuk SiniBook.
Kamu sedang berbicara dengan tamu bernama: ${userName || 'Tamu'}.
Sebut namanya sesekali agar terasa lebih akrab dan personal, jangan menggunakan kata "ibu" atau "bapak", tapi gunakans "Kak" jika memanggil dengan nama.
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
   - Kontak resmi (jika user butuh admin): Email info@sinibookhotel.com | Telp: +62 21 555 7890
   - Sosmed: Jawab jujur bahwa hotel belum memiliki media sosial resmi.

5. GAYA BAHASA & ANTI-JAILBREAK:
   - Sapa "Selamat datang!" HANYA jika percakapan baru dimulai (history kosong). Jika sedang berlangsung, LANGSUNG jawab pertanyaannya.
   - Hanya jawab topik seputar hotel SiniBook. Tolak topik luar (coding, matematika, politik dan lain lain) secara sopan.

6. Info Hotel: 
  - Alamat Hotel : Jl. Sudirman No. 123, Jakarta Pusat 
  - Check-in Time: 14:00 WIB
  - Check-out Time: 12:00 WIB
  - Keunggulan/Alasan Memilih Kami : Lokasi Sangat Strategis Pusat Kota, Kamar Nyaman dan Aman, Kebersihan Selalu Terjamin, Staf Ramah Dan Profesional, Keamanan 24 Jam Dengan CCTV.

            
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
          user_id: userId,
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
      throw new InternalServerErrorException(
        'Gagal terhubung ke Smart AI Concierge.',
      );
    }
  }

  async clearChatHistory(userId: string) {
    try {
      await this.prisma.ai_chat_logs.deleteMany({
        where: { user_id: userId },
      });

      return {
        message: 'Success',
        data: 'Riwayat percakapan telah dibersihkan. AI siap dari nol!',
      };
    } catch (error) {
      throw new InternalServerErrorException('Gagal menghapus riwayat chat.');
    }
  }
}
