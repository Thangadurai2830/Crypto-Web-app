import type { PriceRecord } from "../types/api";

export interface OHLCPoint {
  time: string;
  full: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Derive OHLC from price series. Each point: open = previous close, close = price,
 * high = max(open, close), low = min(open, close).
 */
export function priceRecordsToOHLC(records: PriceRecord[]): OHLCPoint[] {
  const sorted = [...records].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const out: OHLCPoint[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const r = sorted[i];
    const close = parseFloat(r.price);
    const volume = r.volume ? parseFloat(r.volume) : 0;
    const open = i > 0 ? out[i - 1].close : close;
    const high = Math.max(open, close);
    const low = Math.min(open, close);
    out.push({
      time: r.timestamp,
      full: r.timestamp,
      open,
      high,
      low,
      close,
      volume,
    });
  }
  return out;
}
