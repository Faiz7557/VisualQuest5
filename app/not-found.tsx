import Link from "next/link";
import { HeartHandshake, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="text-7xl font-black text-orange-500/40 font-heading">404</div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold font-heading text-white">Halaman Tidak Ditemukan</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Modul atau halaman yang Anda tuju belum terdaftar di arsitektur SEJIWA+. Silakan kembali ke navigasi utama.
        </p>
      </div>
      <Link
        href="/"
        className="flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-5 py-2.5 text-xs font-semibold text-white transition-all shadow-glow"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Beranda</span>
      </Link>
    </div>
  );
}
