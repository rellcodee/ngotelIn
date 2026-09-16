import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { NlpManager } from 'node-nlp';

interface ConversationState {
    waitingFor?: 'kategori_kamar' | 'kapasitas_kamar' | null;
    lastRoomId?: string;
    updatedAt: number;
}

export interface ChatBotResponse {
    reply: string;
    intent: string;
    score: number;
    suggestions: string[];
}

@Injectable()
export class AiBotService implements OnModuleInit {
    private manager: any;
    private userStates: Map<string, ConversationState> = new Map();
    private readonly CONFIDENCE_THRESHOLD = 0.65;

    constructor(private prisma: PrismaService) {
        this.manager = new NlpManager({ languages: ['id'], forceNER: true });
    }

    async onModuleInit() {
        try {
            // 1. Daftarkan nama kamar + alias sebagai Named Entity (NER)
            await this.registerRoomEntities();

            // 2. Load & training dari corpus.csv
            const csvPath = path.join(process.cwd(), 'corpus.csv');
            const csvData = fs.readFileSync(csvPath, 'utf-8');
            const rows = csvData.split(/\r?\n/);

            for (const row of rows) {
                if (!row.trim() || row.startsWith('intent')) continue;
                const [intent, question, answer] = row.split(';');

                if (intent && question) {
                    this.manager.addDocument('id', question.trim(), intent.trim());
                }
                if (intent && answer && answer.trim() !== '-') {
                    this.manager.addAnswer('id', intent.trim(), answer.trim());
                }
            }

            await this.manager.train();
            this.manager.save();
            console.log('TiniBot NLU Ready & Trained with SiniBook Knowledge!');
        } catch (error) {
            console.error('Gagal memuat/mentraining corpus.csv:', error);
        }
    }

    // Daftarkan nama kamar dari DB dengan variasi alias agar deteksi NER fleksibel
    private async registerRoomEntities() {
        const rooms = await this.prisma.resources.findMany({
            select: { name: true },
        });

        for (const room of rooms) {
            const baseName = room.name.toLowerCase();
            const cleanName = baseName.replace(/kamar|room|tipe/gi, '').trim();

            const aliases = Array.from(
                new Set([
                    baseName,
                    cleanName,
                    `kamar ${cleanName}`,
                    `tipe ${cleanName}`,
                    `${cleanName} room`,
                ]),
            ).filter(Boolean);

            this.manager.addNamedEntityText('tipe_kamar', room.name, ['id'], aliases);
        }
    }

    async processUserMessage(message: string, userId?: string): Promise<ChatBotResponse> {
        const userKey = userId || 'guest';
        const cleanMsg = message.trim().toLowerCase();
        const currentState = this.userStates.get(userKey);

        // CONTEXT MEMORY CHECK (Menangani alur lanjutan ketika bot menunggu jawaban user)
        if (currentState?.waitingFor === 'kategori_kamar') {
            const detectedCategory = this.detectCategory(cleanMsg);
            if (detectedCategory) {
                this.userStates.delete(userKey);
                return this.handleRoomRecommendation(detectedCategory, userId, message);
            }
        }

        // PROSES DENGAN NLU ENGINE
        const nlpResult = await this.manager.process('id', message);

        // CONFIDENCE SCORE GUARD (Cegah halusinasi / pertanyaan melenceng)
        if (nlpResult.score < this.CONFIDENCE_THRESHOLD || nlpResult.intent === 'None') {
            return this.handleFallback(userId, message, nlpResult.score);
        }

        let finalAnswer = nlpResult.answer;
        let dynamicSuggestions: string[] = this.getDefaultFollowUpSuggestions(nlpResult.intent);

        // Ambil entity tipe_kamar jika terdeteksi
        const roomEntity = nlpResult.entities.find((e: any) => e.entity === 'tipe_kamar');
        const roomName = roomEntity?.option;

        // ROUTING LOGIKA DINAMIS KE DATABASE PRISMA
        switch (nlpResult.intent) {
            // Sapaan awal rekomendasi kamar -> Bot tanya kriteria dan pasang Context Memory
            case 'pertanyaan.spesifik.kamar': {
                this.userStates.set(userKey, {
                    waitingFor: 'kategori_kamar',
                    updatedAt: Date.now(),
                });
                finalAnswer =
                    'Dengan senang hati Kak! Biar Tini pilihkan kamar yang paling pas, Kakak lagi butuh kamar tipe apa nih? ✨\n\n' +
                    '• **Hemat / Standard** (Paling terjangkau & nyaman)\n' +
                    '• **Mewah / Presidential Suite** (Kelas sultan paling premium)\n' +
                    '• **Keluarga** (Kapasitas besar & luas)\n' +
                    '• **Pasangan / Honeymoon** (Suasana romantis berdua)\n\n' +
                    '*Kakak bisa langsung ketik atau klik pilihan di bawah ya!*';

                dynamicSuggestions = [
                    'Hemat / Standard',
                    'Mewah / Presidential',
                    'Keluarga',
                    'Pasangan / Honeymoon',
                ];
                break;
            }

            case 'kamar.termurah':
                return this.handleRoomRecommendation('hemat', userId, message);

            case 'kamar.termahal_mewah':
                return this.handleRoomRecommendation('mewah', userId, message);

            case 'kamar.untuk_keluarga':
                return this.handleRoomRecommendation('keluarga', userId, message);

            case 'kamar.untuk_honeymoon':
                return this.handleRoomRecommendation('honeymoon', userId, message);

            case 'kamar.berdasarkan_kapasitas': {
                const targetCapacity = this.extractCapacity(message);
                if (!targetCapacity) {
                    finalAnswer = 'Untuk kapasitas berapa orang Kakak mencari kamar? (Contoh: untuk 3 orang, berempat)';
                    dynamicSuggestions = ['Untuk 2 orang', 'Untuk 3 orang', 'Untuk 4 orang', 'Untuk 5 orang'];
                    break;
                }

                const rooms = await this.prisma.resources.findMany({
                    where: { capacity: { gte: targetCapacity } },
                    orderBy: [{ capacity: 'asc' }, { price_per_night: 'asc' }],
                    take: 3,
                });

                if (rooms.length === 0) {
                    finalAnswer = `Mohon maaf Kak, saat ini belum ada kamar yang tersedia untuk kapasitas **${targetCapacity} orang** sekaligus. Kakak bisa memesan 2 kamar terpisah ya. 😊`;
                    dynamicSuggestions = ['Lihat Semua Kamar', 'Kamar Paling Hemat', 'Hubungi CS'];
                } else {
                    finalAnswer = this.formatRoomList(
                        rooms,
                        `Berikut pilihan kamar yang cocok untuk kapasitas **${targetCapacity} orang**:`,
                    );
                    dynamicSuggestions = ['Cara Booking', 'Jam Check-in', 'Fasilitas Hotel'];
                }
                break;
            }

            case 'kamar.daftar_semua_tipe': {
                const rooms = await this.prisma.resources.findMany({
                    take: 4,
                    orderBy: { price_per_night: 'asc' },
                });
                finalAnswer = this.formatRoomList(
                    rooms,
                    'Berikut pilihan tipe kamar yang tersedia di SiniBook:',
                );
                dynamicSuggestions = ['Kamar Paling Hemat', 'Kamar Paling Mewah', 'Cara Booking'];
                break;
            }

            case 'kamar.harga': {
                if (!roomName) {
                    finalAnswer = 'Tipe kamar apa yang ingin Kakak tanyakan harganya? Kami menyediakan tipe Standard, Suite, dan Presidential Suite Kak.';
                    dynamicSuggestions = ['Harga Standard', 'Harga Suite', 'Harga Presidential Suite'];
                    break;
                }
                const room = await this.prisma.resources.findFirst({
                    where: { name: { contains: roomName, mode: 'insensitive' } },
                });
                finalAnswer = this.formatRoomAnswer(
                    room,
                    (r) =>
                        `Harga untuk **${r.name}** adalah **Rp${this.formatPrice(r.price_per_night)}/malam** (Kapasitas ${r.capacity || 2} orang, sudah termasuk sarapan gratis 2 orang).\n\n👉 [Lihat Detail & Foto ${r.name}](/rooms/${r.id})`,
                );
                dynamicSuggestions = ['Fasilitas kamar ini', 'Cara Booking', 'Cek Kamar Lain'];
                break;
            }

            case 'kamar.fasilitas': {
                if (!roomName) {
                    finalAnswer = 'Tipe kamar apa yang ingin Kakak tanyakan fasilitasnya? (Standard, Suite, atau Presidential Suite)';
                    dynamicSuggestions = ['Fasilitas Standard', 'Fasilitas Suite', 'Fasilitas Presidential'];
                    break;
                }
                const room = await this.prisma.resources.findFirst({
                    where: { name: { contains: roomName, mode: 'insensitive' } },
                });
                finalAnswer = this.formatRoomAnswer(
                    room,
                    (r) =>
                        `Fasilitas untuk kamar **${r.name}** antara lain: ${r.facilities && r.facilities.length > 0 ? r.facilities.join(', ') : 'AC, Smart TV, Wi-Fi kencang, Kamar Mandi Pribadi dengan Air Panas'}.\n\n👉 [Lihat Detail ${r.name}](/rooms/${r.id})`,
                );
                dynamicSuggestions = ['Cek Harga Kamar', 'Cara Booking', 'Info Sarapan'];
                break;
            }
        }

        if (!finalAnswer) {
            return this.handleFallback(userId, message, nlpResult.score);
        }

        await this.logChat(userId, message, finalAnswer);

        return {
            reply: finalAnswer,
            intent: nlpResult.intent,
            score: nlpResult.score,
            suggestions: dynamicSuggestions,
        };
    }

    // Helper deteksi kategori kata kunci
    private detectCategory(text: string): string | null {
        if (/hemat|murah|budget|standard|standar|ekonomis/i.test(text)) return 'hemat';
        if (/mewah|presidential|sultan|suite|terbaik|eksklusif|premium/i.test(text)) return 'mewah';
        if (/keluarga|family|anak|rombongan|banyak orang/i.test(text)) return 'keluarga';
        if (/honeymoon|bulan madu|pasangan|berdua|romantis/i.test(text)) return 'honeymoon';
        return null;
    }

    // Helper ekstraksi kapasitas orang dari kalimat bebas
    private extractCapacity(text: string): number | null {
        if (/sendiri|1 orang|satu orang/i.test(text)) return 1;
        if (/berdua|pasangan|2 orang|dua orang/i.test(text)) return 2;
        if (/bertiga|3 orang|tiga orang/i.test(text)) return 3;
        if (/berempat|4 orang|empat orang/i.test(text)) return 4;
        if (/berlima|5 orang|lima orang/i.test(text)) return 5;
        if (/berenam|6 orang|enam orang/i.test(text)) return 6;

        const match = text.match(/(\d+)\s*(orang|org|pax|guest|tamu)?/i);
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }

        return null;
    }

    // dinamis DB
    private async handleRoomRecommendation(
        category: string,
        userId: string | undefined,
        message: string,
    ): Promise<ChatBotResponse> {
        let rooms: any[] = [];
        let label = '';
        let suggestions = ['Cara Booking', 'Jam Check-in', 'Fasilitas Hotel'];

        if (category === 'hemat') {
            rooms = await this.prisma.resources.findMany({
                orderBy: { price_per_night: 'asc' },
                take: 3,
            });
            label = 'Kamar paling hemat & terjangkau (Tipe Standard):';
            suggestions = ['Kamar Mewah', 'Kamar Keluarga', 'Cara Booking'];
        } else if (category === 'mewah') {
            rooms = await this.prisma.resources.findMany({
                orderBy: { price_per_night: 'desc' },
                take: 2,
            });
            label = 'Kamar paling mewah & super premium (Tipe Presidential Suite):';
            suggestions = ['Kamar Hemat', 'Fasilitas Kamar Ini', 'Cara Booking'];
        } else if (category === 'keluarga') {
            rooms = await this.prisma.resources.findMany({
                where: { capacity: { gte: 3 } },
                orderBy: { capacity: 'desc' },
                take: 3,
            });
            if (rooms.length === 0) {
                rooms = await this.prisma.resources.findMany({
                    orderBy: { capacity: 'desc' },
                    take: 2,
                });
            }
            label = 'Rekomendasi kamar luas yang cocok untuk keluarga:';
            suggestions = ['Kamar untuk 4 Orang', 'Info Sarapan', 'Cara Booking'];
        } else if (category === 'honeymoon') {
            rooms = await this.prisma.resources.findMany({
                where: { capacity: 2 },
                orderBy: { price_per_night: 'desc' },
                take: 3,
            });
            label = 'Rekomendasi kamar romantis untuk pasangan:';
            suggestions = ['Fasilitas Suite', 'Cara Booking', 'Jam Check-in'];
        }

        const reply = this.formatRoomList(rooms, `Siap Kak! Berikut ${label}`);
        await this.logChat(userId, message, reply);

        return {
            reply,
            intent: `kamar.rekomendasi.${category}`,
            score: 1.0,
            suggestions,
        };
    }

    private handleFallback(userId: string | undefined, message: string, score: number): ChatBotResponse {
        const reply =
            'Maaf Kak, Tini belum begitu paham dengan pertanyaan tersebut 🙏\n\n' +
            'Kakak bisa tanyakan hal seputar:\n' +
            ' **Rekomendasi & harga kamar**\n' +
            ' **Jadwal check-in / check-out**\n' +
            ' **Info sarapan, parkir basement gratis, & area merokok**\n' +
            ' Atau hubungi resepsionis kami di **+62 21 555 7890**';

        this.logChat(userId, message, reply);

        return {
            reply,
            intent: 'fallback',
            score,
            suggestions: [
                'Rekomendasi kamar',
                'Jam Check-in & Out',
                'Info Sarapan',
                'Fasilitas Hotel',
            ],
        };
    }

    private getDefaultFollowUpSuggestions(intent: string): string[] {
        if (intent.startsWith('jadwal.')) {
            return ['Bisa Early Check-in?', 'Late Check-out', 'Lokasi Hotel', 'Rekomendasi kamar'];
        }
        if (intent.startsWith('info.sarapan') || intent.startsWith('info.parkir')) {
            return ['Fasilitas Hotel', 'Rekomendasi kamar', 'Jam Check-in', 'Cara Booking'];
        }
        if (intent.startsWith('info.merokok') || intent.startsWith('info.hewan')) {
            return ['Fasilitas Hotel', 'Jam Check-in', 'Rekomendasi kamar', 'Hubungi CS'];
        }
        if (intent.startsWith('booking.pembayaran') || intent.startsWith('pembayaran.')) {
            return ['Cara Booking', 'Reschedule/Batal', 'Hubungi CS', 'Rekomendasi kamar'];
        }
        if (intent.startsWith('info.alamat') || intent.startsWith('alamat.maps')) {
            return ['Nomor Telepon CS', 'Jam Check-in', 'Parkir Basement', 'Rekomendasi kamar'];
        }
        return ['Rekomendasi kamar', 'Jam Check-in', 'Fasilitas Hotel', 'Lokasi & Akses'];
    }

    private formatPrice(price: number): string {
        return price.toLocaleString('id-ID');
    }

    private formatRoomAnswer(room: any, formatter: (r: any) => string): string {
        if (!room) {
            return 'Maaf Kak, data kamar tersebut tidak ditemukan di sistem kami.';
        }
        return formatter(room);
    }

    private formatRoomList(rooms: any[], header: string): string {
        if (!rooms || rooms.length === 0) {
            return 'Maaf Kak, belum ada data kamar yang tersedia untuk kriteria tersebut saat ini.';
        }
        let list = '';
        rooms.forEach((r) => {
            list += `\n• **${r.name}** (Kapasitas: ${r.capacity || 2} orang)\n  💰 Rp${this.formatPrice(r.price_per_night)}/malam (Inc. Sarapan 2 org)\n  👉 [Lihat Detail ${r.name}](/rooms/${r.id})\n`;
        });
        return `${header}\n${list}`;
    }

    private async logChat(userId: string | undefined, message: string, response: string) {
        if (userId && userId !== 'guest' && userId.trim() !== '') {
            try {
                await this.prisma.ai_chat_logs.create({
                    data: {
                        user_id: userId,
                        message,
                        response,
                    },
                });
            } catch (err) {
                console.error('Gagal simpan log chat ke DB:', err);
            }
        }
    }

    async clearChatHistory(userId?: string) {
        if (userId && userId !== 'guest' && userId.trim() !== '') {
            try {
                await this.prisma.ai_chat_logs.deleteMany({
                    where: { user_id: userId },
                });
            } catch (err) {
                console.error('Gagal reset log chat:', err);
            }
        }
        return { message: 'Riwayat percakapan berhasil di-reset.' };
    }
}
