"use client";

import Link from "next/link";
import { 
  HeartHandshake, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  Bot, 
  ShieldAlert, 
  Layers, 
  Zap,
  Globe2,
  ChevronRight,
  BarChart3,
  Cpu
} from "lucide-react";
import { motion } from "motion/react";
import { InfographicVisuals } from "@/components/landing/infographic-visuals";
import { WorkflowDiagram } from "@/components/landing/workflow-diagram";
import { RiskMitigation } from "@/components/landing/risk-mitigation";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-[#070d18] via-[#0b162a] to-[#070d18] border-b border-white/5">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[250px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center space-y-8">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400 backdrop-blur-md shadow-glow"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Karya Visual Quest 5.0 • Tim IRIS Universitas Airlangga</span>
          </motion.div>

          {/* Heading */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight font-heading">
              Mendengar yang <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                Tak Terucap
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
              Bagaimana Statistika Memetakan Ketimpangan Spasial dan Mengakselerasi Respons Layanan Jiwa Remaja Indonesia
            </p>
          </motion.div>

          {/* Lead Quote from Infographic */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-3xl rounded-2xl glass-card p-4 sm:p-6 border border-white/10 text-slate-300 italic text-xs sm:text-sm"
          >
            "Jutaan remaja Indonesia berjuang di tengah krisis kesehatan mental, namun jeritan emosional (*inner voice*) mereka seakan tenggelam di tengah <span className="text-orange-400 font-semibold not-italic">Silent Epidemic</span>. Kenapa begitu?"
          </motion.div>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/sejiwa"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-glow hover:scale-105 transition-all"
            >
              <Bot className="h-4 w-4" />
              <span>Coba Simulasi SEJIWA+</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/dashboard/clustering"
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-6 py-3.5 text-sm font-semibold text-slate-200 border border-white/10 transition-all hover:border-white/20"
            >
              <MapPin className="h-4 w-4 text-blue-400" />
              <span>Eksplorasi Peta Spasial</span>
            </Link>

            <Link
              href="/dashboard/forecasting"
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-6 py-3.5 text-sm font-semibold text-slate-200 border border-white/10 transition-all hover:border-white/20"
            >
              <TrendingUp className="h-4 w-4 text-amber-400" />
              <span>Lihat Proyeksi 2026</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. BABAK I: THE SILENT EPIDEMIC (DENGAN VISUAL INFOGRAFIS KAYA) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Babak I: Potret Kerentanan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white">
            "The Silent Epidemic" & Fenomena Inner Voice
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Data survei nasional I-NAMHS mengungkap ironi kesenjangan antara prevalensi krisis dan minimnya akses bantuan formal di Indonesia.
          </p>
        </div>

        {/* 3 Visual Cards: Donut, 24h Clock, Waffle Ratio */}
        <InfographicVisuals />
      </section>

      {/* 3. BABAK II: METODOLOGI STATISTIKA GANDA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#091222] border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Layers className="h-3.5 w-3.5" />
              <span>Babak II: Dua Pilar Pembahasan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white">
              Menjawab "Di Mana" dan "Seberapa Cepat" Krisis Tumbuh
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              Kombinasi analisis spasial 38 provinsi dan peramalan deret waktu 72 bulan membuktikan bahwa kebutuhan melompat melampaui daya tampung sistem.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pilar 1: Spasial & Klaster */}
            <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-6 relative overflow-hidden group">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-heading">Ward Clustering & GWR</h3>
                  <p className="text-xs text-slate-400">Analisis Kesenjangan Spasial 38 Provinsi (BPS 2024)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                <div className="bg-black/30 rounded-xl p-3 border border-white/5 text-center">
                  <div className="text-2xl font-extrabold text-emerald-400">0,957</div>
                  <div className="text-[11px] text-slate-400">Pseudo R² (GWR)</div>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-white/5 text-center">
                  <div className="text-2xl font-extrabold text-emerald-400">0,530</div>
                  <div className="text-[11px] text-slate-400">Silhouette Score</div>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-white/5 text-center">
                  <div className="text-2xl font-extrabold text-emerald-400">0,450</div>
                  <div className="text-[11px] text-slate-400">Moran's I (p=0.001)</div>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-white/5 text-center">
                  <div className="text-2xl font-extrabold text-emerald-400">208,0</div>
                  <div className="text-[11px] text-slate-400">AICc Optimal</div>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Peta kesenjangan digital nyaris <strong>menjiplak peta kesenjangan psikiater</strong>. Wilayah barat terhubung dan memiliki psikiater melimpah, sedangkan gugus Papua (Papua Tengah & Pegunungan) tertinggal ekstrem ganda (ponsel hanya 15–32%).
              </p>

              <div className="pt-2">
                <Link
                  href="/dashboard/clustering"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Buka Peta Interaktif 38 Provinsi</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Pilar 2: Forecasting */}
            <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-6 relative overflow-hidden group">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-heading">SARIMAX & Walk-Forward CV</h3>
                  <p className="text-xs text-slate-400">Proyeksi Kebutuhan Layanan 24 Bulan (2025–2026)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                <div className="bg-black/30 rounded-xl p-3 border border-white/5 text-center">
                  <div className="text-2xl font-extrabold text-orange-400">+79,4%</div>
                  <div className="text-[11px] text-slate-400">Volume Konsultasi</div>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-white/5 text-center">
                  <div className="text-2xl font-extrabold text-orange-400">+70,7%</div>
                  <div className="text-[11px] text-slate-400">Panggilan Darurat</div>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-white/5 text-center">
                  <div className="text-2xl font-extrabold text-orange-400">3,39%</div>
                  <div className="text-[11px] text-slate-400">MAPE (h=3)</div>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-white/5 text-center">
                  <div className="text-2xl font-extrabold text-orange-400">86.892</div>
                  <div className="text-[11px] text-slate-400">Kasus/Bln Des 2026</div>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Kurva kebutuhan layanan kesehatan mental melompat hampir <strong>dua kali lipat hanya dalam tempo dua tahun</strong>. Jika dibiarkan tanpa akselerasi AI, kapasitas psikiater dan konselor manusia akan mengalami kejenuhan sistem (*burnout saturation*).
              </p>

              <div className="pt-2">
                <Link
                  href="/dashboard/forecasting"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <span>Buka Fanchart & Hasil CV</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BABAK III: SOLUSI SEJIWA+ (WORKFLOW & MITIGASI RISIKO) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
        {/* Workflow Diagram Component */}
        <WorkflowDiagram />

        {/* Risk Mitigation Component */}
        <RiskMitigation />

        {/* Live Demo Banner Card */}
        <div className="rounded-3xl bg-gradient-to-r from-orange-600/30 via-navy-800 to-blue-900/30 border border-orange-500/30 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-glow">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Simulasi Triase Interaktif</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Coba Langsung Mesin Triase SEJIWA+
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Ketikkan curahan hati atau keluhan psikologis, dan saksikan bagaimana sistem mengevaluasi skor urgensi, mengelompokkan risiko secara real-time, dan mengaktifkan protokol pendampingan.
            </p>
          </div>
          <Link
            href="/sejiwa"
            className="flex items-center gap-3 rounded-2xl bg-orange-500 hover:bg-orange-600 px-8 py-4 text-base font-bold text-white shadow-glow transition-all hover:scale-105 shrink-0"
          >
            <span>Buka Chat Triase</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
