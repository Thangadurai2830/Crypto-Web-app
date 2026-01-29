import { useRef, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { useTheme } from "../../../contexts/ThemeContext";
import type { PriceRecord } from "../../../types/api";
import { formatPrice, formatVolume, formatDateShort } from "../../../utils/format";
import { priceRecordsToOHLC } from "../../../utils/ohlc";
import { CandlestickChart } from "./CandlestickChart";
import { VolumePriceChart } from "./VolumePriceChart";
import { RSIChart } from "./RSIChart";
import { useChartExport } from "./useChartExport";
import { cn } from "../../../utils/cn";

export type ChartViewType = "candlestick" | "volumePrice" | "price" | "volume";

interface ChartProps {
  type: ChartViewType;
  data: PriceRecord[];
  symbol: string;
  height?: number;
  /** Show technical indicators (SMA/EMA on candlestick, RSI panel) */
  showIndicators?: boolean;
  /** Enable zoom/pan brush */
  showBrush?: boolean;
  /** Enable export as image */
  showExport?: boolean;
}

const gridStrokeLight = "#e2e8f0";
const gridStrokeDark = "#334155";
const axisStrokeLight = "#64748b";
const axisStrokeDark = "#94a3b8";

function useChartColors() {
  const { isDark } = useTheme();
  return {
    grid: isDark ? gridStrokeDark : gridStrokeLight,
    axis: isDark ? axisStrokeDark : axisStrokeLight,
    primary: "#2563eb",
    success: "#10b981",
  };
}

/** Legacy price area chart */
function PriceAreaChart({
  data,
  height,
  colors,
}: {
  data: PriceRecord[];
  symbol: string;
  height: number;
  colors: { grid: string; axis: string; primary: string };
}) {
  const series = [...data]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((r) => ({
      time: formatDateShort(r.timestamp),
      price: parseFloat(r.price),
      full: r.timestamp,
    }));
  if (!series.length) return null;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={series} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke={colors.axis} />
        <YAxis
          tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
          stroke={colors.axis}
          tickFormatter={(v: number) => `$${v >= 1e3 ? (v / 1e3).toFixed(1) + "k" : v.toFixed(2)}`}
        />
        <Tooltip
          formatter={(value: number) => [formatPrice(value), "Price"]}
          labelFormatter={(_, payload) =>
            (payload?.[0] as { payload?: { full?: string } })?.payload?.full
              ? new Date((payload[0] as { payload: { full: string } }).payload.full).toLocaleString()
              : ""
          }
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-card)",
            fontFamily: "JetBrains Mono",
          }}
        />
        <Area type="monotone" dataKey="price" stroke={colors.primary} fill={colors.primary} fillOpacity={0.2} strokeWidth={1.5} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Legacy volume bar chart */
function VolumeBarChart({
  data,
  height,
  colors,
}: {
  data: PriceRecord[];
  symbol: string;
  height: number;
  colors: { grid: string; axis: string; success: string };
}) {
  const series = [...data]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((r) => ({
      time: formatDateShort(r.timestamp),
      volume: r.volume ? parseFloat(r.volume) : 0,
      full: r.timestamp,
    }));
  if (!series.length) return null;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={series} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke={colors.axis} />
        <YAxis
          tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
          stroke={colors.axis}
          tickFormatter={(v: number) =>
            v >= 1e9 ? (v / 1e9).toFixed(1) + "B" : v >= 1e6 ? (v / 1e6).toFixed(1) + "M" : (v / 1e3).toFixed(0) + "K"
          }
        />
        <Tooltip
          formatter={(value: number) => [formatVolume(value), "Volume"]}
          labelFormatter={(_, payload) =>
            (payload?.[0] as { payload?: { full?: string } })?.payload?.full
              ? new Date((payload[0] as { payload: { full: string } }).payload.full).toLocaleString()
              : ""
          }
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-card)",
            fontFamily: "JetBrains Mono",
          }}
        />
        <Bar dataKey="volume" fill={colors.success} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Chart({
  type,
  data,
  symbol,
  height = 280,
  showIndicators = true,
  showBrush = true,
  showExport = true,
}: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { exportChart } = useChartExport(containerRef);
  const colors = useChartColors();
  const [brushStart, setBrushStart] = useState(0);
  const [brushEnd, setBrushEnd] = useState(0);
  const [showSma, setShowSma] = useState(true);
  const [showEma, setShowEma] = useState(false);

  const sortedData = useMemo(
    () =>
      [...data].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    [data]
  );
  const ohlcData = useMemo(() => priceRecordsToOHLC(sortedData), [sortedData]);

  const handleBrushChange = (start: number, end: number) => {
    setBrushStart(start);
    setBrushEnd(end);
  };

  const title =
    type === "candlestick"
      ? `Candlestick — ${symbol}`
      : type === "volumePrice"
        ? `Volume & Price — ${symbol}`
        : type === "price"
          ? `Price — ${symbol}`
          : `Volume — ${symbol}`;

  if (!sortedData.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-muted)] backdrop-blur-xl"
        style={{ height }}
      >
        No data for {symbol}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="card p-4"
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          {type === "candlestick" && showIndicators && (
            <>
              <label className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                <input
                  type="checkbox"
                  checked={showSma}
                  onChange={(e) => setShowSma(e.target.checked)}
                  className="rounded border-[var(--color-border)]"
                />
                SMA
              </label>
              <label className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                <input
                  type="checkbox"
                  checked={showEma}
                  onChange={(e) => setShowEma(e.target.checked)}
                  className="rounded border-[var(--color-border)]"
                />
                EMA
              </label>
            </>
          )}
          {showExport && (
            <button
              type="button"
              onClick={() => exportChart(`${symbol}-${type}-${Date.now()}.png`)}
              className={cn(
                "rounded-lg px-2 py-1 text-xs font-medium transition-colors",
                "text-[var(--color-text-muted)] hover:bg-crypto-primary/10 hover:text-crypto-primary"
              )}
            >
              Export PNG
            </button>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {type === "candlestick" && (
          <CandlestickChart
            data={ohlcData}
            symbol={symbol}
            height={height}
            showSma={showSma}
            showEma={showEma}
            showBrush={showBrush}
            brushStartIndex={brushStart}
            onBrushChange={handleBrushChange}
          />
        )}
        {type === "volumePrice" && (
          <VolumePriceChart
            data={sortedData}
            symbol={symbol}
            height={height}
            showBrush={showBrush}
            brushStartIndex={brushStart}
            onBrushChange={handleBrushChange}
          />
        )}
        {type === "price" && (
          <PriceAreaChart data={sortedData} symbol={symbol} height={height} colors={colors} />
        )}
        {type === "volume" && (
          <VolumeBarChart data={sortedData} symbol={symbol} height={height} colors={colors} />
        )}
        {showIndicators && (type === "candlestick" || type === "volumePrice") && (
          <div>
            <h4 className="mb-1 text-xs font-medium text-[var(--color-text-muted)]">RSI (14)</h4>
            <RSIChart data={sortedData} symbol={symbol} height={120} period={14} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
