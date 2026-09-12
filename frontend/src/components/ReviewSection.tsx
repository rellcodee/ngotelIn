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
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`material-symbols-outlined ${starSize} ${
            i <= Math.floor(rating) ? "text-amber-400" : "text-gray-300"
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
    <section className="rounded-[2rem] border border-surface-container bg-surface-container-lowest p-8 md:p-10 shadow-sm">
      {/* HEADER: Ringkasan rating */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-surface-container pb-6">
        <h2 className="font-display-sm text-[24px] font-bold text-on-surface flex items-center gap-3">
          <span className="material-symbols-outlined text-[24px] text-primary">
            rate_review
          </span>
          Ulasan Tamu
        </h2>

        {!isLoading && !errorMsg && (
          <div className="flex items-center gap-3">
            <span className="font-headline-md text-[28px] font-bold text-on-surface leading-none">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex flex-col gap-1">
              <StarRating rating={averageRating} size="lg" />
              <span className="text-[12px] text-on-surface-variant font-medium">
                {totalReviews} ulasan
              </span>
            </div>
          </div>
        )}
      </div>

      {/* BODY: Loading / Error / Empty / List */}
      {isLoading ? (
        <div className="flex items-center gap-3 text-on-surface-variant animate-pulse">
          <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
          Memuat ulasan tamu...
        </div>
      ) : errorMsg ? (
        <div className="flex items-center gap-3 text-error">
          <span className="material-symbols-outlined text-[20px]">error</span>
          {errorMsg}
        </div>
      ) : totalReviews === 0 ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <span className="material-symbols-outlined text-[40px] text-on-surface-variant/40">
            chat_bubble_outline
          </span>
          <p className="text-[15px] text-on-surface-variant font-medium">
            Belum ada ulasan untuk kamar ini.
          </p>
          <p className="text-[13px] text-on-surface-variant">
            Jadilah tamu pertama yang membagikan pengalamannya!
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="flex gap-4 rounded-2xl border border-surface-container bg-surface-container-lowest p-6 transition-colors hover:border-primary/30"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[15px]">
                {getInitials(r.reviewer_name)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-[15px] font-bold text-on-surface">
                    {r.reviewer_name}
                  </h3>
                  <time className="text-[12px] text-on-surface-variant">
                    {formatDate(r.created_at)}
                  </time>
                </div>

                <div className="mt-1.5 mb-3">
                  <StarRating rating={r.rating} />
                </div>

                <p className="whitespace-pre-line text-[14px] leading-relaxed text-on-surface-variant">
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