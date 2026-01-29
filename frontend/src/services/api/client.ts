import axios from "axios";
import type {
  MarketAssetWithPrice,
  PriceRecord,
  AnalyticsResponse,
  StrategyRun,
  StrategyRunRequest,
} from "../../types/api";
import { getDeviceFingerprint } from "../../utils/deviceFingerprint";
import { apiBaseURL } from "./config";

const apiKey = import.meta.env.VITE_API_KEY as string | undefined;
const headers: Record<string, string> = { "Content-Type": "application/json" };
if (apiKey?.trim()) headers["X-API-Key"] = apiKey.trim();

export const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 15000,
  headers,
});

api.interceptors.request.use((config) => {
  const fp = getDeviceFingerprint();
  if (fp) config.headers["X-Device-Fingerprint"] = fp;
  return config;
});

/** GET /api/v1/markets - List all crypto assets */
export const marketsApi = {
  list: () => api.get<MarketAssetWithPrice[]>("/markets"),
  asset: (symbol: string) =>
    api.get<MarketAssetWithPrice>(`/markets/${encodeURIComponent(symbol.toUpperCase())}`),
  /** Backend returns { status: "accepted", message } when ingest is started in background */
  ingest: () =>
    api.post<{ status: string; message?: string; records_ingested?: number }>("/markets/ingest"),
};

/** GET /api/v1/prices/{symbol} - Current price */
export const pricesApi = {
  get: (symbol: string) =>
    api.get<PriceRecord>(`/prices/${encodeURIComponent(symbol.toUpperCase())}`),
};

/** GET /api/v1/history/{symbol} - Historical data */
export const historyApi = {
  get: (symbol: string, limit = 100) =>
    api.get<PriceRecord[]>(`/history/${encodeURIComponent(symbol.toUpperCase())}`, {
      params: { limit },
    }),
};

/** GET /api/v1/analytics - Computed analytics */
export const analyticsApi = {
  get: (window_hours = 24) =>
    api.get<AnalyticsResponse>("/analytics", { params: { window_hours } }),
};

/** POST /api/v1/strategy/run, GET /api/v1/strategy/results */
export const strategyApi = {
  run: (body?: StrategyRunRequest) => api.post<StrategyRun>("/strategy/run", body ?? {}),
  results: (limit = 10) =>
    api.get<StrategyRun[]>("/strategy/results", { params: { limit } }),
};

/** GET /api/v1/health - Health check */
export const healthApi = {
  check: () => api.get<{ status: string }>("/health"),
};
