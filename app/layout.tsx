import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PresentationShortcuts } from "@/components/shared/presentation-shortcuts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SEJIWA+ | Mendengar yang Tak Terucap - Visual Quest 5.0",
  description: "Prototipe interaktif pemetaan ketimpangan spasial digital dan akselerasi respons layanan kesehatan mental remaja Indonesia. Tim IRIS - Universitas Airlangga.",
  keywords: ["kesehatan mental remaja", "SEJIWA+", "Visual Quest", "Dataquest 2026", "clustering spasial", "forecasting SARIMA", "GWR Indonesia"],
  openGraph: {
    title: "SEJIWA+ | Mendengar yang Tak Terucap",
    description: "Bagaimana Statistika Memetakan Ketimpangan dan Mengakselerasi Respons Layanan Jiwa Remaja Indonesia",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#070d18] text-slate-100 antialiased selection:bg-orange-500 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <PresentationShortcuts />
      </body>
    </html>
  );
}
