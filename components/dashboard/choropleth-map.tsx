"use client";

import dynamic from "next/dynamic";
import { ProvinceData } from "@/types/data";

const LeafletMapInner = dynamic(() => import("./leaflet-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] sm:h-[460px] lg:h-[520px] w-full rounded-2xl border border-white/10 bg-[#0a1424] flex flex-col items-center justify-center space-y-3">
      <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      <p className="text-xs text-slate-400">Memuat Peta Spasial 38 Provinsi...</p>
    </div>
  ),
});

interface Props {
  provinces: ProvinceData[];
  activeLayer: "klaster" | "kerentanan" | "ponsel" | "lisa" | "gwr_ipm";
  onSelectProvince?: (p: ProvinceData | null) => void;
  selectedProvince?: ProvinceData | null;
}

export function ChoroplethMap(props: Props) {
  return <LeafletMapInner {...props} />;
}
