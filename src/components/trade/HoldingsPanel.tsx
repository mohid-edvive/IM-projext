import { useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { getAssetById } from "@/data/assets";
import { getPriceAtDate } from "@/data/priceData";
import { TrendingUp, TrendingDown } from "lucide-react";

function formatPrice(p: number): string {
  if (p >= 1000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  return `$${p.toFixed(4)}`;
}

export default function HoldingsPanel() {
  const holdings = useGameStore((s) => s.holdings);
  const currentDate = useGameStore((s) => s.currentDate);
  const walletBalance = useGameStore((s) => s.walletBalance);
  const getAvgCost = useGameStore((s) => s.getAvgCost);

  const holdingsList = useMemo(() => {
    return Object.entries(holdings)
      .filter(([, qty]) => qty > 0)
      .map(([assetId, qty]) => {
        const asset = getAssetById(assetId);
        const currentPrice = getPriceAtDate(assetId, currentDate);
        const currentValue = qty * currentPrice;
        const avgCost = getAvgCost(assetId);
        const costBasis = avgCost * qty;
        const unrealizedPL = currentValue - costBasis;
        const unrealizedPLPct = costBasis > 0 ? (unrealizedPL / costBasis) * 100 : 0;
        return {
          assetId,
          ticker: asset?.ticker || assetId,
          qty,
          currentPrice,
          currentValue,
          avgCost,
          costBasis,
          unrealizedPL,
          unrealizedPLPct,
        };
      })
      .sort((a, b) => b.currentValue - a.currentValue);
  }, [holdings, currentDate, getAvgCost]);

  const totalHoldingsValue = holdingsList.reduce((s, h) => s + h.currentValue, 0);
  const totalPortfolio = totalHoldingsValue + walletBalance;
  const totalUnrealizedPL = holdingsList.reduce((s, h) => s + h.unrealizedPL, 0);
  const totalCostBasis = holdingsList.reduce((s, h) => s + h.costBasis, 0);
  const totalUnrealizedPct = totalCostBasis > 0 ? (totalUnrealizedPL / totalCostBasis) * 100 : 0;

  if (holdingsList.length === 0) {
    return (
      <div className="text-center py-6 text-[11px] text-muted-foreground">
        No holdings yet — buy your first asset to start building your portfolio
      </div>
    );
  }

  return (
    <div>
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-2 mb-3 pb-3 border-b border-border">
        <div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Invested</div>
          <div className="number-display text-xs font-semibold text-foreground mt-0.5">{formatPrice(totalCostBasis)}</div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Market Value</div>
          <div className="number-display text-xs font-semibold text-foreground mt-0.5">{formatPrice(totalHoldingsValue)}</div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Unrealized P&L</div>
          <div className={`number-display text-xs font-semibold mt-0.5 flex items-center gap-1 ${totalUnrealizedPL >= 0 ? "text-gain" : "text-loss"}`}>
            {totalUnrealizedPL >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {totalUnrealizedPL >= 0 ? "+" : ""}{formatPrice(Math.abs(totalUnrealizedPL))}
            <span className="text-[9px]">({totalUnrealizedPct >= 0 ? "+" : ""}{totalUnrealizedPct.toFixed(1)}%)</span>
          </div>
        </div>
      </div>

      {/* Holdings table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="text-[9px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <th className="text-left py-1.5 font-medium">Asset</th>
              <th className="text-right py-1.5 font-medium">Qty</th>
              <th className="text-right py-1.5 font-medium">Avg Cost</th>
              <th className="text-right py-1.5 font-medium">Price</th>
              <th className="text-right py-1.5 font-medium">Value</th>
              <th className="text-right py-1.5 font-medium">P&L</th>
              <th className="text-right py-1.5 font-medium">Alloc%</th>
            </tr>
          </thead>
          <tbody>
            {holdingsList.map((h) => (
              <tr key={h.assetId} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-1.5 font-medium text-foreground">{h.ticker}</td>
                <td className="py-1.5 text-right number-display text-muted-foreground">
                  {h.qty.toFixed(h.qty < 1 ? 4 : 2)}
                </td>
                <td className="py-1.5 text-right number-display text-muted-foreground">
                  {h.avgCost > 0 ? formatPrice(h.avgCost) : "—"}
                </td>
                <td className="py-1.5 text-right number-display text-muted-foreground">
                  {formatPrice(h.currentPrice)}
                </td>
                <td className="py-1.5 text-right number-display font-medium text-foreground">
                  {formatPrice(h.currentValue)}
                </td>
                <td className="py-1.5 text-right">
                  <div className={`number-display font-medium ${h.unrealizedPL >= 0 ? "text-gain" : "text-loss"}`}>
                    {h.unrealizedPL >= 0 ? "+" : ""}{formatPrice(Math.abs(h.unrealizedPL))}
                  </div>
                  <div className={`text-[9px] number-display ${h.unrealizedPL >= 0 ? "text-gain" : "text-loss"}`}>
                    {h.unrealizedPLPct >= 0 ? "+" : ""}{h.unrealizedPLPct.toFixed(1)}%
                  </div>
                </td>
                <td className="py-1.5 text-right number-display text-muted-foreground">
                  {totalPortfolio > 0 ? ((h.currentValue / totalPortfolio) * 100).toFixed(1) : 0}%
                </td>
              </tr>
            ))}
            {walletBalance > 0 && (
              <tr className="border-b border-border/50">
                <td className="py-1.5 font-medium text-muted-foreground">Cash</td>
                <td className="py-1.5" />
                <td className="py-1.5" />
                <td className="py-1.5" />
                <td className="py-1.5 text-right number-display font-medium text-foreground">{formatPrice(walletBalance)}</td>
                <td className="py-1.5" />
                <td className="py-1.5 text-right number-display text-muted-foreground">
                  {totalPortfolio > 0 ? ((walletBalance / totalPortfolio) * 100).toFixed(1) : 0}%
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
