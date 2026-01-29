import { motion } from "framer-motion";

interface FooterProps {
  /** Optional status message, e.g. "All systems operational" */
  status?: string;
  /** When true, show warning (amber) dot instead of success (green) */
  statusWarning?: boolean;
  /** Optional hint when backend unreachable, e.g. how to start backend */
  statusHint?: string;
  /** Optional last updated timestamp or message */
  lastUpdated?: string;
}

export function Footer({ status, statusWarning, statusHint, lastUpdated }: FooterProps) {
  const dotClass = statusWarning
    ? "h-2 w-2 rounded-full bg-amber-500"
    : "h-2 w-2 rounded-full bg-crypto-success";
  const displayStatus = status != null && status !== "" ? status : "All systems operational";

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-t border-[var(--color-border)] bg-[var(--color-bg-card)] py-4 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--color-text-muted)]">
          <span className="inline-flex flex-wrap items-center gap-1.5">
            <span className={dotClass} aria-hidden />
            {displayStatus}
          </span>
          {statusHint != null && statusHint !== "" && (
            <span className="text-xs opacity-90">{statusHint}</span>
          )}
          {lastUpdated != null && lastUpdated !== "" && (
            <span>Last updated: {lastUpdated}</span>
          )}
        </div>
        <div className="text-sm text-[var(--color-text-muted)]">
          Data from CoinGecko
        </div>
      </div>
    </motion.footer>
  );
}
