// SCHEDULE ENUMS (Status Ketersediaan Slot Jam & Fisik Kamar/Alat)
export enum ScheduleStatus {
    AVAILABLE = 'available',     // Slot jam bebas, siap & bisa dipesan oleh user lain
    BOOKED = 'booked',           // Slot jam sedang dikunci (ada transaksi pending/approved/checked_in)
    MAINTENANCE = 'maintenance', // Slot ditutup sementara oleh admin (perbaikan/servis/bersih-bersih)
    CANCELED = 'canceled',     // Slot dinonaktifkan dari sistem operasional jadwal
}

// BOOKING ENUMS (Status Kontrak Sewa & Operasional Lapangan)
export enum BookingStatus {
    PENDING = 'pending',       // Draft dibuat, invoice terbit, menunggu pembayaran user
    APPROVED = 'approved',     // Pembayaran sah / dikonfirmasi staff, reservasi resmi aman
    CHECKED_IN = 'checked_in', // Tamu/peminjam sudah di lokasi & fisik kamar/alat sedang dipakai
    COMPLETED = 'completed',   // Sewa selesai/check-out (TRIGGER: schedule otomatis balik 'available')
    REJECTED = 'rejected',     // Ditolak staff (misal: identitas tidak valid / pembayaran bermasalah)
    CANCELED = 'canceled',     // Dibatalkan user/expired (TRIGGER: schedule otomatis balik 'available')
}

// PAYMENT ENUMS (Status Aliran Uang Transaksi)
export enum PaymentStatus {
    PENDING = 'pending',     // Tagihan aktif, menunggu transfer/scan dari user
    PAID = 'paid',           // Uang berhasil masuk & diverifikasi (via Webhook Midtrans/Xendit atau Staff)
    EXPIRED = 'expired',     // Batas waktu bayar habis (TRIGGER: booking & payment otomatis canceled)
    FAILED = 'failed',       // Transaksi ditolak oleh bank / payment gateway
    CANCELED = 'canceled', // Invoice dibatalkan manual sebelum proses pembayaran selesai
}

// PAYMENT METHOD ENUMS (Opsi Kanal Pembayaran yang Didukung)
export enum PaymentMethod {
    GOPAY = 'gopay',                 // E-wallet GoPay (Instant Callback via Payment Gateway)
    QRIS = 'qris',                   // QRIS Dinamis / Statis
    BANK_TRANSFER = 'bank_transfer', // Virtual Account (BCA, Mandiri, BNI, dll) atau Transfer Manual
    CREDIT_CARD = 'credit_card',     // Kartu Kredit / Debit Online
    CASH = 'cash',                   // Tunai / Bayar di tempat
}

// ROOM TYPE ENUMS (Jenis Akomodasi yang Ditawarkan)
export enum RoomType {
    STANDARD = 'standard',
    SUITE = 'suite',
    PRESIDENTIAL_SUITE = 'presidential_suite',
}