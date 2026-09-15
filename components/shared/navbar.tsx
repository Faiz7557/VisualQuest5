"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MapPin, 
  TrendingUp, 
  Bot, 
  Activity, 
  Info,
  Menu,
  X
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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070d18]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand with official IRIS Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center transition-transform group-hover:scale-105">
            <img
              src="/images/iris-logo.png"
              alt="Logo Tim IRIS"
              className="h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                SEJIWA<span className="text-orange-500">+</span>
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
                    ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon && <item.icon className="h-3.5 w-3.5" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/sejiwa"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-glow transition-all hover:scale-105"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Coba SEJIWA+</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#091222] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-orange-500/20 text-orange-400 font-semibold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/sejiwa"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 p-2.5 text-xs font-bold text-white shadow-glow"
            >
              <Bot className="h-4 w-4" />
              <span>Coba Simulasi SEJIWA+</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
