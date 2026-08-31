"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Shield, User, Mail, Lock, Edit2 } from "lucide-react";
import CustomModal from "@/components/CustomModal";

// Struktur data user dari backend
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function PenggunaPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"official" | "users">("official");

  const [modal, setModal] = useState({
    isOpen: false,
    type: "info" as "success" | "error" | "warning" | "info" | "confirm",
    title: "",
    message: "",
    onConfirm: undefined as (() => void) | undefined,
    onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
  });

  // State untuk Modal Tambah Official
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk Modal Edit Pengguna
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ id: "", name: "", email: "", role: "" });

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/user/${editData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editData.name,
          email: editData.email,
          // Hanya kirim role jika yang diedit adalah akun official
          ...(editData.role !== 'user' && { role: editData.role })
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        // Menampilkan pesan error asli dari backend (seperti array validasi)
        const errMsg = Array.isArray(errData.message) ? errData.message.join(', ') : errData.message;
        throw new Error(errMsg || "Gagal mengupdate data pengguna");
      }
      
      setIsEditModalOpen(false);
      setModal({
        isOpen: true,
        type: "success",
        title: "Berhasil",
        message: "Data pengguna berhasil diperbarui!",
        onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
      });
      fetchUsers(); // Refresh tabel
    } catch (err: any) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal Update",
        message: err.message,
        onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (user: UserData) => {
    setEditData({ id: user.id, name: user.name, email: user.email, role: user.role });
    setIsEditModalOpen(true);
  };

  // 1. Fetch Data Pengguna
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal mengambil data pengguna");

      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const officials = users.filter(u => u.role === 'admin' || u.role === 'staff');
  const customers = users.filter(u => u.role === 'user');

  // 2. Hapus Pengguna
  const handleDelete = (id: string, name: string) => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Konfirmasi Hapus",
      message: `Yakin ingin menghapus pengguna ${name}?`,
      onConfirm: async () => {
        setModal(prev => ({ ...prev, isOpen: false }));
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`http://localhost:3001/user/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) throw new Error("Gagal menghapus pengguna");
          
          setModal({
            isOpen: true,
            type: "success",
            title: "Berhasil",
            message: "Pengguna berhasil dihapus!",
            onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
          });
          fetchUsers();
        } catch (err: any) {
          setModal({
            isOpen: true,
            type: "error",
            title: "Gagal Hapus",
            message: err.message,
            onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
          });
        }
      },
      onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
    });
  };

  // 3. Tambah Official (Admin/Staff baru)
  const handleAddOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/user/official", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal membuat akun official");
      }

      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", role: "staff" });
      setModal({
        isOpen: true,
        type: "success",
        title: "Berhasil",
        message: "Akun berhasil dibuat!",
        onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
      });
      fetchUsers(); // Refresh tabel
    } catch (err: any) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal Membuat Akun",
        message: err.message,
        onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Tombol Tambah */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Pengguna</h1>
          <p className="text-gray-500">Manajemen data staff dan admin.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Tambah Akun Official
        </button>
      </div>

      {/* Loading & Error State */}
      {isLoading ? (
        <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden p-10 text-center text-gray-500 animate-pulse">
          Memuat data pengguna...
        </div>
      ) : errorMsg ? (
        <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden p-10 text-center text-red-500">
          {errorMsg}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tabs Navigation */}
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("official")}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "official"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Akun Official (Admin & Staff)
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "users"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Akun Tamu (Users)
            </button>
          </div>

          {/* Tabel Akun Official */}
          {activeTab === "official" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-slate-50 text-gray-700 font-semibold border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">Nama</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {officials.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                              <Shield className="w-3 h-3" />
                              {user.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => openEditModal(user)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Pengguna">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {user.role !== "admin" && (
                                <button onClick={() => handleDelete(user.id, user.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Pengguna">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tabel Tamu / User */}
          {activeTab === "users" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-slate-50 text-gray-700 font-semibold border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">Nama</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {customers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => openEditModal(user)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Pengguna">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(user.id, user.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Pengguna">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Tambah Official */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                Buat Akun Official
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddOfficial} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Nama Staff"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="staff@hotel.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role (Peran)
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Pengguna */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Edit Pengguna</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input required type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input required type="email" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              {editData.role !== 'user' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role (Peran)</label>
                  <select value={editData.role} onChange={e => setEditData({...editData, role: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50 transition-colors">
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Modal */}
      <CustomModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={modal.onClose}
      />
    </div>
  );
}
