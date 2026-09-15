"use client";

import { CLUSTERS } from "@/lib/constants";
import { ProvinceData } from "@/types/data";
import { Smartphone, Sparkles, CheckCircle2, ChevronRight, Zap } from "lucide-react";

interface Props {
  provinces: ProvinceData[];
  selectedCluster: number | null;
  onSelectCluster: (clusterId: number | null) => void;
}

const CLUSTER_STRATEGIES: Record<number, { strategy: string; focus: string; tag: string }> = {
  0: {
    tag: "High Tech - High Resource",
    focus: "Optimalisasi Jalur Digital Penuh",
    strategy: "Full AI Chatbot, Video Telekonseling, & Self-Harm Early Warning.",
  },
  1: {
    tag: "Low Tech - Extreme Gap",
    focus: "Solusi Non-Internet 2G & Tim Keliling",
    strategy: "Gateway USSD/SMS (*119#), Flying Psychiatric Team, & Kader Posyandu Jiwa.",
  },
  2: {
    tag: "High Need - Moderate Tech",
    focus: "Skalabilitas Massal & Rujukan Faskes",
    strategy: "Hybrid Skrining Cepat, Rujukan Puskesmas Terdekat, & Mitigasi Burnout Konselor.",
  },
  3: {
    tag: "Moderate Need - Low Resource",
    focus: "Konektivitas Fleksibel & Faskes Primer",
    strategy: "Asynchronous Messaging, Penguatan Tenaga Jiwa Daerah, & Kuota Bebas Pulsa.",
  },
};

export function ClusterCards({ provinces, selectedCluster, onSelectCluster }: Props) {
  const clusterOrder = [0, 2, 3, 1]; // Maju, Berkembang, Transisi, Tertinggal Ekstrem

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {clusterOrder.map((id) => {
        const info = CLUSTERS[id];
        const provs = provinces.filter((p) => Number(p.klaster) === id);
        const count = provs.length;
        const avgHp = provs.length ? provs.reduce((a, b) => a + Number(b.hp_seluler_2024 || 0), 0) / provs.length : 0;
        const avgIpm = provs.length ? provs.reduce((a, b) => a + Number(b.ipm_2024 || 0), 0) / provs.length : 0;
        const isSelected = selectedCluster === id;
        const strat = CLUSTER_STRATEGIES[id];

        // Pick 3 representative sample provinces
        const sampleProvs = provs.slice(0, 3).map((p) => p.provinsi || (p as any).Provinsi);

        return (
          <div
            key={id}
            onClick={() => onSelectCluster(isSelected ? null : id)}
            className={`cursor-pointer rounded-2xl p-5 border transition-all glass-card relative overflow-hidden flex flex-col justify-between ${
              isSelected
                ? "border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/40 shadow-glow scale-[1.02]"
                : "border-white/10 hover:border-white/25 hover:bg-white/5"
            }`}
          >
            {/* Top color indicator bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: info.color }}
            />

            <div>
              {/* Header: Cluster ID & Province Count */}
              <div className="flex items-center justify-between mt-1 mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Klaster {id}
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                  style={{
                    color: info.color,
                    borderColor: `${info.color}40`,
                    backgroundColor: `${info.color}15`,
                  }}
                >
                  {count} Provinsi
                </span>
              </div>

              {/* Title & Tag */}
              <h4 className="text-base font-bold text-white mb-1 font-heading">
                {info.name}
              </h4>
              <div className="text-[10px] font-semibold text-slate-400 mb-2">
                {strat?.tag}
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 mb-3.5 leading-relaxed">
                {info.description}
              </p>

              {/* Recommended Strategic Intervention */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 mb-3.5 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: info.color }}>
                  <Zap className="h-3 w-3" />
                  <span>Strategi SEJIWA+</span>
                </div>
                <p className="text-[11px] text-slate-200 leading-snug">
                  {strat?.strategy}
                </p>
              </div>
            </div>

            {/* Bottom Stats & Representative Provinces */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rerata Ponsel</span>
                    <strong className="text-white text-xs">{avgHp.toFixed(1)}%</strong>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-slate-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rerata IPM</span>
                    <strong className="text-white text-xs">{avgIpm.toFixed(1)}</strong>
                  </div>
                </div>
              </div>

              {sampleProvs.length > 0 && (
                <div className="text-[10px] text-slate-400 pt-1 truncate">
                  Contoh: <span className="text-slate-200">{sampleProvs.join(", ")}{count > 3 ? "..." : ""}</span>
                </div>
              )}

              {isSelected && (
                <div className="text-[10px] font-bold text-orange-400 flex items-center justify-center gap-1 pt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Filter Aktif • Klik untuk Reset</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
