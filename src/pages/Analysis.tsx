import { Link } from "react-router-dom";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AnalysisTab from "@/components/trade/AnalysisTab";

export default function Analysis() {
  const totalEarned = useGameStore((s) => s.totalEarned);
  const tradeHistory = useGameStore((s) => s.tradeHistory);

  if (totalEarned === 0 && tradeHistory.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-sm text-center border border-border p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            No data yet
          </p>
          <h2 className="font-serif italic text-2xl text-foreground mb-3">
            Nothing to analyse yet.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Complete lessons, earn capital, and make some trades — then come back to see your full investor profile.
          </p>
          <Button asChild size="sm"
            className="bg-foreground text-background hover:bg-foreground/90 text-[11px] rounded-sm px-6">
            <Link to="/learn">Start Learning <ArrowRight className="h-3 w-3 ml-1.5" /></Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="container mx-auto max-w-5xl px-5 md:px-8 py-8">

        {/* page header */}
        <div className="border-b border-border pb-8 mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Performance report
          </p>
          <h1 className="font-serif italic text-[clamp(2rem,5vw,3.5rem)] leading-tight text-foreground">
            Portfolio analysis
          </h1>
          <p className="font-mono text-[10px] text-muted-foreground mt-2">
            Investor archetype · skill radar · trade breakdown
          </p>
        </div>

        <AnalysisTab />
      </div>
    </div>
  );
}
