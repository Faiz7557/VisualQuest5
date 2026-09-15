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

    if (p) {
      const pName = p.provinsi || (p as any).Provinsi || provName;
      const clusterId = Number(p.klaster);
      const clusterInfo = CLUSTERS[clusterId];
      const clusterColor = clusterInfo?.color || "#38bdf8";
      const clusterName = p.nama_klaster || clusterInfo?.name || `Klaster ${clusterId}`;
      const hp = Number(p.hp_seluler_2024 || 0).toFixed(1);
      const ipm = Number(p.ipm_2024 || 0).toFixed(1);
      const rank = p.peringkat || (p as any).rank || "-";
      const ikad = Number(p.skor_kerentanan || (p as any).indeks_kerentanan || 0).toFixed(3);
      const lisa = p.kategori_lisa || (p as any).lisa_q || (p as any).lisa || "Tidak Signifikan";

      // Rich Modern Glassmorphism Tooltip Card
      layer.bindTooltip(
        `
        <div style="background: rgba(11, 20, 38, 0.96); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 14px; padding: 14px; box-shadow: 0 15px 30px rgba(0,0,0,0.6); min-width: 250px; font-family: sans-serif; color: #f1f5f9;">
          <!-- Header -->
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
            <div>
              <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8;">Wilayah Spasial • #${rank}</div>
              <div style="font-size: 15px; font-weight: 800; color: #ffffff; margin-top: 1px;">${pName}</div>
            </div>
            <span style="font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; background: ${clusterColor}20; color: ${clusterColor}; border: 1px solid ${clusterColor}45; white-space: nowrap;">
              ${clusterName}
            </span>
          </div>

          <!-- Stats Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; margin-bottom: 10px;">
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 6px 8px;">
              <span style="color: #94a3b8; font-size: 10px; display: block;">Ponsel (2024)</span>
              <strong style="color: #38bdf8; font-size: 13px;">${hp}%</strong>
            </div>
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 6px 8px;">
              <span style="color: #94a3b8; font-size: 10px; display: block;">IPM 2024</span>
              <strong style="color: #10b981; font-size: 13px;">${ipm}</strong>
            </div>
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 6px 8px;">
              <span style="color: #94a3b8; font-size: 10px; display: block;">Skor IKAD</span>
              <strong style="color: #f97316; font-size: 13px;">${ikad}</strong>
            </div>
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 6px 8px;">
              <span style="color: #94a3b8; font-size: 10px; display: block;">Pola LISA</span>
              <strong style="color: #e2e8f0; font-size: 11px;">${lisa}</strong>
            </div>
          </div>

          <!-- Footer Connectivity Cue -->
          <div style="font-size: 10px; color: #38bdf8; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 6px; display: flex; align-items: center; justify-content: space-between;">
            <span>✦ Terhubung spasial k=4 tetangga</span>
            <span style="color: #64748b; font-size: 9px;">Klik poligon</span>
          </div>
        </div>
        `,
        { sticky: true, opacity: 1, className: "leaflet-rich-card-tooltip" }
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
    <div className="h-[520px] w-full rounded-2xl overflow-hidden border border-white/10 relative">
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

      {/* Floating Spatial Connectivity Badge Indicator */}
      {hoveredProvince && spatialConnections.length > 0 && (
        <div className="absolute top-4 right-4 z-[400] glass-card rounded-xl px-4 py-2 border border-sky-400/40 text-xs shadow-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-ping" />
            <span className="text-white font-bold">
              {hoveredProvince.provinsi || (hoveredProvince as any).Provinsi}
            </span>
          </div>
          <span className="text-slate-400">↔</span>
          <div className="text-[11px] text-sky-300">
            Jejaring Spasial k=4:{" "}
            <span className="font-semibold text-white">
              {spatialConnections.map((c) => c.name).join(", ")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
