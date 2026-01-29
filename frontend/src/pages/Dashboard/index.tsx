import { useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMarkets, useHistory, useAnalytics, useWebSocketPrice } from "../../services/hooks";
import { useSearch } from "../../contexts/SearchContext";
import { useAppStore } from "../../store/useAppStore";
import { MarketOverviewCards } from "../../components/features/MarketOverviewCards";
import { AnalyticsCard } from "../../components/features/AnalyticsCard";
import { StrategySignalsPanel } from "../../components/features/StrategySignalsPanel";
import { QuickActions } from "../../components/features/QuickActions";
import { Chart } from "../../components/common/Chart";
import { motion } from "framer-motion";
import type { PriceRecord } from "../../types/api";

function mergeWsIntoHistory(history: PriceRecord[], lastUpdate: PriceRecord | null): PriceRecord[] {
  if (!lastUpdate) return history;
  const ts = new Date(lastUpdate.timestamp).getTime();
  const filtered = history.filter((r) => new Date(r.timestamp).getTime() !== ts);
  const merged = [...filtered, lastUpdate].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  return merged;
}

export function Dashboard() {
  const navigate = useNavigate();
  const selectedSymbol = useAppStore((s) => s.selectedSymbol);
  const setSelectedSymbol = useAppStore((s) => s.setSelectedSymbol);
  const chartType = useAppStore((s) => s.chartType);
  const setChartType = useAppStore((s) => s.setChartType);
  const realTimeEnabled = useAppStore((s) => s.realTimeEnabled);
  const setRealTimeEnabled = useAppStore((s) => s.setRealTimeEnabled);

  const chartSectionRef = useRef<HTMLElement>(null);

  /** When user clicks a market card, open the full crypto detail page with time-range graph */
  const handleSelectSymbolFromCard = useCallback(
    (symbol: string) => {
      navigate(`/crypto/${encodeURIComponent(symbol)}`);
    },
    [navigate]
  );
  const chartHeight = useAppStore((s) => s.chartHeight);
  const showRsi = useAppStore((s) => s.showRsi);
  const showBrush = useAppStore((s) => s.showBrush);
  const analyticsWindowHours = useAppStore((s) => s.analyticsWindowHours);

  const { query } = useSearch();
  const { assets, isLoading, isError: marketsError, refetchMarkets, ingest, isIngesting } = useMarkets();
  const { history, isLoading: historyLoading, isError: historyError, refetch: refetchHistory, isRefetching: historyRefetching } = useHistory(selectedSymbol, 100);
  const { lastUpdate } = useWebSocketPrice(selectedSymbol, !!selectedSymbol && realTimeEnabled);
  const chartData = useMemo(
    () => mergeWsIntoHistory(history, lastUpdate),
    [history, lastUpdate]
  );
  const chartLoading = historyLoading || historyRefetching;
  const chartFailed = historyError;
  const { assets: analyticsAssets, windowHours, isLoading: analyticsLoading } = useAnalytics(analyticsWindowHours);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Dashboard</h1>
        <QuickActions onRefresh={() => ingest()} isRefreshing={isIngesting} />
      </div>

      {marketsError && assets.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6"
          role="alert"
        >
          <p className="text-center text-sm text-[var(--color-text-muted)]">
            Couldn’t load market data. Check connection and try again.
          </p>
          <button
            type="button"
            onClick={() => refetchMarkets()}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            Try again
          </button>
        </div>
      ) : (
        <MarketOverviewCards
          assets={assets}
          selectedSymbol={selectedSymbol}
          onSelectSymbol={handleSelectSymbolFromCard}
          searchQuery={query}
          maxCards={10}
        />
      )}

      {selectedSymbol && (
        <motion.section
          ref={chartSectionRef}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
          aria-labelledby="charts-heading"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="charts-heading" className="text-lg font-semibold text-[var(--color-text)]">
              Price Charts
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as "candlestick" | "volumePrice" | "price" | "volume")}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm text-[var(--color-text)]"
              >
                <option value="candlestick">Candlestick</option>
                <option value="volumePrice">Volume + Price</option>
                <option value="price">Price</option>
                <option value="volume">Volume</option>
              </select>
              <label className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                <input
                  type="checkbox"
                  checked={realTimeEnabled}
                  onChange={(e) => setRealTimeEnabled(e.target.checked)}
                  className="rounded border-[var(--color-border)]"
                />
                Live
              </label>
            </div>
          </div>
          {chartFailed ? (
            <div
              className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6"
              role="alert"
            >
              <p className="text-center text-sm text-[var(--color-text-muted)]">
                Couldn’t load chart data for {selectedSymbol}. Check connection and try again.
              </p>
              <button
                type="button"
                onClick={() => refetchHistory()}
                disabled={historyRefetching}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:opacity-50"
              >
                {historyRefetching ? "Loading…" : "Try again"}
              </button>
            </div>
          ) : chartLoading && chartData.length === 0 ? (
            <div
              className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6"
              style={{ minHeight: chartHeight }}
            >
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" aria-hidden />
              <p className="text-sm text-[var(--color-text-muted)]">Loading chart for {selectedSymbol}…</p>
            </div>
          ) : (
            <Chart
              type={chartType}
              data={chartData}
              symbol={selectedSymbol}
              height={chartHeight}
              showIndicators={showRsi}
              showBrush={showBrush}
              showExport
            />
          )}
        </motion.section>
      )}

      <section aria-labelledby="analytics-heading" className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 id="analytics-heading" className="mb-4 text-lg font-semibold text-[var(--color-text)]">
            Analytics Dashboard
          </h2>
          <AnalyticsCard
            assets={analyticsAssets}
            windowHours={windowHours}
            isLoading={analyticsLoading}
          />
        </div>
        <div>
          <StrategySignalsPanel />
        </div>
      </section>
    </div>
  );
}
