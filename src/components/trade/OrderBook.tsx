import { useMemo } from "react";
import { getPriceAtDate } from "@/data/priceData";
import { useGameStore } from "@/store/gameStore";

function formatPrice(p: number): string {
  if (p >= 1000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  return `$${p.toFixed(4)}`;
}

interface OrderBookProps {
  assetId: string;
}

export default function OrderBook({ assetId }: OrderBookProps) {
  const currentDate = useGameStore((s) => s.currentDate);
  const currentPrice = getPriceAtDate(assetId, currentDate);

  const { bids, asks } = useMemo(() => {
    const spread = currentPrice * 0.002;
    const bids = Array.from({ length: 8 }, (_, i) => {
      const price = currentPrice - spread * (i + 1);
      const size = Math.round(50 + Math.random() * 500);
      return { price, size, total: price * size };
    });
    const asks = Array.from({ length: 8 }, (_, i) => {
      const price = currentPrice + spread * (i + 1);
      const size = Math.round(50 + Math.random() * 500);
      return { price, size, total: price * size };
    });
    return { bids, asks: asks.reverse() };
  }, [currentPrice, currentDate]);

  const maxSize = Math.max(...[...bids, ...asks].map((o) => o.size));

  return (
    <div className="text-[10px] number-display">
      {/* Header */}
      <div className="flex justify-between text-[8px] uppercase tracking-widest text-muted-foreground mb-1 px-0.5 border-b border-border pb-1">
        <span>Price</span>
        <span>Size</span>
      </div>

      {/* Asks */}
      <div className="space-y-0 mb-1">
        {asks.map((a, i) => (
          <div key={`ask-${i}`} className="relative flex justify-between px-0.5 py-0.5">
            <div className="absolute inset-y-0 right-0 bg-loss/6" style={{ width: `${(a.size / maxSize) * 100}%` }} />
            <span className="relative text-loss">{formatPrice(a.price)}</span>
            <span className="relative text-muted-foreground">{a.size.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Spread */}
      <div className="flex justify-center py-1 my-0.5 border-y border-border">
        <span className="text-xs font-semibold text-foreground">{formatPrice(currentPrice)}</span>
      </div>

      {/* Bids */}
      <div className="space-y-0 mt-1">
        {bids.map((b, i) => (
          <div key={`bid-${i}`} className="relative flex justify-between px-0.5 py-0.5">
            <div className="absolute inset-y-0 right-0 bg-gain/6" style={{ width: `${(b.size / maxSize) * 100}%` }} />
            <span className="relative text-gain">{formatPrice(b.price)}</span>
            <span className="relative text-muted-foreground">{b.size.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
