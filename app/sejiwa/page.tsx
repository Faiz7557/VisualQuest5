"use client";

import { useState, useRef, useEffect } from "react";
import { TriageEvaluation } from "@/types/data";
import { 
  Bot, 
  Send, 
  PhoneCall, 
  Radio, 
  RefreshCw, 
  User, 
  Zap,
  Activity,
  MessageSquare,
  Copy,
  Check,
  Smartphone
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "sejiwa";
  text: string;
  evaluation?: TriageEvaluation;
  time: string;
}

const PRESET_CHIPS = [
  "Saya merasa cemas, deg-degan, dan overthinking setiap malam.",
  "Beban kuliah dan ujian membuat saya burnout parah dan lelah mental.",
  "Saya merasa sangat kesepian dan tidak punya teman bercerita.",
  "Saya merasa putus asa, ingin menghilang, dan sudah tidak kuat lagi.",
];

export default function SejiwaDemoPage() {
  const [mode, setMode] = useState<"web" | "ussd">("web");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  // USSD Interactive Simulator State
  const [ussdStep, setUssdStep] = useState<"main" | "crisis" | "schedule" | "breathe" | "faskes">("main");
  const [ussdInput, setUssdInput] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "sejiwa",
      text: "Halo, selamat datang di SEJIWA+ (Lapisan AI Hotline Kemenkes 119 ext 8). Kami hadir sebagai ruang aman untuk mendengarkan apapun yang kamu rasakan tanpa dihakimi. Bagaimana kabarmu saat ini?",
      time: "Baru saja",
    },
  ]);

  const [currentEval, setCurrentEval] = useState<TriageEvaluation>({
    urgencyScore: 18,
    urgencyLevel: "Rendah",
    categoryColor: "#10b981",
    detectedKeywords: ["koneksi siap"],
    recommendedAction: "SISTEM SIAGA: Menunggu input keluhan untuk penilaian triase otomatis.",
    matchedScenario: "Status Standby Hotline 119",
  });

  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(textToSend?: string) {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isTyping) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text: messageContent,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageContent }),
      });
      const data = await res.json();

      if (data.evaluation) {
        setCurrentEval(data.evaluation);
      }

      // Simulate realistic word-by-word streaming
      const fullText = data.responseText || "Kami mendengarkan Anda.";
      const words = fullText.split(" ");
      let currentWordIndex = 0;
      let streamedText = "";

      const aiMsgId = "ai-" + Date.now();
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: "sejiwa",
          text: "",
          evaluation: data.evaluation,
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      const interval = setInterval(() => {
        if (currentWordIndex < words.length) {
          streamedText += (currentWordIndex > 0 ? " " : "") + words[currentWordIndex];
          setMessages((prev) =>
            prev.map((msg) => (msg.id === aiMsgId ? { ...msg, text: streamedText } : msg))
          );
          currentWordIndex++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 35);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          sender: "sejiwa",
          text: "Mohon maaf, terjadi gangguan sinyal jaringan. Silakan hubungi langsung Hotline 119 ext 8 bebas pulsa.",
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }

  function handleReset() {
    setMessages([
      {
        id: "init",
        sender: "sejiwa",
        text: "Halo, selamat datang di SEJIWA+ (Lapisan AI Hotline Kemenkes 119 ext 8). Kami hadir sebagai ruang aman untuk mendengarkan apapun yang kamu rasakan tanpa dihakimi. Bagaimana kabarmu saat ini?",
        time: "Baru saja",
      },
    ]);
    setCurrentEval({
      urgencyScore: 18,
      urgencyLevel: "Rendah",
      categoryColor: "#10b981",
      detectedKeywords: ["koneksi siap"],
      recommendedAction: "SISTEM SIAGA: Menunggu input keluhan untuk penilaian triase otomatis.",
      matchedScenario: "Status Standby Hotline 119",
    });
    setUssdStep("main");
  }

  function handleUssdSend(choice?: string) {
    const val = (choice || ussdInput).trim();
    if (val === "1") setUssdStep("crisis");
    else if (val === "2") setUssdStep("schedule");
    else if (val === "3") setUssdStep("breathe");
    else if (val === "4") setUssdStep("faskes");
    else if (val === "0") setUssdStep("main");
    setUssdInput("");
  }

  function copyTriageRecord() {
    const record = `[REKAM TRIASE SEJIWA+ KEMENKES 119]
Waktu: ${new Date().toLocaleString("id-ID")}
Skor Urgensi: ${currentEval.urgencyScore}/100 (${currentEval.urgencyLevel})
Skenario Klinis: ${currentEval.matchedScenario}
Indikator Kata Kunci: ${currentEval.detectedKeywords.join(", ")}
Protokol Rujukan: ${currentEval.recommendedAction}
Kanal Akses: ${mode === "web" ? "Hotline 119 Web Chat" : "SMS/USSD Gateway 3T"}`;

    navigator.clipboard.writeText(record);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* 1. Header & Channel Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
            <Bot className="h-3.5 w-3.5" />
            <span>Simulasi Mesin Triase AI • SEJIWA+</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
            Triase Respons Cerdas Hotline 119 ext 8
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Lapisan Natural Language Processing (NLP) yang membaca indikator distress, menyortir tingkat kegawatan psikologis, dan merutekan bantuan secara otomatis.
          </p>
        </div>

        {/* Mode Toggle (Web vs USSD Simulator) */}
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-xl bg-[#0b162a] p-1 border border-white/10 text-xs">
            <button
              onClick={() => setMode("web")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-all ${
                mode === "web"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Mode Web / Hotline 119</span>
            </button>
            <button
              onClick={() => setMode("ussd")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-all ${
                mode === "ussd"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              <span>Simulator USSD 3T (*119#)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Web Chat OR USSD Feature Phone Simulator */}
        <div className="lg:col-span-7 flex flex-col h-[660px] glass-card rounded-2xl border border-white/10 overflow-hidden">
          {mode === "web" ? (
            /* WEB CHAT MODE */
            <>
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0a1322]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white font-heading">
                        SEJIWA+ Intelligent Assistant
                      </h3>
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Hotline Kemenkes 119 ext 8 • Enkripsi End-to-End
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Reset Simulasi"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => {
                  const isUser = m.sender === "user";
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isUser && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}

                      <div className={`max-w-[85%] space-y-1 ${isUser ? "items-end text-right" : "items-start text-left"}`}>
                        <div
                          className={`rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                            isUser
                              ? "bg-orange-500 text-white font-medium rounded-tr-sm shadow-md"
                              : "bg-white/10 text-slate-100 border border-white/10 rounded-tl-sm"
                          }`}
                        >
                          {m.text}
                        </div>
                        <span className="text-[10px] text-slate-500 block px-1">
                          {m.time}
                        </span>
                      </div>

                      {isUser && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex gap-2 items-center text-xs text-slate-400 py-1">
                    <span className="h-2 w-2 rounded-full bg-orange-400 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-2 w-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0.4s]" />
                    <span>Mengevaluasi kata kunci dan sentimen...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompt Suggestion Chips */}
              <div className="px-4 py-2 border-t border-white/5 bg-[#09111e]/60">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Uji Skenario Klinis Cepat:
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {PRESET_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(chip)}
                      disabled={isTyping}
                      className="whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] bg-white/5 hover:bg-orange-500/20 hover:text-orange-300 border border-white/10 text-slate-300 transition-all shrink-0"
                    >
                      {chip.slice(0, 36)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="p-3 border-t border-white/10 bg-[#070d18] flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ketikkan apa yang kamu rasakan saat ini..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isTyping}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40 transition-opacity"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            /* USSD / FEATURE PHONE SIMULATOR MODE */
            <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#081220] to-[#050b14] space-y-6">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Simulasi Sinyal 2G/3G Non-Internet (Wilayah Klaster 1 Papua)</span>
                </div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Layanan USSD Dial Gateway *119#
                </h3>
              </div>

              {/* Retro Screen Box */}
              <div className="w-full max-w-sm rounded-2xl border-4 border-slate-700 bg-[#0c1f17] p-5 font-mono text-emerald-400 shadow-2xl space-y-4">
                <div className="border-b border-emerald-500/30 pb-2 text-[11px] flex justify-between">
                  <span>TELKOMSEL 2G</span>
                  <span>*119# SEJIWA+</span>
                </div>

                {ussdStep === "main" && (
                  <div className="text-xs space-y-2 leading-relaxed">
                    <p className="font-bold">LAYANAN DARURAT SEJIWA+ KEMENKES RI:</p>
                    <p>1. Bantuan Krisis Darurat</p>
                    <p>2. Jadwalkan Telekonseling</p>
                    <p>3. Panduan Pernapasan 4-7-8</p>
                    <p>4. Info Puskesmas Wilayah 3T</p>
                    <p className="text-[10px] text-emerald-500 pt-1">Ketik angka pilihan (1-4):</p>
                  </div>
                )}

                {ussdStep === "crisis" && (
                  <div className="text-xs space-y-2 leading-relaxed text-amber-300">
                    <p className="font-bold text-rose-400">[PRIORITAS TINGGI]</p>
                    <p>Panggilan darurat 119 ext 8 sedang disambungkan otomatis ke konselor siaga.</p>
                    <p>Tetap di tempat aman. Petugas ambulans faskes terdekat diberitahu.</p>
                    <p className="text-[10px] text-emerald-400 pt-2">Ketik 0 untuk kembali ke menu utama.</p>
                  </div>
                )}

                {ussdStep === "schedule" && (
                  <div className="text-xs space-y-2 leading-relaxed">
                    <p className="font-bold">JADWAL KONSULTASI TELEFON:</p>
                    <p>Konselor relawan HIMPSI akan menghubungi nomor telepon ini dalam 1x24 jam.</p>
                    <p>Layanan bebas pulsa untuk seluruh nomor seluler Indonesia.</p>
                    <p className="text-[10px] text-emerald-400 pt-2">Ketik 0 untuk kembali.</p>
                  </div>
                )}

                {ussdStep === "breathe" && (
                  <div className="text-xs space-y-2 leading-relaxed text-emerald-300">
                    <p className="font-bold">LATIHAN RELAKSASI 4-7-8:</p>
                    <p>1. Tarik napas lewat hidung 4 detik.</p>
                    <p>2. Tahan napas 7 detik.</p>
                    <p>3. Hembuskan lewat mulut 8 detik.</p>
                    <p>Ulangi 4 siklus sampai detak jantung tenang.</p>
                    <p className="text-[10px] text-emerald-400 pt-2">Ketik 0 untuk kembali.</p>
                  </div>
                )}

                {ussdStep === "faskes" && (
                  <div className="text-xs space-y-2 leading-relaxed">
                    <p className="font-bold">FASKES TERDEKAT:</p>
                    <p>Layanan rujukan jiwa tersedia di Puskesmas Distrik & RSUD Kabupaten terdekat.</p>
                    <p>Bawa KIS/BPJS Kesehatan untuk konsultasi gratis.</p>
                    <p className="text-[10px] text-emerald-400 pt-2">Ketik 0 untuk kembali.</p>
                  </div>
                )}

                {/* USSD Keypad Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUssdSend();
                  }}
                  className="pt-2 border-t border-emerald-500/30 flex gap-2"
                >
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="Input (1-4)"
                    value={ussdInput}
                    onChange={(e) => setUssdInput(e.target.value)}
                    className="w-24 bg-black/50 border border-emerald-500/40 rounded px-2 py-1 text-center text-xs text-emerald-300 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded py-1 transition-colors"
                  >
                    Kirim
                  </button>
                  <button
                    type="button"
                    onClick={() => setUssdStep("main")}
                    className="px-2 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700"
                  >
                    Batal
                  </button>
                </form>
              </div>

              <div className="flex gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleUssdSend(String(num))}
                    className="h-10 w-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 font-mono text-sm font-bold text-white flex items-center justify-center transition-all"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Triage Evaluation Engine */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-orange-500/30 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-orange-400" />
                <h3 className="font-bold text-sm text-white font-heading">
                  Panel Triase Real-Time
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                NLP Engine v2 (Regex & Context)
              </span>
            </div>

            {/* Score Gauge & Classification */}
            <div className="text-center space-y-3 p-6 rounded-2xl bg-black/40 border border-white/10 relative overflow-hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Skor Urgensi Klinis
              </span>

              <div 
                className="text-5xl font-black font-heading tracking-tight"
                style={{ color: currentEval.categoryColor }}
              >
                {currentEval.urgencyScore}
                <span className="text-base text-slate-500 font-normal"> / 100</span>
              </div>

              {/* Urgency Badge */}
              <div className="inline-flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border"
                  style={{
                    color: currentEval.categoryColor,
                    borderColor: `${currentEval.categoryColor}50`,
                    backgroundColor: `${currentEval.categoryColor}15`,
                  }}
                >
                  Tingkat Urgensi: {currentEval.urgencyLevel}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${currentEval.urgencyScore}%`,
                    backgroundColor: currentEval.categoryColor,
                  }}
                />
              </div>
            </div>

            {/* Detected Keywords */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">
                Kata Kunci & Indikator Sentimen Terdeteksi:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentEval.detectedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-orange-300"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Diagnostic Interpretation */}
            <div className="space-y-2 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <div className="text-slate-400 font-medium">Klasifikasi Skenario:</div>
              <div className="font-bold text-white text-sm">
                {currentEval.matchedScenario}
              </div>
            </div>

            {/* Automated Triage Routing Action */}
            <div className="space-y-2 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs">
              <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-wider text-[10px]">
                <Zap className="h-3.5 w-3.5" />
                <span>Protokol Respons Otomatis</span>
              </div>
              <p className="text-slate-200 leading-relaxed font-medium">
                {currentEval.recommendedAction}
              </p>
            </div>

            {/* Action Buttons: Copy Triage Record & Call 119 */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={copyTriageRecord}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 p-3 text-xs font-semibold text-slate-200 transition-all"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-orange-400" />}
                <span>{copied ? "Ringkasan Triase Berhasil Disalin!" : "Salin Ringkasan Rujukan untuk Konselor"}</span>
              </button>

              <a
                href="tel:119"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 p-3.5 text-xs font-bold text-white shadow-lg transition-all"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Hubungi Langsung Hotline Darurat 119 ext 8</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
