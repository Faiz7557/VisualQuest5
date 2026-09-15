"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { ProvinceData } from "@/types/data";
import { CLUSTERS } from "@/lib/constants";
import L from "leaflet";

interface Props {
  provinces: ProvinceData[];
  activeLayer: "klaster" | "kerentanan" | "ponsel" | "lisa";
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
    provMap.set(p.provinsi.toUpperCase().trim(), p);
  });

  function getFeatureColor(provName: string): string {
    const cleanName = provName.toUpperCase().trim();
    const p = provMap.get(cleanName);
    if (!p) return "#475569";

    if (activeLayer === "klaster") {
      return CLUSTERS[p.klaster]?.color || "#64748b";
    }

    if (activeLayer === "kerentanan") {
      switch (p.kategori_kerentanan) {
        case "Sangat Tinggi": return "#ef4444";
        case "Tinggi": return "#f97316";
        case "Sedang": return "#eab308";
        case "Rendah": return "#10b981";
        default: return "#64748b";
      }
    }

    if (activeLayer === "lisa") {
      switch (p.kategori_lisa) {
        case "High-High": return "#ef4444"; // Hotspot
        case "Low-Low": return "#3b82f6"; // Coldspot
        case "Low-High": return "#a855f7"; // Outlier
        default: return "#334155"; // Not significant
      }
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
    const provName = feature.properties.PROVINSI || feature.properties.NAME_1 || "";
    const isSelected = selectedProvince?.provinsi.toUpperCase() === provName.toUpperCase();

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
    const provName = feature.properties.PROVINSI || feature.properties.NAME_1 || "";
    const p = provMap.get(provName.toUpperCase().trim());

    if (p) {
      layer.bindTooltip(
        `
        <div class="p-1 text-xs">
          <strong class="text-sm font-bold text-white block mb-1">${p.provinsi}</strong>
          <div>Klaster: <span class="font-semibold" style="color:${CLUSTERS[p.klaster]?.color}">${p.nama_klaster}</span></div>
          <div>Kepemilikan Ponsel: <strong>${p.hp_seluler_2024.toFixed(1)}%</strong></div>
          <div>IPM 2024: <strong>${p.ipm_2024.toFixed(1)}</strong></div>
          <div>Kerentanan: <strong>${p.kategori_kerentanan}</strong> (Rank #${p.peringkat})</div>
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
            key={activeLayer + (selectedProvince ? selectedProvince.provinsi : "")}
            data={geoData}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}
