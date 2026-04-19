import { useState, useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { getAssetById } from "@/data/assets";
import { getPriceAtDate, getPriceChange } from "@/data/priceData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function fmt(p: number): string {
  if (p >= 1000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 1)    return `$${p.toFixed(2)}`;
  return `$${p.toFixed(4)}`;
}

interface TradePanelProps { assetId: string }

export default function TradePanel({ assetId }: TradePanelProps) {
  const walletBalance  = useGameStore((s) => s.walletBalance);
  const holdings       = useGameStore((s) => s.holdings);
  const unlockedAssets = useGameStore((s) => s.unlockedAssets);
  const currentDate    = useGameStore((s) => s.currentDate);
  const buyAsset       = useGameStore((s) => s.buyAsset);
  const sellAsset      = useGameStore((s) => s.sellAsset);
  const getAvgCost     = useGameStore((s) => s.getAvgCost);

  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [inputMode, setInputMode] = useState<"amount" | "qty">("amount");
  const [inputValue, setInputValue] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const asset        = getAssetById(assetId);
  const isUnlocked   = unlockedAssets.includes(assetId);
  const currentPrice = getPriceAtDate(assetId, currentDate);
  const holdingQty   = holdings[assetId] || 0;
  const { changePercent } = getPriceChange(assetId, currentDate);
  const isUp = changePercent >= 0;

  const positionStats = useMemo(() => {
    if (holdingQty <= 0) return null;
    const avgCost     = getAvgCost(assetId);
    const currentValue = holdingQty * currentPrice;
    const costBasis   = avgCost * holdingQty;
    const pl          = currentValue - costBasis;
    const plPct       = costBasis > 0 ? (pl / costBasis) * 100 : 0;
    return { avgCost, currentValue, pl, plPct };
  }, [holdingQty, currentPrice, getAvgCost, assetId]);

  const rawInput  = parseFloat(inputValue) || 0;
  const qty       = inputMode === "qty" ? rawInput : (currentPrice > 0 ? rawInput / currentPrice : 0);
  const totalCost = qty * currentPrice;

  // % quick-select buttons
  const PCT_OPTS = [25, 50, 75, 100];
  const handlePct = (pct: number) => {
    if (tradeType === "buy") {
      setInputMode("amount");
      setInputValue(((walletBalance * pct) / 100).toFixed(2));
    } else {
      setInputMode("qty");
      setInputValue(((holdingQty * pct) / 100).toFixed(4));
    }
  };

  const canTrade = () => {
    if (qty <= 0 || !isUnlocked) return false;
    if (tradeType === "buy") return walletBalance >= totalCost;
    return holdingQty >= qty;
  };

  const handleTrade = () => {
    if (!canTrade()) return;
    if (tradeType === "buy") buyAsset(assetId, qty, currentPrice);
    else sellAsset(assetId, qty, currentPrice);
    setInputValue("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  if (!asset) return null;

  // Position allocation as % of total estimated portfolio
  const positionPct = holdingQty > 0
    ? (holdingQty * currentPrice) / Math.max(1, walletBalance + holdingQty * currentPrice) * 100
    : 0;

  return (
    <div className="flex flex-col h-full gap-3">

      {/* Buy / Sell toggle */}
      <div className="grid grid-cols-2 border border-border">
        {(["buy", "sell"] as const).map((side) => (
          <button key={side} onClick={() => { setTradeType(side); setInputValue(""); }}
            className={`py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
              side === "sell" ? "border-l border-border" : ""
            } ${tradeType === side ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
          >
            {side}
          </button>
        ))}
      </div>

      {!isUnlocked ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Lock className="mx-auto h-4 w-4 text-muted-foreground mb-2" />
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Asset locked</p>
            <p className="font-serif italic text-[11px] text-muted-foreground mt-1">Complete the required lesson</p>
          </div>
        </div>
      ) : (
        <>
          {/* Price + momentum */}
          <div className="flex items-center justify-between px-2 py-1.5 bg-muted/30 border border-border">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground">Market Price</p>
              <p className="number-display text-base font-semibold text-foreground">{fmt(currentPrice)}</p>
            </div>
            <div className={`flex items-center gap-1 ${isUp ? "text-gain" : "text-loss"}`}>
              {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              <span className="number-display text-sm font-semibold">
                {isUp ? "+" : ""}{changePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Amount / Qty mode toggle */}
          <div className="grid grid-cols-2 border border-border text-[9px]">
            {(["amount", "qty"] as const).map((mode, i) => (
              <button key={mode} onClick={() => { setInputMode(mode); setInputValue(""); }}
                className={`py-1 font-mono font-medium uppercase tracking-wider transition-colors ${
                  i === 1 ? "border-l border-border" : ""
                } ${inputMode === mode ? "bg-muted text-foreground" : "text-muted-foreground"}`}
              >
                {mode === "amount" ? "$ Amount" : "# Shares"}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="relative">
            <Input
              type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputMode === "amount" ? "0.00" : "0.0000"}
              min="0" className="number-display text-sm h-9 border-border pr-14"
              style={{ borderRadius: "2px" }}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] text-muted-foreground uppercase">
              {inputMode === "amount" ? "USD" : "QTY"}
            </span>
          </div>

          {/* % quick buttons */}
          <div className="grid grid-cols-4 border border-border">
            {PCT_OPTS.map((pct, i) => (
              <button key={pct} onClick={() => handlePct(pct)}
                className={`py-1 font-mono text-[9px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
                  i < 3 ? "border-r border-border" : ""
                }`}
              >
                {pct === 100 ? "MAX" : `${pct}%`}
              </button>
            ))}
          </div>

          {/* Position allocation gauge (only if holding) */}
          {holdingQty > 0 && (
            <div className="border border-border px-2.5 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
                  Your Position
                </span>
                <span className="number-display text-[10px] text-foreground">
                  {holdingQty.toFixed(holdingQty < 1 ? 4 : 2)} shares · {positionPct.toFixed(1)}% of portfolio
                </span>
              </div>
              <div className="h-px bg-border w-full relative overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${positionStats && positionStats.pl >= 0 ? "bg-gain" : "bg-loss"}`}
                  style={{ width: `${Math.min(100, positionPct)}%` }}
                />
              </div>
            </div>
          )}

          {/* Order summary */}
          <div className="space-y-1.5 text-[11px] border-t border-border pt-2 flex-1">
            {inputMode === "amount" && qty > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">≈ Shares</span>
                <span className="number-display text-foreground">{qty.toFixed(4)}</span>
              </div>
            )}
            {inputMode === "qty" && rawInput > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order total</span>
                <span className="number-display font-medium text-foreground">{fmt(totalCost)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cash available</span>
              <span className="number-display font-medium text-foreground">{fmt(walletBalance)}</span>
            </div>
            {positionStats && (
              <>
                <div className="border-t border-border/50 my-1" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg cost</span>
                  <span className="number-display text-foreground">{fmt(positionStats.avgCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Unrealized P&L</span>
                  <span className={`number-display font-semibold flex items-center gap-0.5 text-[11px] ${positionStats.pl >= 0 ? "text-gain" : "text-loss"}`}>
                    {positionStats.pl >= 0 ? "+" : ""}{fmt(Math.abs(positionStats.pl))}
                    <span className="text-[9px] opacity-80">({positionStats.plPct >= 0 ? "+" : ""}{positionStats.plPct.toFixed(1)}%)</span>
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Error */}
          {tradeType === "buy" && rawInput > 0 && walletBalance < totalCost && (
            <p className="font-mono text-[9px] text-destructive">Insufficient funds — need {fmt(totalCost - walletBalance)} more</p>
          )}
          {tradeType === "sell" && rawInput > 0 && holdingQty < qty && (
            <p className="font-mono text-[9px] text-destructive">Insufficient shares — you hold {holdingQty.toFixed(4)}</p>
          )}

          {/* Trade button */}
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div key="success" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 py-2.5 text-[11px] font-semibold text-gain border border-gain/30 bg-gain/5"
                style={{ borderRadius: "2px" }}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Order filled — {tradeType === "buy" ? "bought" : "sold"} {qty.toFixed(qty < 1 ? 4 : 2)} {asset.ticker}
              </motion.div>
            ) : (
              <motion.div key="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button onClick={handleTrade} disabled={!canTrade()} size="sm"
                  className={`w-full font-mono text-[10px] font-semibold uppercase tracking-[0.12em] ${
                    tradeType === "buy"
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                  style={{ borderRadius: "2px" }}
                >
                  {tradeType === "buy" ? "Buy" : "Sell"} {asset.ticker}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
