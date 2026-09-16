"use client";

import React, { useState, useEffect } from "react";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Cari nama atau email...",
  className = "",
  debounceMs = 300,
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState(value);

  // Sync internal state if prop value changes externally
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Debounce notification to parent
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== value) {
        onChange(searchTerm);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, onChange, value, debounceMs]);

  const handleClear = () => {
    setSearchTerm("");
    onChange("");
  };

  return (
    <div className={`relative max-w-xs sm:max-w-sm w-full ${className}`}>
      <span className="material-symbols-outlined text-gray-400 text-[20px] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors">
        search
      </span>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 text-sm bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-800 placeholder-gray-400 transition-all"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition-all"
          title="Clear search"
        >
          <span className="material-symbols-outlined text-[16px] block">close</span>
        </button>
      )}
    </div>
  );
}
