import { StrategyPanel } from "../../components/features/StrategyPanel";

export function StrategyBacktest() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-[var(--color-text)]">Strategy & Backtest</h1>
      <StrategyPanel />
    </div>
  );
}
