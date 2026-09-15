"use client";

import { 
  Activity, 
  Users, 
  PhoneCall, 
  ShieldAlert, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Calendar,
  Layers,
  HeartHandshake
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function MonitoringDashboardPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Activity className="h-3.5 w-3.5" />
            <span>Simulasi Dasbor Operasional Kemenkes RI & HIMPSI</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
            Dasbor Prediktif Kapasitas Layanan Jiwa
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Sinkronisasi model deret waktu SARIMAX dengan sistem triase SEJIWA+ untuk memitigasi lonjakan panggilan, mencegah *burnout* konselor, dan memetakan rujukan wilayah blank spot 3T.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Status Sistem: Optimal (Latency &lt; 0.8s)</span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <span>Total Kebutuhan (Proyeksi 2026)</span>
            <TrendingUp className="h-4 w-4 text-orange-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mb-1 font-heading">
            86.892
          </div>
          <p className="text-xs text-slate-400">
            Kasus per bulan (<span className="text-orange-400 font-semibold">+79,4%</span> vs baseline)
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <span>Panggilan Krisis / Bulan</span>
            <PhoneCall className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 mb-1 font-heading">
            11.466
          </div>
          <p className="text-xs text-slate-400">
            Lapisan darurat paling rentan (<span className="text-rose-400 font-semibold">+70,7%</span>)
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <span>Indeks Burnout Tenaga Jiwa</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mb-1 font-heading">
            86,95
          </div>
          <p className="text-xs text-slate-400">
            Skala 0–100 (<span className="text-amber-400 font-semibold">Zona Beban Kritis</span>)
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <span>Efisiensi Triase AI</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mb-1 font-heading">
            &lt; 1 Menit
          </div>
          <p className="text-xs text-slate-400">
            Waktu klasifikasi awal sebelum dialihkan
          </p>
        </div>
      </div>

      {/* Grid: Case Composition & Stakeholder Synergy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Triage Distribution */}
        <div className="lg:col-span-6 glass-card rounded-2xl p-6 border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-base text-white font-heading">
              Komposisi Kasus Hasil Skrining Triase
            </h3>
            <span className="text-xs text-slate-400">Distribusi Beban</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-2 font-semibold text-rose-400">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  Kasus Kritis (Rujukan Langsung Konselor/Ambulans)
                </span>
                <span className="font-bold text-white">25% (21.723 kasus)</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[25%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-2 font-semibold text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Kasus Sedang (Telekonseling Terjadwal & Pernapasan)
                </span>
                <span className="font-bold text-white">45% (39.101 kasus)</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[45%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-2 font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Kasus Ringan (Chatbot Swabantu & Psikoedukasi)
                </span>
                <span className="font-bold text-white">30% (26.068 kasus)</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[30%]" />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 leading-relaxed">
            <strong>Dampak Efisiensi:</strong> Dengan menyalurkan 30% kasus ringan ke modul swabantu mandiri, kapasitas psikiater dan konselor manusia dapat berfokus 100% pada penanganan kasus darurat dan kritis.
          </div>
        </div>

        {/* Right: Sinergi Stakeholder (Infografis Bagian 8) */}
        <div className="lg:col-span-6 glass-card rounded-2xl p-6 border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-base text-white font-heading">
              Sinergi Ekosistem & Stakeholder
            </h3>
            <span className="text-xs text-slate-400">Model Kolaborasi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-orange-400 font-bold">
                <HeartHandshake className="h-4 w-4" />
                <span>Penyedia SDM & Konselor</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Asosiasi profesi (HIMPSI, PDSKJI) dan relawan mahasiswa psikologi disiagakan dengan jadwal piket berdasarkan prediksi jam rawan malam hari.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <MapPin className="h-4 w-4" />
                <span>Infrastruktur Faskes</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Integrasi data ke 10.000+ Puskesmas dan RS Jiwa daerah untuk rujukan tatap muka bagi remaja berisiko tinggi.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Users className="h-4 w-4" />
                <span>Kader Komunitas & Sekolah</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Guru BK dan teman sebaya di sekolah dilatih literasi triase awal untuk mendeteksi tanda distress dini sebelum menjadi krisis.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Layers className="h-4 w-4" />
                <span>Telko & Operator Seluler</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Penyediaan zero-rating kuota bebas pulsa untuk akses 119 dan gateway SMS/USSD di wilayah 3T tanpa internet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
