import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useStrategyResults } from "../../../services/hooks";
import { formatDate } from "../../../utils/format";
import { Card } from "../../common/Card";
import { cn } from "../../../utils/cn";

const signalStyles: Record<string, string> = {
  BUY: "bg-crypto-success/20 text-crypto-success border-crypto-success/40",
  SELL: "bg-crypto-danger/20 text-crypto-danger border-crypto-danger/40",
  HOLD: "bg-[var(--color-border)] text-[var(--color-text-muted)] border-transparent",
};

export function StrategySignalsPanel() {
  const { runs, isLoading, error } = useStrategyResults(5);

  return (
    <Card title="Strategy Signals" noMotion>
      {isLoading && (
        <div className="p-6 text-center text-sm text-[var(--color-text-muted)]">
          Loading signals…
        </div>
      )}
      {error && (
        <div className="p-6 text-center text-sm text-crypto-danger">
          Failed to load strategy results.
        </div>
      )}
      {!isLoading && !error && (!runs?.length ? (
        <div className="p-6 text-center text-sm text-[var(--color-text-muted)]">
          No strategy runs yet.{" "}
          <Link to="/strategy" className="text-crypto-primary hover:underline">
            Run a strategy
          </Link>{" "}
          to see signals here.
        </div>
      ) : (
        <div className="space-y-4 p-4">
          {runs?.slice(0, 3).map((run) => (
            <motion.div
              key={run.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border border-[var(--color-border)] p-3"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-[var(--color-text)]">
                  {run.strategy_name}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {formatDate(run.run_at)} · {run.signals.length} signals
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {run.signals.slice(0, 8).map((s) => (
                  <span
                    key={`${run.id}-${s.symbol}`}
                    className={cn(
                      "inline-flex rounded-md border px-2 py-0.5 text-xs font-medium",
                      signalStyles[s.signal] ?? signalStyles.HOLD
                    )}
                    title={s.reason ?? undefined}
                  >
                    {s.symbol} {s.signal}
                  </span>
                ))}
                {run.signals.length > 8 && (
                  <span className="text-xs text-[var(--color-text-muted)]">
                    +{run.signals.length - 8} more
                  </span>
                )}
              </div>
            </motion.div>
          ))}
          <Link
            to="/strategy"
            className="block text-center text-sm text-crypto-primary hover:underline"
          >
            View all & run strategy →
          </Link>
        </div>
      ))}
    </Card>
  );
}
