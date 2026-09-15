"use client";

import { useState } from "react";
import { Sliders, Sparkles, TrendingDown, ShieldCheck, RefreshCw } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export function PolicySimulator() {
  const [phoneBoost, setPhoneBoost] = useState(15); // +15%
  const [ipmBoost, setIpmBoost] = useState(2.5); // +2.5 poin
  const [psychiatristRedist, setPsychiatristRedist] = useState(30); // +30% redistribusi ke luar Jawa

  // Estimated Impact Models based on GWR & IKAD Elasticity
  // In GWR: IPM elasticity is +8.2 to +12.4 (average ~10.2).
  const estimatedVulnerabilityReduction = (phoneBoost * 0.45 + ipmBoost * 2.8 + psychiatristRedist * 0.35).toFixed(1);
  const estimatedCrisisAverted = Math.round(Number(estimatedVulnerabilityReduction) * 142);

  function resetPolicy() {
    setPhoneBoost(15);
    setIpmBoost(2.5);
    setPsychiatristRedist(30);
  }

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 mb-1">
            <Sliders className="h-3.5 w-3.5" />
            <span>Simulasi Kebijakan • What-If Scenario Planning</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
            Simulator Intervensi Spasial & Reduksi Kerentanan
          </h3>
          <p className="text-xs text-slate-400">
            Geser parameter kebijakan di bawah untuk melihat estimasi dampak terhadap penurunan indeks kerentanan wilayah.
          </p>
        </div>

        <button
          onClick={resetPolicy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs self-start sm:self-center transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Skenario</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Slider 1: Penetrasi Ponsel 3T */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Peningkatan Penetrasi Ponsel 3T</span>
            <strong className="text-emerald-400 text-sm">+{phoneBoost}%</strong>
          </div>
          <input
            type="range"
            min={0}
            max={35}
            step={1}
            value={phoneBoost}
            onChange={(e) => setPhoneBoost(Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Perluasan BTS 4G & subsidi ponsel di Klaster 1 Papua Tengah & Pegunungan.
          </p>
        </div>

        {/* Slider 2: Akselerasi IPM */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Akselerasi IPM Wilayah Timur</span>
            <strong className="text-blue-400 text-sm">+{ipmBoost.toFixed(1)} Poin</strong>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={ipmBoost}
            onChange={(e) => setIpmBoost(Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Target pendidikan lama sekolah & daya beli masyarakat di wilayah Maluku–Papua.
          </p>
        </div>

        {/* Slider 3: Redistribusi Psikiater */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Insentif Psikiater Luar Jawa</span>
            <strong className="text-purple-400 text-sm">+{psychiatristRedist}%</strong>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={5}
            value={psychiatristRedist}
            onChange={(e) => setPsychiatristRedist(Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Pemerataan tenaga psikiater RSUD & konselor klinis dari Pulau Jawa ke Luar Jawa.
          </p>
        </div>
      </div>

      {/* Projected Impact Score Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-navy-900 to-orange-950/40 border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <TrendingDown className="h-4 w-4" />
            Estimasi Reduksi Indeks Kerentanan Regional
          </span>
          <div className="text-4xl font-extrabold text-white font-heading">
            -{estimatedVulnerabilityReduction}%
          </div>
          <p className="text-xs text-slate-300">
            Penurunan kumulatif gap digital dan akses layanan jiwa di 38 provinsi.
          </p>
        </div>

        <div className="space-y-1 sm:border-l sm:border-white/10 sm:pl-6">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            Estimasi Kasus Krisis Tertangani / Bulan
          </span>
          <div className="text-4xl font-extrabold text-orange-400 font-heading">
            ~{formatNumber(estimatedCrisisAverted)} Kasus
          </div>
          <p className="text-xs text-slate-300">
            Potensi pencegahan eskalasi depresi akut melalui respons terpadu SEJIWA+.
          </p>
        </div>
      </div>
    </div>
  );
}
