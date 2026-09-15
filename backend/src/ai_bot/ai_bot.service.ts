import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { NlpManager } from 'node-nlp';

@Injectable()
export class AiBotService implements OnModuleInit {
    private manager: any;

    constructor(private prisma: PrismaService) {
        this.manager = new NlpManager({ languages: ['id'], forceNER: true });
    }

    async onModuleInit() {
        try {
            // 1. Daftarin nama-nama tipe kamar sebagai Named Entity
            // Supaya NLU bisa nangkep "kamar deluxe", "executive suite", dll dari kalimat user
            await this.registerRoomEntities();

            // 2. Load & training dari corpus.csv
            const csvPath = path.join(process.cwd(), 'corpus.csv');
            const csvData = fs.readFileSync(csvPath, 'utf-8');
            const rows = csvData.split('\n');

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
            console.log('TiniBot final!');
        } catch (error) {
            console.error('Gagal memuat corpus.csv:', error);
        }
    }

    // Daftarin nama kamar dari DB sebagai entity biar NLU bisa extract
    // mana yang dimaksud user waktu nanya "harga kamar deluxe" dll
    private async registerRoomEntities() {
        const rooms = await this.prisma.resources.findMany({
            select: { name: true },
        });

        for (const room of rooms) {
            this.manager.addNamedEntityText(
                'tipe_kamar',
                room.name,
                ['id'],
                [room.name.toLowerCase()],
            );
        }
    }

    async processUserMessage(message: string, userId?: string) {
        const nlpResult = await this.manager.process('id', message);
        let finalAnswer = nlpResult.answer;

        // Ambil entity tipe_kamar kalau kedetect (dipakai di beberapa case di bawah)
        const roomEntity = nlpResult.entities.find(
            (e: any) => e.entity === 'tipe_kamar',
        );
        const roomName = roomEntity?.option;

        switch (nlpResult.intent) {
            case 'kamar.termurah': {
                const room = await this.prisma.resources.findFirst({
                    orderBy: { price_per_night: 'asc' },
                });
                finalAnswer = this.formatRoomAnswer(
                    room,
                    (r) =>
                        `Untuk opsi paling hemat, kami rekomendasikan ${r.name} dengan harga Rp${this.formatPrice(r.price_per_night)}/malam, Kak.`,
                );
                break;
            }

            case 'kamar.termahal_mewah': {
                const room = await this.prisma.resources.findFirst({
                    orderBy: { price_per_night: 'desc' },
                });
                finalAnswer = this.formatRoomAnswer(
                    room,
                    (r) =>
                        `Kamar paling premium kami adalah ${r.name} dengan harga Rp${this.formatPrice(r.price_per_night)}/malam, Kak.`,
                );
                break;
            }

            case 'kamar.rekomendasi_umum':
            case 'kamar.untuk_keluarga':
            case 'kamar.untuk_honeymoon':
            case 'kamar.untuk_bisnis':
            case 'kamar.untuk_solo': {
                // NOTE: rekomendasi berbasis kategori (keluarga/honeymoon/dst) idealnya
                // difilter dari kolom kategori/tag di tabel resources kalau datanya ada.
                // Sementara ini fallback ke 3 kamar teratas kalau kolom tag belum tersedia.
                const rooms = await this.prisma.resources.findMany({
                    take: 3,
                    orderBy: { price_per_night: 'asc' },
                });
                finalAnswer = this.formatRoomList(
                    rooms,
                    'Berikut Beberapa Kamar Rekomendasi Tini yang bisa Kakak Pertimbangkan:',
                );
                break;
            }

            case 'kamar.daftar_semua_tipe': {
                const rooms = await this.prisma.resources.findMany({
                    take: 4,
                    orderBy: { price_per_night: 'desc' }
                });
                finalAnswer = this.formatRoomList(
                    rooms,
                    'Berikut Beberapa kamar yang tersedia di SiniBook:',
                );
                break;
            }

            case 'kamar.harga': {
                if (!roomName) {
                    finalAnswer =
                        'Kamar tipe apa yang mau Kakak tanyakan harganya? Kami punya beberapa pilihan tipe kamar, Kak.';
                    break;
                }
                const room = await this.prisma.resources.findFirst({
                    where: { name: { equals: roomName, mode: 'insensitive' } },
                });
                finalAnswer = this.formatRoomAnswer(
                    room,
                    (r) =>
                        `Harga ${r.name} adalah Rp${this.formatPrice(r.price_per_night)}/malam, Kak.\n[Lihat Detail ${r.name}](/rooms/${r.id})`,
                );
                break;
            }

            case 'kamar.fasilitas': {
                if (!roomName) {
                    finalAnswer =
                        'Apa Nama Kamar yang mau Kakak tanyakan fasilitasnya, Kak?';
                    break;
                }
                const room = await this.prisma.resources.findFirst({
                    where: { name: { equals: roomName, mode: 'insensitive' } },
                });
                finalAnswer = this.formatRoomAnswer(
                    room,
                    (r) =>
                        `Untuk Fasilitas Kamar ${r.name} Di Antaranya: ${r.facilities ?? 'informasi fasilitas belum tersedia, silakan cek detail di aplikasi'}, Kak.\n[Lihat Detail ${r.name}](/rooms/${r.id})`,
                );
                break;
            }


        }

        if (!finalAnswer) {
            const fallbacks = [
                'Maaf Kak, Tini belum paham maksudnya. Boleh diperjelas pertanyaannya seputar hotel?',
                'Waduh, Tini kurang mengerti nih Kak. Ada yang bisa Tini bantu terkait kamar atau fasilitas SiniBook?',
                'Pertanyaan Kakak belum Tini pahami. Boleh coba tanyakan info tarif, reservasi, atau aturan hotel?',
                'Maaf ya Kak, Tini cuma asisten info hotel SiniBook. Boleh ketik pertanyaan yang lebih spesifik?'
            ];

            finalAnswer = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        }

        await this.prisma.ai_chat_logs.create({
            data: {
                user_id: userId || null,
                message: message,
                response: finalAnswer,
            },
        });

        return {
            reply: finalAnswer,
            intent: nlpResult.intent,
            score: nlpResult.score,
        };
    }

    private formatPrice(price: number): string {
        return price.toLocaleString('id-ID');
    }

    private formatRoomAnswer(room: any, formatter: (r: any) => string): string {
        if (!room) {
            return 'Maaf Kak, data kamar belum tersedia saat ini.';
        }
        return formatter(room);
    }

    private formatRoomList(rooms: any[], header: string, footer?: string): string {
        if (!rooms || rooms.length === 0) {
            return 'Maaf Kak, belum ada data kamar yang bisa ditampilkan saat ini.';
        }
        let list = '';
        rooms.forEach((r) => {
            list += `\n  - ${r.name} (Rp${this.formatPrice(r.price_per_night)}/malam)\n  [Lihat Detail ${r.name}](/rooms/${r.id})\n`;
        });

        let last = footer ? footer : ""

        return `${header}${list}${last}`;
    }
}

