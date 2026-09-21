import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { NlpManager } from 'node-nlp';

interface ConversationState {
    waitingFor?: 'kategori_kamar' | 'kamar_detail_fasilitas' | 'kamar_detail_harga' | null;
    lastRoomId?: string;
    lastRoomName?: string;
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
    private readonly CONFIDENCE_THRESHOLD = 0.40;

    constructor(private readonly prisma: PrismaService) {
        this.manager = new NlpManager({
            languages: ['id'],
            autoSave: true,
            modelFileName: './model.nlp',
            nlu: { log: false },
        });
    }

    async onModuleInit() {
        try {
            // 1. Registrasi Native Entities (Wajib selalu dieksekusi agar memori entity selalu aktif)
            await this.registerNativeEntities();

            // 2. Load & Train Dataset dari corpus.csv (Selalu train agar update dataset real-time)
            const csvPath = path.join(process.cwd(), 'corpus.csv');
            const csvData = fs.readFileSync(csvPath, 'utf-8');
            const rows = csvData.split(/\r?\n/);

            for (const row of rows) {
                if (!row.trim() || row.startsWith('intent')) continue;
                const [intent, question, answer] = row.split(';');

                if (intent && question) {
                    this.manager.addDocument('id', this.preprocessText(question.trim()), intent.trim());
                }
                if (intent && answer && answer.trim() !== '-') {
                    const formattedAnswer = answer.trim().replace(/\\n/g, '\n');
                    this.manager.addAnswer('id', intent.trim(), formattedAnswer);
                }
            }

            await this.manager.train();
            this.manager.save();
            console.log('NLU Pipeline Ready & Trained (SiniBook Hotel)');
        } catch (error) {
            console.error('Gagal inisialisasi NLU Engine:', error);
        }
    }

    // TEXT PREPROCESSOR & SLANG NORMALIZER
    private preprocessText(text: string): string {
        if (!text) return '';
        let clean = text
            .toLowerCase()
            .replace(/&/g, ' dan ')
            .replace(/[\/\\]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const slangMap: [RegExp, string][] = [
            [/\brekomen\b|\brekomendasikan\b|\brekomendasiin\b/g, 'rekomendasi'],
            [/\big\b|\binsta\b/g, 'instagram'],
            [/\bwa\b|\bno wa\b|\bnomor wa\b/g, 'whatsapp'],
            [/\bboking\b|\bbokingin\b|\bbookingin\b|\bpesenin\b|\bpesen\b/g, 'booking pesan'],
            [/\bkluarga\b|\bklrga\b|\banak kecil\b|\bbocah\b|\bbawa anak\b|\bsekeluarga\b/g, 'keluarga'],
            [/\bduit\b|\btf\b|\btransferan\b/g, 'transfer bayar'],
            [/\bbrp\b|\bbrapa\b|\bbrapaan\b/g, 'berapa'],
            [/\bgmn\b|\bgimana\b/g, 'bagaimana'],
            [/\bkmr\b|\bruang\b/g, 'kamar'],
            [/\bsoal parkir\b|\bparkiran\b/g, 'tempat parkir'],
            [/\bsarap\b|\bmakan pagi\b|\bbreakfast\b/g, 'sarapan'],
            [/\bbego\b|\bbodoh\b|\btolol\b|\bgajelas\b|\bga jelas\b|\bkaga jelas\b/g, 'gak jelas'],
        ];

        for (const [pattern, replacement] of slangMap) {
            clean = clean.replace(pattern, replacement);
        }

        return clean.replace(/\s+/g, ' ').trim();
    }

    // NATIVE ENTITY REGISTRATION
    private async registerNativeEntities() {
        // Kategori Kamar
        this.manager.addNamedEntityText(
            'kategori_kamar',
            'hemat',
            ['id'],
            ['hemat', 'murah', 'budget', 'terjangkau', 'ekonomis', 'standard', 'standar', 'paling murah', 'low budget', 'hemat / standard'],
        );
        this.manager.addNamedEntityText(
            'kategori_kamar',
            'suite',
            ['id'],
            ['suite', 'menengah', 'kamar suite', 'suite room', 'sedang', 'kelas menengah', 'semi mewah', 'premium suite', 'suite / menengah', 'tengah', 'tengah tengah', 'tengah-tengah', 'yang tengah'],
        );
        this.manager.addNamedEntityText(
            'kategori_kamar',
            'mewah',
            ['id'],
            ['mewah', 'presidential', 'mahal', 'termahal', 'elegan', 'paling mahal', 'high class', 'high level', 'sultan', 'eksklusif', 'premium', 'bagus', 'terbaik', 'paling bagus', 'nyaman', 'enak', 'mantap', 'vip', 'luxury', 'mewah / presidential'],
        );
        this.manager.addNamedEntityText(
            'kategori_kamar',
            'keluarga',
            ['id'],
            ['keluarga', 'family', 'anak', 'rombongan', 'sekeluarga', 'bawa anak', 'bocah', 'orang tua', 'ramean'],
        );
        this.manager.addNamedEntityText(
            'kategori_kamar',
            'honeymoon',
            ['id'],
            ['honeymoon', 'bulan madu', 'pasangan', 'berdua', 'romantis', 'staycation berdua', 'suami istri', 'pacar', 'pasangan / honeymoon', 'staycation'],
        );

        // Kapasitas (Digit & Teks)
        this.manager.addNamedEntityText('jumlah_tamu', '1', ['id'], ['1 orang', '1 org', '1 tamu', 'sendiri', 'solo', 'single', 'sendirian']);
        this.manager.addNamedEntityText('jumlah_tamu', '2', ['id'], ['2 orang', '2 org', '2 tamu', 'berdua', 'pasangan', 'duaan']);
        this.manager.addNamedEntityText('jumlah_tamu', '3', ['id'], ['3 orang', '3 org', '3 tamu', 'bertiga', 'tigaan', 'muat 3']);
        this.manager.addNamedEntityText('jumlah_tamu', '4', ['id'], ['4 orang', '4 org', '4 tamu', 'berempat', 'empatan', 'muat 4']);
        this.manager.addNamedEntityText('jumlah_tamu', '5', ['id'], ['5 orang', '5 org', '5 tamu', 'berlima', 'muat 5']);
        this.manager.addNamedEntityText('jumlah_tamu', '6', ['id'], ['6 orang', '6 org', '6 tamu', 'berenam', 'muat 6']);

        // Tipe Kamar Database
        const rooms = await this.prisma.resources.findMany({ select: { name: true, type: true } });
        for (const room of rooms) {
            const base = room.name.toLowerCase();
            const clean = base.replace(/\bkamar\b|\broom\b|\btipe\b/gi, '').replace(/\s+/g, ' ').trim();
            const aliases = Array.from(
                new Set([base, clean, `kamar ${clean}`, `tipe ${clean}`, `${clean} room`]),
            ).filter((a) => a && a.length >= 3 && a !== 'kamar' && a !== 'room');

            if (aliases.length > 0) {
                this.manager.addNamedEntityText('tipe_kamar', room.name, ['id'], aliases);
            }
        }

        // Entity alias umum kasta kamar cuy
        this.manager.addNamedEntityText('tipe_kamar', 'standard', ['id'], ['standard', 'standar', 'kamar standard', 'kamar standar', 'standard room']);
        this.manager.addNamedEntityText('tipe_kamar', 'suite', ['id'], ['suite', 'kamar suite', 'suite room']);
        this.manager.addNamedEntityText('tipe_kamar', 'presidential', ['id'], ['presidential suite', 'presidential', 'kamar presidential', 'presidential room', 'president suite']);
    }

    // PIPELINE EXECUTION
    async processUserMessage(rawMessage: string, userId?: string): Promise<ChatBotResponse> {
        const userKey = userId || 'guest';
        const normalizedMsg = this.preprocessText(rawMessage);
        const currentState = this.userStates.get(userKey);

        // NLU PROCESS
        const nlpResult = await this.manager.process('id', normalizedMsg);

        // Ekstraksi Entities Native yang dihasilkan NLP.js
        const categoryEntity = nlpResult.entities.find((e: any) => e.entity === 'kategori_kamar')?.option;
        const capacityEntity = nlpResult.entities.find((e: any) => e.entity === 'jumlah_tamu')?.option;
        const roomEntity = nlpResult.entities.find((e: any) => e.entity === 'tipe_kamar')?.option;

        // Cek regex numerik cadangan jika entity tidak menangkap digit bebas (misal: "10 orang")
        const regexMatch = normalizedMsg.match(/(\d+)\s*(orang|org|pax|tamu|guest)/);
        const guestCount = capacityEntity ? parseInt(capacityEntity, 10) : (regexMatch ? parseInt(regexMatch[1], 10) : null);

        // Deteksi Kategori yang Tangguh (Entity NLP + Keyword Matcher)
        let resolvedCategory = categoryEntity;
        if (!resolvedCategory) {
            if (/\b(suite|menengah|sedang|tengah|tengah-tengah)\b/i.test(normalizedMsg)) resolvedCategory = 'suite';
            else if (/\b(mewah|presidential|sultan|vvip|luxury|termahal|mahal)\b/i.test(normalizedMsg)) resolvedCategory = 'mewah';
            else if (/\b(hemat|paling murah|murah|budget|low budget|lowbudget|standar|standard|murmer|ramah kantong|kantong pelajar|ekonomis|terjangkau)\b/i.test(normalizedMsg)) resolvedCategory = 'hemat';
            else if (/\b(keluarga|family|anak|rombongan|sekeluarga|ramean)\b/i.test(normalizedMsg)) resolvedCategory = 'keluarga';
            else if (/\b(pasangan|honeymoon|bulan madu|romantis|berdua|staycation berdua|pacar)\b/i.test(normalizedMsg)) resolvedCategory = 'honeymoon';
        }

        // DIALOGUE STATE MACHINE
        if (currentState?.waitingFor === 'kategori_kamar') {
            this.userStates.delete(userKey);
            if (guestCount) {
                return this.fulfillCapacitySearch(guestCount, userId, rawMessage);
            }
            if (resolvedCategory) {
                return this.fulfillCategorySearch(resolvedCategory, userId, rawMessage);
            }
        }

        // Direct Category Routing (Bypass jika user mencari/mengetik kategori secara langsung)
        if (resolvedCategory && !nlpResult.intent?.startsWith('hotel.') && !nlpResult.intent?.startsWith('pembayaran.') && !nlpResult.intent?.startsWith('booking.')) {
            if (nlpResult.intent === 'kamar.cari' || nlpResult.intent === 'kamar.detail_info' || nlpResult.score < this.CONFIDENCE_THRESHOLD) {
                return this.fulfillCategorySearch(resolvedCategory, userId, rawMessage);
            }
        }

        if (currentState?.waitingFor === 'kamar_detail_fasilitas') {
            const target = roomEntity || normalizedMsg;
            const room = await this.findRoomByName(target);
            if (room) {
                this.userStates.set(userKey, { lastRoomId: room.id, lastRoomName: room.name, updatedAt: Date.now() });
                const reply = `Fasilitas untuk kamar **${room.name}** antara lain: ${room.facilities && room.facilities.length > 0 ? room.facilities.join(', ') : 'AC, Smart TV, Wi-Fi kencang, Kamar Mandi Pribadi dengan Air Panas'}.\n\n👉 [Lihat Detail & Foto ${room.name}](/rooms/${room.id})`;
                if (rawMessage) await this.logChat(userId, rawMessage, reply);
                return {
                    reply,
                    intent: 'kamar.detail_fasilitas',
                    score: 1.0,
                    suggestions: ['Cek Harga Kamar Ini', 'Cara Booking', 'Cek Kamar Lain'],
                };
            }
        }

        if (currentState?.waitingFor === 'kamar_detail_harga') {
            const target = roomEntity || normalizedMsg;
            const room = await this.findRoomByName(target);
            if (room) {
                this.userStates.set(userKey, { lastRoomId: room.id, lastRoomName: room.name, updatedAt: Date.now() });
                const reply = `Harga untuk kamar **${room.name}** adalah **Rp${this.formatPrice(room.price_per_night)}/malam** (Kapasitas ${room.capacity || 2} orang, sudah termasuk sarapan prasmanan gratis 2 orang).\n\n👉 [Lihat Detail & Foto ${room.name}](/rooms/${room.id})`;
                if (rawMessage) await this.logChat(userId, rawMessage, reply);
                return {
                    reply,
                    intent: 'kamar.detail_harga',
                    score: 1.0,
                    suggestions: ['Fasilitas Kamar Ini', 'Cara Booking', 'Cek Kamar Lain'],
                };
            }
        }

        // CONFIDENCE SCORE GATE
        if (nlpResult.score < this.CONFIDENCE_THRESHOLD || nlpResult.intent === 'None') {
            return this.handleFallback(userId, rawMessage, nlpResult.score);
        }

        let finalAnswer = nlpResult.answer;
        let dynamicSuggestions: string[] = this.getFollowUpSuggestions(nlpResult.intent);

        // ACTION FULFILLMENT
        switch (nlpResult.intent) {
            case 'sapaan.awal': {
                finalAnswer = `${this.getTimeGreeting()} Kak! Selamat datang di SiniBook, ada yang bisa Tini bantu untuk rencana menginap Kakak hari ini? ✨`;
                dynamicSuggestions = ['Rekomendasi kamar', 'Jam Check-in & Out', 'Info Sarapan', 'Lokasi & Kontak'];
                break;
            }

            case 'umum.tentang_sinibook': {
                finalAnswer =
                    '**SiniBook** adalah hotel modern sekaligus platform reservasi penginapan terpercaya yang berlokasi strategis di pusat bisnis Jakarta (**Jl. Sudirman No. 123**). 🏨✨\n\n' +
                    'Keunggulan utama kami:\n' +
                    '• **Pilihan Kamar**: Standard (hemat), Suite, hingga Presidential Suite (mewah)\n' +
                    '• **Sarapan Prasmanan GRATIS** untuk 2 orang di setiap kamar\n' +
                    '• **Basement Parkir GRATIS** (mobil & motor) dengan keamanan CCTV 24 jam\n' +
                    '• **Wi-Fi Kencang** & Resepsionis 24 jam nonstop';
                dynamicSuggestions = ['Rekomendasi kamar', 'Fasilitas Hotel', 'Lokasi & Kontak', 'Cara Booking'];
                break;
            }

            case 'kamar.cari': {
                // Kasus A: Ada entitas kapasitas tamu (misal: "buat 3 orang", "bertiga")
                if (guestCount) {
                    return this.fulfillCapacitySearch(guestCount, userId, rawMessage);
                }

                // Kasus B: Ada entitas kategori (misal: "kamar yg bagus", "kamar murah", "buat keluarga")
                if (categoryEntity) {
                    return this.fulfillCategorySearch(categoryEntity, userId, rawMessage);
                }

                // Kasus C: Pencarian umum tanpa parameter -> Prompt pilihan & pasang State
                this.userStates.set(userKey, {
                    waitingFor: 'kategori_kamar',
                    updatedAt: Date.now(),
                });
                finalAnswer =
                    'Dengan senang hati Kak! Biar Tini pilihkan kamar yang paling pas, Kakak lagi butuh kamar kategori apa nih? ✨\n\n' +
                    '• **Hemat / Standard** (Paling terjangkau & ekonomis)\n' +
                    '• **Suite / Menengah** (Ruangan luas, santai, & berkelas)\n' +
                    '• **Mewah / Presidential Suite** (Puncak kemewahan kelas sultan)\n' +
                    '• **Keluarga** (Kapasitas besar 3+ orang)\n' +
                    '• **Pasangan / Honeymoon** (Suasana romantis berdua)\n\n' +
                    '*Kakak bisa langsung ketik atau klik tombol di bawah ya!*';

                dynamicSuggestions = [
                    'Hemat / Standard',
                    'Suite / Menengah',
                    'Mewah / Presidential',
                    'Keluarga',
                    'Pasangan / Honeymoon',
                ];
                break;
            }

            case 'kamar.tingkatan_level': {
                finalAnswer =
                    'Di **SiniBook**, kami menyediakan 3 tingkatan (kasta) tipe kamar yang bisa disesuaikan dengan kebutuhan Kakak: 🏨✨\n\n' +
                    '🥇 **1. Standard (Kasta Hemat / Entry Level)**\n' +
                    '• Pilihan paling ekonomis & terjangkau untuk solo traveler, backpacker, atau staycation hemat.\n' +
                    '• Fasilitas: AC, Smart TV, Wi-Fi kencang, Kamar Mandi Air Panas, & Sarapan Prasmanan Gratis 2 orang.\n\n' +
                    '🥈 **2. Suite (Kasta Menengah / Premium)**\n' +
                    '• Ruangan lebih luas dengan area santai terpisah, cocok untuk pasangan atau liburan santai.\n' +
                    '• Fasilitas: Ruang santai ekstra, King Bed nyaman, pemandangan kota, & Sarapan Prasmanan Gratis 2 orang.\n\n' +
                    '👑 **3. Presidential Suite (Kasta Tertinggi / Kelas Sultan)**\n' +
                    '• Puncak kemewahan dan privasi maksimal dengan ruangan termegah dan fasilitas eksklusif.\n' +
                    '• Fasilitas: Living room luas, interior mewah, view terbaik gedung, & pelayanan VIP.\n\n' +
                    '*Kakak tertarik untuk cek kasta kamar yang mana nih?*';
                dynamicSuggestions = ['Cari Kamar Standard', 'Cari Kamar Suite', 'Cari Presidential Suite', 'Cara Booking'];
                break;
            }

            case 'kamar.detail_info': {
                const target = roomEntity || currentState?.lastRoomName || normalizedMsg;
                const room = await this.findRoomByName(target, currentState?.lastRoomId);
                if (!room) {
                    finalAnswer = 'Tipe kamar mana yang ingin Kakak ketahui detailnya? (Standard, Suite, atau Presidential Suite) ✨';
                    dynamicSuggestions = ['Standard Room', 'Suite Room', 'Presidential Suite'];
                    break;
                }
                this.userStates.set(userKey, { lastRoomId: room.id, lastRoomName: room.name, updatedAt: Date.now() });
                finalAnswer =
                    `Berikut informasi lengkap untuk **${room.name}**: 🏨✨\n\n` +
                    `• 💰 **Tarif**: Rp${this.formatPrice(room.price_per_night)}/malam (Termasuk Sarapan 2 org)\n` +
                    `• 👥 **Kapasitas**: ${room.capacity || 2} orang\n` +
                    `• 🛋️ **Fasilitas**: ${room.facilities && room.facilities.length > 0 ? room.facilities.join(', ') : 'AC, Smart TV, Wi-Fi kencang, Kamar Mandi Pribadi dengan Air Panas'}\n` +
                    `• 📝 **Deskripsi**: ${room.description || 'Kamar nyaman dan bersih dengan fasilitas lengkap untuk kenyamanan Anda.'}\n\n` +
                    `👉 [Lihat Detail & Foto ${room.name}](/rooms/${room.id})`;
                dynamicSuggestions = ['Cek Harga Kamar Ini', 'Fasilitas Kamar Ini', 'Cara Booking', 'Cek Kamar Lain'];
                break;
            }

            case 'kamar.detail_harga': {
                const target = roomEntity || normalizedMsg || currentState?.lastRoomName;
                const room = await this.findRoomByName(target, currentState?.lastRoomId);
                if (!room) {
                    this.userStates.set(userKey, {
                        waitingFor: 'kamar_detail_harga',
                        updatedAt: Date.now(),
                    });
                    finalAnswer = 'Tipe kamar apa yang ingin Kakak ketahui harganya? ✨\n\n• **Standard Room**\n• **Suite Room**\n• **Presidential Suite**';
                    dynamicSuggestions = ['Harga Standard', 'Harga Suite', 'Harga Presidential Suite'];
                    break;
                }
                this.userStates.set(userKey, { lastRoomId: room.id, lastRoomName: room.name, updatedAt: Date.now() });
                finalAnswer = this.formatRoomAnswer(
                    room,
                    (r) =>
                        `Harga untuk kamar **${r.name}** adalah **Rp${this.formatPrice(r.price_per_night)}/malam** (Kapasitas ${r.capacity || 2} orang, sudah termasuk sarapan prasmanan gratis 2 orang).\n\n👉 [Lihat Detail & Foto ${r.name}](/rooms/${r.id})`,
                );
                dynamicSuggestions = ['Fasilitas Kamar Ini', 'Cara Booking', 'Cek Kamar Lain'];
                break;
            }

            case 'kamar.detail_fasilitas': {
                const target = roomEntity || normalizedMsg || currentState?.lastRoomName;
                const room = await this.findRoomByName(target, currentState?.lastRoomId);
                if (!room) {
                    this.userStates.set(userKey, {
                        waitingFor: 'kamar_detail_fasilitas',
                        updatedAt: Date.now(),
                    });
                    finalAnswer = 'Tipe kamar apa yang ingin Kakak tanyakan fasilitasnya? ✨\n\n• **Standard Room**\n• **Suite Room**\n• **Presidential Suite**';
                    dynamicSuggestions = ['Fasilitas Standard', 'Fasilitas Suite', 'Fasilitas Presidential'];
                    break;
                }
                this.userStates.set(userKey, { lastRoomId: room.id, lastRoomName: room.name, updatedAt: Date.now() });
                finalAnswer = this.formatRoomAnswer(
                    room,
                    (r) =>
                        `Fasilitas untuk kamar **${r.name}** antara lain: ${r.facilities && r.facilities.length > 0 ? r.facilities.join(', ') : 'AC, Smart TV, Wi-Fi kencang, Kamar Mandi Pribadi dengan Air Panas'}.\n\n👉 [Lihat Detail & Foto ${r.name}](/rooms/${r.id})`,
                );
                dynamicSuggestions = ['Cek Harga Kamar Ini', 'Cara Booking', 'Cek Kamar Lain'];
                break;
            }
        }

        if (!finalAnswer) {
            return this.handleFallback(userId, rawMessage, nlpResult.score);
        }

        await this.logChat(userId, rawMessage, finalAnswer);

        return {
            reply: finalAnswer,
            intent: nlpResult.intent,
            score: nlpResult.score,
            suggestions: dynamicSuggestions,
        };
    }

    // FULFILLMENT HELPERS db query
    private async fulfillCapacitySearch(targetCapacity: number, userId?: string, rawMsg?: string): Promise<ChatBotResponse> {
        const rooms = await this.prisma.resources.findMany({
            where: { capacity: { gte: targetCapacity } },
            orderBy: [{ capacity: 'asc' }, { price_per_night: 'asc' }],
            take: 3,
        });

        let reply = '';
        let suggestions = ['Cara Booking', 'Jam Check-in', 'Fasilitas Hotel'];

        if (rooms.length === 0) {
            reply = `Mohon maaf Kak, saat ini belum ada kamar yang tersedia untuk kapasitas **${targetCapacity} orang** sekaligus. Kakak bisa memesan 2 kamar terpisah ya. 😊`;
            suggestions = ['Lihat Semua Kamar', 'Kamar Paling Hemat', 'Hubungi CS'];
        } else {
            reply = this.formatRoomList(
                rooms,
                `Berikut pilihan kamar yang cocok untuk kapasitas **${targetCapacity} orang**:`,
            );
        }

        if (rawMsg) await this.logChat(userId, rawMsg, reply);

        return {
            reply,
            intent: 'kamar.cari.kapasitas',
            score: 1.0,
            suggestions,
        };
    }

    private async fulfillCategorySearch(category: string, userId?: string, rawMsg?: string): Promise<ChatBotResponse> {
        let rooms: any[] = [];
        let label = '';
        let suggestions = ['Cara Booking', 'Jam Check-in', 'Fasilitas Hotel'];

        if (category === 'hemat') {
            rooms = await this.prisma.resources.findMany({
                where: { OR: [{ type: { contains: 'standard', mode: 'insensitive' } }, { name: { contains: 'standar', mode: 'insensitive' } }] },
                orderBy: { price_per_night: 'asc' },
                take: 3,
            });
            if (rooms.length === 0) {
                rooms = await this.prisma.resources.findMany({
                    orderBy: { price_per_night: 'asc' },
                    take: 3,
                });
            }
            label = 'Kamar paling hemat & terjangkau (Tipe Standard):';
            suggestions = ['Suite / Menengah', 'Mewah / Presidential', 'Cara Booking'];
        } else if (category === 'suite') {
            rooms = await this.prisma.resources.findMany({
                where: { OR: [{ type: { contains: 'suite', mode: 'insensitive' } }, { name: { contains: 'suite', mode: 'insensitive' } }] },
                orderBy: { price_per_night: 'asc' },
                take: 3,
            });
            if (rooms.length === 0) {
                rooms = await this.prisma.resources.findMany({
                    orderBy: { price_per_night: 'asc' },
                    take: 2,
                });
            }
            label = 'Kamar kelas menengah / Suite (Ruangan luas, santai, & berkelas):';
            suggestions = ['Hemat / Standard', 'Mewah / Presidential', 'Cara Booking'];
        } else if (category === 'mewah') {
            rooms = await this.prisma.resources.findMany({
                where: { OR: [{ type: { contains: 'vvip', mode: 'insensitive' } }, { name: { contains: 'presidential', mode: 'insensitive' } }] },
                orderBy: { price_per_night: 'desc' },
                take: 2,
            });
            if (rooms.length === 0) {
                rooms = await this.prisma.resources.findMany({
                    orderBy: { price_per_night: 'desc' },
                    take: 2,
                });
            }
            label = 'Kamar paling mewah & super premium (Tipe Presidential Suite / VVIP):';
            suggestions = ['Suite / Menengah', 'Hemat / Standard', 'Cara Booking'];
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
        if (rawMsg) await this.logChat(userId, rawMsg, reply);

        return {
            reply,
            intent: `kamar.cari.${category}`,
            score: 1.0,
            suggestions,
        };
    }

    private handleFallback(userId: string | undefined, message: string, score: number): ChatBotResponse {
        const reply =
            'Maaf Kak, Tini belum begitu paham dengan pertanyaan tersebut 🙏\n\n' +
            'Kakak bisa tanyakan hal seputar:\n' +
            '• **Rekomendasi & harga kamar**\n' +
            '• **Jadwal check-in / check-out**\n' +
            '• **Info sarapan, parkir basement gratis, & area merokok**\n' +
            '• Atau hubungi resepsionis kami di **+62 21 555 7890**';

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

    private getFollowUpSuggestions(intent: string): string[] {
        if (intent.startsWith('hotel.jadwal')) {
            return ['Bisa Early Check-in?', 'Late Check-out', 'Lokasi Hotel', 'Rekomendasi kamar'];
        }
        if (intent.startsWith('hotel.sarapan') || intent.startsWith('hotel.parkir')) {
            return ['Fasilitas Hotel', 'Rekomendasi kamar', 'Jam Check-in', 'Cara Booking'];
        }
        if (intent.startsWith('hotel.merokok') || intent.startsWith('hotel.hewan')) {
            return ['Fasilitas Hotel', 'Jam Check-in', 'Rekomendasi kamar', 'Hubungi CS'];
        }
        if (intent === 'pembayaran.qris') {
            return ['Cara Booking', 'Metode Bayar Lain', 'Rekomendasi kamar'];
        }
        if (intent === 'pembayaran.gopay') {
            return ['Cara Booking', 'Metode Bayar Lain', 'Rekomendasi kamar'];
        }
        if (intent === 'pembayaran.transfer_bank') {
            return ['Cara Booking', 'Metode Bayar Lain', 'Rekomendasi kamar'];
        }
        if (intent === 'pembayaran.cash') {
            return ['Jam Check-in', 'Cara Booking', 'Metode Bayar Lain', 'Lokasi Hotel'];
        }
        if (intent === 'pembayaran.kartu_kredit') {
            return ['Cara Booking', 'Metode Bayar Lain', 'Rekomendasi kamar'];
        }
        if (intent === 'pembayaran.metode') {
            return ['Bayar QRIS', 'Bayar Cash di Tempat', 'Transfer Bank', 'Cara Booking'];
        }
        if (intent === 'booking.cara_cancel') {
            return ['Info Refund Dana', 'Reschedule Tanggal', 'Hubungi CS', 'Rekomendasi kamar'];
        }
        if (intent === 'booking.info_refund') {
            return ['Cara Cancel Booking', 'Reschedule Tanggal', 'Hubungi CS', 'Rekomendasi kamar'];
        }
        if (intent === 'booking.reschedule') {
            return ['Cara Cancel Booking', 'Info Refund Dana', 'Hubungi CS', 'Rekomendasi kamar'];
        }
        if (intent.startsWith('hotel.anak') || intent.startsWith('hotel.extra_bed')) {
            return ['Aturan Bawa Anak', 'Sewa Extra Bed', 'Kamar Keluarga', 'Cara Booking'];
        }
        if (intent.startsWith('hotel.titip_bagasi')) {
            return ['Jam Check-in & Out', 'Early Check-in', 'Lokasi Hotel', 'Rekomendasi kamar'];
        }
        if (intent.startsWith('hotel.amenities')) {
            return ['Info Sarapan', 'Fasilitas Hotel', 'Rekomendasi kamar', 'Cara Booking'];
        }
        if (intent.startsWith('hotel.kolam')) {
            return ['Katalog Kamar', 'Fasilitas Kamar', 'Rekomendasi kamar', 'Cara Booking'];
        }
        if (intent.startsWith('hotel.room_service')) {
            return ['Order Makanan (WA CS)', 'Restoran & Bar', 'Info Sarapan', 'Rekomendasi kamar'];
        }
        if (intent.startsWith('hotel.resto_bar')) {
            return ['Pesan ke Kamar (24 Jam)', 'Info Sarapan', 'Hubungi CS', 'Rekomendasi kamar'];
        }
        if (intent.startsWith('hotel.resto')) {
            return ['Pesan ke Kamar (24 Jam)', 'Bar & Lounge', 'Info Sarapan', 'Hubungi CS'];
        }
        if (intent.startsWith('hotel.bar')) {
            return ['Jam Buka Bar', 'Restoran Hotel', 'Pesan ke Kamar (24 Jam)', 'Hubungi CS'];
        }
        if (intent.startsWith('hotel.merokok')) {
            return ['Fasilitas Kamar', 'Taman Lantai 1', 'Rekomendasi kamar', 'Hubungi CS'];
        }
        if (intent.startsWith('hotel.pasangan')) {
            return ['Kamar Suite Romantis', 'Jam Check-in & Out', 'Cara Booking', 'Hubungi CS'];
        }
        if (intent.startsWith('hotel.syarat')) {
            return ['Jam Check-in & Out', 'Rekomendasi kamar', 'Metode Pembayaran', 'Cara Booking'];
        }
        if (intent.startsWith('hotel.deposit')) {
            return ['Metode Pembayaran', 'Jam Check-in & Out', 'Cara Booking'];
        }
        if (intent.startsWith('booking.cara')) {
            return ['Metode Pembayaran', 'Rekomendasi kamar', 'Jam Check-in', 'Hubungi CS'];
        }
        if (intent.startsWith('booking.')) {
            return ['Metode Pembayaran', 'Cara Booking', 'Hubungi CS', 'Rekomendasi kamar'];
        }
        if (intent.startsWith('hotel.lokasi') || intent.startsWith('hotel.kontak')) {
            return ['Nomor Telepon CS', 'Jam Check-in', 'Parkir Basement', 'Rekomendasi kamar'];
        }
        if (intent.startsWith('bot.kritik')) {
            return ['Rekomendasi kamar', 'Hubungi CS', 'Fasilitas Hotel'];
        }
        if (intent.startsWith('sapaan.')) {
            return ['Rekomendasi kamar', 'Jam Check-in & Out', 'Info Sarapan', 'Fasilitas Hotel'];
        }
        return ['Rekomendasi kamar', 'Jam Check-in', 'Fasilitas Hotel', 'Lokasi & Akses'];
    }

    private getTimeGreeting(): string {
        //(WIB / zona lokal)
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 11) return 'Selamat pagi';
        if (hour >= 11 && hour < 15) return 'Selamat siang';
        if (hour >= 15 && hour < 18) return 'Selamat sore';
        return 'Selamat malam';
    }

    private async findRoomByName(raw?: string, roomId?: string) {
        if (!raw && roomId) {
            const byId = await this.prisma.resources.findUnique({ where: { id: roomId } });
            if (byId) return byId;
        }
        if (!raw) return null;

        const trimmed = raw.trim();
        const clean = trimmed
            .toLowerCase()
            .replace(/\bkamar\b|\broom\b|\btipe\b|\bfasilitas\b|\bharga\b|\binfo\b|\bapa\b|\baja\b|\bberapa\b/gi, '')
            .replace(/\s+/g, ' ')
            .trim();

        if (clean.includes('standard') || clean.includes('standar')) {
            return this.prisma.resources.findFirst({
                where: { OR: [{ type: { contains: 'standard', mode: 'insensitive' } }, { name: { contains: 'standar', mode: 'insensitive' } }] },
                orderBy: { price_per_night: 'asc' },
            });
        }
        if (clean.includes('suite') && !clean.includes('presidential')) {
            return this.prisma.resources.findFirst({
                where: { OR: [{ type: { contains: 'suite', mode: 'insensitive' } }, { name: { contains: 'suite', mode: 'insensitive' } }] },
                orderBy: { price_per_night: 'asc' },
            });
        }
        if (clean.includes('presidential')) {
            return this.prisma.resources.findFirst({
                where: { name: { contains: 'presidential', mode: 'insensitive' } },
            });
        }

        if (!clean) return null;

        return this.prisma.resources.findFirst({
            where: {
                OR: [
                    { name: { contains: trimmed, mode: 'insensitive' } },
                    { name: { contains: clean, mode: 'insensitive' } },
                    { type: { contains: clean, mode: 'insensitive' } },
                ],
            },
        });
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
