"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, Polyline, CircleMarker } from "react-leaflet";
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
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceData | null>(null);

  useEffect(() => {
    fetch("/data/indonesia_38prov.json")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Gagal memuat GeoJSON:", err));
  }, []);

  // Map dictionary by uppercase province name
  const provMap = useMemo(() => {
    const map = new Map<string, ProvinceData>();
    provinces.forEach((p) => {
      const name = (p.provinsi || (p as any).Provinsi || "").toUpperCase().trim();
      if (name) {
        map.set(name, p);
        if (name === "KEPULAUAN BANGKA BELITUNG") map.set("KEP. BANGKA BELITUNG", p);
        if (name === "DAERAH ISTIMEWA YOGYAKARTA") map.set("DI YOGYAKARTA", p);
        if (name === "DKI JAKARTA") map.set("JAKARTA", p);
      }
    });
    return map;
  }, [provinces]);

  // Calculate k=4 nearest spatial neighbors for dashed connectivity lines
  const spatialConnections = useMemo(() => {
    if (!hoveredProvince || typeof hoveredProvince.lat !== "number" || typeof hoveredProvince.lon !== "number") {
      return [];
    }
    const hLat = hoveredProvince.lat;
    const hLon = hoveredProvince.lon;
    const origin: [number, number] = [hLat, hLon];
    const hoveredName = hoveredProvince.provinsi || (hoveredProvince as any).Provinsi;

    const others = provinces.filter(
      (p): p is ProvinceData & { lat: number; lon: number } =>
        (p.provinsi || (p as any).Provinsi) !== hoveredName &&
        typeof p.lat === "number" &&
        typeof p.lon === "number"
    );

    others.sort((a, b) => {
      const distA = Math.hypot(a.lat - hLat, a.lon - hLon);
      const distB = Math.hypot(b.lat - hLat, b.lon - hLon);
      return distA - distB;
    });

    const nearestNeighbors = others.slice(0, 4);
    return nearestNeighbors.map((n) => ({
      name: n.provinsi || (n as any).Provinsi,
      clusterColor: CLUSTERS[Number(n.klaster)]?.color || "#38bdf8",
      targetCoords: [n.lat, n.lon] as [number, number],
      linePositions: [origin, [n.lat, n.lon] as [number, number]],
    }));
  }, [hoveredProvince, provinces]);

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
      if (katLisa.includes("High-High")) return "#ef4444";
      if (katLisa.includes("Low-Low")) return "#3b82f6";
      if (katLisa.includes("Low-High")) return "#a855f7";
      return "#334155";
    }

    if (activeLayer === "gwr_ipm") {
      const gwrIpm = (p as any).gwr_ipm_2024 || 0;
      if (gwrIpm >= 12.0) return "#ef4444";
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
    const hoveredName = (hoveredProvince?.provinsi || (hoveredProvince as any)?.Provinsi || "").toUpperCase();
    const currentName = provName.toUpperCase().trim();

    const isSelected = selectedName && selectedName === currentName;
    const isHovered = hoveredName && hoveredName === currentName;

    return {
      fillColor: getFeatureColor(provName),
      weight: isSelected ? 3.5 : isHovered ? 2.5 : 1,
      opacity: 1,
      color: isSelected ? "#ffffff" : isHovered ? "#38bdf8" : "rgba(255,255,255,0.22)",
      dashArray: "",
      fillOpacity: isSelected ? 0.95 : isHovered ? 0.92 : 0.78,
    };
  }

  function onEachFeature(feature: any, layer: L.Layer) {
    const provName = feature.properties.PROVINSI || feature.properties.provinsi || feature.properties.NAME_1 || "";
    const p = provMap.get(provName.toUpperCase().trim());

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
          weight: 2.5,
          color: "#38bdf8",
        });
        if (p) {
          setHoveredProvince(p);
        }
      },
      mouseout: (e) => {
        const target = e.target;
        target.setStyle(styleFeature(feature));
        setHoveredProvince(null);
      },
    });
  }

  return (
    <div className="h-[360px] sm:h-[460px] lg:h-[520px] w-full rounded-2xl overflow-hidden border border-white/10 relative">
      <MapContainer
        center={[-1.5, 118.0]}
        zoom={5}
        scrollWheelZoom={false}
        attributionControl={false}
        className="h-full w-full"
      >
        {/* Esri World Dark Gray Canvas */}
        <TileLayer
          attribution='&copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
        />

        {/* Polygons */}
        {geoData && (
          <GeoJSON
            key={activeLayer + (selectedProvince ? (selectedProvince.provinsi || (selectedProvince as any).Provinsi) : "")}
            data={geoData}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Dynamic Spatial Weight Connectivity Lines (Dashed Polyline on Hover) */}
        {spatialConnections.map((conn, idx) => (
          <Polyline
            key={`spatial-line-${idx}-${conn.name}`}
            positions={conn.linePositions}
            pathOptions={{
              color: "#38bdf8",
              weight: 2.5,
              dashArray: "6, 8",
              opacity: 0.9,
              lineCap: "round",
            }}
          />
        ))}

        {/* Target Neighbor Nodes (Pulsing Glow Markers) */}
        {spatialConnections.map((conn, idx) => (
          <CircleMarker
            key={`spatial-node-${idx}-${conn.name}`}
            center={conn.targetCoords}
            radius={5.5}
            pathOptions={{
              color: "#ffffff",
              fillColor: "#0284c7",
              fillOpacity: 1,
              weight: 2,
            }}
          />
        ))}

        {/* Origin Node Indicator */}
        {hoveredProvince && typeof hoveredProvince.lat === "number" && typeof hoveredProvince.lon === "number" && (
          <CircleMarker
            center={[hoveredProvince.lat, hoveredProvince.lon]}
            radius={7}
            pathOptions={{
              color: "#ffffff",
              fillColor: "#f97316",
              fillOpacity: 1,
              weight: 2.5,
            }}
          />
        )}
      </MapContainer>

      {/* Floating Hover Card HUD - Pinned to corner so it NEVER blocks the hovered province or dashed lines */}
      {hoveredProvince && (
        <div
          className={`absolute z-[400] glass-card rounded-2xl p-3.5 sm:p-4 border border-white/20 shadow-2xl animate-in fade-in duration-200 pointer-events-none w-[calc(100%-24px)] sm:w-[310px] ${
            (hoveredProvince.lon || 0) > 130
              ? "bottom-3 left-3 sm:bottom-auto sm:top-3 sm:left-14 sm:right-auto"
              : "bottom-3 left-3 sm:bottom-auto sm:top-3 sm:right-3 sm:left-auto"
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-2 mb-2.5 border-b border-white/10">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                Wilayah Spasial • #{hoveredProvince.peringkat || (hoveredProvince as any).rank || "-"}
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-white font-heading leading-tight mt-0.5">
                {hoveredProvince.provinsi || (hoveredProvince as any).Provinsi}
              </h4>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 whitespace-nowrap"
              style={{
                color: CLUSTERS[Number(hoveredProvince.klaster)]?.color || "#38bdf8",
                borderColor: `${CLUSTERS[Number(hoveredProvince.klaster)]?.color || "#38bdf8"}45`,
                backgroundColor: `${CLUSTERS[Number(hoveredProvince.klaster)]?.color || "#38bdf8"}20`,
              }}
            >
              {CLUSTERS[Number(hoveredProvince.klaster)]?.name || `Klaster ${hoveredProvince.klaster}`}
            </span>
          </div>

          {/* 4 Stat Boxes Grid */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs mb-2.5">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Ponsel (2024)</span>
              <strong className="text-sky-300 font-bold text-xs sm:text-sm">
                {Number(hoveredProvince.hp_seluler_2024 || 0).toFixed(1)}%
              </strong>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 block">IPM 2024</span>
              <strong className="text-emerald-400 font-bold text-xs sm:text-sm">
                {Number(hoveredProvince.ipm_2024 || 0).toFixed(1)}
              </strong>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Skor IKAD</span>
              <strong className="text-orange-400 font-bold text-xs sm:text-sm">
                {Number(hoveredProvince.skor_kerentanan || (hoveredProvince as any).indeks_kerentanan || 0).toFixed(3)}
              </strong>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Pola LISA</span>
              <strong className="text-slate-200 font-bold text-[11px] sm:text-xs truncate block">
                {hoveredProvince.kategori_lisa || (hoveredProvince as any).lisa_q || (hoveredProvince as any).lisa || "Tidak Signifikan"}
              </strong>
            </div>
          </div>

          {/* Connected Neighbors (k=4) */}
          {spatialConnections.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-white/10 text-[11px]">
              <div className="flex items-center gap-1.5 text-sky-400 font-semibold text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping" />
                <span>Jejaring Spasial k=4 Terhubung:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {spatialConnections.map((c, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-[10px] font-medium text-sky-200"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer Cue */}
          <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
            <span>✦ Visualisasi Spasial k=4</span>
            <span className="text-orange-400/80">Klik poligon untuk audit</span>
          </div>
        </div>
      )}
    </div>
  );
}
