"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Keyboard, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Command, 
  Sparkles, 
  Home, 
  MapPin, 
  TrendingUp, 
  Bot, 
  Activity, 
  Info,
  Tv
} from "lucide-react";

interface PresentationSlide {
  path: string;
  step: number;
  title: string;
  subtitle: string;
  keyHint: string;
  icon: any;
  color: string;
}

const SLIDES: PresentationSlide[] = [
  {
    path: "/",
    step: 1,
    title: "The Silent Epidemic",
    subtitle: "Pendahuluan & Potret Kesenjangan Layanan Jiwa",
    keyHint: "1",
    icon: Home,
    color: "#f97316",
  },
  {
    path: "/dashboard/clustering",
    step: 2,
    title: "Peta Spasial & 4 Klaster",
    subtitle: "Kesenjangan Regional BPS 38 Provinsi & Model GWR",
    keyHint: "2",
    icon: MapPin,
    color: "#10b981",
  },
  {
    path: "/dashboard/forecasting",
    step: 3,
    title: "Proyeksi Kebutuhan 2026",
    subtitle: "Peramalan Deret Waktu SARIMAX & Deteksi Kebocoran Data",
    keyHint: "3",
    icon: TrendingUp,
    color: "#38bdf8",
  },
  {
    path: "/sejiwa",
    step: 4,
    title: "Simulasi Triase SEJIWA+",
    subtitle: "Mesin NLP Cerdas Hotline 119 & Gateway USSD 3T",
    keyHint: "4",
    icon: Bot,
    color: "#f59e0b",
  },
  {
    path: "/sejiwa/monitoring",
    step: 5,
    title: "Dasbor Prediktif Kemenkes",
    subtitle: "Monitoring Kapasitas, Beban Faskes, & Sinergi HIMPSI",
    keyHint: "5",
    icon: Activity,
    color: "#a855f7",
  },
  {
    path: "/tentang",
    step: 6,
    title: "Metodologi & Analisis SWOT",
    subtitle: "Integritas Statistika, Uji Ketahanan, & Tim IRIS UNAIR",
    keyHint: "6",
    icon: Info,
    color: "#64748b",
  },
];

export function PresentationShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hudVisible, setHudVisible] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const currentSlideIndex = SLIDES.findIndex((s) => s.path === pathname);
  const currentSlide = currentSlideIndex !== -1 ? SLIDES[currentSlideIndex] : SLIDES[0];

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 2200);
  }, []);

  const navigateToSlide = useCallback(
    (index: number) => {
      const target = SLIDES[index];
      if (target && target.path !== pathname) {
        showToast(`Slide ${target.step}/6: ${target.title}`);
        router.push(target.path);
        setIsOpen(false);
      }
    },
    [pathname, router, showToast]
  );

  const nextSlide = useCallback(() => {
    const nextIdx = currentSlideIndex < SLIDES.length - 1 ? currentSlideIndex + 1 : 0;
    navigateToSlide(nextIdx);
  }, [currentSlideIndex, navigateToSlide]);

  const prevSlide = useCallback(() => {
    const prevIdx = currentSlideIndex > 0 ? currentSlideIndex - 1 : SLIDES.length - 1;
    navigateToSlide(prevIdx);
  }, [currentSlideIndex, navigateToSlide]);

  // Global Keyboard Listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is currently typing in an input, textarea, or contentEditable element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Check for modifier keys
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (e.key === "?" || e.key === "/") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }

      // Toggle HUD visibility with 'p' or 'P'
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setHudVisible((prev) => !prev);
        showToast(!hudVisible ? "HUD Presentasi Ditampilkan" : "HUD Presentasi Disembunyikan");
        return;
      }

      // Number keys 1-6 for quick slide jumps
      if (e.key >= "1" && e.key <= "6") {
        const slideIndex = parseInt(e.key, 10) - 1;
        if (slideIndex >= 0 && slideIndex < SLIDES.length) {
          e.preventDefault();
          navigateToSlide(slideIndex);
        }
        return;
      }

      // Next Slide navigation: ArrowRight, 'j', 'l'
      if (e.key === "ArrowRight" || e.key === "j" || e.key === "J" || e.key === "l" || e.key === "L") {
        e.preventDefault();
        nextSlide();
        return;
      }

      // Previous Slide navigation: ArrowLeft, 'k', 'h'
      if (e.key === "ArrowLeft" || e.key === "h" || e.key === "H") {
        e.preventDefault();
        prevSlide();
        return;
      }
    }

    function handleCustomOpen() {
      setIsOpen(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-presentation-palette", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-presentation-palette", handleCustomOpen);
    };
  }, [currentSlideIndex, hudVisible, navigateToSlide, nextSlide, prevSlide, showToast]);

  return (
    <>
      {/* 1. Quick Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[999] glass-card px-4 py-2 rounded-full border border-orange-500/40 text-xs text-white shadow-glow flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="h-3.5 w-3.5 text-orange-400" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* 2. Floating Presenter HUD Bar (Bottom Right) */}
      {hudVisible && (
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="glass-card rounded-2xl border border-white/10 px-3 py-2 flex items-center gap-3 shadow-2xl backdrop-blur-xl">
            {/* Slide Index Badge */}
            <div className="flex items-center gap-2 text-xs">
              <span 
                className="h-2 w-2 rounded-full animate-pulse" 
                style={{ backgroundColor: currentSlide.color }}
              />
              <span className="text-slate-400 font-mono text-[11px]">
                Tahap {currentSlide.step}/6
              </span>
              <span className="font-bold text-white text-xs hidden sm:inline truncate max-w-[140px]">
                {currentSlide.title}
              </span>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-1 border-l border-white/10 pl-2">
              <button
                onClick={prevSlide}
                title="Sebelumnya (ArrowLeft / H)"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                title="Selanjutnya (ArrowRight / J)"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Launcher Button */}
            <button
              onClick={() => setIsOpen(true)}
              title="Daftar Shortcut & Alur Presentasi (?)"
              className="p-1.5 rounded-lg bg-orange-500/15 text-orange-400 hover:bg-orange-500/25 border border-orange-500/30 transition-all flex items-center gap-1 text-[11px] font-semibold"
            >
              <Keyboard className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Shortcut</span>
              <kbd className="hidden md:inline px-1 py-0.2 bg-black/40 rounded text-[9px] font-mono text-slate-300 border border-white/10">?</kbd>
            </button>
          </div>
        </div>
      )}

      {/* 3. Interactive Presenter Modal & Command Palette */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-2xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Top Glow Accent */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-24 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-glow">
                  <Tv className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                    <span>Navigator Presentasi & Shortcut Keyboard</span>
                    <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                      Pitching Mode
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Gunakan tombol angka atau panah keyboard untuk beralih antar-babak secara instan.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 6 Presentation Chapters (Click to Teleport) */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Alur Narasi Presentasi (Tekan 1-6 untuk Langsung Berpindah):
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SLIDES.map((slide, idx) => {
                  const Icon = slide.icon;
                  const isActive = pathname === slide.path;
                  return (
                    <div
                      key={slide.path}
                      onClick={() => navigateToSlide(idx)}
                      className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                        isActive
                          ? "bg-orange-500/15 border-orange-500 shadow-glow"
                          : "bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-xl border"
                          style={{
                            backgroundColor: `${slide.color}20`,
                            borderColor: `${slide.color}40`,
                            color: slide.color,
                          }}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                              {slide.step}. {slide.title}
                            </span>
                            {isActive && (
                              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-ping" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1">
                            {slide.subtitle}
                          </p>
                        </div>
                      </div>

                      <kbd className="h-6 w-6 rounded-lg bg-black/50 border border-white/15 flex items-center justify-center text-xs font-mono font-bold text-slate-300 shrink-0">
                        {slide.keyHint}
                      </kbd>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Keyboard Legend Grid */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Command className="h-3.5 w-3.5 text-orange-400" />
                <span>Kombinasi Tombol Pintas:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-slate-300">Slide Berikutnya</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-black/60 font-mono text-orange-400 font-bold border border-white/10">▶ / J / L</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-slate-300">Slide Sebelumnya</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-black/60 font-mono text-orange-400 font-bold border border-white/10">◀ / H</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-slate-300">Buka Menu Navigator</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-black/60 font-mono text-orange-400 font-bold border border-white/10">? / Ctrl+K</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-slate-300">Lompat Babak 1–6</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-black/60 font-mono text-orange-400 font-bold border border-white/10">1 – 6</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-slate-300">Toggle Bar HUD</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-black/60 font-mono text-orange-400 font-bold border border-white/10">P</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-slate-300">Tutup Modal</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-black/60 font-mono text-orange-400 font-bold border border-white/10">Esc</kbd>
                </div>
              </div>
            </div>

            {/* Footer Hint */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>*Shortcut dinonaktifkan otomatis saat mengetik di input chat atau pencarian.</span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 transition-colors"
              >
                Mulai Presentasi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
