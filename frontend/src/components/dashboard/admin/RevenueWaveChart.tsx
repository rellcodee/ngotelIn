"use client";

import React, { useState } from "react";
import { TrendUp, CheckCircle } from "@phosphor-icons/react";

interface TrendDay {
  day: string;
  date: string;
  income: number;
}

interface RevenueWaveChartProps {
  data: TrendDay[];
}

export default function RevenueWaveChart({ data }: RevenueWaveChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData =
    data && data.length > 0
      ? data
      : [
          { day: "Sen", date: "2026-09-10", income: 0 },
          { day: "Sel", date: "2026-09-11", income: 0 },
          { day: "Rab", date: "2026-09-12", income: 0 },
          { day: "Kam", date: "2026-09-13", income: 0 },
          { day: "Jum", date: "2026-09-14", income: 0 },
          { day: "Sab", date: "2026-09-15", income: 0 },
          { day: "Min", date: "2026-09-16", income: 0 },
        ];

  const maxIncome = Math.max(...chartData.map((d) => d.income), 1000000);

  const svgWidth = 700;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingY = 30;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingY * 2;

  const points = chartData.map((item, index) => {
    const x = paddingX + (index / (chartData.length - 1)) * usableWidth;
    const y =
      svgHeight - paddingY - (item.income / maxIncome) * usableHeight;
    return { x, y, ...item };
  });

  const generateSmoothPath = (pts: typeof points) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x},${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const linePath = generateSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${
    svgHeight - paddingY
  } L ${points[0].x},${svgHeight - paddingY} Z`;

  const totalWeeklyRevenue = chartData.reduce((acc, curr) => acc + curr.income, 0);

  return (
    <div className="flex flex-col justify-between rounded-3xl bg-white p-6 sm:p-7 shadow-sm border border-slate-200/80">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Analisis Pendapatan</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-100">
              <TrendUp size={12} weight="bold" />
              7 Hari Terakhir
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total omset minggu ini:{" "}
            <span className="font-bold text-slate-900">
              Rp {totalWeeklyRevenue.toLocaleString("id-ID")}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
          <CheckCircle size={14} weight="fill" className="text-blue-600" />
          <span>Settlement (Lunas)</span>
        </div>
      </div>

      {/* SVG Wave Chart Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Gradien Fill Area Bawah */}
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.28" />
              <stop offset="65%" stopColor="#2563EB" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.00" />
            </linearGradient>

            {/* Shadow Curve Line */}
            <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="4"
                floodColor="#1D4ED8"
                floodOpacity="0.25"
              />
            </filter>
          </defs>

          {/* Garis Horizontal Grid */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = svgHeight - paddingY - ratio * usableHeight;
            const val = Math.round((ratio * maxIncome) / 1000);
            return (
              <g key={idx} className="opacity-40">
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#CBD5E1"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-medium font-sans"
                >
                  {val > 0 ? `${val}k` : "0"}
                </text>
              </g>
            );
          })}

          {/* Area Gradien Bawah */}
          <path d={areaPath} fill="url(#blueGradient)" />

          {/* Garis Kurva Utama */}
          <path
            d={linePath}
            fill="none"
            stroke="#2563EB"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowBlue)"
          />

          {/* Titik Interaktif (Points) */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g key={idx}>
                {isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="8"
                    fill="#2563EB"
                    fillOpacity="0.25"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? "6" : "4.5"}
                  fill="#FFFFFF"
                  stroke="#2563EB"
                  strokeWidth="3"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Tooltip Float saat Hover */}
        {hoveredIndex !== null && (
          <div
            className="absolute -top-3 z-30 transform -translate-x-1/2 rounded-2xl bg-slate-900/95 px-4 py-2 text-white shadow-xl backdrop-blur-md transition-all pointer-events-none border border-slate-700/50"
            style={{
              left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
            }}
          >
            <p className="text-[10px] text-slate-400 font-medium">
              {points[hoveredIndex].date} ({points[hoveredIndex].day})
            </p>
            <p className="text-xs font-extrabold text-white mt-0.5">
              Rp {points[hoveredIndex].income.toLocaleString("id-ID")}
            </p>
          </div>
        )}
      </div>

      {/* Label Hari Sumbu X */}
      <div className="flex justify-between px-6 pt-3 border-t border-slate-100 mt-2 text-xs font-semibold text-slate-500">
        {chartData.map((d, i) => (
          <span
            key={i}
            className={`transition-colors ${
              hoveredIndex === i ? "text-blue-600 font-bold" : ""
            }`}
          >
            {d.day}
          </span>
        ))}
      </div>
    </div>
  );
}
