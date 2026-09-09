# Daftar Task Frontend yang Masih Kurang (Missing Features)

Berdasarkan analisis dokumentasi API (`api.http`) yang lu kasih, API backend lu udah lengkap banget (bahkan udah ada fitur transaksi atomik, Midtrans, dan RBAC). Tapi, setelah gw cek *source code* Frontend (terutama di bagian `dashboard` dan `checkout`), ternyata masih banyak fitur yang **cuma pajangan / bohongan (Mocking)** dan belum bener-bener nembak ke Backend.

Ini daftar tugas (Todo List) yang harus lu beresin di Frontend biar sistem hotel lu jalan sempurna:

## 1. 🛒 Proses Checkout & Booking Kamar (`/checkout`)
- `[x]` **Ganti Hardcode Kamar:** Di file `checkout/page.tsx`, data kamar masih pakai *hardcode* (`ROOM_MAP`). Harusnya tarik data asli dengan nembak API `GET /resources/:id`.
- `[x]` **Fungsi Tembak Booking:** Tombol "Konfirmasi & Bayar" sekarang cuma pura-pura *loading* (pake `setTimeout`). Harusnya ngejalanin `POST /bookings` dengan *payload* `resource_id`, tanggal *check-in/check-out*, dan metode pembayaran.
- `[x]` **Integrasi Midtrans:** Kalo metode pembayaran yang dipilih itu beneran butuh *Gateway* (GoPay, QRIS, VA), tangkep *response* dari backend dan arahin/buka *popup* Midtrans Snapshot.

## 2. 👤 Dashboard Tamu (`/dashboard`)
> [!WARNING]
> Seluruh tab di halaman dashboard saat ini masih pakai data bohongan (`MOCK_BOOKINGS`, `MOCK_PAYMENTS`, `MOCK_NOTIFICATIONS`, `MOCK_REVIEWS`). Ini prioritas buat di-refactor!

- `[ ]` **Riwayat Pesanan (Bookings):** Sambungin ke `GET /bookings` pakai Token JWT dari localStorage.
- `[ ]` **Sistem Notifikasi:** Sambungin *icon* lonceng dan halaman Notifikasi ke API `GET /notifications` (buat list) dan `PATCH /notifications/read-all` (buat tandai udah dibaca).
- `[ ]` **Form Tulis Ulasan (Review):** Bikin fungsi nembak `POST /reviews` pas *user* kasih bintang dan ulasan ke kamar yang udah disewa.
- `[ ]` **Edit Profil (Opsional):** Backend lu udah nyediain fitur *edit* profil (`PATCH /user/:id`), tapi di *dashboard* belum kelihatan ada tombol buat ngubah nama atau *password* tamu.

## 3. 👨‍💼 Panel Admin & Staff (`/admin` & `/staff`)
- `[ ]` **Manajemen Jadwal Kamar:** Pastiin Front Office / Housekeeping bisa ngunci kamar buat diperbaiki (nembak `POST /schedule` dengan status `maintenance`).
- `[ ]` **Approval Booking Manual:** Kalau ada pembayaran manual, Pastiin staff bisa nembak `PATCH /bookings/:id` buat ngerubah status jadi `approved` atau `rejected`.
- `[ ]` **Tambah Kamar (Admin):** Pastiin Admin beneran bisa *upload* form tambah kamar (termasuk foto) ke `POST /resources`.

## 4. 🛏️ Halaman Detail Kamar (`/kamar/[id]`)
- `[ ]` **Daftar Ulasan (Reviews):** Bikin UI/komponen buat nampilin daftar *review* dari tamu sebelumnya. Komponen ini harus narik data asli ke API `GET /reviews/resource/:resourceId`.

## 5. 🔒 Autentikasi & Keamanan (`/login` & `/register`)
- `[ ]` **Integrasi CAPTCHA:** Tambahin komponen *widget* CAPTCHA (reCAPTCHA/Turnstile) di UI halaman form biar terhindar dari *bot spam*. (Catatan: Butuh modifikasi juga di *Backend* untuk validasi token).

---
> [!TIP]
> **Cara Ngerjain:** Lu bisa mulai nyicil dari halaman `checkout` dulu, soalnya itu urat nadi utamanya. Kalau lu pengen gw bantu buatin logika `fetch` API-nya per komponen, lu tinggal kasih tau aja file mana yang mau gw eksekusi duluan. Gass! 🚀
