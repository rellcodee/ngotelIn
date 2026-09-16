"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";

interface PillPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  className?: string;
}

export default function PillPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className = "",
}: PillPaginationProps) {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages || totalPages === 0;

  const endIndex = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={`flex justify-center items-center w-full ${className}`}>
      <div className="inline-flex items-center justify-between gap-4 sm:gap-6 bg-[#181f33] text-white px-4 sm:px-5 py-2 rounded-full shadow-xl shadow-slate-950/20 border border-slate-700/50 select-none max-w-full">
        {/* Indikator Jumlah Data */}
        <span className="text-xs sm:text-sm font-medium tracking-wide text-slate-200 whitespace-nowrap pl-1">
          Showing {endIndex}/{totalItems}
        </span>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Previous Button (Oval White) */}
          <button
            type="button"
            onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            aria-label="Previous Page"
            className="px-3.5 sm:px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 hover:bg-white active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
          >
            <ArrowLeft size={16} weight="bold" />
          </button>

          {/* Next Button (Oval Purple/Indigo) */}
          <button
            type="button"
            onClick={() => !isLastPage && onPageChange(currentPage + 1)}
            disabled={isLastPage}
            aria-label="Next Page"
            className="px-3.5 sm:px-4 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-md hover:shadow-indigo-500/30 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
          >
            <ArrowRight size={16} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
