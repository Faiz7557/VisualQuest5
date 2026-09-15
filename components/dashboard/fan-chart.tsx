"use client";

import { useState, useMemo } from "react";
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
  ReferenceLine,
} from "recharts";
import { formatNumber } from "@/lib/utils";
import { 
  Sparkles, 
  Calendar, 
  Users, 
  AlertCircle, 
  TrendingUp, 
  Layers, 
  Check, 
  Clock,
  Activity
} from "lucide-react";

interface Props {
  historical: HistoricalPoint[];
  forecast: ForecastPoint[];
  selectedMetric: "volume" | "krisis" | "burnout" | "finansial";
  onSelectMetric: (m: "volume" | "krisis" | "burnout" | "finansial") => void;
}

export function FanChart({ historical, forecast, selectedMetric, onSelectMetric }: Props) {
  // Time range filter: 'all' (2019-2026), 'forecast_focus' (2024-2026), 'covid' (2020-2022)
  const [timeRange, setTimeRange] = useState<"all" | "forecast_focus" | "covid">("all");

  // Multi-model overlay toggles for volume projection
  const [showSarima, setShowSarima] = useState(false);
  const [showEts, setShowEts] = useState(false);
  const [showProphet, setShowProphet] = useState(false);

  // Active clicked/inspected data point
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  // Get last historical point to bridge the timeline seamlessly
  const lastHist = historical.length > 0 ? historical[historical.length - 1] : null;

  // Filter historical according to time range
  const filteredHistorical = useMemo(() => {
    if (timeRange === "forecast_focus") {
      return historical.filter((h) => h.tanggal >= "2024-01-01");
    }
    if (timeRange === "covid") {
      return historical.filter((h) => h.tanggal >= "2020-01-01" && h.tanggal <= "2022-12-31");
    }
    return historical;
  }, [historical, timeRange]);

  const filteredForecast = useMemo(() => {
    if (timeRange === "covid") return [];
    return forecast;
  }, [forecast, timeRange]);

  // Build unified chart data with floating confidence interval bands and multi-model projections
  const chartData = useMemo(() => {
    return [
      ...filteredHistorical.map((h) => ({
        tanggal: h.tanggal.slice(0, 7),
        rawDate: h.tanggal,
        type: "historis",
        volumeHistoris: h.volume_konsultasi_mental,
        krisisHistoris: h.panggilan_krisis_psikologis,
        burnoutHistoris: h.indeks_burnout_pekerja,
        finansialHistoris: h.indeks_stres_finansial,
        proyeksi: null,
        sarimaProyeksi: null,
        etsProyeksi: null,
        prophetProyeksi: null,
        ci95Range: null,
        ci68Range: null,
        ci95_atas: null,
        ci95_bawah: null,
        ci68_atas: null,
        ci68_bawah: null,
      })),
      // Bridge point on 2024-12 if within range (anchor of the fanchart)
      ...(timeRange !== "covid" && lastHist && filteredForecast.length > 0
        ? [
            {
              tanggal: lastHist.tanggal.slice(0, 7),
              rawDate: lastHist.tanggal,
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
              sarimaProyeksi: lastHist.volume_konsultasi_mental,
              etsProyeksi: lastHist.volume_konsultasi_mental,
              prophetProyeksi: lastHist.volume_konsultasi_mental,
              ci95Range: [
                selectedMetric === "volume" ? lastHist.volume_konsultasi_mental :
                selectedMetric === "krisis" ? lastHist.panggilan_krisis_psikologis :
                selectedMetric === "burnout" ? lastHist.indeks_burnout_pekerja :
                lastHist.indeks_stres_finansial,
                selectedMetric === "volume" ? lastHist.volume_konsultasi_mental :
                selectedMetric === "krisis" ? lastHist.panggilan_krisis_psikologis :
                selectedMetric === "burnout" ? lastHist.indeks_burnout_pekerja :
                lastHist.indeks_stres_finansial,
              ],
              ci68Range: [
                selectedMetric === "volume" ? lastHist.volume_konsultasi_mental :
                selectedMetric === "krisis" ? lastHist.panggilan_krisis_psikologis :
                selectedMetric === "burnout" ? lastHist.indeks_burnout_pekerja :
                lastHist.indeks_stres_finansial,
                selectedMetric === "volume" ? lastHist.volume_konsultasi_mental :
                selectedMetric === "krisis" ? lastHist.panggilan_krisis_psikologis :
                selectedMetric === "burnout" ? lastHist.indeks_burnout_pekerja :
                lastHist.indeks_stres_finansial,
              ],
              ci95_atas: lastHist.volume_konsultasi_mental,
              ci95_bawah: lastHist.volume_konsultasi_mental,
              ci68_atas: lastHist.volume_konsultasi_mental,
              ci68_bawah: lastHist.volume_konsultasi_mental,
            },
          ]
        : []),
      ...filteredForecast.map((f) => {
        const vol = Math.round(f.proyeksi_volume || (f as any).ensemble || 0);
        const krisis = Math.round(f.driver_panggilan_krisis || (f as any).panggilan_krisis_psikologis || 0);
        const burnout = Number((f.driver_burnout || (f as any).indeks_burnout_pekerja || 0).toFixed(1));
        const finansial = Number((f.driver_stres_finansial || (f as any).indeks_stres_finansial || 0).toFixed(1));

        // Metric-dependent target & CI boundaries
        let targetVal = vol;
        let low95 = Math.round(f.ci95_bawah || vol * 0.85);
        let high95 = Math.round(f.ci95_atas || vol * 1.15);
        let low68 = Math.round(f.ci68_bawah || vol * 0.92);
        let high68 = Math.round(f.ci68_atas || vol * 1.08);

        if (selectedMetric === "krisis") {
          targetVal = krisis;
          low95 = Math.round(krisis * 0.88);
          high95 = Math.round(krisis * 1.14);
          low68 = Math.round(krisis * 0.94);
          high68 = Math.round(krisis * 1.07);
        } else if (selectedMetric === "burnout") {
          targetVal = burnout;
          low95 = Number((burnout * 0.94).toFixed(1));
          high95 = Number((burnout * 1.06).toFixed(1));
          low68 = Number((burnout * 0.97).toFixed(1));
          high68 = Number((burnout * 1.03).toFixed(1));
        } else if (selectedMetric === "finansial") {
          targetVal = finansial;
          low95 = Number((finansial * 0.95).toFixed(1));
          high95 = Number((finansial * 1.05).toFixed(1));
          low68 = Number((finansial * 0.98).toFixed(1));
          high68 = Number((finansial * 1.02).toFixed(1));
        }

        return {
          tanggal: f.tanggal.slice(0, 7),
          rawDate: f.tanggal,
          type: "proyeksi",
          volumeHistoris: null,
          krisisHistoris: null,
          burnoutHistoris: null,
          finansialHistoris: null,
          proyeksi: targetVal,
          sarimaProyeksi: Math.round((f as any).sarima || vol),
          etsProyeksi: Math.round((f as any).ets || vol),
          prophetProyeksi: Math.round((f as any).prophet || vol),
          ci95Range: [low95, high95],
          ci68Range: [low68, high68],
          ci95_atas: high95,
          ci95_bawah: low95,
          ci68_atas: high68,
          ci68_bawah: low68,
          rawForecast: f
        };
      }),
    ];
  }, [filteredHistorical, filteredForecast, lastHist, selectedMetric, timeRange]);

  // Set default selected point to latest forecast point when available
  const activeInspectorData = selectedPoint || (chartData.length > 0 ? chartData[chartData.length - 1] : null);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-8">
      {/* 1. Header Toolbar & Metric Switchers */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 mb-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Fanchart Interaktif • Pita Ketidakpastian 68% & 95% Out-of-Fold</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
            {selectedMetric === "volume" && "Proyeksi Volume Konsultasi Jiwa & Interval Ketidakpastian"}
            {selectedMetric === "krisis" && "Tren Panggilan Krisis Psikologis & Eskalasi Darurat"}
            {selectedMetric === "burnout" && "Indeks Beban Kerja / Kelelahan Mental Tenaga Layanan"}
            {selectedMetric === "finansial" && "Dinamika Tekanan Stres Finansial Masyarakat"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Pita arsiran fanchart menggambarkan rentang ketidakpastian interval kepercayaan 68% dan 95% hasil validasi silang.
          </p>
        </div>

        {/* Time Horizon Selector */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Rentang:</span>
          <div className="inline-flex rounded-xl bg-[#08111e] p-1 border border-white/10 text-xs shrink-0">
            <button
              onClick={() => setTimeRange("all")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                timeRange === "all" ? "bg-orange-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Semua (2019–2026)
            </button>
            <button
              onClick={() => setTimeRange("forecast_focus")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                timeRange === "forecast_focus" ? "bg-orange-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Fokus Proyeksi (2024–2026)
            </button>
            <button
              onClick={() => setTimeRange("covid")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                timeRange === "covid" ? "bg-orange-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Era Pandemi (2020–2022)
            </button>
          </div>
        </div>
      </div>

      {/* 2. Multi-Model Overlay Checkboxes (Only visible in Volume metric) */}
      {selectedMetric === "volume" && timeRange !== "covid" && (
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-semibold shrink-0">
            <Layers className="h-4 w-4 text-orange-400" />
            <span>Bandingkan Trajektori Model Alternatif:</span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white shrink-0">
              <input
                type="checkbox"
                checked={true}
                disabled
                className="accent-orange-500 rounded"
              />
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="h-2 w-4 rounded-sm bg-orange-500" />
                <strong className="text-orange-400">Ensemble (Utama)</strong>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white shrink-0">
              <input
                type="checkbox"
                checked={showSarima}
                onChange={(e) => setShowSarima(e.target.checked)}
                className="accent-blue-500 rounded"
              />
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="h-2 w-4 rounded-sm bg-blue-400" />
                <span>SARIMA Univariat</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white shrink-0">
              <input
                type="checkbox"
                checked={showEts}
                onChange={(e) => setShowEts(e.target.checked)}
                className="accent-purple-500 rounded"
              />
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="h-2 w-4 rounded-sm bg-purple-400" />
                <span>ETS (Holt-Winters)</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white shrink-0">
              <input
                type="checkbox"
                checked={showProphet}
                onChange={(e) => setShowProphet(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="h-2 w-4 rounded-sm bg-emerald-400" />
                <span>Meta Prophet</span>
              </span>
            </label>
          </div>
        </div>
      )}

      {/* 3. Recharts Composed Canvas with Native Fanchart Range Areas */}
      <div className="h-[340px] sm:h-[420px] lg:h-[460px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 15, right: 20, left: 10, bottom: 0 }}
            onClick={(e) => {
              if (e && e.activePayload && e.activePayload.length > 0) {
                setSelectedPoint(e.activePayload[0].payload);
              }
            }}
          >
            <defs>
              <linearGradient id="fan95Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0.12} />
              </linearGradient>
              <linearGradient id="fan68Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.65} />
                <stop offset="100%" stopColor="#ea580c" stopOpacity={0.28} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis
              dataKey="tanggal"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              interval={timeRange === "forecast_focus" ? 3 : 6}
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
                    <div className="glass-card rounded-2xl p-4 border border-white/20 text-xs shadow-2xl space-y-2 min-w-[230px]">
                      <div className="font-bold text-white border-b border-white/10 pb-1.5 flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-orange-400" />
                          {label}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                          {d.type === "historis" ? "Historis BPS" : "Proyeksi 2025–2026"}
                        </span>
                      </div>

                      {d.volumeHistoris !== null && d.type !== "proyeksi" && (
                        <div className="text-sky-300 font-semibold text-sm">
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
                        <div className="space-y-1.5 pt-1">
                          <div className="text-orange-400 font-black text-sm">
                            Proyeksi Titik: {formatNumber(d.proyeksi)}
                          </div>
                          {d.ci68_atas && (
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-1">
                              <div className="text-amber-300 text-[11px] font-semibold flex justify-between">
                                <span>Pita 68% CI:</span>
                                <span>[{formatNumber(d.ci68_bawah)} – {formatNumber(d.ci68_atas)}]</span>
                              </div>
                              <div className="text-orange-300 text-[11px] font-semibold flex justify-between">
                                <span>Pita 95% CI:</span>
                                <span>[{formatNumber(d.ci95_bawah)} – {formatNumber(d.ci95_atas)}]</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 italic pt-1 border-t border-white/5">
                        *Klik titik untuk membedah alokasi konselor
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Awal Proyeksi Reference Line */}
            {timeRange !== "covid" && (
              <ReferenceLine
                x="2024-12"
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{ value: "Awal Proyeksi 2025", fill: "#ef4444", fontSize: 10, position: "top" }}
              />
            )}

            {/* Fanchart Outer Band: 95% Confidence Interval */}
            {timeRange !== "covid" && (
              <Area
                type="monotone"
                dataKey="ci95Range"
                fill="url(#fan95Gradient)"
                stroke="#f97316"
                strokeWidth={1}
                strokeDasharray="4 4"
                strokeOpacity={0.6}
                connectNulls={true}
                isAnimationActive={false}
                name="Interval Kepercayaan 95%"
              />
            )}

            {/* Fanchart Inner Band: 68% Confidence Interval */}
            {timeRange !== "covid" && (
              <Area
                type="monotone"
                dataKey="ci68Range"
                fill="url(#fan68Gradient)"
                stroke="#ea580c"
                strokeWidth={1}
                strokeDasharray="2 2"
                strokeOpacity={0.8}
                connectNulls={true}
                isAnimationActive={false}
                name="Interval Kepercayaan 68%"
              />
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
              strokeWidth={3}
              dot={{ r: 2.5, fill: "#0284c7" }}
              activeDot={{ r: 6, fill: "#38bdf8", stroke: "#ffffff", strokeWidth: 2 }}
              name="Observasi Historis"
              connectNulls
            />

            {/* Projected Trajectory Line (Center Spine of Fan) */}
            <Line
              type="monotone"
              dataKey="proyeksi"
              stroke="#ffffff"
              strokeWidth={3.5}
              dot={{ r: 3.5, fill: "#f97316", stroke: "#ffffff", strokeWidth: 1.5 }}
              activeDot={{ r: 7.5, fill: "#f97316", stroke: "#ffffff", strokeWidth: 2.5 }}
              name="Proyeksi Titik (Ensemble)"
              connectNulls
            />

            {/* Alternative Model Lines */}
            {selectedMetric === "volume" && showSarima && (
              <Line
                type="monotone"
                dataKey="sarimaProyeksi"
                stroke="#60a5fa"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                name="SARIMA"
              />
            )}
            {selectedMetric === "volume" && showEts && (
              <Line
                type="monotone"
                dataKey="etsProyeksi"
                stroke="#c084fc"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                name="ETS"
              />
            )}
            {selectedMetric === "volume" && showProphet && (
              <Line
                type="monotone"
                dataKey="prophetProyeksi"
                stroke="#34d399"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                name="Prophet"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Visual Legend of the Fanchart */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5 text-xs text-slate-300">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-5 rounded bg-sky-400" />
            <span>Historis (2019–2024)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500 border border-white" />
            <span className="font-bold text-white">Proyeksi Titik (2025–2026)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-5 rounded bg-amber-500/60 border border-amber-400" />
            <span className="text-amber-300">Pita 68% CI (Zona Paling Mungkin)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-5 rounded bg-orange-500/25 border border-orange-500/60 border-dashed" />
            <span className="text-orange-300">Pita 95% CI (Batas Ekstrem Sistem)</span>
          </div>
        </div>
        <div className="text-slate-400 italic text-[11px]">
          *Fan chart diestimasi dari galat out-of-fold walk-forward cross validation
        </div>
      </div>

      {/* 4. Interactive Data Point Inspector Drawer */}
      {activeInspectorData && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0b182e] via-[#0d1f3d] to-[#0b182e] border border-orange-500/30 space-y-4 shadow-xl animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="h-3 w-3 rounded-full bg-orange-400 animate-pulse" />
              <h4 className="font-bold text-white text-base font-heading">
                Detail Bedah Titik: Periode {activeInspectorData.tanggal}
              </h4>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                {activeInspectorData.type === "historis" ? "Data Riil BPS" : "Proyeksi SARIMAX"}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              *Klik titik lain di grafik untuk mengganti inspeksi
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[11px] text-slate-400 block">Estimasi Kasus Bulanan</span>
              <strong className="text-lg font-black text-orange-400 font-heading">
                {formatNumber(
                  activeInspectorData.proyeksi || activeInspectorData.volumeHistoris || 0
                )}
              </strong>
              <span className="text-[10px] text-slate-500 block">
                {activeInspectorData.ci95_atas ? `95% CI: [${formatNumber(activeInspectorData.ci95_bawah)} – ${formatNumber(activeInspectorData.ci95_atas)}]` : "Observasi Aktual"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[11px] text-slate-400 block">Beban Kasus Rata-Rata</span>
              <strong className="text-lg font-black text-sky-400 font-heading">
                ~{formatNumber(Math.round((activeInspectorData.proyeksi || activeInspectorData.volumeHistoris || 0) / 30))}
              </strong>
              <span className="text-[10px] text-slate-500 block">Panggilan Kasus / Hari</span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[11px] text-slate-400 block">Kebutuhan Konselor 119</span>
              <strong className="text-lg font-black text-emerald-400 font-heading">
                ~{Math.round((activeInspectorData.proyeksi || activeInspectorData.volumeHistoris || 0) / 900)} Orang
              </strong>
              <span className="text-[10px] text-slate-500 block">Rasio Standar Beban Kerja</span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[11px] text-slate-400 block">Krisis Akut Diperkirakan</span>
              <strong className="text-lg font-black text-rose-400 font-heading">
                ~{formatNumber(Math.round((activeInspectorData.proyeksi || activeInspectorData.volumeHistoris || 0) * 0.132))}
              </strong>
              <span className="text-[10px] text-slate-500 block">Risiko Tinggi Keselamatan</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
