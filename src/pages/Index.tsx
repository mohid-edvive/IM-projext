import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useGameStore } from "@/store/gameStore";
import { assets, getAssetById } from "@/data/assets";
import { getPriceAtDate, getPriceChange, generatePriceHistory } from "@/data/priceData";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ArrowRight, ChevronRight, TrendingUp, TrendingDown, CheckCircle2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvestigoMark } from "@/components/Logo";

// ─── helpers ────────────────────────────────────────────────────────────────

function fmt(p: number): string {
  if (p >= 1000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  return `$${p.toFixed(4)}`;
}

// Tiny sparkline SVG
const Sparkline = React.forwardRef<SVGSVGElement, { assetId: string; currentDate: string }>(
  function Sparkline({ assetId, currentDate }, ref) {
    const history = generatePriceHistory(assetId);
    const visible = history.filter((p) => p.date <= currentDate).slice(-14);
    if (visible.length < 2) return null;
    const min = Math.min(...visible.map((p) => p.price));
    const max = Math.max(...visible.map((p) => p.price));
    const range = max - min || 1;
    const w = 52; const h = 18;
    const pts = visible.map((p, i) =>
      `${(i / (visible.length - 1)) * w},${h - ((p.price - min) / range) * h}`
    ).join(" ");
    const up = visible[visible.length - 1].price >= visible[0].price;
    return (
      <svg ref={ref} width={w} height={h}>
        <polyline points={pts} fill="none"
          stroke={up ? "hsl(156,50%,22%)" : "hsl(12,65%,42%)"}
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
);

// ─── data ───────────────────────────────────────────────────────────────────

const TICKERS = ["SPY", "AAPL", "BTC-USD", "NVDA", "GC=F", "ETH-USD"];

const CHAPTERS = [
  { id: 1,  name: "What Is the Stock Market?",   lessons: 5, reward: 500,   desc: "Stocks, exchanges, index funds, reading a chart." },
  { id: 2,  name: "How to Buy and Sell",          lessons: 5, reward: 750,   desc: "Order types, brokerages, going long, fees & P&L." },
  { id: 3,  name: "Understanding Risk",           lessons: 5, reward: 1000,  desc: "Volatility, diversification, market swings." },
  { id: 4,  name: "Reading the Market",           lessons: 5, reward: 1250,  desc: "Fundamentals, P/E ratios, sector rotation." },
  { id: 5,  name: "Your Brain Is the Enemy",      lessons: 5, reward: 1500,  desc: "Loss aversion, FOMO, anchoring, herd mentality." },
  { id: 6,  name: "Commodities & Real Assets",    lessons: 5, reward: 1750,  desc: "Gold, oil, silver, REITs in a portfolio." },
  { id: 7,  name: "Crypto & Digital Assets",      lessons: 5, reward: 2000,  desc: "Bitcoin, Ethereum, blockchain fundamentals." },
  { id: 8,  name: "ETFs & Passive Investing",     lessons: 5, reward: 2500,  desc: "Three-fund portfolio, DCA, bond ETFs." },
  { id: 9,  name: "Advanced Concepts",            lessons: 5, reward: 3000,  desc: "Short selling, options, leverage, market makers." },
  { id: 10, name: "Thinking Long Term",           lessons: 5, reward: 5000,  desc: "Compound growth, taxes, rebalancing, media noise." },
];

const STEPS = [
  { n: "01", title: "Read", desc: "Structured lessons written for clarity, not complexity." },
  { n: "02", title: "Quiz", desc: "Score 80 %+ on each quiz to unlock the next chapter." },
  { n: "03", title: "Earn", desc: "Every passed quiz credits your virtual trading account." },
  { n: "04", title: "Trade", desc: "Place real-strategy trades across 7 years of history." },
];

// ─── page ───────────────────────────────────────────────────────────────────

export default function Index() {
  const walletBalance    = useGameStore((s) => s.walletBalance);
  const holdings         = useGameStore((s) => s.holdings);
  const totalEarned      = useGameStore((s) => s.totalEarned);
  const completedLessons = useGameStore((s) => s.completedLessons);
  const tradeHistory     = useGameStore((s) => s.tradeHistory);
  const currentDate      = useGameStore((s) => s.currentDate);

  const holdingsValue = useMemo(() =>
    Object.entries(holdings).reduce((sum, [id, q]) =>
      q > 0 ? sum + q * getPriceAtDate(id, currentDate) : sum, 0),
  [holdings, currentDate]);

  const portfolioValue = walletBalance + holdingsValue;
  const profitLoss     = portfolioValue - totalEarned;
  const hasStarted     = totalEarned > 0 || completedLessons.length > 0;

  const nextChapterId = useMemo(() => {
    for (const ch of CHAPTERS) {
      const done = Array.from({ length: ch.lessons }, (_, i) => `${ch.id}-${i + 1}`)
        .every((id) => completedLessons.includes(id));
      if (!done) return ch.id;
    }
    return null;
  }, [completedLessons]);

  const topMovers = useMemo(() =>
    TICKERS.map((id) => {
      const asset = getAssetById(id);
      const price = getPriceAtDate(id, currentDate);
      const { changePercent } = getPriceChange(id, currentDate);
      return { id, ticker: asset?.ticker || id, price, changePercent };
    }),
  [currentDate]);

  const chartData = useMemo(() => {
    if (!hasStarted) return [];
    const history = generatePriceHistory("SPY");
    const idx = history.findIndex((p) => p.date === currentDate);
    return history.slice(Math.max(0, idx - 11), idx + 1).map((p) => {
      let val = walletBalance;
      Object.entries(holdings).forEach(([id, qty]) => {
        if (qty > 0) val += qty * getPriceAtDate(id, p.date);
      });
      return { date: p.date, value: val };
    });
  }, [hasStarted, currentDate, walletBalance, holdings]);

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="container mx-auto max-w-5xl px-5 md:px-8">

        {/* ══════════════════════════════════════════════════════════════
            HERO — new-user variant
        ══════════════════════════════════════════════════════════════ */}
        {!hasStarted ? (
          <section className="pt-16 pb-16 md:pt-24 md:pb-20 border-b border-border">
            {/* overline */}
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6">
              Investigo · Investment Education
            </p>

            {/* headline */}
            <h1 className="font-serif italic text-[clamp(2.6rem,7vw,5.5rem)] leading-[1.02] tracking-tight text-foreground mb-6 max-w-3xl">
              Master the markets,<br />
              one lesson at a time.
            </h1>

            {/* sub */}
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed mb-10">
              Pair <em className="italic not-italic font-medium text-foreground">invest</em> with
              the Latin <em className="italic not-italic font-medium text-foreground">investigo</em> — to
              track, to trace, to investigate. 50 lessons. Virtual capital you earn. Seven years of real market data to trade.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-16">
              <Button asChild size="sm"
                className="bg-foreground text-background hover:bg-foreground/90 h-10 px-7 text-xs font-semibold tracking-wide rounded-sm">
                <Link to="/learn">Start Learning <ArrowRight className="h-3.5 w-3.5 ml-2" /></Link>
              </Button>
              <Button asChild variant="outline" size="sm"
                className="h-10 px-7 text-xs font-medium tracking-wide rounded-sm">
                <Link to="/trade">Trading Terminal</Link>
              </Button>
            </div>

            {/* ── how it works ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border">
              {STEPS.map((s) => (
                <div key={s.n} className="bg-background p-5">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[hsl(var(--amber))] block mb-2">
                    {s.n}
                  </span>
                  <div className="font-serif italic text-lg text-foreground mb-1">{s.title}</div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

        ) : (
        /* ══════════════════════════════════════════════════════════════
            DASHBOARD — returning user
        ══════════════════════════════════════════════════════════════ */
          <section className="pt-10 pb-10 border-b border-border">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Portfolio · {currentDate}
            </p>
            <h1 className="font-serif italic text-4xl text-foreground mb-6">Your positions</h1>

            {/* stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border mb-6">
              {[
                { label: "Portfolio",     value: fmt(portfolioValue) },
                { label: "P & L",         value: `${profitLoss >= 0 ? "+" : ""}${fmt(Math.abs(profitLoss))}`,
                  color: profitLoss >= 0 ? "text-gain" : "text-loss" },
                { label: "Lessons done",  value: `${completedLessons.length} / 50` },
                { label: "Trades",        value: `${tradeHistory.length}` },
              ].map((s) => (
                <div key={s.label} className="bg-background p-5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-1">{s.label}</p>
                  <p className={`number-display text-lg font-semibold ${s.color ?? "text-foreground"}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* chart + actions */}
            <div className="grid md:grid-cols-[1fr_260px] gap-4 mb-6">
              <div className="border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Portfolio value</p>
                  <span className={`number-display text-xs font-medium ${profitLoss >= 0 ? "text-gain" : "text-loss"}`}>
                    {profitLoss >= 0 ? "+" : ""}
                    {totalEarned > 0 ? ((profitLoss / totalEarned) * 100).toFixed(1) : "0"}%
                  </span>
                </div>
                {chartData.length > 1 ? (
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="hsl(156,35%,11%)" stopOpacity={0.07} />
                            <stop offset="95%" stopColor="hsl(156,35%,11%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value"
                          stroke="hsl(156,35%,11%)" strokeWidth={1.5} fill="url(#grad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center">
                    <p className="font-mono text-[10px] text-muted-foreground">Make trades to see your chart</p>
                  </div>
                )}
              </div>

              <div className="border border-border p-4 flex flex-col gap-1">
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-2">Quick actions</p>
                {[
                  { to: "/learn", label: "Continue Learning",
                    sub: `${50 - completedLessons.length} lessons remaining` },
                  { to: "/trade", label: "Open Terminal", sub: "Trade historical data" },
                  { to: "/analysis", label: "View Analysis",  sub: "Skill radar & archetypes" },
                ].map((a) => (
                  <Link key={a.to} to={a.to}
                    className="flex items-center justify-between py-2.5 px-3 hover:bg-muted rounded-sm transition-colors group">
                    <div>
                      <p className="text-xs font-medium text-foreground">{a.label}</p>
                      <p className="font-mono text-[9px] text-muted-foreground mt-0.5">{a.sub}</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* learning progress */}
            {completedLessons.length < 50 && (
              <div className="border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                    Learning progress
                  </p>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {completedLessons.length} / 50
                  </span>
                </div>
                <div className="w-full bg-border h-px mb-3 relative">
                  <div className="absolute top-0 left-0 h-px bg-foreground transition-all duration-500"
                    style={{ width: `${(completedLessons.length / 50) * 100}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {fmt(totalEarned)} earned ·{" "}
                    {nextChapterId
                      ? `next: Ch ${nextChapterId} — ${CHAPTERS[nextChapterId - 1]?.name}`
                      : "all complete"}
                  </p>
                  <Button asChild size="sm" variant="outline"
                    className="h-7 text-[11px] rounded-sm px-4">
                    <Link to="/learn">Continue <ArrowRight className="h-3 w-3 ml-1" /></Link>
                  </Button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            MARKETS
        ══════════════════════════════════════════════════════════════ */}
        <section className="py-12 border-b border-border">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                Market snapshot · {currentDate}
              </p>
              <h2 className="font-serif italic text-2xl text-foreground">Live prices</h2>
            </div>
            <Link to="/trade"
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Terminal <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border border border-border">
            {topMovers.map((m) => (
              <Link key={m.id} to="/trade"
                className="bg-background p-4 hover:bg-muted/40 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[11px] font-medium text-foreground tracking-wide">
                    {m.ticker}
                  </span>
                  <Sparkline assetId={m.id} currentDate={currentDate} />
                </div>
                <div className="flex items-end justify-between">
                  <span className="number-display text-sm font-semibold text-foreground">
                    {fmt(m.price)}
                  </span>
                  <span className={`number-display text-[11px] font-medium flex items-center gap-0.5 ${
                    m.changePercent >= 0 ? "text-gain" : "text-loss"
                  }`}>
                    {m.changePercent >= 0
                      ? <TrendingUp className="h-3 w-3" />
                      : <TrendingDown className="h-3 w-3" />}
                    {m.changePercent >= 0 ? "+" : ""}{m.changePercent.toFixed(1)}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            CURRICULUM
        ══════════════════════════════════════════════════════════════ */}
        <section className="py-12 border-b border-border">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                10 chapters · 50 lessons · up to $18,250 virtual capital
              </p>
              <h2 className="font-serif italic text-2xl text-foreground">The curriculum</h2>
            </div>
            <Link to="/learn"
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Browse all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="border border-border divide-y divide-border">
            {CHAPTERS.map((ch) => {
              const ids = Array.from({ length: ch.lessons }, (_, i) => `${ch.id}-${i + 1}`);
              const doneCount = ids.filter((id) => completedLessons.includes(id)).length;
              const isComplete = doneCount === ch.lessons;
              const isCurrent = !isComplete && ch.id === (nextChapterId ?? 1);

              return (
                <Link key={ch.id} to="/learn"
                  className="flex items-start gap-5 px-5 py-4 bg-background hover:bg-muted/40 transition-colors group">

                  {/* chapter number */}
                  <span className={`font-mono text-[11px] tracking-widest shrink-0 mt-0.5 w-6 ${
                    isComplete ? "text-gain" : isCurrent ? "text-[hsl(var(--amber))]" : "text-muted-foreground"
                  }`}>
                    {String(ch.id).padStart(2, "0")}
                  </span>

                  {/* content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">{ch.name}</span>
                      {isComplete && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-gain shrink-0" />
                      )}
                      {isCurrent && !hasStarted && (
                        <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-foreground text-background">
                          Start here
                        </span>
                      )}
                      {isCurrent && hasStarted && (
                        <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-foreground text-background flex items-center gap-1">
                          <Play className="h-2 w-2" /> In progress
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      {ch.desc}
                    </p>
                    {/* per-chapter progress bar */}
                    {hasStarted && doneCount > 0 && !isComplete && (
                      <div className="mt-2 w-full bg-border h-px relative">
                        <div className="absolute top-0 left-0 h-px bg-foreground"
                          style={{ width: `${(doneCount / ch.lessons) * 100}%` }} />
                      </div>
                    )}
                  </div>

                  {/* reward */}
                  <div className="shrink-0 text-right">
                    <span className="font-mono text-[10px] text-[hsl(var(--amber))] font-medium">
                      +${ch.reward.toLocaleString()}
                    </span>
                    <p className="font-mono text-[9px] text-muted-foreground mt-0.5">
                      {ch.lessons} lessons
                    </p>
                  </div>

                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-1 group-hover:text-foreground transition-colors" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            WHAT YOU WILL LEARN — new users only
        ══════════════════════════════════════════════════════════════ */}
        {!hasStarted && (
          <section className="py-12 border-b border-border">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Outcomes
            </p>
            <h2 className="font-serif italic text-2xl text-foreground mb-8">
              From zero to portfolio
            </h2>

            <div className="grid md:grid-cols-2 gap-px bg-border border border-border mb-10">
              {[
                "How stocks, ETFs, and index funds actually work",
                "How to analyse companies and read financial data",
                "The psychological biases that make investors lose money",
                "How to build a diversified, long-term portfolio",
                "Advanced topics: options, leverage, short selling",
                "How compound growth and tax efficiency maximise returns",
              ].map((item, i) => (
                <div key={i} className="bg-background px-5 py-4 flex items-start gap-3">
                  <span className="font-mono text-[9px] tracking-widest text-[hsl(var(--amber))] shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            {/* stats */}
            <div className="grid grid-cols-3 gap-px bg-border border border-border">
              {[
                { value: "50",          label: "Structured lessons" },
                { value: `${assets.length}+`, label: "Tradeable assets" },
                { value: "7 years",     label: "Historical data" },
              ].map((s) => (
                <div key={s.label} className="bg-background px-5 py-5 text-center">
                  <p className="font-serif italic text-3xl text-foreground mb-1">{s.value}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            FINAL CTA — new users only
        ══════════════════════════════════════════════════════════════ */}
        {!hasStarted && (
          <section className="py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <InvestigoMark size={48} />
              <div>
                <h2 className="font-serif italic text-2xl text-foreground leading-tight">
                  Begin your first lesson.
                </h2>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-1">
                  No account required
                </p>
              </div>
            </div>
            <Button asChild size="sm"
              className="bg-foreground text-background hover:bg-foreground/90 h-10 px-8 text-xs font-semibold tracking-wide rounded-sm shrink-0">
              <Link to="/learn">
                Start Chapter 1 <ArrowRight className="h-3.5 w-3.5 ml-2" />
              </Link>
            </Button>
          </section>
        )}

      </div>
    </div>
  );
}
