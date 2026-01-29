import { motion } from "framer-motion";
import type { MarketAssetWithPrice } from "../../../types/api";
import { formatPrice, formatVolume } from "../../../utils/format";
import { Card } from "../../common/Card";
import { cn } from "../../../utils/cn";

interface MarketOverviewCardsProps {
  assets: MarketAssetWithPrice[];
  selectedSymbol: string | null;
  onSelectSymbol: (symbol: string) => void;
  searchQuery?: string;
  maxCards?: number;
}

export function MarketOverviewCards({
  assets,
  selectedSymbol,
  onSelectSymbol,
  searchQuery = "",
  maxCards = 10,
}: MarketOverviewCardsProps) {
  const q = searchQuery.trim().toLowerCase();
  const filtered = q
    ? assets.filter(
        (a) =>
          a.symbol.toLowerCase().includes(q) ||
          (a.name?.toLowerCase().includes(q) ?? false)
      )
    : assets.slice(0, maxCards);
  const displayList = q ? filtered.slice(0, maxCards) : filtered;

  if (!displayList.length) {
    return (
      <Card title="Market Overview" noMotion>
        <div className="p-6 text-center text-[var(--color-text-muted)]">
          {assets.length === 0
            ? "No assets. Refresh data to load markets."
            : "No assets match your search."}
        </div>
      </Card>
    );
  }

  return (
    <Card title="Market Overview (Top crypto)" noMotion>
      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {displayList.map((asset, i) => {
          const selected = selectedSymbol === asset.symbol;
          return (
            <motion.button
              key={asset.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => onSelectSymbol(asset.symbol)}
              title={`View full chart for ${asset.symbol}`}
              aria-label={`View full chart for ${asset.symbol}`}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                "border-[var(--color-border)] bg-[var(--color-bg)] hover:border-crypto-primary/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-crypto-primary focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]",
                selected && "border-crypto-primary ring-2 ring-crypto-primary/30"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-[var(--color-text)]">
                  {asset.symbol}
                </span>
                {asset.name && (
                  <span className="truncate text-xs text-[var(--color-text-muted)]" title={asset.name}>
                    {asset.name}
                  </span>
                )}
              </div>
              <div className="mt-2 font-mono text-lg tabular-nums text-[var(--color-text)]">
                {formatPrice(asset.latest_price)}
              </div>
              <div className="mt-1 text-xs font-mono text-[var(--color-text-muted)]">
                Vol {formatVolume(asset.latest_volume)}
              </div>
            </motion.button>
          );
        })}
      </div>
    </Card>
  );
}
