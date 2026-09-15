export interface ProvinceData {
  provinsi: string;
  Provinsi?: string;
  hp_seluler_2024: number;
  rls_2024: number;
  ipm_2024: number;
  pdrb_kapita_2024: number;
  tpt_2024: number;
  pc1?: number;
  pc2?: number;
  klaster: number;
  nama_klaster: string;
  skor_kerentanan: number;
  indeks_kerentanan?: number;
  peringkat: number;
  kategori_kerentanan: string;
  kategori?: string;
  kategori_lisa: string;
  lisa_q?: string;
  lisa_p?: number;
  lisa?: string;
  lat?: number;
  lon?: number;
  gwr_rls_2024?: number;
  gwr_ipm_2024?: number;
  gwr_pdrb_log?: number;
  gwr_tpt_2024?: number;
}

export interface ClusterInfo {
  id: number;
  name: string;
  color: string;
  badgeBg: string;
  description: string;
  count: number;
  avgPhone: number;
  avgIpm: number;
  provinces: string[];
}

export interface MoranData {
  variabel: string;
  moran_i: number;
  p_value: number;
  z_score: number;
  pola: string;
}

export interface SpatialModel {
  model: string;
  aicc: number;
  r2: number;
  peringkat: string;
}

export interface HistoricalPoint {
  tanggal: string;
  volume_konsultasi_mental: number;
  indeks_stres_finansial: number;
  indeks_burnout_pekerja: number;
  panggilan_krisis_psikologis: number;
}

export interface ForecastPoint {
  tanggal: string;
  proyeksi_volume: number;
  ensemble?: number;
  sarima?: number;
  ets?: number;
  prophet?: number;
  ci68_bawah: number;
  ci68_atas: number;
  ci95_bawah: number;
  ci95_atas: number;
  driver_stres_finansial?: number;
  driver_burnout?: number;
  driver_panggilan_krisis?: number;
}

export interface ForecastModelCV {
  model: string;
  h?: number;
  horizon: string;
  mape: number;
  rmse: number;
  mae?: number;
  smape: number;
}

export interface TriageEvaluation {
  urgencyScore: number;
  urgencyLevel: "Rendah" | "Sedang" | "Kritis";
  categoryColor: string;
  detectedKeywords: string[];
  recommendedAction: string;
  matchedScenario: string;
}
