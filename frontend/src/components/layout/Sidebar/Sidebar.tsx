import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../../utils/cn";

const nav = [
  { to: "/", label: "Dashboard" },
  { to: "/analysis", label: "Market Analysis" },
  { to: "/strategy", label: "Strategy & Backtest" },
  { to: "/settings", label: "Settings" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-48 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 backdrop-blur-xl">
      <nav className="flex flex-col gap-1">
        {nav.map(({ to, label }, i) => {
          const active = location.pathname === to;
          return (
            <motion.div
              key={to}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={to}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-crypto-primary/15 text-crypto-primary dark:bg-crypto-primary/20"
                    : "text-[var(--color-text-muted)] hover:bg-crypto-primary/10 hover:text-[var(--color-text)]"
                )}
              >
                {label}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </aside>
  );
}
