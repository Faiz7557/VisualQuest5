"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { ProvinceData } from "@/types/data";
import { CLUSTERS } from "@/lib/constants";
import L from "leaflet";

interface Props {
  provinces: ProvinceData[];
  activeLayer: "klaster" | "kerentanan" | "ponsel" | "lisa" | "gwr_ipm";
  onSelectProvince?: (p: ProvinceData | null) => void;
  selectedProvince?: ProvinceData | null;
}

export default function LeafletMapInner({ provinces, activeLayer, onSelectProvince, selectedProvince }: Props) {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch("/data/indonesia_38prov.json")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Gagal memuat GeoJSON:", err));
  }, []);

  // Map dictionary by province name uppercase
  const provMap = new Map<string, ProvinceData>();
  provinces.forEach((p) => {
    const name = (p.provinsi || (p as any).Provinsi || "").toUpperCase().trim();
    if (name) {
      provMap.set(name, p);
      // Handle alternative naming
      if (name === "KEPULAUAN BANGKA BELITUNG") provMap.set("KEP. BANGKA BELITUNG", p);
      if (name === "DAERAH ISTIMEWA YOGYAKARTA") provMap.set("DI YOGYAKARTA", p);
      if (name === "DKI JAKARTA") provMap.set("JAKARTA", p);
    }
  });

  function getFeatureColor(provName: string): string {
    const cleanName = provName.toUpperCase().trim();
    const p = provMap.get(cleanName);
    if (!p) return "#475569";

    const clusterId = Number(p.klaster);
    const katKerentanan = p.kategori_kerentanan || (p as any).kategori || "";
    const katLisa = p.kategori_lisa || (p as any).lisa_q || (p as any).lisa || "";

    if (activeLayer === "klaster") {
      return CLUSTERS[clusterId]?.color || "#64748b";
    }

    if (activeLayer === "kerentanan") {
      switch (katKerentanan) {
        case "Sangat Tinggi": return "#ef4444";
        case "Tinggi": return "#f97316";
        case "Sedang": return "#eab308";
        case "Rendah": return "#10b981";
        default: return "#64748b";
      }
    }

    if (activeLayer === "lisa") {
      if (katLisa.includes("High-High")) return "#ef4444"; // Hotspot
      if (katLisa.includes("Low-Low")) return "#3b82f6"; // Coldspot
      if (katLisa.includes("Low-High")) return "#a855f7"; // Outlier
      return "#334155"; // Tidak signifikan
    }

    if (activeLayer === "gwr_ipm") {
      const gwrIpm = (p as any).gwr_ipm_2024 || 0;
      if (gwrIpm >= 12.0) return "#ef4444"; // KTI (Elastisitas IPM Tertinggi)
      if (gwrIpm >= 10.0) return "#f97316";
      if (gwrIpm >= 8.5) return "#eab308";
      return "#3b82f6";
    }

    if (activeLayer === "ponsel") {
      const val = p.hp_seluler_2024;
      if (val >= 78) return "#10b981";
      if (val >= 72) return "#3b82f6";
      if (val >= 60) return "#f59e0b";
      if (val >= 40) return "#f97316";
      return "#ef4444";
    }

    return "#64748b";
  }

  function styleFeature(feature: any) {
    const provName = feature.properties.PROVINSI || feature.properties.provinsi || feature.properties.NAME_1 || "";
    const selectedName = (selectedProvince?.provinsi || (selectedProvince as any)?.Provinsi || "").toUpperCase();
    const isSelected = selectedName && selectedName === provName.toUpperCase().trim();

    return {
      fillColor: getFeatureColor(provName),
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? "#ffffff" : "rgba(255,255,255,0.25)",
      dashArray: "",
      fillOpacity: isSelected ? 0.95 : 0.75,
    };
  }

  function onEachFeature(feature: any, layer: L.Layer) {
    const provName = feature.properties.PROVINSI || feature.properties.provinsi || feature.properties.NAME_1 || "";
    const p = provMap.get(provName.toUpperCase().trim());

    if (p) {
      const pName = p.provinsi || (p as any).Provinsi || provName;
      const clusterId = Number(p.klaster);
      const clusterName = p.nama_klaster || CLUSTERS[clusterId]?.name || `Klaster ${clusterId}`;
      const clusterColor = CLUSTERS[clusterId]?.color || "#e2e8f0";
      const hp = Number(p.hp_seluler_2024 || 0).toFixed(1);
      const ipm = Number(p.ipm_2024 || 0).toFixed(1);
      const kat = p.kategori_kerentanan || (p as any).kategori || "Sedang";
      const rank = p.peringkat || (p as any).rank || "-";

      layer.bindTooltip(
        `
        <div class="p-1.5 text-xs font-sans">
          <strong class="text-sm font-bold text-white block mb-1">${pName}</strong>
          <div class="text-slate-300">Klaster: <span class="font-bold" style="color:${clusterColor}">${clusterName}</span></div>
          <div class="text-slate-300">Penetrasi Ponsel: <strong class="text-white">${hp}%</strong></div>
          <div class="text-slate-300">IPM 2024: <strong class="text-white">${ipm}</strong></div>
          <div class="text-slate-300">Kerentanan: <strong class="text-orange-400">${kat}</strong> (Rank #${rank})</div>
        </div>
        `,
        { sticky: true, className: "leaflet-custom-tooltip" }
      );
    }

    layer.on({
      click: () => {
        if (p && onSelectProvince) {
          onSelectProvince(p);
        }
      },
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          fillOpacity: 0.95,
          weight: 2,
          color: "#ffffff",
        });
      },
      mouseout: (e) => {
        const target = e.target;
        target.setStyle(styleFeature(feature));
      },
    });
  }

  return (
    <div className="h-[520px] w-full rounded-2xl overflow-hidden border border-white/10 relative">
      <MapContainer
        center={[-1.5, 118.0]}
        zoom={5}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {geoData && (
          <GeoJSON
            key={activeLayer + (selectedProvince ? (selectedProvince.provinsi || (selectedProvince as any).Provinsi) : "")}
            data={geoData}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}
