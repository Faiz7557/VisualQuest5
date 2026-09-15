"use client";

import { useState } from "react";
import { HistoricalPoint, ForecastPoint } from "@/types/data";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from "recharts";
import { formatNumber } from "@/lib/utils";

interface Props {
  historical: HistoricalPoint[];
  forecast: ForecastPoint[];
}

export function FanChart({ historical, forecast }: Props) {
  const [selectedMetric, setSelectedMetric] = useState<"volume" | "krisis" | "burnout" | "finansial">("volume");

  // Merge historical + forecast into unified timeline
  const chartData = [
    ...historical.map((h) => ({
      tanggal: h.tanggal.slice(0, 7),
      type: "historis",
      volumeHistoris: h.volume_konsultasi_mental,
      krisisHistoris: h.panggilan_krisis_psikologis,
      burnoutHistoris: h.indeks_burnout_pekerja,
      finansialHistoris: h.indeks_stres_finansial,
      proyeksi: null,
      ci68Bawah: null,
      ci68Atas: null,
      ci95Bawah: null,
      ci95Atas: null,
    })),
    ...forecast.map((f) => ({
      tanggal: f.tanggal.slice(0, 7),
      type: "proyeksi",
      volumeHistoris: null,
      krisisHistoris: null,
      burnoutHistoris: null,
      finansialHistoris: null,
      proyeksi: selectedMetric === "volume" 
        ? Math.round(f.proyeksi_volume)
        : selectedMetric === "krisis"
        ? Math.round(f.driver_panggilan_krisis || 0)
        : selectedMetric === "burnout"
        ? Number((f.driver_burnout || 0).toFixed(1))
        : Number((f.driver_stres_finansial || 0).toFixed(1)),
      ci68Bawah: selectedMetric === "volume" ? Math.round(f.ci68_bawah) : null,
      ci68Atas: selectedMetric === "volume" ? Math.round(f.ci68_atas) : null,
      ci95Bawah: selectedMetric === "volume" ? Math.round(f.ci95_bawah) : null,
      ci95Atas: selectedMetric === "volume" ? Math.round(f.ci95_atas) : null,
      // For range bands in Area
      band95: selectedMetric === "volume" ? [Math.round(f.ci95_bawah), Math.round(f.ci95_atas)] : null,
      band68: selectedMetric === "volume" ? [Math.round(f.ci68_bawah), Math.round(f.ci68_atas)] : null,
    })),
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
      {/* Metric Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white font-heading">
            {selectedMetric === "volume" && "Fanchart Proyeksi Volume Konsultasi Mental (2019–2026)"}
            {selectedMetric === "krisis" && "Tren & Proyeksi Panggilan Krisis Psikologis"}
            {selectedMetric === "burnout" && "Lintasan Indeks Kelelahan Kerja Tenaga Layanan (Burnout)"}
            {selectedMetric === "finansial" && "Dinamika Indeks Tekanan Stres Finansial"}
          </h3>
          <p className="text-xs text-slate-400">
            {selectedMetric === "volume" 
              ? "SARIMAX(p,1,q)x(0,1,1)12 dilengkapi pita ketidakpastian 68% dan 95% out-of-fold."
              : "Diproyeksikan menggunakan Holt-Winters Damped Trend sebagai variabel pendorong sistem."}
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="inline-flex rounded-xl bg-[#070d18] p-1 border border-white/10 text-xs">
          <button
            onClick={() => setSelectedMetric("volume")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedMetric === "volume"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Volume Konsultasi
          </button>
          <button
            onClick={() => setSelectedMetric("krisis")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedMetric === "krisis"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Panggilan Krisis
          </button>
          <button
            onClick={() => setSelectedMetric("burnout")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedMetric === "burnout"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Indeks Burnout
          </button>
          <button
            onClick={() => setSelectedMetric("finansial")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedMetric === "finansial"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Stres Finansial
          </button>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="h-[420px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradient95" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="gradient68" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0.12} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="tanggal" 
              stroke="#64748b" 
              fontSize={11}
              tickLine={false}
              interval={7}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              tickFormatter={(v) => formatNumber(v)}
              domain={['auto', 'auto']}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="glass-card rounded-xl p-3 border border-white/20 text-xs shadow-xl space-y-1">
                      <div className="font-bold text-white border-b border-white/10 pb-1">
                        Periode: {label}
                      </div>
                      {data.type === "historis" ? (
                        <div className="text-blue-400 font-semibold">
                          Historis: {formatNumber(
                            selectedMetric === "volume"
                              ? data.volumeHistoris
                              : selectedMetric === "krisis"
                              ? data.krisisHistoris
                              : selectedMetric === "burnout"
                              ? data.burnoutHistoris
                              : data.finansialHistoris
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-orange-400 font-bold">
                            Proyeksi: {formatNumber(data.proyeksi)}
                          </div>
                          {selectedMetric === "volume" && (
                            <>
                              <div className="text-slate-400 text-[10px]">
                                68% CI: [{formatNumber(data.ci68Bawah)} – {formatNumber(data.ci68Atas)}]
                              </div>
                              <div className="text-slate-500 text-[10px]">
                                95% CI: [{formatNumber(data.ci95Bawah)} – {formatNumber(data.ci95Atas)}]
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Vertical Line Marking the start of Forecast */}
            <ReferenceLine 
              x="2024-12" 
              stroke="#ef4444" 
              strokeDasharray="4 4" 
              label={{ value: "Awal Proyeksi (Jan 2025)", fill: "#ef4444", fontSize: 10, position: "top" }}
            />

            {/* 95% CI Area */}
            {selectedMetric === "volume" && (
              <Area
                type="monotone"
                dataKey="band95"
                stroke="none"
                fill="url(#gradient95)"
                name="Interval Kepercayaan 95%"
              />
            )}

            {/* 68% CI Area */}
            {selectedMetric === "volume" && (
              <Area
                type="monotone"
                dataKey="band68"
                stroke="none"
                fill="url(#gradient68)"
                name="Interval Kepercayaan 68%"
              />
            )}

            {/* Historical Line */}
            <Line
              type="monotone"
              dataKey={
                selectedMetric === "volume"
                  ? "volumeHistoris"
                  : selectedMetric === "krisis"
                  ? "krisisHistoris"
                  : selectedMetric === "burnout"
                  ? "burnoutHistoris"
                  : "finansialHistoris"
              }
              stroke="#38bdf8"
              strokeWidth={2.5}
              dot={false}
              name="Observasi Historis (2019-2024)"
            />

            {/* Forecast Projection Line */}
            <Line
              type="monotone"
              dataKey="proyeksi"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ r: 2, fill: "#f97316" }}
              name="Proyeksi Titik (2025-2026)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
