import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

// Setup adapter PG manual khusus untuk script seed
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Cleaning database...');
  await prisma.room_images.deleteMany();
  await prisma.schedules.deleteMany();
  await prisma.resources.deleteMany();
  await prisma.users.deleteMany();

  console.log('Seeding users...');
  const hashedPassword = await bcrypt.hash('12345678', 10);

  // 1. Create Admin
  const admin = await prisma.users.create({
    data: {
      name: 'Super Admin NgotelIn',
      email: 'admin@ngotelin.com',
      password_hash: hashedPassword,
      role: 'admin',
    },
  });
  console.log(`Admin created: ${admin.email}`);

  // 2. Create User
  const user = await prisma.users.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: hashedPassword,
      role: 'user',
    },
  });
  console.log(`User created: ${user.email}`);

  console.log('Seeding resources/rooms...');

  const roomsData = [
    {
      name: 'Standard Cozy 101',
      type: 'standard',
      location: 'Lantai 1',
      capacity: 2,
      price_per_night: 350000,
      facilities: ['Wi-Fi', 'AC', 'TV', 'Single Bed'],
      image:
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Deluxe Suite 202',
      type: 'suite',
      location: 'Lantai 2',
      capacity: 3,
      price_per_night: 750000,
      facilities: ['Wi-Fi', 'AC', 'TV', 'Queen Bed', 'Minibar', 'Bathtub'],
      image:
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Presidential Penthouse 501',
      type: 'vvip',
      location: 'Lantai 5 (Rooftop)',
      capacity: 5,
      price_per_night: 2500000,
      facilities: [
        'Private Pool',
        'Private Elevator',
        'Butler Service',
        'Wi-Fi',
        'King Bed',
        'Smart Home Control',
      ],
      image:
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
    },
  ];

  for (const room of roomsData) {
    const createdRoom = await prisma.resources.create({
      data: {
        name: room.name,
        type: room.type,
        location: room.location,
        capacity: room.capacity,
        price_per_night: room.price_per_night,
        facilities: room.facilities,
      },
    });

    // Seed room images
    await prisma.room_images.create({
      data: {
        resource_id: createdRoom.id,
        image_url: room.image,
        is_primary: true,
      },
    });

    // Seed schedule (Available for next 7 days)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    await prisma.schedules.create({
      data: {
        resource_id: createdRoom.id,
        start_time: today,
        end_time: nextWeek,
        status: 'available',
      },
    });

    console.log(`Room created: ${createdRoom.name}`);
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
