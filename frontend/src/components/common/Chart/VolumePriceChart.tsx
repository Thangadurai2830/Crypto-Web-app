import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
} from "recharts";
import type { PriceRecord } from "../../../types/api";
import { useTheme } from "../../../contexts/ThemeContext";
import { formatPrice, formatVolume, formatDateShort } from "../../../utils/format";

const gridStrokeLight = "#e2e8f0";
const gridStrokeDark = "#334155";
const axisStrokeLight = "#64748b";
const axisStrokeDark = "#94a3b8";

interface VolumePriceChartProps {
  data: PriceRecord[];
  symbol: string;
  height: number;
  showBrush?: boolean;
  brushStartIndex?: number;
  onBrushChange?: (start: number, end: number) => void;
}

function useChartColors() {
  const { isDark } = useTheme();
  return {
    grid: isDark ? gridStrokeDark : gridStrokeLight,
    axis: isDark ? axisStrokeDark : axisStrokeLight,
    price: "#2563eb",
    volume: "#10b981",
  };
}

export function VolumePriceChart({
  data,
  symbol,
  height,
  showBrush = true,
  brushStartIndex = 0,
  onBrushChange,
}: VolumePriceChartProps) {
  const colors = useChartColors();
  const sorted = [...data].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const series = sorted.map((r, i) => ({
    index: i,
    time: formatDateShort(r.timestamp),
    full: r.timestamp,
    price: parseFloat(r.price),
    volume: r.volume ? parseFloat(r.volume) : 0,
  }));

  if (!series.length) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={series}
        margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis
          dataKey="index"
          type="number"
          domain={["dataMin", "dataMax"]}
          tick={{ fontSize: 10 }}
          stroke={colors.axis}
          tickFormatter={(i) => series[i]?.time ?? String(i)}
        />
        <YAxis
          yAxisId="price"
          orientation="left"
          tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }}
          stroke={colors.axis}
          tickFormatter={(v) => `$${v >= 1e3 ? (v / 1e3).toFixed(1) + "k" : v.toFixed(2)}`}
        />
        <YAxis
          yAxisId="volume"
          orientation="right"
          tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }}
          stroke={colors.axis}
          tickFormatter={(v) =>
            v >= 1e9 ? (v / 1e9).toFixed(1) + "B" : v >= 1e6 ? (v / 1e6).toFixed(1) + "M" : (v / 1e3).toFixed(0) + "K"
          }
        />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-card)",
            fontFamily: "JetBrains Mono",
          }}
          formatter={(value: number, name: string) =>
            name === "price" ? [formatPrice(value), "Price"] : [formatVolume(value), "Volume"]
          }
          labelFormatter={(_, payload) =>
            payload?.[0]?.payload?.full
              ? new Date(payload[0].payload.full).toLocaleString()
              : ""
          }
        />
        <Bar yAxisId="volume" dataKey="volume" fill={colors.volume} radius={[2, 2, 0, 0]} name="volume" />
        <Line
          yAxisId="price"
          type="monotone"
          dataKey="price"
          stroke={colors.price}
          strokeWidth={2}
          dot={false}
          name="price"
        />
        {showBrush && series.length > 10 && (
          <Brush
            dataKey="index"
            height={24}
            stroke={colors.axis}
            startIndex={Math.max(0, series.length - 50)}
            endIndex={series.length - 1}
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
