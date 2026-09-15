import { TriageEvaluation } from "@/types/data";
import { MOCK_SEJIWA_SCENARIOS } from "./constants";

export function evaluateMessage(text: string): { evaluation: TriageEvaluation; responseText: string } {
  const lower = text.toLowerCase();
  
  for (const scenario of MOCK_SEJIWA_SCENARIOS) {
    const matched = scenario.keywords.filter(kw => lower.includes(kw));
    if (matched.length > 0) {
      return {
        evaluation: {
          urgencyScore: scenario.urgencyScore,
          urgencyLevel: scenario.urgencyLevel,
          categoryColor: scenario.categoryColor,
          detectedKeywords: matched,
          recommendedAction: scenario.recommendedAction,
          matchedScenario: scenario.matchedScenario,
        },
        responseText: scenario.response,
      };
    }
  }

  // Default evaluation
  return {
    evaluation: {
      urgencyScore: 20,
      urgencyLevel: "Rendah",
      categoryColor: "#10b981",
      detectedKeywords: ["curhat umum"],
      recommendedAction: "SWABANTU & EDUKASI: Memberikan materi psikoedukasi dan panduan kesehatan mental remaja.",
      matchedScenario: "Konsultasi Suportif Umum",
    },
    responseText: "Halo, terima kasih sudah membuka diri dan menghubungi SEJIWA+. Kami di sini untuk mendengarkan apapun yang sedang kamu rasakan saat ini. Ceritakan lebih banyak hal apa yang paling mengganjal di pikiranmu, kami siap menemani."
  };
}
