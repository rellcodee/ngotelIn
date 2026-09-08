"use client";

import React, { useEffect, useState } from "react";

import CustomModal from "@/components/CustomModal";

interface RoomImage {
  id: string;
  image_url: string;
  is_primary: boolean;
}

interface RoomData {
  id: string;
  name: string;
  type: string;
  location: string;
  description?: string;
  capacity: number;
  price_per_night: number;
  facilities: string[];
  room_images: RoomImage[];
  current_status?: string;
}

export default function KamarPage() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

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
    onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
  });

  // State Form (Bisa untuk Tambah dan Edit)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editRoomId, setEditRoomId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    type: "standard",
    location: "",
    description: "",
    capacity: 2,
    price_per_night: 0,
    facilities: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [newPrimaryIndex, setNewPrimaryIndex] = useState<number>(0);

  // State Khusus Edit Gambar
  const [oldImages, setOldImages] = useState<RoomImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [primaryImageId, setPrimaryImageId] = useState<string>("");

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/resources/live-status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal mengambil data kamar");

      const data = await res.json();
      setRooms(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Terjadi kesalahan.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadRooms = async () => {
      await fetchRooms();
    };
    loadRooms();
  }, []);

  const getPrimaryImage = (images: RoomImage[]) => {
    if (!images || images.length === 0)
      return "https://placehold.co/600x400?text=No+Image";
    const primary = images.find((img) => img.is_primary);

    const imageUrl = primary ? primary.image_url : images[0].image_url;
    if (imageUrl.startsWith("http")) return imageUrl;
    return `http://localhost:3001${imageUrl}`;
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "available":
        return (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md uppercase tracking-wide z-10">
            Tersedia
          </div>
        );
      case "booked":
        return (
          <div className="absolute top-3 right-3 bg-blue-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md uppercase tracking-wide z-10">
            Terisi (Booked)
          </div>
        );
      case "maintenance":
        return (
          <div className="absolute top-3 right-3 bg-rose-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md uppercase tracking-wide z-10">
            Maintenance
          </div>
        );
      default:
        return null;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const remainingOld = isEditModalOpen
        ? oldImages.length - deletedImageIds.length
        : 0;

      if (remainingOld + selectedFiles.length + filesArray.length > 5) {
        setModal({
          isOpen: true,
          type: "warning",
          title: "Batas Gambar Tercapai",
          message:
            "Maksimal hanya 5 gambar yang diperbolehkan untuk satu kamar!",
          onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
        });
        return;
      }
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.match(/\/(jpg|jpeg|png|webp)$/),
      );
      const remainingOld = isEditModalOpen
        ? oldImages.length - deletedImageIds.length
        : 0;

      if (remainingOld + selectedFiles.length + filesArray.length > 5) {
        setModal({
          isOpen: true,
          type: "warning",
          title: "Batas Gambar Tercapai",
          message:
            "Maksimal hanya 5 gambar yang diperbolehkan untuk satu kamar!",
          onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
        });
        return;
      }
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeNewFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    if (newPrimaryIndex === index) setNewPrimaryIndex(0);
    else if (newPrimaryIndex > index) setNewPrimaryIndex(newPrimaryIndex - 1);
  };

  const markOldImageForDeletion = (imageId: string) => {
    if (primaryImageId === imageId) {
      setPrimaryImageId(""); // Batalkan jika gambar utama dihapus
    }
    setDeletedImageIds((prev) => [...prev, imageId]);
  };

  const undoOldImageDeletion = (imageId: string) => {
    setDeletedImageIds((prev) => prev.filter((id) => id !== imageId));
  };

  // ==========================================
  // ACTION: HAPUS KAMAR
  // ==========================================
  const handleDelete = (id: string, name: string) => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Hapus Kamar?",
      message: `Anda yakin ingin menghapus kamar "${name}" beserta semua fotonya secara permanen?`,
      onConfirm: async () => {
        setModal((prev) => ({ ...prev, isOpen: false }));
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`http://localhost:3001/resources/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Gagal menghapus kamar");

          setModal({
            isOpen: true,
            type: "success",
            title: "Berhasil",
            message: "Kamar dan seluruh galeri fotonya telah dihapus.",
            onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
          });
          fetchRooms();
        } catch (err: unknown) {
          setModal({
            isOpen: true,
            type: "error",
            title: "Gagal Menghapus",
            message: err instanceof Error ? err.message : "Terjadi kesalahan",
            onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
          });
        }
      },
    });
  };

  // ==========================================
  // ACTION: TAMBAH KAMAR BARU
  // ==========================================
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Gambar Kosong",
        message: "Wajib mengunggah minimal 1 gambar.",
        onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("name", formData.name);
      data.append("type", formData.type);
      data.append("location", formData.location);
      data.append("description", formData.description);
      data.append("capacity", formData.capacity.toString());
      data.append("price_per_night", formData.price_per_night.toString());

      const facilitiesArray = formData.facilities
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f);
      facilitiesArray.forEach((f) => data.append("facilities[]", f));

      const reorderedFiles = [...selectedFiles];
      if (newPrimaryIndex > 0 && newPrimaryIndex < reorderedFiles.length) {
        const cover = reorderedFiles.splice(newPrimaryIndex, 1)[0];
        reorderedFiles.unshift(cover);
      }
      reorderedFiles.forEach((file) => data.append("files", file));

      const res = await fetch("http://localhost:3001/resources", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (!res.ok)
        throw new Error((await res.json()).message || "Gagal menyimpan kamar");

      setIsAddModalOpen(false);
      setFormData({
        name: "",
        type: "Deluxe",
        location: "",
        description: "",
        capacity: 2,
        price_per_night: 0,
        facilities: "",
      });
      setSelectedFiles([]);
      fetchRooms();
      setModal({
        isOpen: true,
        type: "success",
        title: "Berhasil",
        message: "Kamar ditambahkan!",
        onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
    } catch (err: unknown) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal",
        message: err instanceof Error ? err.message : "Terjadi kesalahan",
        onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // BUKA MODAL EDIT KAMAR
  // ==========================================
  const openEditModal = (room: RoomData) => {
    setEditRoomId(room.id);
    setFormData({
      name: room.name,
      type: room.type,
      location: room.location,
      description: room.description || "",
      capacity: room.capacity,
      price_per_night: room.price_per_night,
      facilities: room.facilities.join(", "),
    });
    setOldImages(room.room_images);
    setDeletedImageIds([]);
    setSelectedFiles([]);
    setNewPrimaryIndex(0);
    const primary = room.room_images.find((img) => img.is_primary);
    if (primary) setPrimaryImageId(primary.id);

    setIsEditModalOpen(true);
  };

  // ==========================================
  // ACTION: UPDATE KAMAR (PATCH)
  // ==========================================
  const handleEditRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const remainingOldImages = oldImages.filter(
      (img) => !deletedImageIds.includes(img.id),
    );
    if (remainingOldImages.length + selectedFiles.length === 0) {
      alert("Kamar harus memiliki minimal 1 gambar!");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("name", formData.name);
      data.append("type", formData.type);
      data.append("location", formData.location);
      data.append("description", formData.description);
      data.append("capacity", formData.capacity.toString());
      data.append("price_per_night", formData.price_per_night.toString());

      const facilitiesArray = formData.facilities
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f);
      facilitiesArray.forEach((f) => data.append("facilities[]", f));

      const reorderedFiles = [...selectedFiles];
      if (
        primaryImageId === "" &&
        newPrimaryIndex > 0 &&
        newPrimaryIndex < reorderedFiles.length
      ) {
        const cover = reorderedFiles.splice(newPrimaryIndex, 1)[0];
        reorderedFiles.unshift(cover);
      }
      reorderedFiles.forEach((file) => data.append("files", file));

      deletedImageIds.forEach((id) => data.append("delete_image_ids[]", id));
      if (primaryImageId) {
        data.append("primary_image_id", primaryImageId);
      } else if (reorderedFiles.length > 0) {
        data.append("primary_image_id", "UNSET");
      }

      const res = await fetch(`http://localhost:3001/resources/${editRoomId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (!res.ok)
        throw new Error(
          (await res.json()).message || "Gagal memperbarui kamar",
        );

      setIsEditModalOpen(false);
      fetchRooms();
      setModal({
        isOpen: true,
        type: "success",
        title: "Berhasil",
        message: "Kamar diperbarui!",
        onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
    } catch (err: unknown) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal",
        message: err instanceof Error ? err.message : "Terjadi kesalahan",
        onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Kelola Kamar & Galeri
          </h1>
          <p className="text-gray-500">
            Manajemen data tipe kamar, harga, fasilitas, dan foto.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: "",
              type: "standard",
              location: "",
              description: "",
              capacity: 2,
              price_per_night: 0,
              facilities: "",
            });
            setSelectedFiles([]);
            setNewPrimaryIndex(0);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">add</span> Tambah Kamar Baru
        </button>
      </div>

      {/* TAMPILAN GRID KAMAR */}
      {isLoading ? (
        <div className="p-10 text-center text-gray-500 animate-pulse bg-white rounded-xl border border-gray-100">
          Sedang menarik data kamar...
        </div>
      ) : errorMsg ? (
        <div className="p-10 text-center text-red-500 bg-white rounded-xl border border-gray-100">
          {errorMsg}
        </div>
      ) : rooms.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px] text-gray-300">location_on</span>
          </div>
          <p className="font-medium text-gray-900">Belum Ada Kamar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col"
            >
              <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                <img
                  src={getPrimaryImage(room.room_images)}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/600x400?text=Image+Not+Found";
                  }}
                />

                {getStatusBadge(room.current_status)}

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-700 shadow-sm uppercase tracking-wide">
                  {room.type.replace("_", " ")}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
                  {room.name}
                </h3>
                <div className="flex flex-col gap-2 mt-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0">location_on</span>
                    <span className="truncate">{room.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0">group</span>
                    <span>Maksimal {room.capacity} Orang</span>
                  </div>
                </div>
                <div className="mt-auto pt-5">
                  <div className="border-t border-gray-100 pt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">
                        Tarif per malam
                      </p>
                      <p className="text-lg font-bold text-[#1D4ED8]">
                        Rp {room.price_per_night.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(room)}
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(room.id, room.name)}
                        className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =======================================================
          MODAL TAMBAH & EDIT KAMAR (Kombinasi UI)
          ======================================================= */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-gray-900">
                {isEditModalOpen ? "Edit Tipe Kamar" : "Tambah Tipe Kamar Baru"}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex-1">
              <form
                id="room-form"
                onSubmit={isEditModalOpen ? handleEditRoom : handleAddRoom}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* KOLOM KIRI: TEKS */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nama Kamar <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Tipe <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        <option value="standard">Standard</option>
                        <option value="suite">Suite</option>
                        <option value="presidential_suite">
                          Presidential Suite
                        </option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Kapasitas
                        </label>
                        <input
                          required
                          type="number"
                          min="1"
                          value={formData.capacity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              capacity: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Harga / Malam
                        </label>
                        <input
                          required
                          type="number"
                          min="0"
                          value={formData.price_per_night}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price_per_night: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Lokasi Gedung / Lantai
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Deskripsi Kamar
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                        placeholder="Tuliskan deskripsi menarik tentang kamar ini..."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Fasilitas Tambahan (Pisahkan Koma)
                      </label>
                      <textarea
                        value={formData.facilities}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            facilities: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px] resize-y"
                      />
                    </div>
                  </div>

                  {/* KOLOM KANAN: GAMBAR */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Galeri Foto (Maks. 5){" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-4">
                      Tambahkan foto baru jika perlu. Total foto tidak boleh
                      lebih dari 5.
                    </p>

                    <div
                      className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors group mb-4 ${isDragging
                          ? "bg-emerald-50 border-emerald-500 scale-[1.02]"
                          : "border-gray-300 hover:bg-emerald-50/50 hover:border-emerald-300"
                        }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[32px] text-gray-400 group-hover:text-emerald-500 transition-colors mb-2">cloud_upload</span>
                        <span className="text-sm font-semibold text-emerald-600">
                          Upload Foto Baru
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {/* Tampilkan Foto LAMA jika sedang edit */}
                      {isEditModalOpen &&
                        oldImages.map((img) => {
                          const isDeleted = deletedImageIds.includes(img.id);
                          const isPrimary = primaryImageId === img.id;
                          const src = img.image_url.startsWith("http")
                            ? img.image_url
                            : `http://localhost:3001${img.image_url}`;
                          return (
                            <div
                              key={img.id}
                              className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${isDeleted ? "opacity-30 border-dashed" : isPrimary ? "border-amber-400" : "border-gray-200"}`}
                            >
                              <img
                                src={src}
                                alt="old"
                                className="w-full h-full object-cover"
                              />
                              {isDeleted ? (
                                <button
                                  type="button"
                                  onClick={() => undoOldImageDeletion(img.id)}
                                  className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white"
                                >
                                  <span className="text-[10px] font-bold">
                                    BATAL HAPUS
                                  </span>
                                </button>
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 flex items-end p-2 gap-1 transition-opacity">
                                  {!isPrimary && (
                                    <button
                                      type="button"
                                      onClick={() => setPrimaryImageId(img.id)}
                                      className="bg-amber-500 text-white p-1 rounded hover:bg-amber-600"
                                      title="Jadikan Cover"
                                    >
                                      <span className="material-symbols-outlined text-[14px]">star</span>
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      markOldImageForDeletion(img.id)
                                    }
                                    className="bg-rose-500 text-white p-1 rounded hover:bg-rose-600 ml-auto"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">delete</span>
                                  </button>
                                </div>
                              )}
                              {!isDeleted && isPrimary && (
                                <div className="absolute top-1 left-1 bg-amber-400 text-black text-[9px] px-1.5 py-0.5 rounded-sm font-bold shadow-sm">
                                  COVER
                                </div>
                              )}
                            </div>
                          );
                        })}

                      {/* Tampilkan Foto BARU yang baru dipilih */}
                      {selectedFiles.map((file, idx) => {
                        const isPrimaryNew =
                          (!isEditModalOpen && newPrimaryIndex === idx) ||
                          (isEditModalOpen &&
                            primaryImageId === "" &&
                            newPrimaryIndex === idx);

                        return (
                          <div
                            key={idx}
                            className={`relative aspect-video rounded-xl overflow-hidden border-2 group ${isPrimaryNew ? "border-amber-400" : "border-emerald-400"}`}
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt="new"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 flex items-end p-2 gap-1 transition-opacity">
                              {!isPrimaryNew && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewPrimaryIndex(idx);
                                    if (isEditModalOpen) setPrimaryImageId("");
                                  }}
                                  className="bg-amber-500 text-white p-1 rounded hover:bg-amber-600"
                                  title="Jadikan Cover"
                                >
                                  <span className="material-symbols-outlined text-[14px]">star</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeNewFile(idx)}
                                className="bg-rose-500 text-white p-1 rounded hover:bg-rose-600 ml-auto"
                              >
                                <span className="material-symbols-outlined text-[14px]">delete</span>
                              </button>
                            </div>

                            <div className="absolute top-1 right-1 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-bold shadow-sm">
                              BARU
                            </div>
                            {isPrimaryNew && (
                              <div className="absolute top-1 left-1 bg-amber-400 text-black text-[9px] px-1.5 py-0.5 rounded-sm font-bold shadow-sm">
                                COVER
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50/80">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="room-form"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Kamar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={modal.onClose || (() => { })}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
}
