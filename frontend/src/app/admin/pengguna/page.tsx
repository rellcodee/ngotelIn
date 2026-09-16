"use client";

import React, { useEffect, useState, useCallback } from "react";
import CustomModal from "@/components/CustomModal";
import PillPagination from "@/components/PillPagination";
import SearchInput from "@/components/SearchInput";

// Struktur data user dari backend
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface PaginatedUserResponse {
  data: UserData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function PenggunaPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"official" | "users">("official");

  // State Paginasi & Search
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "warning" | "info" | "confirm";
    title: string;
    message: string;
    onConfirm?: (() => void) | undefined;
    onClose: () => void;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: undefined,
    onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
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

  // 1. Fetch Data Pengguna dari Backend
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        roleType: activeTab,
      });

      if (search.trim()) {
        params.append("search", search.trim());
      }

      const res = await fetch(`http://localhost:3001/user?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal mengambil data pengguna");

      const result: PaginatedUserResponse = await res.json();
      setUsers(result.data || []);
      setTotalItems(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, activeTab, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handler Ganti Tab
  const handleTabChange = (tab: "official" | "users") => {
    setActiveTab(tab);
    setPage(1); // Reset ke halaman 1 saat tab berganti
  };

  // Handler Ganti Search
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset ke halaman 1 saat pencarian berubah
  };

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
          ...(editData.role !== "user" && { role: editData.role }),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        const errMsg = Array.isArray(errData.message)
          ? errData.message.join(", ")
          : errData.message;
        throw new Error(errMsg || "Gagal mengupdate data pengguna");
      }

      setIsEditModalOpen(false);
      setModal({
        isOpen: true,
        type: "success",
        title: "Berhasil",
        message: "Data pengguna berhasil diperbarui!",
        onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
      fetchUsers(); // Refresh tabel
    } catch (err: any) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal Update",
        message: err.message,
        onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (user: UserData) => {
    setEditData({ id: user.id, name: user.name, email: user.email, role: user.role });
    setIsEditModalOpen(true);
  };

  // Hapus Pengguna
  const handleDelete = (id: string, name: string) => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Konfirmasi Hapus",
      message: `Yakin ingin menghapus pengguna ${name}?`,
      onConfirm: async () => {
        setModal((prev) => ({ ...prev, isOpen: false }));
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
            onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
          });
          fetchUsers();
        } catch (err: any) {
          setModal({
            isOpen: true,
            type: "error",
            title: "Gagal Hapus",
            message: err.message,
            onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
          });
        }
      },
      onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
    });
  };

  // Tambah Official (Admin/Staff baru)
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
        onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
      fetchUsers(); // Refresh tabel
    } catch (err: any) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal Membuat Akun",
        message: err.message,
        onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
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
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">add</span> Tambah Akun Official
        </button>
      </div>

      {/* Navigation Tabs & Search Input Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-3">
        {/* Tabs Navigation */}
        <div className="flex space-x-4">
          <button
            onClick={() => handleTabChange("official")}
            className={`pb-2 text-sm font-semibold transition-colors border-b-2 -mb-3 ${activeTab === "official"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            Akun Official (Admin & Staff)
          </button>
          <button
            onClick={() => handleTabChange("users")}
            className={`pb-2 text-sm font-semibold transition-colors border-b-2 -mb-3 ${activeTab === "users"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            Akun Tamu (Users)
          </button>
        </div>

        {/* Search Field */}
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder={`Cari ${activeTab === "official" ? "admin/staff" : "tamu"}...`}
        />
      </div>

      {/* Loading & Error State */}
      {isLoading ? (
        <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-10 text-center text-gray-500 animate-pulse">
          Memuat data pengguna...
        </div>
      ) : errorMsg ? (
        <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-10 text-center text-red-500">
          {errorMsg}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Tabel Content */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-slate-50 text-gray-700 font-semibold border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Nama</th>
                      <th className="px-6 py-4">Email</th>
                      {activeTab === "official" && <th className="px-6 py-4">Role</th>}
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={activeTab === "official" ? 4 : 3}
                          className="px-6 py-8 text-center text-gray-400 font-medium"
                        >
                          Data pengguna tidak ditemukan.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          {activeTab === "official" && (
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === "admin"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-amber-100 text-amber-700"
                                  }`}
                              >
                                <span className="material-symbols-outlined text-[12px]">
                                  security
                                </span>
                                {user.role.toUpperCase()}
                              </span>
                            </td>
                          )}
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditModal(user)}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Pengguna"
                              >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                              </button>
                              {user.role !== "admin" && (
                                <button
                                  onClick={() => handleDelete(user.id, user.name)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Hapus Pengguna"
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    delete
                                  </span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Reusable Pill Pagination Component */}
          <PillPagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            className="pt-2 justify-center"
          />
        </div>
      )}

      {/* Modal Tambah Official */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Buat Akun Official</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddOfficial} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <div className="relative">
                  <span className="material-symbols-outlined text-[16px] text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">
                    person
                  </span>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Nama Staff"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined text-[16px] text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">
                    mail
                  </span>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="staff@hotel.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined text-[16px] text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">
                    lock
                  </span>
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50 transition-colors"
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
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <div className="relative">
                  <span className="material-symbols-outlined text-[16px] text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">
                    person
                  </span>
                  <input
                    required
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined text-[16px] text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">
                    mail
                  </span>
                  <input
                    required
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {editData.role !== "user" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role (Peran)
                  </label>
                  <select
                    value={editData.role}
                    onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50 transition-colors"
                >
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
