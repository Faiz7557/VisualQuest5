"use client";

import { CLUSTERS } from "@/lib/constants";
import { ProvinceData } from "@/types/data";
import { Users, Smartphone, GraduationCap, DollarSign } from "lucide-react";

interface Props {
  provinces: ProvinceData[];
  selectedCluster: number | null;
  onSelectCluster: (clusterId: number | null) => void;
}

export function ClusterCards({ provinces, selectedCluster, onSelectCluster }: Props) {
  const clusterOrder = [0, 2, 3, 1]; // Maju, Berkembang, Tertinggal Sedang, Tertinggal Ekstrem

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {clusterOrder.map((id) => {
        const info = CLUSTERS[id];
        const count = provinces.filter((p) => p.klaster === id).length;
        const provs = provinces.filter((p) => p.klaster === id);
        const avgHp = provs.length ? provs.reduce((a, b) => a + b.hp_seluler_2024, 0) / provs.length : 0;
        const avgIpm = provs.length ? provs.reduce((a, b) => a + b.ipm_2024, 0) / provs.length : 0;
        const isSelected = selectedCluster === id;

        return (
          <div
            key={id}
            onClick={() => onSelectCluster(isSelected ? null : id)}
            className={`cursor-pointer rounded-2xl p-5 border transition-all glass-card relative overflow-hidden ${
              isSelected
                ? "border-white/40 ring-2 ring-orange-500/50 scale-[1.02] shadow-glow"
                : "border-white/10 hover:border-white/20 hover:scale-[1.01]"
            }`}
          >
            <div 
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: info.color }}
            />

            <div className="flex items-center justify-between mt-1 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Klaster {id}
              </span>
              <span 
                className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
                style={{ 
                  color: info.color, 
                  borderColor: `${info.color}40`, 
                  backgroundColor: `${info.color}15` 
                }}
              >
                {count} Provinsi
              </span>
            </div>

            <h4 className="text-base font-bold text-white mb-2 font-heading">
              {info.name}
            </h4>

            <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
              {info.description}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Rerata Ponsel</span>
                <span className="font-extrabold text-white text-sm">{avgHp.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Rerata IPM</span>
                <span className="font-extrabold text-white text-sm">{avgIpm.toFixed(1)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
