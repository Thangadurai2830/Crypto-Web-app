import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { useMarkets, useHistory } from "../../services/hooks";
import type { PriceRecord } from "../../types/api";
import { formatPrice, formatVolume, formatPct, formatDateAxis } from "../../utils/format";
import { cn } from "../../utils/cn";

const TIME_RANGES = [
  { key: "1W", label: "1W", days: 7 },
  { key: "1M", label: "1M", days: 30 },
  { key: "3M", label: "3M", days: 90 },
  { key: "6M", label: "6M", days: 180 },
  { key: "1Y", label: "1Y", days: 365 },
  { key: "All", label: "All", days: null },
] as const;

const gridStrokeLight = "#e2e8f0";
const gridStrokeDark = "#334155";
const axisStrokeLight = "#64748b";
const axisStrokeDark = "#94a3b8";

function filterByRange(data: PriceRecord[], days: number | null): PriceRecord[] {
  if (!data.length) return [];
  if (days == null) return [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return [...data]
    .filter((r) => new Date(r.timestamp).getTime() >= cutoff)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

function toPercentChangeSeries(data: PriceRecord[]): { time: string; full: string; pct: number }[] {
  if (!data.length) return [];
  const sorted = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const firstPrice = parseFloat(sorted[0].price);
  if (firstPrice === 0) return sorted.map((r) => ({ time: formatDateAxis(r.timestamp), full: r.timestamp, pct: 0 }));
  return sorted.map((r) => {
    const p = parseFloat(r.price);
    const pct = ((p - firstPrice) / firstPrice) * 100;
    return { time: formatDateAxis(r.timestamp), full: r.timestamp, pct };
  });
}

function toPriceSeries(data: PriceRecord[]): { time: string; full: string; price: number }[] {
  return [...data]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((r) => ({
      time: formatDateAxis(r.timestamp),
      full: r.timestamp,
      price: parseFloat(r.price),
    }));
}

export function CryptoDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [timeRange, setTimeRange] = useState<(typeof TIME_RANGES)[number]["key"]>("1M");
  const [chartMode, setChartMode] = useState<"price" | "pct">("price");

  const { assets } = useMarkets();
  const asset = useMemo(
    () => (symbol ? assets.find((a) => a.symbol.toUpperCase() === symbol.toUpperCase()) : null),
    [assets, symbol]
  );
  const { history, isLoading, isError, refetch, isRefetching } = useHistory(symbol ?? null, 500);

  const rangeConfig = TIME_RANGES.find((r) => r.key === timeRange);
  const filteredHistory = useMemo(
    () => filterByRange(history, rangeConfig?.days ?? null),
    [history, rangeConfig?.days]
  );

  const priceSeries = useMemo(() => toPriceSeries(filteredHistory), [filteredHistory]);
  const pctSeries = useMemo(() => toPercentChangeSeries(filteredHistory), [filteredHistory]);
  const chartData = chartMode === "price" ? priceSeries : pctSeries;

  const firstPrice = filteredHistory.length ? parseFloat(filteredHistory[0].price) : null;
  const lastPrice = filteredHistory.length ? parseFloat(filteredHistory[filteredHistory.length - 1].price) : null;
  const periodPct =
    firstPrice != null && lastPrice != null && firstPrice !== 0
      ? ((lastPrice - firstPrice) / firstPrice) * 100
      : null;

  const colors = {
    grid: isDark ? gridStrokeDark : gridStrokeLight,
    axis: isDark ? axisStrokeDark : axisStrokeLight,
    primary: "#2563eb",
    gradientStart: "rgba(37, 99, 235, 0.4)",
    gradientEnd: "rgba(37, 99, 235, 0)",
    negative: "#ef4444",
    negativeGradient: "rgba(239, 68, 68, 0.2)",
  };

  if (!symbol) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-[var(--color-text-muted)]">No symbol in URL.</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-border)]"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-crypto-primary"
        >
          ← Back to Dashboard
        </button>
      </div>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            {symbol}
            {asset?.name && (
              <span className="ml-2 text-lg font-normal text-[var(--color-text-muted)]">
                {asset.name}
              </span>
            )}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
            {asset?.latest_price != null && (
              <span className="font-mono text-[var(--color-text)]">
                {formatPrice(asset.latest_price)}
              </span>
            )}
            {asset?.latest_volume != null && (
              <span className="text-[var(--color-text-muted)]">
                Vol {formatVolume(asset.latest_volume)}
              </span>
            )}
            {periodPct != null && (
              <span
                className={cn(
                  "font-medium",
                  periodPct >= 0 ? "text-emerald-500" : "text-red-500"
                )}
              >
                {formatPct(periodPct)} (period)
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 backdrop-blur-xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {TIME_RANGES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setTimeRange(r.key)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  timeRange === r.key
                    ? "bg-crypto-primary text-white"
                    : "bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)]"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setChartMode("price")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium",
                chartMode === "price"
                  ? "bg-crypto-primary/15 text-crypto-primary"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-border)]"
              )}
            >
              Price
            </button>
            <button
              type="button"
              onClick={() => setChartMode("pct")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium",
                chartMode === "pct"
                  ? "bg-crypto-primary/15 text-crypto-primary"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-border)]"
              )}
            >
              % Change
            </button>
          </div>
        </div>

        {isError && (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 py-12">
            <p className="text-sm text-[var(--color-text-muted)]">
              Couldn’t load chart data for {symbol}.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-border)] disabled:opacity-50"
            >
              {isRefetching ? "Loading…" : "Try again"}
            </button>
          </div>
        )}

        {!isError && isLoading && chartData.length === 0 && (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-2">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-crypto-primary" />
            <p className="text-sm text-[var(--color-text-muted)]">Loading chart…</p>
          </div>
        )}

        {!isError && !isLoading && chartData.length === 0 && (
          <div className="flex min-h-[320px] flex-col items-center justify-center text-[var(--color-text-muted)]">
            No data for this period. Try another range or refresh market data on the Dashboard.
          </div>
        )}

        {!isError && chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="h-[360px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.primary} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="areaGradientNegative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.negative} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={colors.negative} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11 }}
                  stroke={colors.axis}
                />
                <YAxis
                  tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
                  stroke={colors.axis}
                  tickFormatter={
                    chartMode === "price"
                      ? (v: number) =>
                          `$${v >= 1e3 ? (v / 1e3).toFixed(1) + "k" : v.toFixed(2)}`
                      : (v: number) => `${v.toFixed(2)}%`
                  }
                />
                <Tooltip
                  formatter={(value: number) =>
                    chartMode === "price"
                      ? [formatPrice(value), "Price"]
                      : [formatPct(value), "% Change"]
                  }
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0] as { payload?: { full?: string } };
                    return p?.payload?.full
                      ? new Date(p.payload.full).toLocaleString()
                      : "";
                  }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg-card)",
                    fontFamily: "JetBrains Mono",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={chartMode === "price" ? "price" : "pct"}
                  stroke={chartMode === "pct" && (chartData[chartData.length - 1] as { pct: number }).pct < 0 ? colors.negative : colors.primary}
                  fill={chartMode === "pct" && (chartData[chartData.length - 1] as { pct: number }).pct < 0 ? "url(#areaGradientNegative)" : "url(#areaGradient)"}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
}
