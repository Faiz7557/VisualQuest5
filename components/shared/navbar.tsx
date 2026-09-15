"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HeartHandshake, 
  MapPin, 
  TrendingUp, 
  Bot, 
  Activity, 
  Info,
  Menu,
  X,
  ExternalLink
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Beranda", href: "/" },
    { label: "Spasial & Klaster", href: "/dashboard/clustering", icon: MapPin },
    { label: "Proyeksi 2026", href: "/dashboard/forecasting", icon: TrendingUp },
    { label: "Simulasi SEJIWA+", href: "/sejiwa", icon: Bot },
    { label: "Dasbor Kemenkes", href: "/sejiwa/monitoring", icon: Activity },
    { label: "Tentang Riset", href: "/tentang", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070d18]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-glow transition-transform group-hover:scale-105">
            <HeartHandshake className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                SEJIWA<span className="text-orange-500">+</span>
              </span>
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                Visual Quest 5.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Tim IRIS • Universitas Airlangga</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white/10 text-orange-400 shadow-sm border border-white/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon && <item.icon className="h-3.5 w-3.5" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status indicator & CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Hotline 119 ext 8 AI</span>
          </div>
          <Link
            href="/sejiwa"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-glow hover:opacity-95 transition-opacity"
          >
            <span>Uji Coba Triase</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#0a1424] px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
