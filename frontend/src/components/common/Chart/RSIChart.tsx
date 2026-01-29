import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { PriceRecord } from "../../../types/api";
import { useTheme } from "../../../contexts/ThemeContext";
import { formatDateShort } from "../../../utils/format";
import { rsi } from "../../../utils/indicators";

const gridStrokeLight = "#e2e8f0";
const gridStrokeDark = "#334155";
const axisStrokeLight = "#64748b";
const axisStrokeDark = "#94a3b8";

interface RSIChartProps {
  data: PriceRecord[];
  symbol: string;
  height: number;
  period?: number;
}

function useChartColors() {
  const { isDark } = useTheme();
  return {
    grid: isDark ? gridStrokeDark : gridStrokeLight,
    axis: isDark ? axisStrokeDark : axisStrokeLight,
    rsi: "#8b5cf6",
  };
}

export function RSIChart({ data, symbol, height, period = 14 }: RSIChartProps) {
  const colors = useChartColors();
  const sorted = [...data].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const prices = sorted.map((r) => parseFloat(r.price));
  const rsiValues = rsi(prices, period);
  const series = sorted.map((r, i) => ({
    index: i,
    time: formatDateShort(r.timestamp),
    full: r.timestamp,
    rsi: rsiValues[i] ?? undefined,
  }));

  if (!series.length) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={series} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
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
          domain={[0, 100]}
          tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }}
          stroke={colors.axis}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-card)",
            fontFamily: "JetBrains Mono",
          }}
          formatter={(value: number) => [value.toFixed(1), "RSI"]}
          labelFormatter={(_, payload) =>
            payload?.[0]?.payload?.full
              ? new Date(payload[0].payload.full).toLocaleString()
              : ""
          }
        />
        <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="2 2" />
        <ReferenceLine y={30} stroke="#10b981" strokeDasharray="2 2" />
        <Line type="monotone" dataKey="rsi" stroke={colors.rsi} strokeWidth={1.5} dot={false} name="RSI" />
      </LineChart>
    </ResponsiveContainer>
  );
}
