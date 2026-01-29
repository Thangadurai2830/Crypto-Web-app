export interface MarketAssetWithPrice {
  id: number;
  symbol: string;
  name: string | null;
  coingecko_id: string | null;
  created_at: string;
  updated_at: string;
  latest_price: string | null;
  latest_volume: string | null;
  latest_timestamp: string | null;
}

export interface PriceRecord {
  symbol: string;
  price: string;
  volume: string | null;
  timestamp: string;
}

export interface MacdData {
  macd_line: number;
  signal_line: number;
  histogram: number;
}

export interface AssetAnalytics {
  symbol: string;
  price_change_pct: number | null;
  volume_change_pct: number | null;
  momentum: number | null;
  current_price: string | null;
  current_volume: string | null;
  window_hours: number;
  /** Optional indicators from backend */
  sma_20?: number | null;
  ema_20?: number | null;
  volume_ratio_20?: number | null;
  rsi_14?: number | null;
  macd?: MacdData | null;
  rank?: number | null;
}

export interface AnalyticsResponse {
  window_hours: number;
  computed_at: string;
  assets: AssetAnalytics[];
}

export interface StrategySignal {
  symbol: string;
  signal: string;
  price_at_signal: string | null;
  reason: string | null;
  created_at: string;
}

export interface StrategyRun {
  id: number;
  run_at: string;
  strategy_name: string;
  params_snapshot: string | null;
  status: string;
  signals: StrategySignal[];
}

export interface StrategyRunRequest {
  strategy_name?: string;
  limit_per_symbol?: number;
}
