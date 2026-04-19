import { useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { getPriceAtDate } from "@/data/priceData";
import { TrendingUp, TrendingDown } from "lucide-react";

function fmt(p: number): string {
  if (p >= 1_000_000) return `$${(p / 1_000_000).toFixed(2)}M`;
  if (p >= 1000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  return `$${p.toFixed(4)}`;
}

export default function PortfolioBar() {
  const walletBalance  = useGameStore((s) => s.walletBalance);
  const holdings       = useGameStore((s) => s.holdings);
  const currentDate    = useGameStore((s) => s.currentDate);
  const totalEarned    = useGameStore((s) => s.totalEarned);
  const clockStartedAt = useGameStore((s) => s.clockStartedAt);
  const tradeHistory   = useGameStore((s) => s.tradeHistory);

  const holdingsValue = useMemo(() =>
    Object.entries(holdings).reduce((sum, [assetId, q]) =>
      q > 0 ? sum + q * getPriceAtDate(assetId, currentDate) : sum, 0),
  [holdings, currentDate]);

  const portfolioValue = walletBalance + holdingsValue;
  const profitLoss     = portfolioValue - totalEarned;
  const plPercent      = totalEarned > 0 ? (profitLoss / totalEarned) * 100 : 0;
  const isGain         = profitLoss >= 0;
  const positionCount  = Object.values(holdings).filter((q) => q > 0).length;

  // Realized P&L from closed trades
  const realizedPL = useMemo(() => {
    let totalCost: Record<string, number> = {};
    let totalQty:  Record<string, number> = {};
    let realized = 0;
    for (const t of tradeHistory) {
      const id = t.assetId;
      if (t.type === "buy") {
        totalCost[id] = (totalCost[id] ?? 0) + t.quantity * t.pricePerUnit;
        totalQty[id]  = (totalQty[id]  ?? 0) + t.quantity;
      } else {
        const qty = totalQty[id] ?? 0;
        if (qty > 0) {
          const avgCost = (totalCost[id] ?? 0) / qty;
          realized += (t.pricePerUnit - avgCost) * t.quantity;
          const removed = avgCost * t.quantity;
          totalCost[id] = Math.max(0, (totalCost[id] ?? 0) - removed);
          totalQty[id]  = Math.max(0, qty - t.quantity);
        }
      }
    }
    return realized;
  }, [tradeHistory]);

  // Sim elapsed display
  const simElapsed = useMemo(() => {
    if (!clockStartedAt) return null;
    const from  = "Jan 2020";
    const [yr, mo] = currentDate.split("-").map(Number);
    const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const to = `${names[mo - 1]} ${yr}`;
    return { from, to };
  }, [clockStartedAt, currentDate]);

  const stats = [
    {
      label: "Portfolio",
      value: fmt(portfolioValue),
      sub: simElapsed ? `${simElapsed.from} → ${simElapsed.to}` : "Total value",
      color: "text-foreground",
    },
    {
      label: "Cash",
      value: fmt(walletBalance),
      sub: totalEarned > 0 ? `${((walletBalance / portfolioValue) * 100).toFixed(0)}% of portfolio` : "Available",
      color: "text-foreground",
    },
    {
      label: "Holdings",
      value: fmt(holdingsValue),
      sub: `${positionCount} position${positionCount !== 1 ? "s" : ""}`,
      color: "text-foreground",
    },
    {
      label: "Total P&L",
      value: `${isGain ? "+" : ""}${fmt(Math.abs(profitLoss))}`,
      sub: `${isGain ? "+" : ""}${plPercent.toFixed(1)}% return`,
      color: isGain ? "text-gain" : "text-loss",
      Icon: isGain ? TrendingUp : TrendingDown,
    },
    {
      label: "Realized P&L",
      value: `${realizedPL >= 0 ? "+" : ""}${fmt(Math.abs(realizedPL))}`,
      sub: "Closed trades",
      color: realizedPL >= 0 ? "text-gain" : "text-loss",
    },
    {
      label: "Unrealized",
      value: `${(profitLoss - realizedPL) >= 0 ? "+" : ""}${fmt(Math.abs(profitLoss - realizedPL))}`,
      sub: "Open positions",
      color: (profitLoss - realizedPL) >= 0 ? "text-gain" : "text-loss",
    },
  ];

  return (
    <div className="border border-border overflow-hidden">
      {/* Stats grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-border">
        {stats.map((s) => (
          <div key={s.label} className="px-3 py-2.5 relative">
            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground mb-1 flex items-center gap-1">
              {s.Icon && <s.Icon className="h-2.5 w-2.5 shrink-0" />}
              {s.label}
            </p>
            <p className={`number-display text-sm font-semibold ${s.color}`}>{s.value}</p>
            <p className="font-mono text-[8px] text-muted-foreground/60 mt-0.5 truncate">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* P&L accent bar at bottom */}
      <div className="h-0.5 w-full relative bg-border">
        <div
          className={`h-full transition-all duration-700 ${isGain ? "bg-gain" : "bg-loss"}`}
          style={{ width: `${Math.min(100, Math.abs(plPercent))}%` }}
        />
      </div>
    </div>
  );
}
