import { Link } from "react-router-dom";
import { Button } from "../../common/Button";
import { cn } from "../../../utils/cn";

interface QuickActionsProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onRunStrategy?: () => void;
  isRunningStrategy?: boolean;
}

export function QuickActions({
  onRefresh,
  isRefreshing,
  onRunStrategy,
  isRunningStrategy,
}: QuickActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {onRefresh != null && (
        <Button
          variant="primary"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? "Refreshing…" : "Refresh market data"}
        </Button>
      )}
      {onRunStrategy != null && (
        <Button
          variant="success"
          onClick={onRunStrategy}
          disabled={isRunningStrategy}
        >
          {isRunningStrategy ? "Running…" : "Run strategy"}
        </Button>
      )}
      <Link
        to="/analysis"
        className={cn(
          "inline-flex items-center rounded-lg border border-gray-300 bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700/80"
        )}
      >
        Market Analysis
      </Link>
      <Link
        to="/strategy"
        className={cn(
          "inline-flex items-center rounded-lg border border-gray-300 bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700/80"
        )}
      >
        Strategy & Backtest
      </Link>
    </div>
  );
}
