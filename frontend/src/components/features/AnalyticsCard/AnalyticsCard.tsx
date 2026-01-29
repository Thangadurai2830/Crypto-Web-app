import type { AssetAnalytics } from "../../../types/api";
import { formatPrice, formatVolume, formatPct } from "../../../utils/format";
import { cn } from "../../../utils/cn";
import { Card } from "../../common/Card";
import { Table, TableHead, TableBody, TableRow, Th, Td } from "../../common/Table";

interface AnalyticsCardProps {
  assets: AssetAnalytics[];
  windowHours: number;
  isLoading?: boolean;
}

export function AnalyticsCard({ assets, windowHours, isLoading }: AnalyticsCardProps) {
  if (isLoading) {
    return (
      <Card title={`Analytics (${windowHours}h window)`}>
        <div className="p-6 text-center text-[var(--color-text-muted)]">Loading analytics…</div>
      </Card>
    );
  }

  if (!assets.length) {
    return (
      <Card title={`Analytics (${windowHours}h window)`}>
        <div className="p-6 text-center text-[var(--color-text-muted)]">No analytics. Ensure market data is ingested.</div>
      </Card>
    );
  }

  return (
    <Card title={`Analytics (${windowHours}h window)`}>
      <Table>
        <TableHead>
          <tr>
            <Th>Symbol</Th>
            <Th className="text-right">Price</Th>
            <Th className="text-right">Volume</Th>
            <Th className="text-right">Price Δ%</Th>
            <Th className="text-right">Volume Δ%</Th>
            <Th className="text-right">Momentum</Th>
          </tr>
        </TableHead>
        <TableBody>
          {assets.map((a) => (
            <TableRow key={a.symbol}>
              <Td className="font-medium">{a.symbol}</Td>
              <Td className="text-right font-num">{formatPrice(a.current_price)}</Td>
              <Td className="text-right font-num text-[var(--color-text-muted)]">{formatVolume(a.current_volume)}</Td>
              <Td
                className={cn(
                  "text-right font-medium font-num",
                  a.price_change_pct != null && a.price_change_pct >= 0 && "text-crypto-success",
                  a.price_change_pct != null && a.price_change_pct < 0 && "text-crypto-danger"
                )}
              >
                {formatPct(a.price_change_pct)}
              </Td>
              <Td
                className={cn(
                  "text-right font-num",
                  a.volume_change_pct != null && a.volume_change_pct >= 0 && "text-crypto-success",
                  a.volume_change_pct != null && a.volume_change_pct < 0 && "text-crypto-danger"
                )}
              >
                {formatPct(a.volume_change_pct)}
              </Td>
              <Td
                className={cn(
                  "text-right font-num",
                  a.momentum != null && a.momentum >= 0 && "text-crypto-success",
                  a.momentum != null && a.momentum < 0 && "text-crypto-danger"
                )}
              >
                {formatPct(a.momentum)}
              </Td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
