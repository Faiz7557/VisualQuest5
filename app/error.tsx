"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-5">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold font-heading text-white">Terjadi Kendala Sistem</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Terjadi kesalahan saat memproses data. Anda dapat mencoba memuat ulang modul ini atau kembali ke beranda.
        </p>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2.5 text-xs font-semibold text-white transition-all shadow-glow"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Muat Ulang</span>
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-xs font-semibold text-slate-200 border border-white/10 transition-all"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}
