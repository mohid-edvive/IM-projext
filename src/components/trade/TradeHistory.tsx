import { useGameStore } from "@/store/gameStore";
import { getAssetById } from "@/data/assets";

function formatPrice(p: number): string {
  if (p >= 1000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  return `$${p.toFixed(4)}`;
}

export default function TradeHistory() {
  const tradeHistory = useGameStore((s) => s.tradeHistory);
  const recent = [...tradeHistory].reverse().slice(0, 20);

  if (recent.length === 0) {
    return (
      <div className="text-center py-6 text-[11px] text-muted-foreground">
        No trades yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-[9px] uppercase tracking-widest text-muted-foreground border-b border-border">
            <th className="text-left py-1.5 font-medium">Type</th>
            <th className="text-left py-1.5 font-medium">Asset</th>
            <th className="text-right py-1.5 font-medium">Qty</th>
            <th className="text-right py-1.5 font-medium">Price</th>
            <th className="text-right py-1.5 font-medium">Total</th>
            <th className="text-right py-1.5 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((trade) => {
            const asset = getAssetById(trade.assetId);
            const isBuy = trade.type === "buy";
            return (
              <tr key={trade.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-1.5">
                  <span className={`font-medium ${isBuy ? "text-gain" : "text-loss"}`}>
                    {isBuy ? "BUY" : "SELL"}
                  </span>
                </td>
                <td className="py-1.5 font-medium text-foreground">{asset?.ticker || trade.assetId}</td>
                <td className="py-1.5 text-right number-display text-foreground">
                  {trade.quantity.toFixed(trade.quantity < 1 ? 4 : 2)}
                </td>
                <td className="py-1.5 text-right number-display text-muted-foreground">{formatPrice(trade.pricePerUnit)}</td>
                <td className="py-1.5 text-right number-display font-medium text-foreground">{formatPrice(trade.totalValue)}</td>
                <td className="py-1.5 text-right number-display text-muted-foreground">{trade.date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
