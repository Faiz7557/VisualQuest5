import { TriageEvaluation } from "@/types/data";

interface ScenarioRule {
  id: string;
  category: "Kritis" | "Sedang" | "Rendah";
  baseScore: number;
  color: string;
  matchedScenario: string;
  recommendedAction: string;
  regexPatterns: RegExp[];
  negationPatterns?: RegExp[];
  responses: string[];
}

const RULES: ScenarioRule[] = [
  // 1. KRISIS AKUT / KESELAMATAN DIRI
  {
    id: "suicide_crisis",
    category: "Kritis",
    baseScore: 92,
    color: "#ef4444",
    matchedScenario: "Deteksi Krisis Akut / Risiko Tinggi Keselamatan Diri",
    recommendedAction: "PENGALIHAN DARURAT: Menghubungkan langsung ke Konselor Siaga 119 ext 8 & Layanan Ambulans Jiwa Terdekat.",
    regexPatterns: [
      /\b(bunuh diri|mengakhiri hidup|akhiri hidup|ingin mati|mau mati|pengen mati)\b/i,
      /\b(sayat|luka|melukai diri|self harm|gantung diri|lompat dari)\b/i,
      /\b(sudah tidak kuat lagi|tidak sanggup hidup|ingin hilang selamanya)\b/i,
    ],
    negationPatterns: [
      /mati lampu/i,
      /mati rasa/i,
      /mati gaya/i,
      /tidak (ingin|mau|akan) (mati|bunuh diri)/i,
      /bukan mau bunuh diri/i,
    ],
    responses: [
      "Terima kasih sudah bertahan dan berani bersuara kepada kami malam ini. Kamu tidak sendirian, dan rasa sakit yang kamu rasakan itu nyata. Sistem SEJIWA+ mendeteksi bahwa kamu membutuhkan pendampingan profesional SEGERA. Saya sedang mengaktifkan jalur prioritas darurat ke konselor hotline 119 ext 8. Tetaplah bersama kami di sini, bantuan sedang disambungkan.",
      "Napasmu berharga, dan kehadiranmu sangat berarti. Kami mendengar beban yang sangat berat itu. Mohon tetap di saluran ini, konselor krisis darurat sedang mengambil alih panggilan untuk mendampingimu secara langsung."
    ]
  },

  // 2. SERANGAN PANIK & KECEMASAN AKUT
  {
    id: "panic_anxiety",
    category: "Sedang",
    baseScore: 68,
    color: "#f59e0b",
    matchedScenario: "Episode Kecemasan Akut / Serangan Panik Terindikasi",
    recommendedAction: "INTERVENSI TERPANDU: Teknik Regulasi Pernapasan 4-7-8 & Penjadwalan Telekonseling 1x24 Jam.",
    regexPatterns: [
      /\b(cemas|panik|serangan panik|panic attack)\b/i,
      /\b(deg-degan|berdebar|deg degan|jantung berdebar|sesak napas)\b/i,
      /\b(overthinking|takut berlebihan|gemetar|keringat dingin)\b/i,
    ],
    responses: [
      "Napasmu terasa cepat dan pikiranmu berpacu ya? Tarik napas pelan-pelan bersamaku: tarik napas dalam 4 detik... tahan 7 detik... hembuskan perlahan 8 detik. Kamu aman saat ini. Gejala kecemasanmu telah tercatat dalam sistem triase kami. Konselor SEJIWA siap mendampingimu jika detak jantungmu belum mereda.",
      "Sensasi panik dan overthinking memang terasa sangat nyata dan melelahkan fisik. Mari kita beri jeda sejenak untuk tubuhmu. Ikuti irama napas ini: hirup perlahan, lepaskan beban di pundakmu."
    ]
  },

  // 3. BURNOUT AKADEMIK & STRES PEKERJAAN
  {
    id: "academic_burnout",
    category: "Sedang",
    baseScore: 48,
    color: "#f59e0b",
    matchedScenario: "Tekanan Akademik & Kelelahan Emosional (Burnout)",
    recommendedAction: "SWABANTU DIGITAL: Modul Manajemen Burnout & Konseling Kelompok Daring.",
    regexPatterns: [
      /\b(tugas|kuliah|sekolah|ujian|skripsi|sidang|dosen|target)\b/i,
      /\b(burnout|lelah mental|capek mental|capek banget|kewalahan|beban pikiran)\b/i,
    ],
    responses: [
      "Merasa kewalahan dengan tumpukan ekspektasi, tugas, dan target adalah hal yang sangat manusiawi. Lelahmu valid. Kamu sudah berjuang begitu jauh. SEJIWA+ menyediakan modul swabantu relaksasi kognitif dan kamu bisa menjadwalkan sesi konseling daring tanpa perlu takut dihakimi.",
      "Istirahat bukanlah tanda menyerah, melainkan bagian dari bertahan. Ambil jeda 15 menit dari layarmu sekarang, minum air hangat, dan izinkan dirimu bernapas tanpa memikirkan deadline sejenak."
    ]
  },

  // 4. ISOLASI SOSIAL & KESEPIAN
  {
    id: "loneliness",
    category: "Rendah",
    baseScore: 35,
    color: "#10b981",
    matchedScenario: "Kebutuhan Koneksi Sosial & Ruang Aman Berbagi",
    recommendedAction: "DUKUNGAN SEBAYA: Akses Ruang Aman Komunitas Remaja & Peer Counselor SEJIWA.",
    regexPatterns: [
      /\b(kesepian|sendiri|sendirian|tidak punya teman|dijauhi|asing)\b/i,
      /\b(sedih|hampa|kosong|menangis|tidak ada yang paham)\b/i,
    ],
    responses: [
      "Rasa sepi di tengah keramaian itu berat ya. Ingat bahwa kehadiranmu berharga dan kamu tidak harus memikul semuanya sendirian. Di SEJIWA+, ribuan remaja lain juga mencari ruang untuk didengar secara aman dan anonim. Kami hadir untuk menemanimu.",
      "Kamu selalu punya tempat untuk pulang dan didengar di sini. Ceritakan apapun yang membuat hatimu terasa berat hari ini, kami tidak akan pergi ke mana-mana."
    ]
  }
];

export function evaluateMessage(text: string): { evaluation: TriageEvaluation; responseText: string } {
  const clean = text.trim();

  // Check each rule
  for (const rule of RULES) {
    // Check if negated
    if (rule.negationPatterns && rule.negationPatterns.some((np) => np.test(clean))) {
      continue;
    }

    const matchedKeywords: string[] = [];
    for (const pattern of rule.regexPatterns) {
      const match = clean.match(pattern);
      if (match) {
        matchedKeywords.push(match[0]);
      }
    }

    if (matchedKeywords.length > 0) {
      // Dynamic urgency score calculation based on keyword density
      const densityBonus = Math.min(8, (matchedKeywords.length - 1) * 3);
      const finalScore = Math.min(99, rule.baseScore + densityBonus);

      const resp = rule.responses[Math.floor(Math.random() * rule.responses.length)];

      return {
        evaluation: {
          urgencyScore: finalScore,
          urgencyLevel: rule.category,
          categoryColor: rule.color,
          detectedKeywords: Array.from(new Set(matchedKeywords)),
          recommendedAction: rule.recommendedAction,
          matchedScenario: rule.matchedScenario,
        },
        responseText: resp,
      };
    }
  }

  // Default General Supportive Response
  return {
    evaluation: {
      urgencyScore: 22,
      urgencyLevel: "Rendah",
      categoryColor: "#10b981",
      detectedKeywords: ["curhat umum"],
      recommendedAction: "SWABANTU & EDUKASI: Memberikan materi psikoedukasi dan panduan kesehatan mental remaja.",
      matchedScenario: "Konsultasi Suportif Umum",
    },
    responseText: "Halo, terima kasih sudah membuka diri dan menghubungi SEJIWA+. Kami di sini untuk mendengarkan apa saja yang sedang berkecamuk di pikiranmu tanpa syarat dan tanpa stigma. Ceritakan lebih banyak, kami siap mendengarkan."
  };
}
