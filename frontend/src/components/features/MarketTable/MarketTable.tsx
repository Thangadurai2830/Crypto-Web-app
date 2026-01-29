import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { MarketAssetWithPrice } from "../../../types/api";
import { formatPrice, formatVolume, formatDate } from "../../../utils/format";
import { Card } from "../../common/Card";
import { Table, TableHead, TableBody, TableRow, Th, Td } from "../../common/Table";
import { cn } from "../../../utils/cn";

const VIRTUAL_SCROLL_THRESHOLD = 25;
const ROW_HEIGHT = 48;
const VIRTUAL_MAX_HEIGHT = 400;

interface MarketTableProps {
  assets: MarketAssetWithPrice[];
  onSelectSymbol?: (symbol: string) => void;
  selectedSymbol?: string | null;
  isLoading?: boolean;
}

export function MarketTable({
  assets,
  onSelectSymbol,
  selectedSymbol,
  isLoading,
}: MarketTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <Card>
        <div className="p-6 text-center text-[var(--color-text-muted)]">Loading markets…</div>
      </Card>
    );
  }

  if (!assets.length) {
    return (
      <Card>
        <div className="p-6 text-center text-[var(--color-text-muted)]">No assets. Trigger ingest to fetch data.</div>
      </Card>
    );
  }

  const useVirtual = assets.length > VIRTUAL_SCROLL_THRESHOLD;

  if (useVirtual) {
    const virtualizer = useVirtualizer({
      count: assets.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => ROW_HEIGHT,
      overscan: 5,
    });
    const totalHeight = virtualizer.getTotalSize();
    const virtualItems = virtualizer.getVirtualItems();

    return (
      <Card noMotion>
        <div className="min-w-full divide-y divide-[var(--color-border)]">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 bg-[var(--color-bg)] px-4 py-2.5 text-left text-xs font-semibold uppercase text-[var(--color-text-muted)] sm:grid-cols-[1fr_auto_6rem_8rem]">
            <span>Symbol</span>
            <span className="text-right">Price</span>
            <span className="hidden text-right sm:block">Volume</span>
            <span className="hidden text-right md:block">Updated</span>
          </div>
        </div>
        <div ref={parentRef} className="overflow-auto" style={{ maxHeight: VIRTUAL_MAX_HEIGHT }}>
          <div style={{ height: totalHeight, position: "relative", width: "100%" }}>
            {virtualItems.map((virtualRow) => {
              const asset = assets[virtualRow.index];
              const selected = selectedSymbol === asset.symbol;
              return (
                <div
                  key={asset.id}
                  role="row"
                  tabIndex={0}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className={cn(
                    "grid grid-cols-[1fr_auto_auto_auto] gap-2 border-b border-[var(--color-border)] px-4 py-2.5 sm:grid-cols-[1fr_auto_6rem_8rem]",
                    onSelectSymbol && "cursor-pointer hover:bg-crypto-primary/10 dark:hover:bg-crypto-primary/20",
                    selected && "bg-crypto-primary/10 dark:bg-crypto-primary/20"
                  )}
                  onClick={() => onSelectSymbol?.(asset.symbol)}
                >
                  <span className="font-medium text-[var(--color-text)]">
                    {asset.symbol}
                    {asset.name && (
                      <span className="ml-1 text-sm text-[var(--color-text-muted)]">({asset.name})</span>
                    )}
                  </span>
                  <span className="text-right font-mono font-medium tabular-nums">
                    {formatPrice(asset.latest_price)}
                  </span>
                  <span className="hidden text-right font-mono text-[var(--color-text-muted)] sm:block">
                    {formatVolume(asset.latest_volume)}
                  </span>
                  <span className="hidden text-right text-sm text-[var(--color-text-muted)] md:block">
                    {formatDate(asset.latest_timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card noMotion>
      <Table>
        <TableHead>
          <tr>
            <Th>Symbol</Th>
            <Th className="text-right">Price</Th>
            <Th className="hidden text-right sm:table-cell">Volume</Th>
            <Th className="hidden text-right md:table-cell">Updated</Th>
          </tr>
        </TableHead>
        <TableBody>
          {assets.map((asset) => (
            <TableRow
              key={asset.id}
              clickable={!!onSelectSymbol}
              selected={selectedSymbol === asset.symbol}
              onClick={() => onSelectSymbol?.(asset.symbol)}
            >
              <Td>
                <span className="font-medium text-[var(--color-text)]">{asset.symbol}</span>
                {asset.name && (
                  <span className="ml-1 text-sm text-[var(--color-text-muted)]">({asset.name})</span>
                )}
              </Td>
              <Td className="text-right font-medium font-num">{formatPrice(asset.latest_price)}</Td>
              <Td className="hidden text-right font-num text-[var(--color-text-muted)] sm:table-cell">
                {formatVolume(asset.latest_volume)}
              </Td>
              <Td className="hidden text-right text-sm text-[var(--color-text-muted)] md:table-cell">
                {formatDate(asset.latest_timestamp)}
              </Td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
