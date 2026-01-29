import { useAnalytics } from "../../services/hooks";
import { useAppStore } from "../../store/useAppStore";
import { AnalyticsCard } from "../../components/features/AnalyticsCard";

const WINDOW_OPTIONS = [6, 12, 24, 48, 168];

export function MarketAnalysis() {
  const analyticsWindowHours = useAppStore((s) => s.analyticsWindowHours);
  const setAnalyticsWindowHours = useAppStore((s) => s.setAnalyticsWindowHours);
  const { assets, windowHours: actual, isLoading } = useAnalytics(analyticsWindowHours);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Market Analysis</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[var(--color-text)]">Window:</label>
          <select
            value={analyticsWindowHours}
            onChange={(e) => setAnalyticsWindowHours(Number(e.target.value))}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] shadow-sm focus:border-crypto-primary focus:outline-none focus:ring-1 focus:ring-crypto-primary"
          >
            {WINDOW_OPTIONS.map((h) => (
              <option key={h} value={h}>
                {h}h
              </option>
            ))}
          </select>
        </div>
      </div>

      <AnalyticsCard assets={assets} windowHours={actual} isLoading={isLoading} />
    </div>
  );
}
