import { useForm } from "react-hook-form";
import type { StrategyRunRequest } from "../../../types/api";
import { formatDate } from "../../../utils/format";
import { cn } from "../../../utils/cn";
import { Card } from "../../common/Card";
import { Button } from "../../common/Button";
import { useStrategyResults, useStrategyRun } from "../../../services/hooks";

interface FormValues {
  strategy_name: string;
  limit_per_symbol: number;
}

const defaultValues: FormValues = {
  strategy_name: "ma_crossover",
  limit_per_symbol: 100,
};

const signalColors: Record<string, string> = {
  BUY: "bg-crypto-success text-white",
  SELL: "bg-crypto-danger text-white",
  HOLD: "bg-[var(--color-border)] text-[var(--color-text)] dark:bg-slate-600 dark:text-slate-100",
};

export function StrategyPanel() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ defaultValues });
  const runMutation = useStrategyRun();
  const { runs, isLoading, error } = useStrategyResults(10);

  const onSubmit = (data: FormValues) => {
    runMutation.mutate({
      strategy_name: data.strategy_name,
      limit_per_symbol: data.limit_per_symbol,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Run strategy">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)]">Strategy</label>
            <select
              {...register("strategy_name", { required: true })}
              className="mt-1 block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] shadow-sm focus:border-crypto-primary focus:outline-none focus:ring-1 focus:ring-crypto-primary"
            >
              <option value="ma_crossover">MA Crossover</option>
              <option value="momentum">Momentum</option>
              <option value="momentum_rsi">Momentum (RSI)</option>
            </select>
            {errors.strategy_name && (
              <p className="mt-1 text-sm text-crypto-danger">{errors.strategy_name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)]">History points per symbol</label>
            <input
              type="number"
              min={10}
              max={500}
              {...register("limit_per_symbol", { required: true, min: 10, max: 500, valueAsNumber: true })}
              className="mt-1 block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-sm text-[var(--color-text)] shadow-sm focus:border-crypto-primary focus:outline-none focus:ring-1 focus:ring-crypto-primary"
            />
            {errors.limit_per_symbol && (
              <p className="mt-1 text-sm text-crypto-danger">{errors.limit_per_symbol.message}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit" disabled={runMutation.isPending}>
              {runMutation.isPending ? "Running…" : "Run strategy"}
            </Button>
            {runMutation.isError && (
              <p className="self-center text-sm text-crypto-danger">
                {runMutation.error instanceof Error ? runMutation.error.message : "Request failed"}
              </p>
            )}
          </div>
        </form>
      </Card>

      <Card title="Latest runs">
        {isLoading && <div className="p-6 text-center text-[var(--color-text-muted)]">Loading results…</div>}
        {error && (
          <div className="p-6 text-center text-crypto-danger">Failed to load strategy results.</div>
        )}
        {!isLoading && !error && (!runs?.length ? (
          <div className="p-6 text-center text-[var(--color-text-muted)]">No strategy runs yet. Run a strategy to the left.</div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {runs?.map((run) => (
              <div key={run.id} className="p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-medium text-[var(--color-text)]">{run.strategy_name}</span>
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {formatDate(run.run_at)} · {run.signals.length} signals
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {run.signals.map((s) => (
                    <span
                      key={`${run.id}-${s.symbol}`}
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        signalColors[s.signal] ?? "bg-[var(--color-border)] text-[var(--color-text)]"
                      )}
                      title={s.reason ?? undefined}
                    >
                      {s.symbol} {s.signal}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </Card>
    </div>
  );
}
