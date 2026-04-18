import { useMemo } from "react";
import { useGameStore, Trade } from "@/store/gameStore";
import { getAssetById } from "@/data/assets";
import { getPriceAtDate } from "@/data/priceData";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
} from "recharts";
import {
  Brain, TrendingUp, TrendingDown, Shield, Clock, Target,
  AlertTriangle, Award, Layers, Zap, Eye, Compass, Scale,
} from "lucide-react";

function formatPrice(p: number): string {
  if (p >= 1000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  return `$${p.toFixed(4)}`;
}

const COLORS = [
  "hsl(156, 35%, 11%)", "hsl(47, 7%, 51%)", "hsl(156, 50%, 22%)",
  "hsl(156, 20%, 65%)", "hsl(12, 65%, 42%)", "hsl(156, 35%, 22%)",
];

export default function AnalysisTab() {
  const tradeHistory = useGameStore((s) => s.tradeHistory);
  const holdings = useGameStore((s) => s.holdings);
  const walletBalance = useGameStore((s) => s.walletBalance);
  const totalEarned = useGameStore((s) => s.totalEarned);
  const currentDate = useGameStore((s) => s.currentDate);
  const completedLessons = useGameStore((s) => s.completedLessons);

  const holdingsValue = useMemo(() => {
    return Object.entries(holdings).reduce((sum, [assetId, q]) => {
      if (q <= 0) return sum;
      return sum + q * getPriceAtDate(assetId, currentDate);
    }, 0);
  }, [holdings, currentDate]);
  const portfolioValue = walletBalance + holdingsValue;
  const profitLoss = portfolioValue - totalEarned;

  const analysis = useMemo(() => {
    const totalTrades = tradeHistory.length;
    const returnPercent = totalEarned > 0 ? (profitLoss / totalEarned) * 100 : 0;
    const sellTrades = tradeHistory.filter((t) => t.type === "sell");
    const buysAll = tradeHistory.filter((t) => t.type === "buy");
    
    let wins = 0;
    const tradeReturns: number[] = [];
    let bestReturn = -Infinity;
    let worstReturn = Infinity;
    let bestTrade: Trade | null = null;
    let worstTrade: Trade | null = null;

    sellTrades.forEach((sell) => {
      const matchingBuys = tradeHistory.filter((t) => t.type === "buy" && t.assetId === sell.assetId && t.timestamp < sell.timestamp);
      if (matchingBuys.length > 0) {
        const avgBuyPrice = matchingBuys.reduce((s, b) => s + b.pricePerUnit, 0) / matchingBuys.length;
        const ret = (sell.pricePerUnit - avgBuyPrice) / avgBuyPrice;
        tradeReturns.push(ret);
        if (sell.pricePerUnit > avgBuyPrice) wins++;
        if (ret > bestReturn) { bestReturn = ret; bestTrade = sell; }
        if (ret < worstReturn) { worstReturn = ret; worstTrade = sell; }
      }
    });

    const winRate = sellTrades.length > 0 ? (wins / sellTrades.length) * 100 : 0;
    
    // Archetype
    let archetypeName = "Fresh Start";
    let archetypeDesc = "You haven't traded much yet. Every great investor started here.";
    if (totalTrades >= 3) {
      const uniqueAssets = new Set(tradeHistory.map((t) => t.assetId));
      if (totalTrades >= 20) { archetypeName = "Active Trader"; archetypeDesc = "You trade frequently. Watch for overtrading costs."; }
      else if (uniqueAssets.size >= 8) { archetypeName = "Diversifier"; archetypeDesc = "You spread your bets wisely across many assets."; }
      else if (sellTrades.length === 0 && buysAll.length >= 3) { archetypeName = "Diamond Hand"; archetypeDesc = "You hold through thick and thin. Patience is your strength."; }
      else if (profitLoss > 0 && uniqueAssets.size >= 4) { archetypeName = "Balanced Investor"; archetypeDesc = "You trade with discipline and diversification."; }
      else if (profitLoss < 0) { archetypeName = "Learning Phase"; archetypeDesc = "Losses are tuition. Review your trade reasoning."; }
      else { archetypeName = "Momentum Rider"; archetypeDesc = "You follow trends and ride winners."; }
    }

    // Radar
    const timing = Math.min(100, 30 + winRate * 0.7);
    const diversification = Math.min(100, new Set(tradeHistory.map((t) => t.assetId)).size * 15);
    const riskMgmt = Math.min(100, totalTrades > 0 ? 40 + (profitLoss > 0 ? 30 : 0) + (sellTrades.length > 0 ? 20 : 0) : 20);
    const discipline = Math.min(100, completedLessons.length * 4 + (totalTrades < 30 ? 30 : 0));
    const patience = Math.min(100, totalTrades === 0 ? 50 : totalTrades < 10 ? 80 : totalTrades < 20 ? 60 : 30);
    const radarData = [
      { subject: "Timing", score: Math.round(timing) },
      { subject: "Diversification", score: Math.round(diversification) },
      { subject: "Risk Mgmt", score: Math.round(riskMgmt) },
      { subject: "Discipline", score: Math.round(discipline) },
      { subject: "Patience", score: Math.round(patience) },
    ];

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    Object.entries(holdings).forEach(([assetId, qty]) => {
      if (qty <= 0) return;
      const asset = getAssetById(assetId);
      const cat = asset?.category || "other";
      const val = qty * getPriceAtDate(assetId, currentDate);
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + val;
    });

    // Sharpe
    const avgReturn = tradeReturns.length > 0 ? tradeReturns.reduce((a, b) => a + b, 0) / tradeReturns.length : 0;
    const stdDev = tradeReturns.length > 1 ? Math.sqrt(tradeReturns.reduce((s, r) => s + (r - avgReturn) ** 2, 0) / (tradeReturns.length - 1)) : 0;
    const sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0;

    return {
      totalTrades, returnPercent, winRate, archetypeName, archetypeDesc,
      radarData, categoryBreakdown, sharpeRatio,
      bestTrade, worstTrade,
      bestReturn: bestReturn === -Infinity ? 0 : bestReturn * 100,
      worstReturn: worstReturn === Infinity ? 0 : worstReturn * 100,
      buyCount: buysAll.length, sellCount: sellTrades.length,
    };
  }, [tradeHistory, holdings, walletBalance, totalEarned, currentDate, completedLessons, profitLoss, holdingsValue]);

  const categoryPieData = useMemo(() => {
    return Object.entries(analysis.categoryBreakdown).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), value: Math.round(value),
    }));
  }, [analysis.categoryBreakdown]);

  if (tradeHistory.length === 0) {
    return (
      <div className="text-center py-10">
        <Compass className="mx-auto h-5 w-5 mb-3 text-muted-foreground/40" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Make some trades to see your analysis
        </p>
      </div>
    );
  }

  const tooltipStyle = {
    backgroundColor: "hsl(44, 33%, 94%)",
    border: "1px solid hsl(156, 20%, 80%)",
    borderRadius: "4px",
    fontSize: "10px",
    fontFamily: "Geist Mono, monospace",
  };

  return (
    <div className="space-y-4">
      {/* Archetype + key stats */}
      <div className="grid md:grid-cols-[1fr_1fr] gap-px bg-border border border-border">
        <div className="bg-background p-6 text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-3">Investor type</p>
          <h3 className="font-serif italic text-xl text-foreground mb-1">{analysis.archetypeName}</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">{analysis.archetypeDesc}</p>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border">
          {[
            { label: "Win Rate", value: `${analysis.winRate.toFixed(0)}%`,                                          color: analysis.winRate > 50       ? "text-gain" : "text-foreground" },
            { label: "Sharpe",   value: analysis.sharpeRatio.toFixed(2),                                            color: analysis.sharpeRatio > 1    ? "text-gain" : "text-foreground" },
            { label: "Return",   value: `${analysis.returnPercent >= 0 ? "+" : ""}${analysis.returnPercent.toFixed(1)}%`, color: analysis.returnPercent >= 0 ? "text-gain" : "text-loss" },
            { label: "Trades",   value: `${analysis.totalTrades}`,                                                  color: "text-foreground" },
          ].map((s) => (
            <div key={s.label} className="bg-background p-4 text-center">
              <div className={`number-display text-lg font-semibold ${s.color}`}>{s.value}</div>
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Radar + Allocation */}
      <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
        <div className="bg-background p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-3">Skill radar</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={analysis.radarData}>
                <PolarGrid stroke="hsl(156, 20%, 80%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(47, 7%, 51%)", fontSize: 9, fontFamily: "Geist Mono, monospace" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="score" stroke="hsl(156, 35%, 11%)" fill="hsl(156, 35%, 11%)" fillOpacity={0.08} strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-background p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-3">Allocation</p>
          {categoryPieData.length > 0 ? (
            <>
              <div className="h-36 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                      {categoryPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatPrice(value), ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {categoryPieData.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="h-2 w-2 shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="font-mono text-[10px] text-foreground flex-1">{cat.name}</span>
                    <span className="number-display text-[10px] text-muted-foreground">{formatPrice(cat.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-36 flex items-center justify-center">
              <p className="font-mono text-[10px] text-muted-foreground">No holdings</p>
            </div>
          )}
        </div>
      </div>

      {/* Best / Worst trades */}
      {(analysis.bestTrade || analysis.worstTrade) && (
        <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
          {analysis.bestTrade && (
            <div className="bg-background p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gain mb-2">Best trade</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium text-foreground">{getAssetById(analysis.bestTrade.assetId)?.ticker}</span>
                <span className="number-display text-base font-semibold text-gain">+{analysis.bestReturn.toFixed(1)}%</span>
              </div>
            </div>
          )}
          {analysis.worstTrade && (
            <div className="bg-background p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-loss mb-2">Worst trade</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium text-foreground">{getAssetById(analysis.worstTrade.assetId)?.ticker}</span>
                <span className="number-display text-base font-semibold text-loss">{analysis.worstReturn.toFixed(1)}%</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
