# ==============================================================================

# NGOTELIN ENVIRONMENT VARIABLES SETUP

# ==============================================================================

Dokumen ini berisi panduan setup `.env` untuk masing-masing folder agar proyek berjalan dengan sinkron dan lancar. Pastikan meletakkan file `.env` di folder yang tepat.

---

## 1. ROOT ENVIRONMENT VARIABLES (Folder Root: `/.env`)

File ini digunakan oleh **Docker Compose** untuk membangun sistem database PostgreSQL & pgAdmin.
Buat file bernama `.env` di luar folder backend/frontend (tepat di root project `ngotelIn/`) dan isi dengan:

```env
# 🐘 PostgreSQL Credentials
POSTGRES_USER=admin_ngotel
POSTGRES_PASSWORD=ngotelin123
POSTGRES_DB=ngotelin_db
POSTGRES_PORT=5432

# 🛠️ pgAdmin Credentials (Web GUI untuk Database)
PGADMIN_DEFAULT_EMAIL=admin@ngotelin.com
PGADMIN_DEFAULT_PASSWORD=admin
PGADMIN_PORT=8080

# 🔴 Redis Cache Credentials
REDIS_PORT=6379
```

---

## 2. BACKEND ENVIRONMENT VARIABLES (Folder: `/backend/.env`)

File ini digunakan oleh sistem Backend (termasuk Prisma ORM).
Buat file bernama `.env` di dalam folder `backend/` dan isi dengan:

```env
# 🌐 APP CONFIGURATION
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# 🐘 DATABASE CONFIGURATION
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://admin_ngotel:ngotelin123@localhost:5432/ngotelin_db?schema=public"

# 🤖 AI & STORAGE
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# 💰 MIDTRANS PAYMENT GATEWAY
MIDTRANS_SERVER_KEY="YOUR_MIDTRANS_SERVER_KEY_HERE"
MIDTRANS_CLIENT_KEY="YOUR_MIDTRANS_CLIENT_KEY_HERE"
MIDTRANS_NOTIFICATION_URL=https://xxxx-xxxx.ngrok-free.app/api/payment/notification
```

---

## 3. FRONTEND ENVIRONMENT VARIABLES (Folder: `/frontend/.env` atau `.env.local`)

File ini digunakan oleh aplikasi Frontend (Next.js).
Buat file bernama `.env` (atau `.env.local`) di dalam folder `frontend/` dan isi dengan:

```env
# 🌐 BACKEND API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```
