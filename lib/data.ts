import fs from "fs";
import path from "path";
import { ProvinceData, HistoricalPoint, ForecastPoint, ForecastModelCV, MoranData, SpatialModel } from "@/types/data";

function readLocalJson<T>(filename: string): T {
  const filePath = path.join(process.cwd(), "public", "data", filename);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent) as T;
}

export function getClusteringResults(): ProvinceData[] {
  return readLocalJson<ProvinceData[]>("clustering_results.json");
}

export function getHistoricalTimeseries(): HistoricalPoint[] {
  return readLocalJson<HistoricalPoint[]>("historical_timeseries.json");
}

export function getForecastProjections(): ForecastPoint[] {
  return readLocalJson<ForecastPoint[]>("forecast_projection.json");
}

export function getForecastModels(): ForecastModelCV[] {
  return readLocalJson<ForecastModelCV[]>("forecast_models.json");
}

export function getMoranResults(): MoranData[] {
  return readLocalJson<MoranData[]>("moran_results.json");
}

export function getSpatialModels(): SpatialModel[] {
  return readLocalJson<SpatialModel[]>("spatial_models.json");
}
