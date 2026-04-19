import { useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { getAssetById } from "@/data/assets";
import { getPriceAtDate } from "@/data/priceData";
import { TrendingUp, TrendingDown, Package } from "lucide-react";

function fmt(p: number): string {
  if (p >= 1000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  return `$${p.toFixed(4)}`;
}

export default function HoldingsPanel() {
  const holdings      = useGameStore((s) => s.holdings);
  const currentDate   = useGameStore((s) => s.currentDate);
  const walletBalance = useGameStore((s) => s.walletBalance);
  const getAvgCost    = useGameStore((s) => s.getAvgCost);

  const holdingsList = useMemo(() =>
    Object.entries(holdings)
      .filter(([, qty]) => qty > 0)
      .map(([assetId, qty]) => {
        const asset        = getAssetById(assetId);
        const currentPrice = getPriceAtDate(assetId, currentDate);
        const currentValue = qty * currentPrice;
        const avgCost      = getAvgCost(assetId);
        const costBasis    = avgCost * qty;
        const unrealizedPL    = currentValue - costBasis;
        const unrealizedPLPct = costBasis > 0 ? (unrealizedPL / costBasis) * 100 : 0;
        return { assetId, ticker: asset?.ticker ?? assetId, name: asset?.name ?? assetId,
          qty, currentPrice, currentValue, avgCost, costBasis, unrealizedPL, unrealizedPLPct };
      })
      .sort((a, b) => b.currentValue - a.currentValue),
  [holdings, currentDate, getAvgCost]);

  const totalHoldings    = holdingsList.reduce((s, h) => s + h.currentValue, 0);
  const totalPortfolio   = totalHoldings + walletBalance;
  const totalCostBasis   = holdingsList.reduce((s, h) => s + h.costBasis, 0);
  const totalUnrealized  = holdingsList.reduce((s, h) => s + h.unrealizedPL, 0);
  const totalUnrealPct   = totalCostBasis > 0 ? (totalUnrealized / totalCostBasis) * 100 : 0;
  const isGain           = totalUnrealized >= 0;

  if (holdingsList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
        <Package className="h-8 w-8 text-border" />
        <div>
          <p className="font-serif italic text-foreground mb-1">No open positions</p>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            Buy an asset to start building your portfolio
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Summary row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-px bg-border border border-border mb-4">
        {[
          { label: "Cost Basis", value: fmt(totalCostBasis), color: "text-foreground" },
          { label: "Market Value", value: fmt(totalHoldings),  color: "text-foreground" },
          {
            label: "Unrealized P&L",
            value: `${isGain ? "+" : ""}${fmt(Math.abs(totalUnrealized))}`,
            sub: `${totalUnrealPct >= 0 ? "+" : ""}${totalUnrealPct.toFixed(1)}%`,
            color: isGain ? "text-gain" : "text-loss",
            Icon: isGain ? TrendingUp : TrendingDown,
          },
        ].map((s) => (
          <div key={s.label} className="px-3 py-2.5 bg-background">
            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground mb-1 flex items-center gap-1">
              {s.Icon && <s.Icon className="h-2.5 w-2.5" />}
              {s.label}
            </p>
            <p className={`number-display text-sm font-semibold ${s.color}`}>{s.value}</p>
            {s.sub && <p className={`number-display text-[9px] ${s.color} opacity-70`}>{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* P&L summary bar */}
      <div className="h-px w-full bg-border mb-4 relative overflow-hidden">
        <div className={`h-full transition-all duration-700 ${isGain ? "bg-gain" : "bg-loss"}`}
          style={{ width: `${Math.min(100, Math.abs(totalUnrealPct))}%` }} />
      </div>

      {/* ── Holdings table ─────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground border-b border-border">
              <th className="text-left py-1.5 font-medium">Asset</th>
              <th className="text-right py-1.5 font-medium">Qty</th>
              <th className="text-right py-1.5 font-medium">Avg Cost</th>
              <th className="text-right py-1.5 font-medium">Price</th>
              <th className="text-right py-1.5 font-medium">Value</th>
              <th className="text-right py-1.5 font-medium">P&L</th>
              <th className="text-right py-1.5 font-medium">Alloc</th>
            </tr>
          </thead>
          <tbody>
            {holdingsList.map((h) => {
              const allocPct  = totalPortfolio > 0 ? (h.currentValue / totalPortfolio) * 100 : 0;
              const isRowGain = h.unrealizedPL >= 0;
              return (
                <tr key={h.assetId} className="border-b border-border/50 hover:bg-muted/20 transition-colors group relative">
                  <td className="py-2">
                    <div className="font-semibold text-foreground">{h.ticker}</div>
                    <div className="font-mono text-[8px] text-muted-foreground truncate max-w-[80px]">{h.name}</div>
                  </td>
                  <td className="py-2 text-right number-display text-muted-foreground">
                    {h.qty.toFixed(h.qty < 1 ? 4 : 2)}
                  </td>
                  <td className="py-2 text-right number-display text-muted-foreground">
                    {h.avgCost > 0 ? fmt(h.avgCost) : "—"}
                  </td>
                  <td className="py-2 text-right number-display text-muted-foreground">
                    {fmt(h.currentPrice)}
                  </td>
                  <td className="py-2 text-right number-display font-semibold text-foreground">
                    {fmt(h.currentValue)}
                  </td>
                  <td className="py-2 text-right">
                    <div className={`number-display font-semibold text-[11px] ${isRowGain ? "text-gain" : "text-loss"}`}>
                      {isRowGain ? "+" : ""}{fmt(Math.abs(h.unrealizedPL))}
                    </div>
                    <div className={`number-display text-[9px] ${isRowGain ? "text-gain" : "text-loss"} opacity-80`}>
                      {h.unrealizedPLPct >= 0 ? "+" : ""}{h.unrealizedPLPct.toFixed(1)}%
                    </div>
                  </td>
                  <td className="py-2 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="number-display text-[10px] text-muted-foreground">{allocPct.toFixed(1)}%</span>
                      {/* Allocation mini-bar */}
                      <div className="w-10 h-0.5 bg-border overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${isRowGain ? "bg-gain/60" : "bg-loss/60"}`}
                          style={{ width: `${Math.min(100, allocPct)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Cash row */}
            {walletBalance > 0 && (
              <tr className="border-b border-border/30">
                <td className="py-2">
                  <div className="font-semibold text-muted-foreground">Cash</div>
                  <div className="font-mono text-[8px] text-muted-foreground/60">Available to trade</div>
                </td>
                <td colSpan={3} />
                <td className="py-2 text-right number-display font-semibold text-foreground">{fmt(walletBalance)}</td>
                <td />
                <td className="py-2 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className="number-display text-[10px] text-muted-foreground">
                      {totalPortfolio > 0 ? ((walletBalance / totalPortfolio) * 100).toFixed(1) : 0}%
                    </span>
                    <div className="w-10 h-0.5 bg-border overflow-hidden">
                      <div className="h-full bg-muted-foreground/40 transition-all duration-500"
                        style={{ width: `${totalPortfolio > 0 ? Math.min(100, (walletBalance / totalPortfolio) * 100) : 0}%` }} />
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
