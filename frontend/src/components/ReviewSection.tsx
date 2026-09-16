"use client";

import React, { useEffect, useState } from "react";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  reviewer_name: string;
  created_at: string;
}

interface ReviewsResponse {
  resource_id: string;
  total_reviews: number;
  average_rating: number;
  reviews: ReviewItem[];
}

interface ReviewSectionProps {
  resourceId: string;
}

const formatDate = (iso: string) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

// Display rating 1-5. Rating bisa desimal (mis. 4.5) -> bintang diisi floor-nya.
const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) => {
  const starSize = size === "lg" ? "text-[22px]" : "text-[16px]";
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`material-symbols-outlined ${starSize} transition-transform hover:scale-110 ${
            i <= Math.floor(rating)
              ? "text-amber-400 drop-shadow-[0_2px_5px_rgba(245,158,11,0.4)]"
              : "text-slate-200"
          }`}
        >
          star
        </span>
      ))}
    </div>
  );
};

export default function ReviewSection({ resourceId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!resourceId) return;

    const fetchReviews = async () => {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch(
          `http://localhost:3001/reviews/resource/${resourceId}`,
        );
        if (!res.ok) throw new Error("Gagal memuat ulasan.");

        const data = (await res.json()) as ReviewsResponse;
        setReviews(data.reviews || []);
        setTotalReviews(data.total_reviews || 0);
        setAverageRating(data.average_rating || 0);
      } catch (err: unknown) {
        setErrorMsg(
          err instanceof Error ? err.message : "Terjadi kesalahan saat memuat ulasan.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [resourceId]);

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-white p-8 md:p-10 shadow-[0_20px_50px_-15px_rgba(0,26,82,0.08),0_5px_15px_rgba(0,0,0,0.02)] backdrop-blur-sm">
      {/* HEADER: Ringkasan rating */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <h2 className="font-display text-[24px] font-extrabold text-slate-900 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#001a52] to-[#1D4ED8] text-white shadow-[0_6px_16px_rgba(0,26,82,0.25)] border border-blue-400/30">
            <span className="material-symbols-outlined text-[22px]">
              rate_review
            </span>
          </div>
          Ulasan Tamu
        </h2>

        {!isLoading && !errorMsg && (
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-blue-50/80 border border-blue-100 shadow-[0_4px_14px_rgba(29,78,216,0.08)]">
            <span className="font-display text-[30px] font-black text-[#001a52] leading-none">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex flex-col gap-0.5">
              <StarRating rating={averageRating} size="lg" />
              <span className="text-[12px] text-slate-600 font-bold">
                {totalReviews} ulasan terverifikasi
              </span>
            </div>
          </div>
        )}
      </div>

      {/* BODY: Loading / Error / Empty / List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10 gap-3 text-slate-500 font-medium animate-pulse">
          <span className="material-symbols-outlined text-[22px] text-[#1D4ED8]">hourglass_top</span>
          Memuat ulasan tamu...
        </div>
      ) : errorMsg ? (
        <div className="flex items-center justify-center py-10 gap-3 text-rose-600 font-semibold">
          <span className="material-symbols-outlined text-[22px]">error</span>
          {errorMsg}
        </div>
      ) : totalReviews === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100/80 text-slate-400 shadow-inner mb-1">
            <span className="material-symbols-outlined text-[36px]">
              chat_bubble_outline
            </span>
          </div>
          <p className="text-[16px] text-slate-800 font-bold">
            Belum ada ulasan untuk kamar ini.
          </p>
          <p className="text-[13px] text-slate-500 font-medium">
            Jadilah tamu pertama yang membagikan pengalaman luar biasa Anda!
          </p>
        </div>
      ) : (
        <div className="space-y-4.5">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="flex gap-4.5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,26,82,0.12)] hover:border-blue-300/80"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#001a52] via-[#0e2f76] to-[#1D4ED8] text-white font-extrabold text-[15px] shadow-[0_4px_14px_rgba(0,26,82,0.25)] border border-blue-400/30">
                {getInitials(r.reviewer_name)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-[15px] font-bold text-slate-900 font-display">
                    {r.reviewer_name}
                  </h3>
                  <time className="text-[12px] text-slate-400 font-medium">
                    {formatDate(r.created_at)}
                  </time>
                </div>

                <div className="mt-1.5 mb-3">
                  <StarRating rating={r.rating} />
                </div>

                <p className="whitespace-pre-line text-[14px] leading-relaxed text-slate-600 font-medium">
                  {r.comment || "Tidak ada komentar."}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}