import { useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { getPriceAtDate } from "@/data/priceData";

function formatPrice(p: number): string {
  if (p >= 1000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  return `$${p.toFixed(4)}`;
}

export default function PortfolioBar() {
  const walletBalance = useGameStore((s) => s.walletBalance);
  const holdings = useGameStore((s) => s.holdings);
  const currentDate = useGameStore((s) => s.currentDate);
  const totalEarned = useGameStore((s) => s.totalEarned);

  const holdingsValue = useMemo(() => {
    return Object.entries(holdings).reduce((sum, [assetId, q]) => {
      if (q <= 0) return sum;
      return sum + q * getPriceAtDate(assetId, currentDate);
    }, 0);
  }, [holdings, currentDate]);

  const portfolioValue = walletBalance + holdingsValue;
  const profitLoss = portfolioValue - totalEarned;
  const plPercent = totalEarned > 0 ? (profitLoss / totalEarned) * 100 : 0;
  const assetCount = Object.entries(holdings).filter(([, q]) => q > 0).length;

  const stats = [
    { label: "Portfolio", value: formatPrice(portfolioValue) },
    { label: "Cash", value: formatPrice(walletBalance) },
    { label: "Holdings", value: formatPrice(holdingsValue) },
    { label: "P&L", value: `${profitLoss >= 0 ? "+" : ""}${formatPrice(Math.abs(profitLoss))}`, color: profitLoss >= 0 ? "text-gain" : "text-loss" },
    { label: "Return", value: `${profitLoss >= 0 ? "+" : ""}${plPercent.toFixed(1)}%`, color: profitLoss >= 0 ? "text-gain" : "text-loss" },
    { label: "Positions", value: `${assetCount}` },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 border border-border rounded-lg divide-x divide-border">
      {stats.map((s) => (
        <div key={s.label} className="px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{s.label}</p>
          <p className={`number-display text-sm font-semibold mt-0.5 ${s.color || "text-foreground"}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}
