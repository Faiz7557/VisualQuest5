"use client";

import { useState, useEffect } from "react";
import { ProvinceData } from "@/types/data";
import { ChoroplethMap } from "@/components/dashboard/choropleth-map";
import { ClusterCards } from "@/components/dashboard/cluster-cards";
import { ProvinceTable } from "@/components/dashboard/province-table";
import { CLUSTERS } from "@/lib/constants";
import { 
  Layers, 
  MapPin, 
  Info, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  BarChart2, 
  Smartphone, 
  GraduationCap, 
  DollarSign, 
  Briefcase,
  X
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function ClusteringDashboardPage() {
  const [provinces, setProvinces] = useState<ProvinceData[]>([]);
  const [activeLayer, setActiveLayer] = useState<"klaster" | "kerentanan" | "ponsel" | "lisa">("klaster");
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);

  useEffect(() => {
    fetch("/data/clustering_results.json")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error(err));
  }, []);

  const clusterDetails = selectedProvince ? CLUSTERS[selectedProvince.klaster] : null;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* 1. Page Header & Key Metrics Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <MapPin className="h-3.5 w-3.5" />
            <span>Pilar 1 • Analisis Kesenjangan Regional</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
            Peta Klaster & Ekonometrika Spasial
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Eksplorasi autokorelasi spasial, tipologi 4 klaster (Ward + PCA), dan model heterogenitas lokal Geographically Weighted Regression (GWR) di 38 provinsi.
          </p>
        </div>

        {/* 4 Badges Statistik Kunci */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#0b162a] border border-white/10 rounded-xl p-3 text-center">
            <div className="text-xs text-slate-400 font-medium">Pseudo R² (GWR)</div>
            <div className="text-xl font-extrabold text-emerald-400">0,957</div>
            <div className="text-[10px] text-slate-500">Model Terbaik</div>
          </div>
          <div className="bg-[#0b162a] border border-white/10 rounded-xl p-3 text-center">
            <div className="text-xs text-slate-400 font-medium">Silhouette</div>
            <div className="text-xl font-extrabold text-blue-400">0,530</div>
            <div className="text-[10px] text-slate-500">Robust + PCA2</div>
          </div>
          <div className="bg-[#0b162a] border border-white/10 rounded-xl p-3 text-center">
            <div className="text-xs text-slate-400 font-medium">Moran's I</div>
            <div className="text-xl font-extrabold text-orange-400">0,450</div>
            <div className="text-[10px] text-slate-500">z=6.91, p=0.001</div>
          </div>
          <div className="bg-[#0b162a] border border-white/10 rounded-xl p-3 text-center">
            <div className="text-xs text-slate-400 font-medium">AICc GWR</div>
            <div className="text-xl font-extrabold text-purple-400">208,0</div>
            <div className="text-[10px] text-slate-500">ΔAICc = -16.0 OLS</div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Map Section with Layer Switcher & Detail Panel */}
      <div className="space-y-4">
        {/* Layer Selector Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-orange-400" />
              Pilih Layer Peta:
            </span>
            <div className="inline-flex rounded-xl bg-[#0b162a] p-1 border border-white/10">
              <button
                onClick={() => setActiveLayer("klaster")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLayer === "klaster"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                4 Klaster Tipologi
              </button>
              <button
                onClick={() => setActiveLayer("kerentanan")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLayer === "kerentanan"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Indeks Kerentanan (IKAD)
              </button>
              <button
                onClick={() => setActiveLayer("ponsel")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLayer === "ponsel"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Penetrasi Ponsel (%)
              </button>
              <button
                onClick={() => setActiveLayer("lisa")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLayer === "lisa"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                LISA (Spatial Cluster)
              </button>
            </div>
          </div>

          {/* Quick Note */}
          <span className="text-xs text-slate-500 italic">
            *Klik salah satu poligon provinsi di peta untuk membuka audit profil indikator
          </span>
        </div>

        {/* Map & Detail Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`${selectedProvince ? "lg:col-span-8" : "lg:col-span-12"} transition-all`}>
            <ChoroplethMap
              provinces={provinces}
              activeLayer={activeLayer}
              selectedProvince={selectedProvince}
              onSelectProvince={setSelectedProvince}
            />
          </div>

          {/* Selected Province Detail Drawer */}
          {selectedProvince && (
            <div className="lg:col-span-4 glass-card rounded-2xl p-6 border border-orange-500/30 space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block mb-1">
                    Audit Detail Wilayah • Peringkat #{selectedProvince.peringkat}
                  </span>
                  <h3 className="text-2xl font-black text-white font-heading">
                    {selectedProvince.provinsi}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProvince(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cluster Tag */}
              <div 
                className="p-3 rounded-xl border"
                style={{ 
                  backgroundColor: `${clusterDetails?.color}15`, 
                  borderColor: `${clusterDetails?.color}35` 
                }}
              >
                <div className="text-xs font-semibold" style={{ color: clusterDetails?.color }}>
                  Klaster {selectedProvince.klaster}: {selectedProvince.nama_klaster}
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  {clusterDetails?.description}
                </p>
              </div>

              {/* 5 Indicator Stats */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/5 text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
                    Kepemilikan Ponsel (2024)
                  </span>
                  <span className="font-bold text-white text-sm">
                    {selectedProvince.hp_seluler_2024.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/5 text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                    Indeks Pembangunan Manusia
                  </span>
                  <span className="font-bold text-white text-sm">
                    {selectedProvince.ipm_2024.toFixed(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/5 text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-amber-400" />
                    Rata-rata Lama Sekolah (RLS)
                  </span>
                  <span className="font-bold text-white text-sm">
                    {selectedProvince.rls_2024.toFixed(2)} thn
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/5 text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-purple-400" />
                    PDRB per Kapita ADHB
                  </span>
                  <span className="font-bold text-white text-sm">
                    Rp {formatNumber(selectedProvince.pdrb_kapita_2024)} rb
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/5 text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-rose-400" />
                    Tingkat Pengangguran Terbuka
                  </span>
                  <span className="font-bold text-white text-sm">
                    {selectedProvince.tpt_2024.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Composite score info */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Skor Kerentanan (IKAD)</span>
                  <span className="font-black text-white text-base">
                    {selectedProvince.skor_kerentanan.toFixed(4)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[11px] block">Pola Spasial LISA</span>
                  <span className="font-bold text-orange-400">
                    {selectedProvince.kategori_lisa}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Cluster Summary Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-heading">
            Profil 4 Klaster Wilayah
          </h2>
          <span className="text-xs text-slate-400">
            Klik kartu klaster untuk memfilter tabel provinsi di bawah
          </span>
        </div>
        <ClusterCards
          provinces={provinces}
          selectedCluster={selectedCluster}
          onSelectCluster={setSelectedCluster}
        />
      </div>

      {/* 4. Complete 38 Provinces Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-heading">
            Tabel Data Lengkap 38 Provinsi
          </h2>
          {selectedCluster !== null && (
            <button
              onClick={() => setSelectedCluster(null)}
              className="text-xs text-orange-400 hover:underline"
            >
              Reset Filter Klaster
            </button>
          )}
        </div>
        <ProvinceTable
          provinces={provinces}
          selectedProvince={selectedProvince}
          onSelectProvince={setSelectedProvince}
          filterCluster={selectedCluster}
        />
      </div>
    </div>
  );
}
