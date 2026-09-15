"use client";

import { 
  Info, 
  Database, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  FileText, 
  ExternalLink,
  BookOpen,
  Scale
} from "lucide-react";

export default function TentangPage() {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
          <Award className="h-3.5 w-3.5" />
          <span>Visual Quest 5.0 • Dataquest 2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
          Tentang Karya & Metodologi Riset
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Dokumentasi teknis, sumber data, arsitektur pemodelan statistika, dan kerangka implementasi solusi SEJIWA+.
        </p>
      </div>

      {/* Identitas Karya Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
        <h2 className="text-xl font-bold text-white font-heading">Identitas Karya</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400 block">Tema Utama</span>
            <span className="font-bold text-white text-sm">
              The Anatomy of a Happy Life: Unpacking the Social, Economic, and Health Factors Behind Life Satisfaction
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400 block">Subtema</span>
            <span className="font-bold text-orange-400 text-sm">Social</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400 block">Tim Pengusul</span>
            <span className="font-bold text-white text-sm">IRIS — Universitas Airlangga</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400 block">Target Pembangunan Berkelanjutan</span>
            <span className="font-bold text-emerald-400 text-sm">SDG 3 (Kesehatan Baik) & SDG 10 (Pengurangan Ketimpangan)</span>
          </div>
        </div>
      </div>

      {/* Dua Pilar Metodologi */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white font-heading">Arsitektur Metodologi Statistika</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pilar Spasial */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Layers className="h-4 w-4" />
              <span>Pilar 1: Spasial & Klaster JALA</span>
            </div>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Unit Analisis:</strong> 38 provinsi di Indonesia (termasuk 4 DOB Tanah Papua) bersumber dari BPS 2024.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Optimasi Klastering:</strong> Grid search 161 kombinasi model. Model terpilih <em>RobustScaler + PCA2 + Ward (k=4)</em> dengan Silhouette 0,530.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Uji Stabilitas:</strong> 300 bootstrap resampling (85% subsample) menghasilkan rata-rata ARI = 0,961 ± 0,082 (sangat stabil).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Autokorelasi Spasial:</strong> Global Moran's I = 0,450 (p=0.001) dengan matriks bobot KNN (k=7).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Ekonometrika Spasial:</strong> Geographically Weighted Regression (GWR) terbaik dengan Pseudo R² 0,957 dan AICc 208,027.</span>
              </li>
            </ul>
          </div>

          {/* Pilar Forecasting */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Pilar 2: Forecasting Deret Waktu</span>
            </div>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 mt-0.5 shrink-0" />
                <span><strong>Dataset Historis:</strong> 72 bulan (Januari 2019 – Desember 2024) mencakup 4 indikator kesehatan mental dan makroekonomi.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 mt-0.5 shrink-0" />
                <span><strong>Dekomposisi STL:</strong> Kekuatan tren Ft = 0,998 (deterministik dominan) dan musiman tahunan Fs = 0,311.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 mt-0.5 shrink-0" />
                <span><strong>Integritas Data:</strong> Panggilan krisis dikeluarkan dari eksogen untuk mencegah kebocoran data (*data leakage*, r=0.997).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 mt-0.5 shrink-0" />
                <span><strong>Walk-Forward CV:</strong> 413 fold pengujian out-of-sample. SARIMA terbaik di h=3 (MAPE 3,39%), SARIMAX terbaik di h=12 (MAPE 4,37%).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 mt-0.5 shrink-0" />
                <span><strong>Uji Ketahanan:</strong> 250 evaluasi fold guncangan COVID-19 membuktikan diferensiasi logaritmik d=1 lebih robust dibanding dummy intervensi.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Analisis SWOT Infografis */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
        <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
          <Scale className="h-5 w-5 text-orange-400" />
          <span>Analisis SWOT Solusi SEJIWA+</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* S */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <span className="font-bold text-emerald-400 text-sm block">Strengths (Kekuatan)</span>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>Infrastruktur terpercaya menumpang layanan hotline 119 Kemenkes yang sudah dikenal luas.</li>
              <li>Efisiensi SDM: Triase otomatis melipatgandakan kapasitas psikolog konselor yang terbatas.</li>
              <li>Jalur krisis prioritas: Kasus berisiko tinggi langsung terhubung ke psikiater/ambulans.</li>
            </ul>
          </div>

          {/* W */}
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
            <span className="font-bold text-rose-400 text-sm block">Weaknesses (Kelemahan)</span>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>Kesenjangan digital: Efektivitas menurun di wilayah dengan sinyal minim (Klaster 1 Papua).</li>
              <li>Akurasi bahasa daerah: Model rentan bias intonasi atau dialek lokal non-Indonesia baku.</li>
              <li>Ketergantungan pemeliharaan sistem AI butuh keahlian teknis khusus berkelanjutan.</li>
            </ul>
          </div>

          {/* O */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
            <span className="font-bold text-blue-400 text-sm block">Opportunities (Peluang)</span>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>Momentum kebijakan selaras prioritas nasional kesehatan jiwa remaja pasca-pandemi.</li>
              <li>Sinergi organisasi profesi (HIMPSI, PDSKJI) dan relawan mahasiswa psikologi.</li>
              <li>Data epidemiologi real-time menjadi pionir dasbor prediktif krisis mental nasional.</li>
            </ul>
          </div>

          {/* T */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <span className="font-bold text-amber-400 text-sm block">Threats (Ancaman)</span>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>Blank-spot wilayah 3T berisiko melumpuhkan triase berbasis suara/chat internet.</li>
              <li>Risiko misklasifikasi (*false negatives*) pada kasus darurat tersembunyi.</li>
              <li>Lonjakan volume panggilan melebihi kapasitas infrastruktur cloud server.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
