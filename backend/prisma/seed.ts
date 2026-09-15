import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import * as bcrypt from "bcrypt";

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
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
];

const roomTypes = [
  { type: 'Standard', price: 400000, cap: 2, fac: ['WiFi', 'TV', 'AC', 'Kamar Mandi Dalam'] },
  { type: 'Suite', price: 1500000, cap: 4, fac: ['WiFi', 'Smart TV', 'AC', 'Bathtub', 'Minibar', 'Ruang Tamu', 'Akses Lounge'] },
  { type: 'Presidential Suite', price: 3500000, cap: 6, fac: ['WiFi', 'Smart TV', 'AC', 'Jacuzzi', 'Dapur Pribadi', 'Pelayan Pribadi', 'Balkon'] }
];

async function main() {
  console.log("Membuat/memperbarui data pengguna (Admin, Staff, User)...");
  
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const staffPasswordHash = await bcrypt.hash("staff123", 10);
  const userPasswordHash = await bcrypt.hash("user123", 10);

  const initialUsers = [
    {
      name: "Super Admin",
      email: "admin@ngotelin.com",
      password_hash: adminPasswordHash,
      role: "admin",
    },
    {
      name: "Staff Resepsionis",
      email: "staff@ngotelin.com",
      password_hash: staffPasswordHash,
      role: "staff",
    },
    {
      name: "Tamu Regular",
      email: "user@ngotelin.com",
      password_hash: userPasswordHash,
      role: "user",
    },
  ];

  for (const user of initialUsers) {
    await prisma.users.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        password_hash: user.password_hash,
      },
      create: user,
    });
    console.log(`User berhasil di-seed: ${user.email} (${user.role})`);
  }

  console.log("Memeriksa data kamar lama...");
  try {
    await prisma.room_images.deleteMany({});
    await prisma.schedules.deleteMany({
      where: {
        bookings: { none: {} }
      }
    });
  } catch (e) {
    // Ignore cleanup error if dependent records exist
  }

  console.log("Memulai proses seeding 15 kamar...");
  
  for (let i = 1; i <= 15; i++) {
    // Tentukan tipe kamar berdasarkan i
    let typeConfig;
    if (i <= 8) typeConfig = roomTypes[0]; // 8 Standard
    else if (i <= 13) typeConfig = roomTypes[1]; // 5 Suite
    else typeConfig = roomTypes[2]; // 2 Presidential Suite

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
          location: `Lantai ${Math.ceil(i / 5)}`,
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

