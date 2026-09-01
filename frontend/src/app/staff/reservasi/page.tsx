"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  CalendarRange,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Edit2,
  Plus,
  Trash2,
} from "lucide-react";
import CustomModal from "@/components/CustomModal";

// --- TYPES ---
interface User {
  id: string;
  name: string;
  email: string;
}

interface Resource {
  id: string;
  name: string;
  type: string;
}

interface Schedule {
  id: string;
  resource_id: string;
  start_time: string;
  end_time: string;
  status: string;
  resources?: Resource;
}

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
}

interface Booking {
  id: string;
  user_id: string;
  schedule_id: string;
  status: string;
  notes: string;
  total_price: number;
  created_at: string;
  users: User;
  schedules: Schedule;
  payment: Payment;
}

export default function AdminReservasiPage() {
  const [activeTab, setActiveTab] = useState<"reservasi" | "jadwal">(
    "reservasi",
  );
  const [isLoading, setIsLoading] = useState(true);

  // Data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [rooms, setRooms] = useState<Resource[]>([]);

  // Modal State
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "warning" | "info" | "confirm";
    title: string;
    message: string;
    onConfirm?: () => void;
    onClose?: () => void;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // Action States
  const [isEditBookingOpen, setIsEditBookingOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [bookingStatus, setBookingStatus] = useState("");

  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    resource_id: "",
    start_time: "",
    end_time: "",
    status: "maintenance",
  });

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    id: "",
    start_time: "",
    end_time: "",
    status: "",
  });

  // --- FETCHERS ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Bookings
      const resBookings = await fetch("http://localhost:3001/bookings", {
        headers,
      });
      if (resBookings.ok) {
        setBookings(await resBookings.json());
      }

      // Fetch Schedules
      const resSchedules = await fetch("http://localhost:3001/schedule", {
        headers,
      });
      if (resSchedules.ok) {
        setSchedules(await resSchedules.json());
      }

      // Fetch Rooms (for maintenance dropdown)
      const resRooms = await fetch("http://localhost:3001/resources", {
        headers,
      });
      if (resRooms.ok) {
        setRooms(await resRooms.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  // --- BOOKING ACTIONS ---
  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/bookings/${editingBooking.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: bookingStatus }),
        },
      );

      if (!res.ok)
        throw new Error((await res.json()).message || "Gagal update status");

      setModal({
        isOpen: true,
        type: "success",
        title: "Berhasil",
        message: "Status reservasi berhasil diperbarui.",
        onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
      setIsEditBookingOpen(false);
      fetchData();
    } catch (err: unknown) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal",
        message: err instanceof Error ? err.message : "Terjadi kesalahan",
        onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
    }
  };

  // --- SCHEDULE ACTIONS ---
  const handleAddMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3001/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resource_id: scheduleData.resource_id,
          start_time: new Date(scheduleData.start_time).toISOString(),
          end_time: new Date(scheduleData.end_time).toISOString(),
          status: scheduleData.status,
        }),
      });

      if (!res.ok)
        throw new Error(
          (await res.json()).message || "Gagal membuat blokir jadwal",
        );

      setModal({
        isOpen: true,
        type: "success",
        title: "Berhasil",
        message: "Kamar berhasil diblokir untuk maintenance.",
        onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
      setIsAddScheduleOpen(false);
      setScheduleData({
        resource_id: "",
        start_time: "",
        end_time: "",
        status: "maintenance",
      });
      fetchData();
    } catch (err: unknown) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal",
        message: err instanceof Error ? err.message : "Terjadi kesalahan",
        onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
    }
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/schedule/${rescheduleData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          start_time: new Date(rescheduleData.start_time).toISOString(),
          end_time: new Date(rescheduleData.end_time).toISOString(),
          status: rescheduleData.status,
        }),
      });

      if (!res.ok) throw new Error((await res.json()).message || "Gagal mengubah jadwal");

      setModal({
        isOpen: true,
        type: "success",
        title: "Berhasil",
        message: "Jadwal berhasil di-reschedule.",
        onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
      setIsRescheduleOpen(false);
      fetchData();
    } catch (err: unknown) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal Reschedule",
        message: err instanceof Error ? err.message : "Terjadi kesalahan",
        onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
    }
  };

  const handleDeleteSchedule = (id: string) => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Hapus Blokir Jadwal?",
      message: "Kamar akan kembali tersedia pada rentang waktu ini.",
      onConfirm: async () => {
        setModal((prev) => ({ ...prev, isOpen: false }));
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`http://localhost:3001/schedule/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) throw new Error("Gagal menghapus jadwal");

          setModal({
            isOpen: true,
            type: "success",
            title: "Berhasil",
            message: "Jadwal berhasil dihapus.",
            onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
          });
          fetchData();
        } catch (err: unknown) {
          setModal({
            isOpen: true,
            type: "error",
            title: "Gagal",
            message: err instanceof Error ? err.message : "Terjadi kesalahan",
            onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
          });
        }
      },
    });
  };

  // --- UI HELPERS ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
            Approved
          </span>
        );
      case "checked_in":
        return (
          <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
            Checked In
          </span>
        );
      case "completed":
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
            Completed
          </span>
        );
      case "canceled":
      case "rejected":
        return (
          <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-semibold rounded-full border border-rose-200 capitalize">
            {status}
          </span>
        );
      case "maintenance":
        return (
          <span className="px-2.5 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full border border-gray-300">
            Maintenance
          </span>
        );
      case "booked":
        return (
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
            Booked
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manajemen Reservasi & Jadwal
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola pesanan tamu dan jadwal operasional kamar
          </p>
        </div>
        {activeTab === "jadwal" && (
          <button
            onClick={() => setIsAddScheduleOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Tambah Jadwal
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100/80 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("reservasi")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "reservasi"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Daftar Reservasi
        </button>
        <button
          onClick={() => setActiveTab("jadwal")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "jadwal"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          <CalendarRange className="w-4 h-4" />
          Daftar Jadwal
        </button>
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500 animate-pulse">
            Memuat data...
          </div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === "reservasi" ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Tamu</th>
                    <th className="p-4 font-semibold">Kamar</th>
                    <th className="p-4 font-semibold">Tanggal</th>
                    <th className="p-4 font-semibold">Total Harga</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <p className="font-semibold text-gray-900">
                          {booking.users?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.users?.email}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-900">
                          {booking.schedules?.resources?.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {booking.schedules?.resources?.type?.replace(
                            "_",
                            " ",
                          )}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-emerald-600">
                            In:
                          </span>{" "}
                          {new Date(
                            booking.schedules?.start_time,
                          ).toLocaleDateString("id-ID")}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-rose-600">
                            Out:
                          </span>{" "}
                          {new Date(
                            booking.schedules?.end_time,
                          ).toLocaleDateString("id-ID")}
                        </p>
                      </td>
                      <td className="p-4 font-medium text-gray-900">
                        {formatCurrency(booking.total_price)}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          {getStatusBadge(booking.status)}
                          <span className="text-[10px] font-semibold uppercase text-gray-400 mt-1">
                            Pay: {booking.payment?.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setEditingBooking(booking);
                            setBookingStatus(booking.status);
                            setIsEditBookingOpen(true);
                          }}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors shadow-sm inline-flex"
                          title="Update Status"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        Belum ada reservasi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Kamar</th>
                    <th className="p-4 font-semibold">Tanggal Mulai</th>
                    <th className="p-4 font-semibold">Tanggal Selesai</th>
                    <th className="p-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {schedules.map((sched) => (
                    <tr
                      key={sched.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4">{getStatusBadge(sched.status)}</td>
                      <td className="p-4 font-medium text-gray-900">
                        {sched.resources?.name}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {new Date(sched.start_time).toLocaleString("id-ID")}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {new Date(sched.end_time).toLocaleString("id-ID")}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              // Konversi ke format YYYY-MM-DDThh:mm untuk input datetime-local
                              const offset = new Date().getTimezoneOffset() * 60000;
                              const localStart = new Date(new Date(sched.start_time).getTime() - offset).toISOString().slice(0, 16);
                              const localEnd = new Date(new Date(sched.end_time).getTime() - offset).toISOString().slice(0, 16);
                              
                              setRescheduleData({
                                id: sched.id,
                                start_time: localStart,
                                end_time: localEnd,
                                status: sched.status,
                              });
                              setIsRescheduleOpen(true);
                            }}
                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors shadow-sm inline-flex"
                            title="Edit Jadwal"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(sched.id)}
                            className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors shadow-sm inline-flex"
                            title="Hapus Jadwal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {schedules.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        Tidak ada jadwal.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* MODAL UPDATE BOOKING */}
      {isEditBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                Update Status Reservasi
              </h3>
              <button
                onClick={() => setIsEditBookingOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateBooking} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ubah Status
                </label>
                <select
                  value={bookingStatus}
                  onChange={(e) => setBookingStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="checked_in">Checked In</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditBookingOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold transition-colors shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BLOKIR JADWAL */}
      {isAddScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                Tambah Jadwal Kamar
              </h3>
              <button
                onClick={() => setIsAddScheduleOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMaintenance} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Pilih Kamar <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={scheduleData.resource_id}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      resource_id: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="" disabled>
                    -- Pilih Kamar --
                  </option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({room.type.replace("_", " ")})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mulai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduleData.start_time}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        start_time: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Selesai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduleData.end_time}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        end_time: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={scheduleData.status}
                  onChange={(e) =>
                    setScheduleData({ ...scheduleData, status: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="booked">Booked (Dipesan)</option>
                  <option value="maintenance">
                    Maintenance (Pemeliharaan)
                  </option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold transition-colors shadow-sm"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT JADWAL */}
      {isRescheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Edit Jadwal</h3>
              <button onClick={() => setIsRescheduleOpen(false)} className="text-gray-400 hover:text-gray-600"><XCircle className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleReschedule} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={rescheduleData.status}
                  onChange={(e) =>
                    setRescheduleData({ ...rescheduleData, status: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="available">Available (Tersedia)</option>
                  <option value="booked">Booked (Dipesan)</option>
                  <option value="maintenance">Maintenance (Pemeliharaan)</option>
                  <option value="canceled">Canceled (Dibatalkan)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mulai Baru <span className="text-rose-500">*</span></label>
                  <input
                    type="datetime-local"
                    required
                    value={rescheduleData.start_time}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, start_time: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Selesai Baru <span className="text-rose-500">*</span></label>
                  <input
                    type="datetime-local"
                    required
                    value={rescheduleData.end_time}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, end_time: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsRescheduleOpen(false)} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors">Batal</button>
                <button type="submit" className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-colors shadow-sm">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CustomModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={modal.onClose || (() => {})}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
}
