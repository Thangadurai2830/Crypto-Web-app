import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
  ReferenceArea,
  ReferenceLine,
  Line,
} from "recharts";
import type { OHLCPoint } from "../../../utils/ohlc";
import { useTheme } from "../../../contexts/ThemeContext";
import { formatPrice, formatDateShort } from "../../../utils/format";
import { sma, ema } from "../../../utils/indicators";

const gridStrokeLight = "#e2e8f0";
const gridStrokeDark = "#334155";
const axisStrokeLight = "#64748b";
const axisStrokeDark = "#94a3b8";

interface CandlestickChartProps {
  data: OHLCPoint[];
  symbol: string;
  height: number;
  showSma?: boolean;
  showEma?: boolean;
  smaPeriod?: number;
  emaPeriod?: number;
  showBrush?: boolean;
  brushStartIndex?: number;
  onBrushChange?: (start: number, end: number) => void;
}

function useChartColors() {
  const { isDark } = useTheme();
  return {
    grid: isDark ? gridStrokeDark : gridStrokeLight,
    axis: isDark ? axisStrokeDark : axisStrokeLight,
    up: "#10b981",
    down: "#ef4444",
    sma: "#f59e0b",
    ema: "#8b5cf6",
  };
}

export function CandlestickChart({
  data,
  symbol,
  height,
  showSma = true,
  showEma = false,
  smaPeriod = 20,
  emaPeriod = 20,
  showBrush = true,
  brushStartIndex = 0,
  onBrushChange,
}: CandlestickChartProps) {
  const colors = useChartColors();
  const closes = data.map((d) => d.close);
  const smaValues = sma(closes, smaPeriod);
  const emaValues = ema(closes, emaPeriod);
  const chartData = data.map((d, i) => ({
    ...d,
    index: i,
    time: formatDateShort(d.full),
    sma: smaValues[i] ?? undefined,
    ema: emaValues[i] ?? undefined,
  }));

  if (!chartData.length) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={chartData}
        margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis
          dataKey="index"
          type="number"
          domain={["dataMin", "dataMax"]}
          tick={{ fontSize: 10 }}
          stroke={colors.axis}
          tickFormatter={(i) => chartData[i]?.time ?? String(i)}
        />
        <YAxis
          yAxisId="price"
          domain={["auto", "auto"]}
          tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }}
          stroke={colors.axis}
          tickFormatter={(v) => `$${v >= 1e3 ? (v / 1e3).toFixed(1) + "k" : v.toFixed(2)}`}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-card)",
            fontFamily: "JetBrains Mono",
          }}
          formatter={(value: number) => [formatPrice(value), "Price"]}
          labelFormatter={(_, payload) =>
            payload?.[0]?.payload?.full
              ? new Date(payload[0].payload.full).toLocaleString()
              : ""
          }
          label="Price"
        />
        {chartData.map((d, i) => (
          <ReferenceLine
            key={`wick-${i}`}
            segment={[{ x: d.index, y: d.high }, { x: d.index, y: d.low }]}
            stroke={d.close >= d.open ? colors.up : colors.down}
            strokeWidth={1}
          />
        ))}
        {chartData.map((d, i) => (
          <ReferenceArea
            key={`body-${i}`}
            x1={d.index - 0.35}
            x2={d.index + 0.35}
            y1={Math.min(d.open, d.close)}
            y2={Math.max(d.open, d.close)}
            fill={d.close >= d.open ? colors.up : colors.down}
            stroke={d.close >= d.open ? "#059669" : "#dc2626"}
            strokeWidth={1}
          />
        ))}
        {showSma && <Line type="monotone" dataKey="sma" stroke={colors.sma} strokeWidth={1.5} dot={false} name="SMA" />}
        {showEma && <Line type="monotone" dataKey="ema" stroke={colors.ema} strokeWidth={1.5} dot={false} name="EMA" />}
        {showBrush && chartData.length > 10 && (
          <Brush
            dataKey="index"
            height={24}
            stroke={colors.axis}
            startIndex={brushStartIndex}
            endIndex={chartData.length - 1}
            onChange={(range) => {
              if (range?.startIndex != null && range?.endIndex != null)
                onBrushChange?.(range.startIndex, range.endIndex);
            }}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
