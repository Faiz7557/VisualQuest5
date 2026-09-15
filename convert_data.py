import os
import json
import pandas as pd

out_dir = os.path.join("public", "data")
os.makedirs(out_dir, exist_ok=True)

# 1. Master Analisis JALA 38 Provinsi
df_jala = pd.read_csv(os.path.join("Analisis Clustering dan Spasial", "hasil_analisis_jala.csv"))
df_jala.to_json(os.path.join(out_dir, "clustering_results.json"), orient="records", indent=2)
print("1. clustering_results.json:", len(df_jala), "records")

# 2. Grid Search Klaster
df_grid = pd.read_csv(os.path.join("Analisis Clustering dan Spasial", "hasil_grid_klaster.csv"))
df_grid.to_json(os.path.join(out_dir, "grid_search_results.json"), orient="records", indent=2)
print("2. grid_search_results.json:", len(df_grid), "records")

# 3. Moran Spasial
df_moran = pd.read_csv(os.path.join("Analisis Clustering dan Spasial", "hasil_moran.csv"))
df_moran.to_json(os.path.join(out_dir, "moran_results.json"), orient="records", indent=2)
print("3. moran_results.json:", len(df_moran), "records")

# 4. Model Spasial
df_sp_models = pd.read_csv(os.path.join("Analisis Clustering dan Spasial", "hasil_perbandingan_model.csv"))
df_sp_models.to_json(os.path.join(out_dir, "spatial_models.json"), orient="records", indent=2)
print("4. spatial_models.json:", len(df_sp_models), "records")

# 5. Forecasting 72 Bulan Historis
df_hist = pd.read_csv(os.path.join("Analisis Forecasting", "dataset_forecasting_kesehatan_mental_72bulan.csv"))
df_hist.to_json(os.path.join(out_dir, "historical_timeseries.json"), orient="records", indent=2)
print("5. historical_timeseries.json:", len(df_hist), "records")

# 6. Forecasting Proyeksi 24 Bulan
df_proj = pd.read_csv(os.path.join("Analisis Forecasting", "hasil_proyeksi_24bulan.csv"))
df_proj.to_json(os.path.join(out_dir, "forecast_projection.json"), orient="records", indent=2)
print("6. forecast_projection.json:", len(df_proj), "records")

# 7. Model CV Forecasting
df_fc_models = pd.read_csv(os.path.join("Analisis Forecasting", "hasil_perbandingan_model_cv.csv"))
df_fc_models.to_json(os.path.join(out_dir, "forecast_models.json"), orient="records", indent=2)
print("7. forecast_models.json:", len(df_fc_models), "records")

# 8. Copy GeoJSON to public/data
with open(os.path.join("Analisis Clustering dan Spasial", "shp", "indonesia_38prov.geojson"), "r", encoding="utf-8") as f:
    geojson_data = json.load(f)
with open(os.path.join(out_dir, "indonesia_38prov.json"), "w", encoding="utf-8") as f:
    json.dump(geojson_data, f)
print("8. indonesia_38prov.json copied. Features:", len(geojson_data.get("features", [])))

print("ALL DATA CONVERTED SUCCESSFULLY!")
