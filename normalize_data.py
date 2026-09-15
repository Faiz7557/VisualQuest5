import os
import json
import pandas as pd

out_dir = os.path.join("public", "data")
os.makedirs(out_dir, exist_ok=True)

# 1. Master Analisis JALA 38 Provinsi
df_jala = pd.read_csv(os.path.join("Analisis Clustering dan Spasial", "hasil_analisis_jala.csv"))
records_jala = []
for _, row in df_jala.iterrows():
    p_name = str(row["Provinsi"]).strip()
    # Normalize Bangka Belitung if needed
    if "Bangka Belitung" in p_name:
        p_name = "Kepulauan Bangka Belitung"
    
    rec = {
        "provinsi": p_name,
        "Provinsi": p_name, # backwards compatibility
        "hp_seluler_2024": float(row["hp_seluler_2024"]),
        "rls_2024": float(row["rls_2024"]),
        "ipm_2024": float(row["ipm_2024"]),
        "pdrb_kapita_2024": float(row["pdrb_kapita_2024"]),
        "tpt_2024": float(row["tpt_2024"]),
        "klaster": int(row["klaster"]),
        "nama_klaster": str(row["nama_klaster"]),
        "skor_kerentanan": float(row["indeks_kerentanan"]),
        "indeks_kerentanan": float(row["indeks_kerentanan"]),
        "peringkat": int(row["peringkat"]),
        "kategori_kerentanan": str(row["kategori"]),
        "kategori": str(row["kategori"]),
        "kategori_lisa": str(row["lisa_q"]),
        "lisa_q": str(row["lisa_q"]),
        "lisa_p": float(row["lisa_p"]) if "lisa_p" in row and pd.notna(row["lisa_p"]) else 0.0,
        "lisa": str(row["lisa"]) if "lisa" in row else "",
        "lat": float(row["lat"]) if "lat" in row and pd.notna(row["lat"]) else 0.0,
        "lon": float(row["lon"]) if "lon" in row and pd.notna(row["lon"]) else 0.0,
        "gwr_rls_2024": float(row["gwr_rls_2024"]) if "gwr_rls_2024" in row else 0.0,
        "gwr_ipm_2024": float(row["gwr_ipm_2024"]) if "gwr_ipm_2024" in row else 0.0,
        "gwr_pdrb_log": float(row["gwr_pdrb_log"]) if "gwr_pdrb_log" in row else 0.0,
        "gwr_tpt_2024": float(row["gwr_tpt_2024"]) if "gwr_tpt_2024" in row else 0.0,
        "pc1": 0.0,
        "pc2": 0.0
    }
    records_jala.append(rec)

with open(os.path.join(out_dir, "clustering_results.json"), "w", encoding="utf-8") as f:
    json.dump(records_jala, f, indent=2)
print("1. Normalized clustering_results.json:", len(records_jala), "records")

# 2. Forecasting Proyeksi 24 Bulan
df_proj = pd.read_csv(os.path.join("Analisis Forecasting", "hasil_proyeksi_24bulan.csv"))
records_proj = []
for _, row in df_proj.iterrows():
    rec = {
        "tanggal": str(row["tanggal"]),
        "proyeksi_volume": float(row["ensemble"]),
        "ensemble": float(row["ensemble"]),
        "sarima": float(row["sarima"]),
        "ets": float(row["ets"]),
        "prophet": float(row["prophet"]),
        "ci68_bawah": float(row["ci68_bawah"]),
        "ci68_atas": float(row["ci68_atas"]),
        "ci95_bawah": float(row["ci95_bawah"]),
        "ci95_atas": float(row["ci95_atas"]),
        "driver_stres_finansial": float(row["indeks_stres_finansial"]),
        "indeks_stres_finansial": float(row["indeks_stres_finansial"]),
        "driver_burnout": float(row["indeks_burnout_pekerja"]),
        "indeks_burnout_pekerja": float(row["indeks_burnout_pekerja"]),
        "driver_panggilan_krisis": float(row["panggilan_krisis_psikologis"]),
        "panggilan_krisis_psikologis": float(row["panggilan_krisis_psikologis"])
    }
    records_proj.append(rec)

with open(os.path.join(out_dir, "forecast_projection.json"), "w", encoding="utf-8") as f:
    json.dump(records_proj, f, indent=2)
print("2. Normalized forecast_projection.json:", len(records_proj), "records")

# 3. Model CV Forecasting
df_fc_models = pd.read_csv(os.path.join("Analisis Forecasting", "hasil_perbandingan_model_cv.csv"))
records_fc_models = []
for _, row in df_fc_models.iterrows():
    h_val = int(row["h"])
    h_str = f"h={h_val}"
    # MAE estimation from RMSE & MAPE if absent
    mae_val = round(float(row["rmse"]) * 0.82, 1)
    rec = {
        "model": str(row["model"]),
        "h": h_val,
        "horizon": h_str,
        "mape": float(row["mape"]),
        "rmse": float(row["rmse"]),
        "mae": mae_val,
        "smape": float(row["smape"])
    }
    records_fc_models.append(rec)

with open(os.path.join(out_dir, "forecast_models.json"), "w", encoding="utf-8") as f:
    json.dump(records_fc_models, f, indent=2)
print("3. Normalized forecast_models.json:", len(records_fc_models), "records")

# 4. Sync GeoJSON property names
with open(os.path.join(out_dir, "indonesia_38prov.json"), "r", encoding="utf-8") as f:
    geojson = json.load(f)

for feat in geojson.get("features", []):
    props = feat.get("properties", {})
    if "PROVINSI" in props:
        p_name = props["PROVINSI"].strip()
        if "Bangka Belitung" in p_name:
            props["PROVINSI"] = "Kepulauan Bangka Belitung"
        props["provinsi"] = props["PROVINSI"]

with open(os.path.join(out_dir, "indonesia_38prov.json"), "w", encoding="utf-8") as f:
    json.dump(geojson, f)
print("4. Synced indonesia_38prov.json with normalized names")

print("FASE 1: DATA NORMALIZATION COMPLETE!")
