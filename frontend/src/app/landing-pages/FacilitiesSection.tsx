"use client";

import { useState, useEffect } from "react";
import { Building, CheckCircle2, Layers } from "lucide-react"; 

interface FacilityResource {
  id: string;
  name: string;
  type?: string | null;
  facilities?: string[];
}

interface GroupedCategory {
  type: string;
  facilities: string[];
}

export default function FacilitiesByTypeSection() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  
  const [groupedData, setGroupedData] = useState<GroupedCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndGroupFacilities() {
      try {
        const res = await fetch(`${apiUrl}/resources`);
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data: FacilityResource[] = await res.json();

        // --- LOGIC PENGELOMPOKAN BERDASARKAN TYPE ---
        const map = new Map<string, Set<string>>();

        data.forEach((item) => {
          // Kalau type-nya kosong/null, kita masukin ke kategori "Lainnya"
          const category = item.type || "Lainnya";

          if (!map.has(category)) {
            map.set(category, new Set());
          }

          // Masukin semua fasilitas kamar ini ke Set kategori tersebut (biar gak duplikat)
          item.facilities?.forEach((fac) => {
            map.get(category)?.add(fac);
          });
        });

        // Ubah balik format Map ke Array of Object biar gampang di-map ke JSX
        const formatted: GroupedCategory[] = Array.from(map.entries()).map(([type, facSet]) => ({
          type,
          facilities: Array.from(facSet), // Ubah Set jadi Array string biasa
        }));

        setGroupedData(formatted);
      } catch (err) {
        console.error("Error fetching or grouping facilities:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAndGroupFacilities();
  }, [apiUrl]);

  if (loading) {
    return (
      <section className="w-full bg-[#F4F8F5] py-16 text-center">
        <p className="text-gray-500 font-medium animate-pulse">Memuat fasilitas berdasarkan kategori...</p>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#F4F8F5] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Fasilitas Berdasarkan Tipe Kamar
            </h2>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Gabungan fasilitas unggulan dari setiap kategori tipe kamar yang tersedia.
            </p>
          </div>
          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B4F37] text-white shadow-lg">
            <Building className="h-6 w-6" />
          </div>
        </div>

        {/* LOOPING PER KATEGORI (TYPE) */}
        <div className="space-y-16">
          {groupedData.length > 0 ? (
            groupedData.map((group, index) => (
              <div key={index} className="border-t border-emerald-100/60 pt-8 first:border-0 first:pt-0">
                
                {/* Judul Kategori / Type Kamar */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B4F37] text-white">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                    Tipe: {group.type}
                  </h3>
                </div>

                {/* Grid Fasilitas yang Udah Digabung & Dihilangin Duplikatnya */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {group.facilities.length > 0 ? (
                    group.facilities.map((facName, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm border border-emerald-50 transition-all hover:border-[#0B4F37] hover:shadow-md"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#0B4F37]">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 capitalize">
                            {facName}
                          </h4>
                          <p className="mt-1 text-xs text-gray-500">
                            Nikmati fasilitas {facName.toLowerCase()} pilihan untuk kenyamanan kelas {group.type}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">Belum ada fasilitas terdaftar untuk tipe ini.</p>
                  )}
                </div>

              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm">Tidak ada data kategori kamar.</p>
          )}
        </div>

      </div>
    </section>
  );
}