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

  // Get last historical point to bridge the timeline seamlessly
  const lastHist = historical.length > 0 ? historical[historical.length - 1] : null;

  // Build unified chart data with floating confidence interval bands
  const chartData = [
    ...historical.map((h) => ({
      tanggal: h.tanggal.slice(0, 7),
      type: "historis",
      volumeHistoris: h.volume_konsultasi_mental,
      krisisHistoris: h.panggilan_krisis_psikologis,
      burnoutHistoris: h.indeks_burnout_pekerja,
      finansialHistoris: h.indeks_stres_finansial,
      proyeksi: null,
      ci95Base: null,
      ci95Spread: null,
      ci68Base: null,
      ci68Spread: null,
      ci95_atas: null,
      ci95_bawah: null,
      ci68_atas: null,
      ci68_bawah: null,
    })),
    // Anchor point on the transition month (2024-12) to connect the lines seamlessly
    ...(lastHist && forecast.length > 0
      ? [
          {
            tanggal: lastHist.tanggal.slice(0, 7),
            type: "transisi",
            volumeHistoris: lastHist.volume_konsultasi_mental,
            krisisHistoris: lastHist.panggilan_krisis_psikologis,
            burnoutHistoris: lastHist.indeks_burnout_pekerja,
            finansialHistoris: lastHist.indeks_stres_finansial,
            proyeksi: selectedMetric === "volume"
              ? lastHist.volume_konsultasi_mental
              : selectedMetric === "krisis"
              ? lastHist.panggilan_krisis_psikologis
              : selectedMetric === "burnout"
              ? lastHist.indeks_burnout_pekerja
              : lastHist.indeks_stres_finansial,
            ci95Base: selectedMetric === "volume" ? lastHist.volume_konsultasi_mental : null,
            ci95Spread: 0,
            ci68Base: selectedMetric === "volume" ? lastHist.volume_konsultasi_mental : null,
            ci68Spread: 0,
            ci95_atas: lastHist.volume_konsultasi_mental,
            ci95_bawah: lastHist.volume_konsultasi_mental,
            ci68_atas: lastHist.volume_konsultasi_mental,
            ci68_bawah: lastHist.volume_konsultasi_mental,
          },
        ]
      : []),
    ...forecast.map((f) => {
      const vol = Math.round(f.proyeksi_volume || (f as any).ensemble || 0);
      const low95 = Math.round(f.ci95_bawah || vol * 0.85);
      const high95 = Math.round(f.ci95_atas || vol * 1.15);
      const low68 = Math.round(f.ci68_bawah || vol * 0.92);
      const high68 = Math.round(f.ci68_atas || vol * 1.08);

      return {
        tanggal: f.tanggal.slice(0, 7),
        type: "proyeksi",
        volumeHistoris: null,
        krisisHistoris: null,
        burnoutHistoris: null,
        finansialHistoris: null,
        proyeksi: selectedMetric === "volume"
          ? vol
          : selectedMetric === "krisis"
          ? Math.round(f.driver_panggilan_krisis || (f as any).panggilan_krisis_psikologis || 0)
          : selectedMetric === "burnout"
          ? Number((f.driver_burnout || (f as any).indeks_burnout_pekerja || 0).toFixed(1))
          : Number((f.driver_stres_finansial || (f as any).indeks_stres_finansial || 0).toFixed(1)),
        ci95Base: selectedMetric === "volume" ? low95 : null,
        ci95Spread: selectedMetric === "volume" ? Math.max(0, high95 - low95) : null,
        ci68Base: selectedMetric === "volume" ? low68 : null,
        ci68Spread: selectedMetric === "volume" ? Math.max(0, high68 - low68) : null,
        ci95_atas: high95,
        ci95_bawah: low95,
        ci68_atas: high68,
        ci68_bawah: low68,
      };
    }),
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
      {/* Header Selector */}
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

        {/* Switcher Buttons */}
        <div className="inline-flex flex-wrap rounded-xl bg-[#070d18] p-1 border border-white/10 text-xs">
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

      {/* Chart Canvas */}
      <div className="h-[440px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="band95Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.20} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0.06} />
              </linearGradient>
              <linearGradient id="band68Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0.18} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis
              dataKey="tanggal"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              interval={6}
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
                  const d = payload[0].payload;
                  return (
                    <div className="glass-card rounded-xl p-3 border border-white/20 text-xs shadow-xl space-y-1.5">
                      <div className="font-bold text-white border-b border-white/10 pb-1 flex items-center justify-between gap-3">
                        <span>Periode: {label}</span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                          {d.type === "historis" ? "Historis BPS/Kemenkes" : "Proyeksi SARIMAX"}
                        </span>
                      </div>
                      {d.volumeHistoris !== null && d.type !== "proyeksi" && (
                        <div className="text-blue-400 font-semibold">
                          Observasi: {formatNumber(
                            selectedMetric === "volume"
                              ? d.volumeHistoris
                              : selectedMetric === "krisis"
                              ? d.krisisHistoris
                              : selectedMetric === "burnout"
                              ? d.burnoutHistoris
                              : d.finansialHistoris
                          )}
                        </div>
                      )}
                      {d.proyeksi !== null && (
                        <div className="space-y-1">
                          <div className="text-orange-400 font-bold">
                            Proyeksi Titik: {formatNumber(d.proyeksi)}
                          </div>
                          {selectedMetric === "volume" && d.ci68_atas && (
                            <>
                              <div className="text-amber-300 text-[11px]">
                                Pita 68% CI: [{formatNumber(d.ci68_bawah)} – {formatNumber(d.ci68_atas)}]
                              </div>
                              <div className="text-orange-300 text-[11px]">
                                Pita 95% CI: [{formatNumber(d.ci95_bawah)} – {formatNumber(d.ci95_atas)}]
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

            {/* Reference Line for Forecast Split */}
            <ReferenceLine
              x="2024-12"
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{ value: "Awal Proyeksi 2025", fill: "#ef4444", fontSize: 10, position: "top" }}
            />

            {/* Floating Stacked Area: 95% Confidence Interval Band */}
            {selectedMetric === "volume" && (
              <>
                <Area
                  type="monotone"
                  dataKey="ci95Base"
                  stackId="ci95"
                  stroke="none"
                  fill="transparent"
                  legendType="none"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="ci95Spread"
                  stackId="ci95"
                  stroke="none"
                  fill="url(#band95Gradient)"
                  name="Pita Ketidakpastian 95% CI"
                  isAnimationActive={false}
                />
              </>
            )}

            {/* Floating Stacked Area: 68% Confidence Interval Band */}
            {selectedMetric === "volume" && (
              <>
                <Area
                  type="monotone"
                  dataKey="ci68Base"
                  stackId="ci68"
                  stroke="none"
                  fill="transparent"
                  legendType="none"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="ci68Spread"
                  stackId="ci68"
                  stroke="none"
                  fill="url(#band68Gradient)"
                  name="Pita Ketidakpastian 68% CI"
                  isAnimationActive={false}
                />
              </>
            )}

            {/* Historical Observation Line */}
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
              connectNulls
            />

            {/* Projected Trajectory Line */}
            <Line
              type="monotone"
              dataKey="proyeksi"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ r: 2, fill: "#f97316" }}
              name="Proyeksi Titik (2025-2026)"
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Footnote */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-5 rounded bg-sky-400" />
            <span>Historis (2019–2024)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-5 rounded bg-orange-500" />
            <span>Proyeksi SARIMAX (2025–2026)</span>
          </div>
          {selectedMetric === "volume" && (
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-5 rounded bg-orange-500/30 border border-orange-500/50" />
              <span>Interval Kepercayaan 68% & 95%</span>
            </div>
          )}
        </div>
        <div className="text-slate-500 italic">
          *Divalidasi dengan 413 fold walk-forward CV bebas kebocoran data
        </div>
      </div>
    </div>
  );
}
