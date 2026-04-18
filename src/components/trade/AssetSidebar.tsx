import { useState, useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { assets } from "@/data/assets";
import { getPriceAtDate, getPriceChange } from "@/data/priceData";
import { Input } from "@/components/ui/input";
import { Search, Lock, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function formatPrice(p: number): string {
  if (p >= 1000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  return `$${p.toFixed(4)}`;
}

interface AssetSidebarProps {
  selectedAsset: string;
  onSelectAsset: (id: string) => void;
}

export default function AssetSidebar({ selectedAsset, onSelectAsset }: AssetSidebarProps) {
  const unlockedAssets = useGameStore((s) => s.unlockedAssets);
  const currentDate = useGameStore((s) => s.currentDate);
  const holdings = useGameStore((s) => s.holdings);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "ALL" },
    { id: "stocks", label: "STK" },
    { id: "etfs", label: "ETF" },
    { id: "crypto", label: "CRY" },
    { id: "commodities", label: "CMD" },
  ];

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.ticker.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [category, search]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-7 h-7 text-[11px] border-border"
            style={{ borderRadius: "2px" }}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-0 mb-2 border border-border text-[9px]">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`flex-1 py-1 font-medium uppercase tracking-wider transition-colors ${
                category === c.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Header row */}
        <div className="flex items-center gap-1 px-1 py-1 text-[8px] uppercase tracking-widest text-muted-foreground border-b border-border">
          <span className="flex-1">Symbol</span>
          <span className="w-14 text-right">Price</span>
          <span className="w-10 text-right">Chg%</span>
        </div>

        {/* Asset list */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {filteredAssets.map((a) => {
            const unlocked = unlockedAssets.includes(a.id);
            const price = getPriceAtDate(a.id, currentDate);
            const { changePercent: cp } = getPriceChange(a.id, currentDate);
            const held = (holdings[a.id] || 0) > 0;
            const isExpanded = expandedAsset === a.id;

            return (
              <div key={a.id}>
                <div
                  className={`w-full flex items-center gap-1 px-1 py-1 text-left text-[11px] transition-colors border-b border-border/50 ${
                    selectedAsset === a.id ? "bg-muted" : "hover:bg-muted/50"
                  } ${!unlocked ? "opacity-30" : ""}`}
                >
                  {!unlocked && <Lock className="h-2 w-2 text-muted-foreground shrink-0" />}
                  <button
                    onClick={() => unlocked && onSelectAsset(a.id)}
                    className={`flex-1 min-w-0 text-left ${!unlocked ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-foreground text-[11px]">{a.ticker}</span>
                      {held && <div className="h-1 w-1 rounded-full bg-foreground shrink-0" />}
                    </div>
                  </button>
                  {unlocked && (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedAsset(isExpanded ? null : a.id);
                            }}
                            className="shrink-0 p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Info className="h-2.5 w-2.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-[220px] text-[10px] leading-relaxed" style={{ borderRadius: "2px" }}>
                          <p className="font-semibold text-foreground mb-0.5">{a.name}</p>
                          <p className="text-muted-foreground">{a.description}</p>
                        </TooltipContent>
                      </Tooltip>
                      <span className="number-display text-[10px] text-foreground w-14 text-right">{formatPrice(price)}</span>
                      <span className={`number-display text-[10px] font-medium w-10 text-right ${cp >= 0 ? "text-gain" : "text-loss"}`}>
                        {cp >= 0 ? "+" : ""}{cp.toFixed(1)}%
                      </span>
                    </>
                  )}
                </div>
                {/* Expanded description row */}
                {isExpanded && unlocked && (
                  <div className="px-2 py-1.5 bg-muted/30 border-b border-border/50 text-[9px] text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">{a.name}</span> — {a.description}
                    <div className="mt-1 flex gap-2 text-[8px] uppercase tracking-wider">
                      <span className="text-muted-foreground">Category: <span className="text-foreground">{a.category}</span></span>
                      {a.sector && <span className="text-muted-foreground">Sector: <span className="text-foreground">{a.sector}</span></span>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
