# TODO List Implementasi Admin & Staff Panel
*(Berbasiskan ketersediaan API di Backend saat ini)*

File ini dibuat untuk melacak (tracking) progress implementasi UI di frontend. Beri tanda `[x]` jika Anda sudah selesai mengerjakan bagian tersebut.

## 1. Persiapan & Routing Dasar
- [x] Buat folder/file `src/app/admin/pengguna/page.tsx`
- [x] Buat folder/file `src/app/admin/kamar/page.tsx`
- [x] Buat folder/file `src/app/admin/reservasi/page.tsx`
- [x] Buat folder/file `src/app/staff/page.tsx` (Dashboard Utama Staff)
- [x] Buat folder/file `src/app/staff/kamar/page.tsx` (Melihat status kamar - Read Only)
- [x] Buat folder/file `src/app/staff/reservasi/page.tsx` (Mengelola status reservasi)

---

## 2. Implementasi Halaman Admin (Hotel Owner)

### A. Kelola Pengguna (`/admin/pengguna`)
- [x] Buat fungsi fetch `GET /user` dengan Authorization token.
- [x] Render UI Tabel (Pisahkan Tabel Official & Tamu agar UI tidak padat).
- [x] Buat form/modal tambah Official (`POST /user/official`) untuk mendaftarkan staff/admin baru.
- [x] Buat tombol dan fungsi Edit Pengguna (`PATCH /user/:id`), pastikan ada fitur ubah Role khusus untuk Staff/Admin.
- [x] Buat tombol dan fungsi Hapus Pengguna (`DELETE /user/:id`).
- [x] Implementasi notifikasi sukses/error menggunakan `CustomModal`.

### B. Kelola Kamar & Galeri (`/admin/kamar`)
- [ ] Buat fungsi fetch `GET /resources`.
- [ ] Render UI Grid/Tabel daftar kamar beserta foto utamanya.
- [ ] Buat Modal Form Tambah Kamar (`POST /resources`). Pastikan menggunakan `FormData` untuk mengirim input teks sekaligus array `files` (gambar) maksimal 5 gambar.
- [ ] Buat form Edit Kamar (`PATCH /resources/:id`). Form ini harus menangani input teks, array `files` baru, `delete_image_ids` (array ID gambar yang mau dihapus), dan `primary_image_id`.
- [ ] Buat fungsi hapus kamar (`DELETE /resources/:id`).

### C. Daftar Reservasi & Jadwal (`/admin/reservasi`)
- [ ] **Tab Reservasi:** Fetch `GET /bookings`. Render tabel reservasi (Nama Tamu, Kamar, Tanggal Check-in/out, Status, Status Bayar).
- [ ] **Aksi Reservasi:** Tombol untuk update status reservasi (`PATCH /bookings/:id`).
- [ ] **Tab Penjadwalan Khusus (Opsional):** Gunakan `GET /schedule` untuk melihat kalender ketersediaan, dan `POST /schedule` untuk nge-blok jadwal kamar untuk *maintenance* (status: maintenance).
- [ ] **Aksi Penjadwalan Khusus:** `PATCH /schedule/:id` untuk *reschedule* jadwal atau `DELETE /schedule/:id`.

---

## 3. Implementasi Halaman Staff (Front Office / HK)

> **Catatan Role Staff:** Sesuai matriks fitur, Staff *TIDAK BISA* mengelola master inventaris kamar, tapi *BISA* melihat profil/users dan *BISA* mengonfigurasi penjadwalan kamar (reservasi).

### A. Status Kamar (`/staff/kamar`)
- [ ] Fetch `GET /resources` (Read-only) atau `GET /schedule/stats`.
- [ ] Tampilkan UI daftar kamar untuk melihat mana yang sedang kotor/terisi/kosong tanpa memberikan form Edit/Hapus data master.

### B. Kelola Jadwal / Reservasi (`/staff/reservasi`)
- [ ] Fetch `GET /bookings` dan `GET /schedule`.
- [ ] Render UI Tabel Reservasi (sama seperti admin).
- [ ] Beri akses (tombol aksi) untuk `PATCH /bookings/:id` agar Staff bisa memperbarui status check-in/check-out tamu.
- [ ] Beri akses (tombol aksi) untuk `PATCH /schedule/:id` agar Staff bisa me-reschedule tanggal kedatangan tamu jika terjadi kendala.
