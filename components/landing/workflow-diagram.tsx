"use client";

import { Bot, PhoneCall, Zap, HeartHandshake, ArrowRight, ShieldCheck } from "lucide-react";

export function WorkflowDiagram() {
  const steps = [
    {
      num: "01",
      title: "Panggilan / SMS Masuk",
      channel: "Hotline 119 ext 8 & SMS 3T",
      desc: "Remaja mengakses hotline bebas pulsa atau gateway SMS tanpa kuota data internet untuk daerah 3T.",
      icon: PhoneCall,
      color: "#3b82f6",
      bg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    },
    {
      num: "02",
      title: "Triase NLP Cerdas",
      channel: "< 1 Menit Deteksi",
      desc: "Mesin NLP menganalisis pilihan kata emosional, menghitung skor urgensi, dan memetakan tingkat keparahan.",
      icon: Bot,
      color: "#f97316",
      bg: "bg-orange-500/10 border-orange-500/30 text-orange-400",
    },
    {
      num: "03",
      title: "Rujukan Berjenjang",
      channel: "3 Jalur Penanganan",
      desc: "Risiko Kritis dialihkan langsung ke konselor manusia/ambulans, sedang ke telekonseling, ringan ke chatbot swabantu.",
      icon: Zap,
      color: "#eab308",
      bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    },
    {
      num: "04",
      title: "Faskes & Dasbor Kemenkes",
      channel: "Sinergi Multipihak",
      desc: "Integrasi data anonim ke 10.000+ Puskesmas, jadwal piket relawan HIMPSI, dan dasbor prediksi nasional.",
      icon: HeartHandshake,
      color: "#10b981",
      bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Arsitektur Solusi • Bagian 7 Infografis</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">
          Alur Kerja 4 Langkah Sistem SEJIWA+
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Mengintegrasikan kecerdasan buatan untuk mereduksi waktu tunggu krisis dan mengoptimalkan kapasitas tenaga profesional yang terbatas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="relative p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between space-y-4 group hover:border-white/25 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-600 group-hover:text-orange-500/50 transition-colors font-heading">
                  {step.num}
                </span>
                <div className={`p-2.5 rounded-xl border ${step.bg}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {step.channel}
                </span>
                <h4 className="text-base font-bold text-white font-heading">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < 3 && (
                <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 text-slate-600">
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
