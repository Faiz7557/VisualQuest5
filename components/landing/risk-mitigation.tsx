"use client";

import { ShieldCheck, WifiOff, AlertTriangle, Cloud, Lock } from "lucide-react";

export function RiskMitigation() {
  const risks = [
    {
      title: "Blank Spot 3T & Kesenjangan Sinyal",
      risk: "Di wilayah Tertinggal Ekstrem (Klaster 1 Papua), ketiadaan sinyal internet melumpuhkan aplikasi web.",
      solution: "Infrastruktur hybrid SMS Gateway & protokol USSD dialer (*119#) bekerja pada jaringan seluler 2G dasar.",
      icon: WifiOff,
      color: "border-rose-500/30 text-rose-400",
    },
    {
      title: "Risiko False Negatives AI",
      risk: "Penelepon dalam bahaya bunuh diri akut tidak terdeteksi karena kata-kata terselubung.",
      solution: "Default bias ke kewaspadaan tinggi (fail-safe protocol), integrasi tombol darurat manusia 1-klik, dan audit klinis rutin.",
      icon: AlertTriangle,
      color: "border-amber-500/30 text-amber-400",
    },
    {
      title: "Lonjakan Beban Panggilan Serentak",
      risk: "Beban panggilan di jam rawan malam hari melumpuhkan server hotline.",
      solution: "Arsitektur serverless autoscaling edge computing dan penjadwalan piket relawan berbasis proyeksi SARIMAX.",
      icon: Cloud,
      color: "border-blue-500/30 text-blue-400",
    },
    {
      title: "Kerahasiaan Data & Stigma Remaja",
      risk: "Remaja takut identitas dan rekam medis curhat mereka bocor ke sekolah atau keluarga.",
      solution: "Enkripsi end-to-end tanpa penyimpanan nomor identitas (zero-PII logging) menjamin privasi 100% anonim.",
      icon: Lock,
      color: "border-emerald-500/30 text-emerald-400",
    },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
            Matriks Strategi Mitigasi 4 Risiko Utama
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Kerangka kehati-hatian klinis dan operasional diadopsi dari Bagian 10 Infografis IRIS.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl self-start sm:self-center">
          <ShieldCheck className="h-4 w-4" />
          <span>Prinsip Keamanan Berlapis</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {risks.map((r, idx) => {
          const Icon = r.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border bg-white/5 ${r.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-white font-heading">
                  {r.title}
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-slate-400">
                  <strong className="text-slate-300">Potensi Risiko: </strong>
                  {r.risk}
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                  <strong className="text-orange-400">Mitigasi SEJIWA+: </strong>
                  {r.solution}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
