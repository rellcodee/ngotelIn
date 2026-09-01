# 📋 Task List Integrasi Backend & Frontend (NgotelIn)

Berikut adalah daftar tugas untuk mengintegrasikan sisa halaman/komponen di Frontend dengan API Backend yang belum selesai:

### 1. 🛒 Transaksi / Checkout
- `[ ]` **`frontend/src/app/checkout/page.tsx`**
  - `[ ]` Fetch detail *booking* kamar dari state, keranjang, atau parameter URL.
  - `[ ]` Integrasikan *form submit* menggunakan API POST `/bookings` untuk membuat data reservasi ke database.
  - `[ ]` Integrasikan *payment gateway* atau API POST `/payments` untuk proses pembayaran reservasi.

### 2. 📊 Dashboard Admin & Staff
- `[ ]` **`frontend/src/app/admin/page.tsx`**
  - `[ ]` Buat atau pastikan ketersediaan endpoint API statistik admin (total pengguna, pendapatan, kamar terisi, dsb).
  - `[ ]` Ganti *dummy array* `.map()` di UI dengan data asli dari respons Backend.
- `[ ]` **`frontend/src/app/staff/page.tsx`**
  - `[ ]` Integrasikan UI dengan API metrik statistik khusus Staff hotel.

### 3. 👤 Guest / User Dashboard
- `[ ]` **`frontend/src/app/dashboard/page.tsx`**
  - `[ ]` Fetch data reservasi aktif khusus user yang sedang login menggunakan API (`GET /bookings/user/:id`).
  - `[ ]` Tampilkan *history* / riwayat transaksi user tersebut pada tabel di UI.
  - `[ ]` **Penting:** Integrasikan fungsi menu navigasi sidebar (seperti form ubah profil, ubah *password* / keamanan, dan pengaturan lainnya) agar data ter-update ke database melalui API.

---
**Catatan:** Bagian Landing Page (FAQ, About Us, Why Us, dan Testimonial) dibiarkan statis dengan *dummy data* sesuai instruksi.

*Ubah `[ ]` menjadi `[x]` jika sudah selesai.*
