"use client";

import { useState, useMemo } from "react";
import { ProvinceData } from "@/types/data";
import { CLUSTERS } from "@/lib/constants";
import { Search, ArrowUpDown } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface Props {
  provinces: ProvinceData[];
  selectedProvince: ProvinceData | null;
  onSelectProvince: (p: ProvinceData | null) => void;
  filterCluster: number | null;
}

export function ProvinceTable({ provinces, selectedProvince, onSelectProvince, filterCluster }: Props) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string>("peringkat");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    return provinces
      .filter((p) => {
        const name = p.provinsi || (p as any).Provinsi || "";
        const matchSearch = name.toLowerCase().includes(search.toLowerCase());
        const matchCluster = filterCluster === null || Number(p.klaster) === filterCluster;
        return matchSearch && matchCluster;
      })
      .sort((a, b) => {
        let valA: any = (a as any)[sortKey];
        let valB: any = (b as any)[sortKey];

        if (sortKey === "provinsi") {
          valA = a.provinsi || (a as any).Provinsi || "";
          valB = b.provinsi || (b as any).Provinsi || "";
        }

        if (typeof valA === "number" && typeof valB === "number") {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA || "").localeCompare(String(valB || ""))
          : String(valB || "").localeCompare(String(valA || ""));
      });
  }, [provinces, search, filterCluster, sortKey, sortAsc]);

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  return (
    <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
      {/* Search & Filter Header */}
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari provinsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#070d18] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <div className="text-xs text-slate-400 w-full sm:w-auto text-right">
          Menampilkan <strong>{filtered.length}</strong> dari 38 Provinsi
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-[#0c1524] text-slate-300 border-b border-white/10 z-10">
            <tr>
              <th 
                className="p-3 cursor-pointer hover:text-white"
                onClick={() => handleSort("peringkat")}
              >
                <div className="flex items-center gap-1">
                  <span>Rank</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th 
                className="p-3 cursor-pointer hover:text-white"
                onClick={() => handleSort("provinsi")}
              >
                <div className="flex items-center gap-1">
                  <span>Provinsi</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="p-3">Klaster</th>
              <th 
                className="p-3 cursor-pointer hover:text-white text-right"
                onClick={() => handleSort("hp_seluler_2024")}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Ponsel (%)</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th 
                className="p-3 cursor-pointer hover:text-white text-right"
                onClick={() => handleSort("ipm_2024")}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>IPM</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th 
                className="p-3 cursor-pointer hover:text-white text-right"
                onClick={() => handleSort("pdrb_kapita_2024")}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>PDRB/Kapita</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="p-3 text-center">Kerentanan</th>
              <th className="p-3 text-center">LISA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((p) => {
              const pName = p.provinsi || (p as any).Provinsi;
              const isSelected = (selectedProvince?.provinsi || (selectedProvince as any)?.Provinsi) === pName;
              const clusterId = Number(p.klaster);
              const clusterInfo = CLUSTERS[clusterId];
              const katKerentanan = p.kategori_kerentanan || (p as any).kategori || "Sedang";
              const katLisa = p.kategori_lisa || (p as any).lisa_q || (p as any).lisa || "Tidak Signifikan";

              return (
                <tr
                  key={pName}
                  onClick={() => onSelectProvince(isSelected ? null : p)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-orange-500/20 text-white font-medium"
                      : "hover:bg-white/5 text-slate-300"
                  }`}
                >
                  <td className="p-3 font-semibold text-slate-400">#{p.peringkat}</td>
                  <td className="p-3 font-bold text-white">{pName}</td>
                  <td className="p-3">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                      style={{
                        color: clusterInfo?.color,
                        borderColor: `${clusterInfo?.color}40`,
                        backgroundColor: `${clusterInfo?.color}15`,
                      }}
                    >
                      {clusterInfo?.name}
                    </span>
                  </td>
                  <td className="p-3 text-right font-semibold text-white">
                    {Number(p.hp_seluler_2024).toFixed(1)}%
                  </td>
                  <td className="p-3 text-right">{Number(p.ipm_2024).toFixed(1)}</td>
                  <td className="p-3 text-right text-slate-400">
                    Rp {formatNumber(Number(p.pdrb_kapita_2024))} rb
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        katKerentanan === "Sangat Tinggi"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : katKerentanan === "Tinggi"
                          ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                          : katKerentanan === "Sedang"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {katKerentanan}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`text-[10px] font-medium ${
                        katLisa.includes("High-High")
                          ? "text-rose-400 font-bold"
                          : katLisa.includes("Low-Low")
                          ? "text-blue-400 font-bold"
                          : katLisa.includes("Low-High")
                          ? "text-purple-400 font-bold"
                          : "text-slate-500"
                      }`}
                    >
                      {katLisa}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
