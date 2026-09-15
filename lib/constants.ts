import { ClusterInfo } from "@/types/data";

export const CLUSTERS: Record<number, ClusterInfo> = {
  0: {
    id: 0,
    name: "Maju dan Terhubung",
    color: "#10b981", // Emerald Green
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    description: "Konektivitas dan kapasitas ekonomi tertinggi. Didominasi pusat pertumbuhan ekonomi nasional dan industri ekstraktif.",
    count: 5,
    avgPhone: 78.8,
    avgIpm: 78.3,
    provinces: ["DKI Jakarta", "Kalimantan Timur", "Kalimantan Utara", "Kepulauan Riau", "Riau"]
  },
  2: {
    id: 2,
    name: "Berkembang Menengah",
    color: "#3b82f6", // Sky Blue
    badgeBg: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    description: "Tulang punggung populasi nasional dengan akses digital stabil dan IPM moderat mendekati rata-rata nasional.",
    count: 25,
    avgPhone: 73.4,
    avgIpm: 74.7,
    provinces: [
      "Aceh", "Sumatera Utara", "Sumatera Barat", "Jambi", "Sumatera Selatan", "Bengkulu",
      "Lampung", "Kep. Bangka Belitung", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta",
      "Jawa Timur", "Banten", "Bali", "Nusa Tenggara Barat", "Kalimantan Barat",
      "Kalimantan Tengah", "Kalimantan Selatan", "Sulawesi Utara", "Sulawesi Tengah",
      "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo", "Maluku", "Maluku Utara"
    ]
  },
  3: {
    id: 3,
    name: "Tertinggal Sedang",
    color: "#f59e0b", // Amber Orange
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    description: "Kesenjangan penetrasi ponsel dan IPM yang cukup kentara di wilayah kepulauan dan kawasan timur.",
    count: 6,
    avgPhone: 56.1,
    avgIpm: 65.4,
    provinces: ["Nusa Tenggara Timur", "Sulawesi Barat", "Papua Barat", "Papua Barat Daya", "Papua", "Papua Selatan"]
  },
  1: {
    id: 1,
    name: "Tertinggal Ekstrem",
    color: "#ef4444", // Rose Red
    badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    description: "Krisis kesenjangan digital dan kapasitas layanan akut. Terisolasi secara geografis dan infrastruktur dasar.",
    count: 2,
    avgPhone: 23.9,
    avgIpm: 55.8,
    provinces: ["Papua Tengah", "Papua Pegunungan"]
  }
};

export const STATS_LATAR_BELAKANG = {
  prevalensi: {
    rasio: "1 dari 3",
    populasi: "15,5 Juta",
    deskripsi: "Remaja usia 10–17 tahun bergulat dengan masalah kesehatan mental di Indonesia."
  },
  aksesKonseling: {
    persentase: "2,6%",
    deskripsi: "Remaja bermasalah emosional yang pernah mengakses konseling psikologi profesional."
  },
  silentEpidemic: {
    persentase: "74%",
    deskripsi: "Remaja enggan mengungkapkan masalah emosional ke orang tua maupun guru, memilih anonim di ruang digital."
  },
  jamRawan: {
    rentang: "22.00 – 02.00",
    deskripsi: "Puncak ekspresi emosi negatif dan pencarian bantuan anonim di media sosial terjadi dini hari."
  },
  rasioPsikiater: {
    nasional: "0,43",
    standarWho: "1 – 3",
    satuan: "per 100.000 penduduk",
    terpusatJawa: "> 65%",
    puskesmasJiwa: "< 25%"
  }
};

export const MOCK_SEJIWA_SCENARIOS = [
  {
    keywords: ["bunuh diri", "mati", "mengakhiri hidup", "sayat", "luka", "sudah tidak kuat lagi", "ingin hilang"],
    urgencyScore: 94,
    urgencyLevel: "Kritis" as const,
    categoryColor: "#ef4444",
    recommendedAction: "PENGALIHAN DARURAT: Menghubungkan langsung ke Konselor Siaga 119 ext 8 & Layanan Ambulans Jiwa Terdekat.",
    matchedScenario: "Deteksi Krisis Akut / Risiko Tinggi Keselamatan Diri",
    response: "Terima kasih sudah bertahan dan berani bersuara kepada kami. Kamu tidak sendirian malam ini, dan rasa sakit yang kamu rasakan itu nyata. Sistem SEJIWA+ mendeteksi bahwa kamu membutuhkan pendampingan profesional SEGERA. Saya sedang mengaktifkan jalur prioritas darurat ke konselor manusia hotline 119 ext 8. Tetaplah bersama kami di sini, bantuan sedang disambungkan."
  },
  {
    keywords: ["cemas", "panik", "deg-degan", "overthinking", "takut", "sesak", "gemetar"],
    urgencyScore: 68,
    urgencyLevel: "Sedang" as const,
    categoryColor: "#f59e0b",
    recommendedAction: "INTERVENSI TERPANDU: Teknik Regulasi Pernapasan 4-7-8 & Penjadwalan Telekonseling 1x24 Jam.",
    matchedScenario: "Episode Kecemasan Akut / Serangan Panik Terindikasi",
    response: "Napasmu terasa cepat dan pikiranmu berpacu ya? Tarik napas pelan-pelan bersamaku: tarik napas dalam 4 detik... tahan 7 detik... hembuskan perlahan 8 detik. Kamu aman saat ini. Gejala kecemasan yang kamu alami telah tercatat dalam sistem triase kami. Konselor SEJIWA siap mendampingimu jika detak jantungmu belum mereda."
  },
  {
    keywords: ["tugas", "kuliah", "sekolah", "ujian", "skripsi", "burnout", "lelah", "capek mental", "beban"],
    urgencyScore: 45,
    urgencyLevel: "Sedang" as const,
    categoryColor: "#f59e0b",
    recommendedAction: "SWABANTU DIGITAL: Modul Manajemen Burnout & Konseling Kelompok Daring.",
    matchedScenario: "Tekanan Akademik & Kelelahan Emosional (Burnout)",
    response: "Merasa kewalahan dengan tumpukan ekspektasi dan tugas adalah hal yang sangat manusiawi. Lelahmu valid. Kamu sudah berjuang begitu jauh. SEJIWA+ menyediakan panduan swabantu relaksasi kognitif dan kamu bisa menjadwalkan sesi konsultasi daring tanpa perlu takut dihakimi."
  },
  {
    keywords: ["kesepian", "sendiri", "tidak punya teman", "dijauhi", "asing", "sedih"],
    urgencyScore: 35,
    urgencyLevel: "Rendah" as const,
    categoryColor: "#10b981",
    recommendedAction: "DUKUNGAN SEBAYA: Akses Ruang Aman Komunitas Remaja & Peer Counselor SEJIWA.",
    matchedScenario: "Kebutuhan Koneksi Sosial & Ruang Aman Berbagi",
    response: "Rasa sepi di tengah keramaian itu berat ya. Ingat bahwa kehadiranmu berharga. Di SEJIWA+, ribuan remaja lain juga mencari ruang untuk didengar tanpa identitas. Kami hadir untuk menemanimu malam ini."
  }
];
