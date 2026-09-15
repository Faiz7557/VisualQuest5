import Link from "next/link";
import { ShieldCheck, Database } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#060b14] text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/iris-logo.png"
                alt="Logo Tim IRIS"
                className="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
              />
              <span className="font-heading font-bold text-white text-base tracking-tight">
                SEJIWA<span className="text-orange-500">+</span>
              </span>
            </div>
            <p className="max-w-md text-slate-400 leading-relaxed">
              Prototipe web interaktif pendamping infografis statistik 
              <span className="text-slate-200 font-medium"> "Mendengar yang Tak Terucap"</span>. 
              Mengintegrasikan ekonometrika spasial (GWR), Ward Hierarchical Clustering, 
              SARIMAX Forecasting, dan simulasi triase NLP hotline krisis kesehatan mental remaja.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2">
              <span>Mendukung SDG 3 (Kesehatan Baik) & SDG 10 (Pengurangan Ketimpangan)</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Modul Analisis</h4>
            <ul className="space-y-1.5">
              <li><Link href="/dashboard/clustering" className="hover:text-orange-400">Peta Klaster & GWR (38 Prov)</Link></li>
              <li><Link href="/dashboard/forecasting" className="hover:text-orange-400">Proyeksi 24 Bulan & CV</Link></li>
              <li><Link href="/sejiwa" className="hover:text-orange-400">Demo Triase NLP Real-Time</Link></li>
              <li><Link href="/sejiwa/monitoring" className="hover:text-orange-400">Dasbor Prediktif Kemenkes</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Kredensial Pengembang</h4>
            <p className="text-slate-400">Tim: <strong className="text-slate-200 font-medium">IRIS</strong></p>
            <p className="text-slate-400">Institusi: <strong className="text-slate-200 font-medium">Universitas Airlangga</strong></p>
            <p className="text-slate-400">Kemenkes RI Hotline: <strong className="text-orange-400">119 ext 8</strong></p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 Tim IRIS Universitas Airlangga. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Database className="h-3 w-3 text-blue-400" /> Sumber Data: BPS 2024 & I-NAMHS
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" /> Simulasi Triase Aman
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
