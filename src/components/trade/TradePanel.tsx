import { useState, useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { getAssetById } from "@/data/assets";
import { getPriceAtDate } from "@/data/priceData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function formatPrice(p: number): string {
  if (p >= 1000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  return `$${p.toFixed(4)}`;
}

interface TradePanelProps {
  assetId: string;
}

export default function TradePanel({ assetId }: TradePanelProps) {
  const walletBalance = useGameStore((s) => s.walletBalance);
  const holdings = useGameStore((s) => s.holdings);
  const unlockedAssets = useGameStore((s) => s.unlockedAssets);
  const currentDate = useGameStore((s) => s.currentDate);
  const buyAsset = useGameStore((s) => s.buyAsset);
  const sellAsset = useGameStore((s) => s.sellAsset);
  const getAvgCost = useGameStore((s) => s.getAvgCost);

  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [inputMode, setInputMode] = useState<"amount" | "qty">("amount");
  const [inputValue, setInputValue] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const asset = getAssetById(assetId);
  const isUnlocked = unlockedAssets.includes(assetId);
  const currentPrice = getPriceAtDate(assetId, currentDate);
  const holdingQty = holdings[assetId] || 0;

  const positionStats = useMemo(() => {
    if (holdingQty <= 0) return null;
    const avgCost = getAvgCost(assetId);
    const currentValue = holdingQty * currentPrice;
    const costBasis = avgCost * holdingQty;
    const pl = currentValue - costBasis;
    const plPct = costBasis > 0 ? (pl / costBasis) * 100 : 0;
    return { avgCost, currentValue, pl, plPct };
  }, [holdingQty, currentPrice, getAvgCost, assetId]);

  const rawInput = parseFloat(inputValue) || 0;
  const qty = inputMode === "qty" ? rawInput : (currentPrice > 0 ? rawInput / currentPrice : 0);
  const totalCost = qty * currentPrice;

  const quickAmounts = [10, 25, 50, 100];

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

  const handleQuickAmount = (amt: number) => setInputValue(amt.toString());

  const handleMax = () => {
    if (tradeType === "buy") {
      setInputMode("amount");
      setInputValue(walletBalance.toFixed(2));
    } else {
      setInputMode("qty");
      setInputValue(holdingQty.toString());
    }
  };

  if (!asset) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Buy/Sell toggle */}
      <div className="flex border border-border mb-3">
        <button
          onClick={() => setTradeType("buy")}
          className={`flex-1 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
            tradeType === "buy" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setTradeType("sell")}
          className={`flex-1 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors border-l border-border ${
            tradeType === "sell" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sell
        </button>
      </div>

      {!isUnlocked ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-xs text-muted-foreground">
            <Lock className="mx-auto h-4 w-4 mb-1" />
            Asset locked
          </div>
        </div>
      ) : (
        <>
          {/* Amount / Qty toggle */}
          <div className="flex border border-border mb-3">
            <button
              onClick={() => { setInputMode("amount"); setInputValue(""); }}
              className={`flex-1 py-1 text-[10px] font-medium transition-colors ${
                inputMode === "amount" ? "bg-muted text-foreground" : "text-muted-foreground"
              }`}
            >
              $ Amount
            </button>
            <button
              onClick={() => { setInputMode("qty"); setInputValue(""); }}
              className={`flex-1 py-1 text-[10px] font-medium transition-colors border-l border-border ${
                inputMode === "qty" ? "bg-muted text-foreground" : "text-muted-foreground"
              }`}
            >
              # Shares
            </button>
          </div>

          {/* Input */}
          <div className="relative mb-2">
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputMode === "amount" ? "0.00" : "0"}
              min="0"
              className="number-display text-sm h-9 border-border pr-12"
              style={{ borderRadius: "2px" }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium number-display">
              {inputMode === "amount" ? "USD" : "QTY"}
            </span>
          </div>

          {/* Quick amounts */}
          <div className="flex gap-0 mb-3 border border-border">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => handleQuickAmount(amt)}
                className="flex-1 py-1 text-[10px] number-display font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border-r border-border last:border-r-0"
              >
                {inputMode === "amount" ? `$${amt}` : amt}
              </button>
            ))}
            <button
              onClick={handleMax}
              className="flex-1 py-1 text-[10px] font-semibold text-foreground hover:bg-muted transition-colors"
            >
              MAX
            </button>
          </div>

          {/* Order summary */}
          <div className="space-y-1 text-[11px] mb-3 flex-1 border-t border-border pt-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price</span>
              <span className="number-display text-foreground font-medium">{formatPrice(currentPrice)}</span>
            </div>
            {inputMode === "amount" && qty > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">≈ Shares</span>
                <span className="number-display text-foreground">{qty.toFixed(4)}</span>
              </div>
            )}
            {inputMode === "qty" && rawInput > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order total</span>
                <span className="number-display text-foreground font-medium">{formatPrice(totalCost)}</span>
              </div>
            )}
            <div className="border-t border-border my-1.5" />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cash avail.</span>
              <span className="number-display text-foreground font-medium">{formatPrice(walletBalance)}</span>
            </div>
            {positionStats && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Position</span>
                  <span className="number-display text-foreground">{holdingQty.toFixed(holdingQty < 1 ? 4 : 2)} shares</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg cost</span>
                  <span className="number-display text-foreground">{formatPrice(positionStats.avgCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Unrealized P&L</span>
                  <span className={`number-display font-medium flex items-center gap-0.5 ${positionStats.pl >= 0 ? "text-gain" : "text-loss"}`}>
                    {positionStats.pl >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {positionStats.pl >= 0 ? "+" : ""}{formatPrice(Math.abs(positionStats.pl))}
                    <span className="text-[9px]">({positionStats.plPct >= 0 ? "+" : ""}{positionStats.plPct.toFixed(1)}%)</span>
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Errors */}
          {tradeType === "buy" && rawInput > 0 && walletBalance < totalCost && (
            <p className="text-[10px] text-destructive mb-2">Insufficient funds</p>
          )}
          {tradeType === "sell" && rawInput > 0 && holdingQty < qty && (
            <p className="text-[10px] text-destructive mb-2">Insufficient shares</p>
          )}

          {/* Trade button */}
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium text-gain"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Filled
              </motion.div>
            ) : (
              <motion.div key="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button
                  onClick={handleTrade}
                  disabled={!canTrade()}
                  size="sm"
                  className="w-full text-[11px] font-semibold uppercase tracking-wider bg-foreground text-background hover:bg-foreground/90"
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
