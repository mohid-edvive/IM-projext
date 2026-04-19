import { useState, useMemo } from "react";
import { generatePriceHistory, getPriceAtDate, getPriceChange } from "@/data/priceData";
import { getAssetById } from "@/data/assets";
import { useGameStore } from "@/store/gameStore";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

function formatPrice(p: number): string {
  if (p >= 1000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  if (p >= 0.01) return `$${p.toFixed(4)}`;
  return `$${p.toFixed(6)}`;
}

type TimeRange = "3M" | "6M" | "1Y" | "2Y" | "ALL";

interface TradeChartProps {
  assetId: string;
}

export default function TradeChart({ assetId }: TradeChartProps) {
  const currentDate = useGameStore((s) => s.currentDate);
  const unlockedAssets = useGameStore((s) => s.unlockedAssets);
  const [timeRange, setTimeRange] = useState<TimeRange>("ALL");

  const asset = getAssetById(assetId);
  const isUnlocked = unlockedAssets.includes(assetId);
  const currentPrice = getPriceAtDate(assetId, currentDate);
  const { changePercent } = getPriceChange(assetId, currentDate);
  const priceHistory = generatePriceHistory(assetId);

  const chartData = useMemo(() => {
    const all = priceHistory.filter((p) => p.date <= currentDate);
    const months: Record<TimeRange, number> = { "3M": 3, "6M": 6, "1Y": 12, "2Y": 24, "ALL": all.length };
    const count = months[timeRange];
    return all.slice(-count);
  }, [priceHistory, currentDate, timeRange]);

  const stats = useMemo(() => {
    if (chartData.length < 2) return null;
    const prices = chartData.map((p) => p.price);
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const first = prices[0];
    const last = prices[prices.length - 1];
    const periodReturn = ((last - first) / first) * 100;
    const volatility = prices.reduce((sum, p, i) => {
      if (i === 0) return 0;
      return sum + Math.abs((p - prices[i - 1]) / prices[i - 1]);
    }, 0) / (prices.length - 1) * 100;
    return { high, low, periodReturn, volatility };
  }, [chartData]);

  const isPositive = changePercent >= 0;
  const chartColor = isPositive ? "hsl(156, 50%, 22%)" : "hsl(12, 65%, 42%)";

  if (!asset) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-2 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg font-semibold text-foreground">{asset.ticker}</h2>
            <span className="text-[9px] px-1.5 py-0.5 border border-border text-muted-foreground font-medium uppercase">
              {asset.category}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">{asset.name}</p>
        </div>
        <div className="text-right">
          <div className="number-display text-xl font-semibold text-foreground">
            {formatPrice(currentPrice)}
          </div>
          <div className={`text-[11px] number-display font-medium ${isPositive ? "text-gain" : "text-loss"}`}>
            {isPositive ? "+" : ""}{changePercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Timeframe */}
      <div className="flex gap-0 mb-3 border border-border inline-flex self-start">
        {(["3M", "6M", "1Y", "2Y", "ALL"] as TimeRange[]).map((t) => (
          <button
            key={t}
            onClick={() => setTimeRange(t)}
            className={`px-2.5 py-1 text-[10px] font-medium transition-colors border-r border-border last:border-r-0 ${
              timeRange === t
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {!isUnlocked ? (
        <div className="flex-1 flex items-center justify-center border border-border">
          <div className="text-center text-xs text-muted-foreground">
            Complete the required lesson to unlock
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.08} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "hsl(47, 7%, 51%)", fontSize: 9, fontFamily: "Geist Mono, monospace" }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(156, 20%, 80%)" }}
                  interval={Math.max(1, Math.floor(chartData.length / 5))}
                />
                <YAxis
                  tick={{ fill: "hsl(47, 7%, 51%)", fontSize: 9, fontFamily: "Geist Mono, monospace" }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(156, 20%, 80%)" }}
                  domain={["auto", "auto"]}
                  tickFormatter={(v: number) => formatPrice(v).replace("$", "")}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(44, 33%, 94%)",
                    border: "1px solid hsl(156, 20%, 80%)",
                    borderRadius: "2px",
                    fontSize: "11px",
                    fontFamily: "Geist Mono, monospace",
                    padding: "4px 8px",
                  }}
                  formatter={(value: number) => [formatPrice(value), "Price"]}
                />
                <Area type="monotone" dataKey="price" stroke={chartColor} strokeWidth={1.5} fill="url(#priceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {stats && (
            <div className="grid grid-cols-4 mt-2 pt-2 border-t border-border divide-x divide-border">
              {[
                { label: "HIGH", value: formatPrice(stats.high), color: "text-foreground" },
                { label: "LOW", value: formatPrice(stats.low), color: "text-foreground" },
                { label: "RETURN", value: `${stats.periodReturn >= 0 ? "+" : ""}${stats.periodReturn.toFixed(1)}%`, color: stats.periodReturn >= 0 ? "text-gain" : "text-loss" },
                { label: "VOL", value: `${stats.volatility.toFixed(1)}%`, color: "text-muted-foreground" },
              ].map((s) => (
                <div key={s.label} className="px-2 text-center">
                  <div className="text-[8px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
                  <div className={`number-display text-[11px] font-medium ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
