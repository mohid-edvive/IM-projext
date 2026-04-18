import { useState } from "react";
import { Link } from "react-router-dom";
import { useGameStore } from "@/store/gameStore";
import { assets } from "@/data/assets";
import { Button } from "@/components/ui/button";
import { BookOpen, LayoutGrid, List, BarChart3 } from "lucide-react";

import PortfolioBar from "@/components/trade/PortfolioBar";
import AssetSidebar from "@/components/trade/AssetSidebar";
import TradeChart from "@/components/trade/TradeChart";
import TradePanel from "@/components/trade/TradePanel";
import TradeHistory from "@/components/trade/TradeHistory";
import HoldingsPanel from "@/components/trade/HoldingsPanel";
import OrderBook from "@/components/trade/OrderBook";
import TimelineController from "@/components/trade/TimelineController";
import TradeNewsWidget from "@/components/trade/TradeNewsWidget";
import AnalysisTab from "@/components/trade/AnalysisTab";

export default function Trade() {
  const walletBalance = useGameStore((s) => s.walletBalance);
  const totalEarned = useGameStore((s) => s.totalEarned);
  const unlockedAssets = useGameStore((s) => s.unlockedAssets);

  const [selectedAsset, setSelectedAsset] = useState<string>("SPY");
  const [bottomTab, setBottomTab] = useState<"holdings" | "history" | "analysis">("holdings");

  if (walletBalance === 0 && totalEarned === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-sm text-center border border-border rounded-lg p-10">
          <BookOpen className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
          <h2 className="font-serif text-lg font-semibold text-foreground">No Trading Capital</h2>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Complete lessons and pass quizzes to earn virtual money for trading.
          </p>
          <Button asChild className="mt-5 bg-foreground text-background hover:bg-foreground/90" size="sm" style={{ borderRadius: "6px" }}>
            <Link to="/learn">Start Learning</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <div className="container mx-auto px-3 md:px-4 py-3 max-w-7xl">
        <div className="mb-3">
          <PortfolioBar />
        </div>

        <div className="mb-3">
          <TimelineController />
        </div>

        <div className="grid gap-0 md:grid-cols-[180px_1fr_160px_220px] border border-border rounded-lg divide-x divide-border overflow-hidden">
          <div className="hidden md:block p-2 max-h-[calc(100vh-260px)]">
            <AssetSidebar selectedAsset={selectedAsset} onSelectAsset={setSelectedAsset} />
          </div>
          <div className="p-4">
            <TradeChart assetId={selectedAsset} />
          </div>
          <div className="hidden md:block p-2 max-h-[calc(100vh-260px)] overflow-y-auto">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium mb-2 pb-1.5 border-b border-border">Order Book</div>
            <OrderBook assetId={selectedAsset} />
          </div>
          <div className="p-4">
            <TradePanel assetId={selectedAsset} />
          </div>
        </div>

        {/* Mobile asset selector */}
        <div className="md:hidden mt-3">
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="w-full border border-border bg-background p-2.5 text-xs text-foreground rounded-md"
          >
            {assets.filter((a) => unlockedAssets.includes(a.id)).map((a) => (
              <option key={a.id} value={a.id}>{a.ticker} — {a.name}</option>
            ))}
          </select>
        </div>

        {/* Bottom section: tabs + news */}
        <div className="grid md:grid-cols-[1fr_280px] gap-3 mt-3">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="flex border-b border-border">
              {[
                { id: "holdings" as const, label: "Portfolio", icon: LayoutGrid },
                { id: "history" as const, label: "History", icon: List },
                { id: "analysis" as const, label: "Analysis", icon: BarChart3 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setBottomTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
                    bottomTab === tab.id
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-4">
              {bottomTab === "holdings" && <HoldingsPanel />}
              {bottomTab === "history" && <TradeHistory />}
              {bottomTab === "analysis" && <AnalysisTab />}
            </div>
          </div>
          <div className="hidden md:block">
            <TradeNewsWidget assetId={selectedAsset} />
          </div>
        </div>
      </div>
    </div>
  );
}
