"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface ResourceRoom {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  price_per_night: number;
  facilities: string[];
  image: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80";

export default function RecommendedRoomsSection() {
  const [recommendedRooms, setRecommendedRooms] = useState<ResourceRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3001/resources");
        const json = await response.json();

        if (response.ok) {
          const dataArray = Array.isArray(json) ? json : json.data || [];
          const formattedRooms: ResourceRoom[] = dataArray
            .slice(0, 3)
            .map((room: any) => ({
              id: room.id,
              name: room.name,
              type: room.type,
              location: room.location,
              capacity: room.capacity,
              price_per_night: room.price_per_night,
              facilities: room.facilities || [],
              image:
                room.room_images && room.room_images.length > 0
                  ? room.room_images[0].image_url
                  : FALLBACK_IMAGE,
            }));
          setRecommendedRooms(formattedRooms);
        }
      } catch (error) {
        console.error("Gagal mengambil data kamar rekomendasi", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <section
      className="py-space-3xl lg:py-space-4xl bg-surface relative z-10"
      id="kamar"
    >
      <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop">
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md mb-space-2xl">
          <div className="max-w-2xl">
            <h2 className="font-display-xl text-headline-lg lg:text-display-xl text-primary mb-space-sm tracking-tight">
              Recommended
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Nikmati fasilitas terbaik dan kenyamanan kamar berbintang di
              SiniBook Hotel.
            </p>
          </div>
          <Link
            href="/kamar"
            className="group inline-flex items-center gap-space-2xs px-space-xl py-space-sm rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-all duration-300 border border-outline-variant hover:border-outline shadow-sm hover:shadow-md"
          >
            <span>Lihat Semua Kamar</span>
            <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-1">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* GRID KARTU KAMAR REKOMENDASI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-3xl bg-surface-container-lowest overflow-hidden border border-surface-container shadow-[0_8px_24px_rgba(14,47,118,0.06)] animate-pulse h-[500px]"
              >
                <div className="relative aspect-[4/3] bg-surface-container"></div>
                <div className="p-space-lg flex flex-col flex-1 gap-space-md">
                  <div className="h-6 w-3/4 bg-surface-container rounded"></div>
                  <div className="h-4 w-1/2 bg-surface-container rounded mt-auto"></div>
                </div>
              </div>
            ))
          ) : recommendedRooms.length > 0 ? (
            recommendedRooms.map((room) => (
              <div
                key={room.id}
                className="group flex flex-col rounded-3xl bg-surface-container-lowest overflow-hidden border border-surface-container shadow-sm hover:shadow-[0_20px_40px_rgba(14,47,118,0.08)] hover:border-primary-container/50 hover:-translate-y-1.5 transition-all duration-500 relative cursor-pointer"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={
                      room.image.startsWith("http")
                        ? room.image
                        : `http://localhost:3001${room.image}`
                    }
                    alt={room.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                  <div className="absolute bottom-space-md left-space-md text-on-primary">
                    <h3 className="font-headline-sm text-headline-sm text-on-primary">
                      {room.name}
                    </h3>
                    <p className="font-label-sm text-label-sm text-primary-fixed-dim">
                      {room.type}
                    </p>
                  </div>
                </div>

                <div className="p-space-lg flex flex-col flex-1 gap-space-md">
                  <div className="grid grid-cols-2 gap-space-sm mb-space-xs">
                    <div className="flex items-center gap-space-2xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">
                        group
                      </span>
                      <span className="font-body-sm text-body-sm">
                        {room.capacity} Tamu
                      </span>
                    </div>
                    <div className="flex items-center gap-space-2xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">
                        location_on
                      </span>
                      <span className="font-body-sm text-body-sm truncate">
                        {room.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-space-2xs mt-auto">
                    {room.facilities.slice(0, 3).map((fac, idx) => (
                      <span
                        key={idx}
                        className="px-space-xs py-space-2xs rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm border border-surface-container-high"
                      >
                        {fac}
                      </span>
                    ))}
                    {room.facilities.length > 3 && (
                      <span className="px-space-xs py-space-2xs rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm border border-surface-container-high">
                        +{room.facilities.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-space-lg pb-space-lg pt-space-md border-t border-surface-container flex items-center justify-between">
                  <div>
                    <span className="block font-label-sm text-label-sm text-secondary uppercase mb-space-2xs">
                      Mulai Dari
                    </span>
                    <div className="flex items-baseline gap-space-2xs">
                      <span className="font-headline-sm text-headline-sm text-primary">
                        Rp {room.price_per_night.toLocaleString("id-ID")}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        /mlm
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/kamar/${room.id}`}
                    className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all duration-300 hover:-rotate-45 shadow-sm hover:shadow-[0_8px_16px_rgba(14,47,118,0.25)]"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 text-on-surface-variant font-body-lg">
              Belum ada kamar yang tersedia saat ini.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
