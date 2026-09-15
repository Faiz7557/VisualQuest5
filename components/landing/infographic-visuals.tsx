"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Clock, Users, ShieldAlert, HeartHandshake, Compass } from "lucide-react";

export function InfographicVisuals() {
  // 1. Data Donut Jurang Akses Layanan Jiwa
  const donutData = [
    { name: "Remaja Mengalami Masalah Emosional", value: 34.9, color: "#f97316" },
    { name: "Remaja Tanpa Keluhan Signifikan", value: 65.1, color: "#1e293b" },
  ];

  const accessData = [
    { name: "Akses Konseling Profesional", value: 2.6, color: "#ef4444" },
    { name: "Tidak Mengakses Bantuan Formal", value: 97.4, color: "#1e293b" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Jurang Akses Donut */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Jurang Akses Layanan Jiwa
            </span>
            <span className="text-[10px] text-slate-400">I-NAMHS 2022</span>
          </div>

          <div className="grid grid-cols-2 gap-2 items-center py-2">
            <div className="h-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={48}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm font-black text-orange-400">34,9%</span>
                <span className="text-[9px] text-slate-400">Terdampak</span>
              </div>
            </div>

            <div className="h-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accessData}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={48}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {accessData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm font-black text-rose-500">2,6%</span>
                <span className="text-[9px] text-slate-400">Konseling</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Dari <strong>1 dari 3 remaja</strong> (~15,5 juta jiwa) dengan masalah emosional, <strong>hanya 2,6%</strong> yang pernah mendapatkan pendampingan psikologis profesional.
          </p>
        </div>

        {/* Card 2: Jam Rawan Dini Hari 22.00 - 02.00 */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Puncak Curhat Anonim (Jam Rawan)
            </span>
            <span className="text-[10px] text-slate-400">Media Sosial</span>
          </div>

          {/* Clock Dial Visualization */}
          <div className="py-2 flex items-center justify-center">
            <div className="relative h-32 w-32 rounded-full border-2 border-slate-700 flex items-center justify-center bg-black/40 shadow-inner">
              {/* 22:00 - 02:00 highlighted sector */}
              <div className="absolute inset-1 rounded-full border-4 border-amber-500/80 border-t-amber-500 border-l-amber-500/30 border-b-transparent border-r-transparent animate-pulse" />
              <div className="text-center space-y-0.5 z-10">
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-widest">Puncak</span>
                <span className="text-base font-black text-white font-heading">22.00–02.00</span>
                <span className="text-[9px] text-slate-400 block">Dini Hari</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>74% remaja</strong> memilih kanal digital anonim untuk meluapkan distress. Lonjakan ekspresi depresi dan kecemasan terakumulasi tengah malam saat layanan puskesmas tutup.
          </p>
        </div>

        {/* Card 3: Waffle Ketimpangan Psikiater */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <HeartHandshake className="h-3.5 w-3.5" />
              Rasio Tenaga Psikiater
            </span>
            <span className="text-[10px] text-slate-400">vs WHO</span>
          </div>

          {/* Waffle / Pictogram representation */}
          <div className="py-2 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Indonesia Saat Ini:</span>
              <strong className="text-rose-400 text-sm">0,43 / 100k</strong>
            </div>
            {/* 10-block mini waffle */}
            <div className="grid grid-cols-10 gap-1.5">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`h-4 rounded-sm ${
                    i < 2 ? "bg-rose-500 shadow-glow" : i < 6 ? "bg-slate-700" : "bg-slate-800"
                  }`}
                  title={i < 2 ? "0.43 Psikiater per 100.000 Penduduk" : "Defisit Layanan"}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Standar Ideal WHO:</span>
              <strong className="text-emerald-400">1 – 3 / 100k</strong>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Lebih dari <strong>65% psikiater menumpuk di Jawa</strong>, dan <strong>&lt;25% Puskesmas</strong> memiliki fasilitas rawat jiwa dasar. KTI mengalami kelangkaan dokter spesialis jiwa.
          </p>
        </div>
      </div>
    </div>
  );
}
