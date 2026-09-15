# 🌟 SEJIWA+ : Mendengar yang Tak Terucap
### Prototipe Web Interaktif & Triase AI Hotline 119 ext 8
> **Visual Quest 5.0 (Dataquest 2026)**  
> **Tema:** The Anatomy of a Happy Life: Unpacking the Social, Economic, and Health Factors Behind Life Satisfaction  
> **Subtema:** Social  
> **Tim:** IRIS — Universitas Airlangga  
> **Target SDGs:** SDG 3 (Kesehatan yang Baik dan Kesejahteraan) & SDG 10 (Berkurangnya Kesenjangan)

---

## 🌐 Live Demo & Deployment
- **Production URL:** [https://iris-visual-quest5.vercel.app/](https://iris-visual-quest5.vercel.app/)
- **Repositori:** [https://github.com/Faiz7557/VisualQuest5](https://github.com/Faiz7557/VisualQuest5)

---

## 📌 Ringkasan Eksekutif
Satu dari tiga remaja Indonesia (15,5 juta jiwa) bergulat dengan masalah kesehatan mental, namun hanya 2,6% yang pernah mengakses bantuan konseling profesional. 74% remaja enggan bercerita ke orang tua atau guru, dan melarikan diri ke ruang digital tanpa pendampingan memadai. Kondisi ini diperparah oleh rasio psikiater nasional yang hanya 0,43 per 100.000 penduduk dengan >65% terpusat di Pulau Jawa.

Prototipe web ini melengkapi infografis statistik **"Mendengar yang Tak Terucap"** dengan mengintegrasikan:
1. **Analisis Spasial & Klastering Regional (JALA)** pada 38 provinsi di Indonesia menggunakan *Ward Hierarchical Clustering* (Silhouette 0,530), *Global Moran's I* (0,450), dan *Geographically Weighted Regression / GWR* (Pseudo R² 0,957).
2. **Peramalan Deret Waktu (Forecasting)** 72 bulan menggunakan model *SARIMAX* dengan validasi silang *Walk-Forward CV (413 fold)* bebas kebocoran (*leakage-free*), memproyeksikan kenaikan volume konsultasi sebesar +79,4% dan lonjakan panggilan krisis darurat +70,7% pada akhir 2026.
3. **Simulasi Solusi SEJIWA+**: Lapisan Natural Language Processing (NLP) cerdas di atas Hotline Kemenkes 119 ext 8 yang menilai skor urgensi < 1 menit, menyortir jalur rujukan berjenjang (swabantu vs darurat konselor), serta menyediakan Mode SMS/USSD untuk wilayah tertinggal 3T tanpa kuota data internet.

---

## 🚀 Fitur Aplikasi

1. **Beranda Interaktif (Scroll Storytelling)**
   - Visualisasi naratif 4 babak infografis.
   - Metrik interaktif *The Silent Epidemic*.
2. **Peta Spasial & Klaster 38 Provinsi (`/dashboard/clustering`)**
   - Peta tematik kloroplet dinamis (Leaflet) dengan 4 layer: 4 Klaster Tipologi, Indeks Kerentanan IKAD, Penetrasi Ponsel, dan Pola Spasial LISA.
   - Panel audit detail per provinsi dan tabel interaktif yang dapat difilter dan diurutkan.
3. **Proyeksi Kebutuhan 2026 (`/dashboard/forecasting`)**
   - Fanchart interaktif (Recharts) dengan pita ketidakpastian 68% dan 95% interval kepercayaan out-of-fold.
   - Perbandingan 7 model deret waktu pada horizon h=3 (SARIMA MAPE 3,39%) dan h=12 (SARIMAX MAPE 4,37%).
4. **Simulasi Triase AI SEJIWA+ (`/sejiwa`)**
   - Mode Web Chat Hotline 119 vs Mode SMS/USSD Offline.
   - Panel triase live: Skor Urgensi 0-100, deteksi kata kunci emosi, klasifikasi risiko, dan protokol respons otomatis.
   - Preset prompt skenario klinis (kecemasan, burnout, kesepian, krisis akut).
5. **Dasbor Prediktif Kemenkes (`/sejiwa/monitoring`)**
   - Pemantauan kapasitas tenaga kesehatan mental, distribusi beban kasus triase, dan sinergi stakeholder.
6. **Tentang & Metodologi (`/tentang`)**
   - Dokumentasi lengkap metodologi ekonometrika spasial, forecasting, audit kebocoran data, dan analisis SWOT.

---

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router, Turbopack)
- **Library UI:** React 19, Tailwind CSS, Lucide React, Glassmorphism Design System
- **Visualisasi Data:** Recharts, Leaflet / React-Leaflet
- **Animasi:** Motion (Framer Motion)
- **Deployment:** Vercel Edge Platform

---

## 💻 Menjalankan Secara Lokal

```bash
# 1. Kloning repositori
git clone https://github.com/Faiz7557/VisualQuest5.git
cd VisualQuest5

# 2. Instalasi dependensi
npm install --legacy-peer-deps

# 3. Jalankan server pengembangan
npm run dev

# 4. Buka di browser
http://localhost:3000
```

---

## 👥 Tim Penyusun
**Tim IRIS — Universitas Airlangga**
- Visual Quest 5.0 (Dataquest 2026)
