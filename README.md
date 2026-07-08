# 🏨 NgotelIn - Single Hotel Room Booking System

**NgotelIn** adalah platform back-end berbasis API yang dirancang khusus untuk mengelola pemesanan kamar dan ruangan (seperti ruang rapat/ballroom) pada satu hotel spesifik (*Single Hotel Enterprise*). Proyek ini dibangun menggunakan arsitektur modular **NestJS** untuk performa yang terstruktur, **Prisma v7** sebagai ORM modern, dan **PostgreSQL (Docker)** sebagai media penyimpanan data.

---

## 🚀 Fitur Utama

*   **Single Hotel Focus:** Tidak memerlukan entitas multi-hotel, seluruh manajemen inventory fokus pada klasifikasi kamar dan fasilitas di satu lokasi.
*   **Room & Resource Management:** Pengelolaan tipe kamar, ketersediaan kasur, fasilitas, hingga ruangan fungsional lainnya.
*   **Booking & Schedule System:** Sistem reservasi terintegrasi untuk melacak status check-in, check-out, dan ketersediaan slot kamar secara *real-time*.
*   **Secure Authentication:** Sistem registrasi dan login menggunakan hashing password yang aman sebelum disimpan ke database.

---

## 🛠️ Tech Stack & Arsitektur

*   **Framework:** NestJS (TypeScript)
*   **Database ORM:** Prisma v7 (with `@prisma/adapter-pg` & `pg` driver)
*   **Database Engine:** PostgreSQL 15 (Containerized via Docker)
*   **Database GUI:** pgAdmin 4 (Docker Services)

---

## 📁 Struktur Direktori Proyek

```text
ngotelIn/
├── backend/                   # Sumber kode aplikasi NestJS
│   ├── prisma/
│   │   ├── migrations/        # Catatan track record perubahan database
│   │   └── schema.prisma      # Definisi model skema database (Prisma 7 standard)
│   ├── src/
│   │   ├── prisma/            # Prisma Module & Service (Global Provider)
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   └── main.ts            # Entry point aplikasi
│   ├── .env.example           # Template environment variables (Lokal)
│   ├── prisma.config.ts       # Konfigurasi datasource database Prisma 7
│   └── package.json
└── docker-compose.yml         # Orkestrasi container Postgres & pgAdmin
