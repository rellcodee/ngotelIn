import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const hotelImages = [
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522771731478-44bf10472cb3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1618773928120-2c40951af173?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
];

const roomTypes = [
  { type: 'Standard', price: 400000, cap: 2, fac: ['WiFi', 'TV', 'AC', 'Kamar Mandi Dalam'] },
  { type: 'Suite', price: 1500000, cap: 4, fac: ['WiFi', 'Smart TV', 'AC', 'Bathtub', 'Minibar', 'Ruang Tamu', 'Akses Lounge'] },
  { type: 'Presidential Suite', price: 3500000, cap: 6, fac: ['WiFi', 'Smart TV', 'AC', 'Jacuzzi', 'Dapur Pribadi', 'Pelayan Pribadi', 'Balkon'] }
];

async function main() {
  console.log("Menghapus data kamar lama...");
  await prisma.resources.deleteMany({
    where: {
      type: {
        in: ['Standard', 'Superior', 'Deluxe', 'Suite', 'Presidential_Suite', 'Presidential Suite']
      }
    }
  });

  console.log("Memulai proses seeding 50 kamar...");
  
  for (let i = 1; i <= 50; i++) {
    // Tentukan tipe kamar berdasarkan i
    let typeConfig;
    if (i <= 30) typeConfig = roomTypes[0]; // 30 Standard
    else if (i <= 45) typeConfig = roomTypes[1]; // 15 Suite
    else typeConfig = roomTypes[2]; // 5 Presidential Suite

    const roomName = `Kamar ${typeConfig.type} - ${100 + i}`;
    
    // Pilih gambar acak
    const randomImage = hotelImages[Math.floor(Math.random() * hotelImages.length)];
    
    // Buat data room
    try {
      await prisma.resources.upsert({
        where: { name: roomName },
        update: {}, // Jika sudah ada, lewati
        create: {
          name: roomName,
          type: typeConfig.type,
          location: `Lantai ${Math.ceil(i / 10)}`,
          description: `Nikmati kenyamanan menginap di ${roomName} kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.`,
          capacity: typeConfig.cap,
          price_per_night: typeConfig.price,
          facilities: typeConfig.fac,
          room_images: {
            create: [
              {
                image_url: randomImage,
                is_primary: true
              }
            ]
          }
        }
      });
      console.log(`Berhasil membuat: ${roomName}`);
    } catch (e) {
      console.error(`Gagal membuat ${roomName}:`, e);
    }
  }

  console.log("Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
