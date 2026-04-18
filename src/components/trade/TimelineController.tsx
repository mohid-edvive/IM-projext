import { useState, useRef, useCallback, useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsRight, Play, Pause, SkipBack, Newspaper, MapPin } from "lucide-react";

const months = Array.from({ length: 84 }, (_, i) => {
  const year = 2020 + Math.floor(i / 12);
  const month = (i % 12) + 1;
  return `${year}-${String(month).padStart(2, "0")}`;
});

const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

const monthNames = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

interface NewsItem {
  headline: string;
  detail: string;
  impact: "bullish" | "bearish" | "neutral";
}

const newsData: Record<string, NewsItem[]> = {
  "2020-01": [
    { headline: "US-China Phase 1 Trade Deal Signed", detail: "Markets rally as trade tensions ease between the world's two largest economies.", impact: "bullish" },
  ],
  "2020-02": [
    { headline: "COVID-19 Spreads Beyond China", detail: "WHO warns of pandemic potential. Italy reports surge in cases.", impact: "bearish" },
  ],
  "2020-03": [
    { headline: "WHO Declares COVID-19 a Pandemic", detail: "Global markets crash 30%+ in weeks. Circuit breakers triggered multiple times.", impact: "bearish" },
    { headline: "Fed Cuts Rates to Near Zero", detail: "Emergency rate cut and $700B QE program announced to stabilize markets.", impact: "bullish" },
  ],
  "2020-04": [
    { headline: "Oil Prices Go Negative", detail: "WTI crude futures drop below $0 for the first time in history as storage fills up.", impact: "bearish" },
    { headline: "US Unemployment Hits 14.7%", detail: "Worst jobless rate since the Great Depression. 20M+ jobs lost in April.", impact: "bearish" },
  ],
  "2020-06": [
    { headline: "Tech Stocks Lead Recovery", detail: "NASDAQ reaches new highs as stay-at-home stocks surge. V-shaped recovery debate.", impact: "bullish" },
  ],
  "2020-08": [
    { headline: "Apple Becomes $2T Company", detail: "First US company to reach $2 trillion market cap. Tech dominance continues.", impact: "bullish" },
  ],
  "2020-11": [
    { headline: "Pfizer Vaccine Shows 95% Efficacy", detail: "Markets surge on vaccine news. Rotation from tech to value stocks begins.", impact: "bullish" },
    { headline: "Bitcoin Breaks $19K All-Time High", detail: "Institutional adoption drives crypto rally. PayPal adds crypto support.", impact: "bullish" },
  ],
  "2021-01": [
    { headline: "GameStop Short Squeeze", detail: "Reddit's WallStreetBets drives GME up 1,600%. Robinhood halts buying, sparking outrage.", impact: "neutral" },
    { headline: "Biden Inaugurated, $1.9T Stimulus Proposed", detail: "New administration pushes massive relief package. Markets watch for inflation.", impact: "bullish" },
  ],
  "2021-02": [
    { headline: "Tesla Buys $1.5B in Bitcoin", detail: "Elon Musk's move sends Bitcoin above $50K. Corporate treasury debate intensifies.", impact: "bullish" },
  ],
  "2021-04": [
    { headline: "Coinbase IPO at $86B Valuation", detail: "Largest crypto exchange goes public. Crypto market cap exceeds $2 trillion.", impact: "bullish" },
  ],
  "2021-05": [
    { headline: "China Bans Crypto Mining", detail: "Bitcoin drops 50% from peak. Miners relocate to US and Central Asia.", impact: "bearish" },
    { headline: "Inflation Fears Rise: CPI Hits 5%", detail: "Consumer prices surge at fastest rate in 13 years. Transitory vs. permanent debate.", impact: "bearish" },
  ],
  "2021-09": [
    { headline: "Evergrande Debt Crisis Rocks Markets", detail: "Chinese property giant teeters on $300B in debt. Contagion fears spread globally.", impact: "bearish" },
  ],
  "2021-11": [
    { headline: "Bitcoin Hits $69K All-Time High", detail: "Crypto market cap peaks at $3T. NFT mania at full swing.", impact: "bullish" },
    { headline: "Omicron Variant Discovered", detail: "New COVID variant triggers selloff. Travel stocks plunge.", impact: "bearish" },
  ],
  "2022-01": [
    { headline: "Fed Signals Aggressive Rate Hikes", detail: "Hawkish pivot sends growth stocks tumbling. NASDAQ enters correction territory.", impact: "bearish" },
  ],
  "2022-02": [
    { headline: "Russia Invades Ukraine", detail: "Largest European conflict since WWII. Oil spikes above $100, wheat prices soar.", impact: "bearish" },
  ],
  "2022-05": [
    { headline: "Terra/LUNA Collapses to Zero", detail: "$40B wiped out in days. Algorithmic stablecoin depegs, triggering crypto contagion.", impact: "bearish" },
  ],
  "2022-06": [
    { headline: "S&P 500 Enters Bear Market", detail: "Down 20%+ from peak. Fed hikes 75bps — largest since 1994.", impact: "bearish" },
    { headline: "Inflation Hits 9.1% — 40-Year High", detail: "Gas prices exceed $5/gallon. Cost-of-living crisis deepens.", impact: "bearish" },
  ],
  "2022-09": [
    { headline: "UK Pension Fund Crisis", detail: "British gilt market crashes after mini-budget. Bank of England intervenes.", impact: "bearish" },
  ],
  "2022-11": [
    { headline: "FTX Exchange Collapses", detail: "Sam Bankman-Fried's $32B crypto empire implodes. Customer funds missing.", impact: "bearish" },
  ],
  "2023-01": [
    { headline: "Tech Layoffs Accelerate", detail: "Google, Meta, Amazon cut 40,000+ jobs. AI pivot reshapes Silicon Valley.", impact: "neutral" },
  ],
  "2023-03": [
    { headline: "Silicon Valley Bank Collapses", detail: "Largest bank failure since 2008. FDIC seizes SVB. Regional bank panic spreads.", impact: "bearish" },
    { headline: "Credit Suisse Acquired by UBS", detail: "167-year-old bank forced into emergency merger. $17B in bonds wiped out.", impact: "bearish" },
  ],
  "2023-05": [
    { headline: "Debt Ceiling Crisis Narrowly Averted", detail: "US comes within days of default. Last-minute deal raises the ceiling.", impact: "neutral" },
    { headline: "NVIDIA Surges on AI Demand", detail: "Revenue forecast beats estimates by 50%. AI chip shortage declared.", impact: "bullish" },
  ],
  "2023-07": [
    { headline: "Fed Raises to 5.25-5.5%", detail: "Highest rates in 22 years. Markets debate whether this is the final hike.", impact: "neutral" },
  ],
  "2023-10": [
    { headline: "Magnificent 7 Drive Market Returns", detail: "Apple, Microsoft, Google, Amazon, NVIDIA, Meta, Tesla account for most S&P gains.", impact: "bullish" },
  ],
  "2023-12": [
    { headline: "Fed Signals Rate Cuts in 2024", detail: "Dovish pivot sparks Santa rally. S&P 500 nears all-time high.", impact: "bullish" },
  ],
  "2024-01": [
    { headline: "Bitcoin ETFs Approved by SEC", detail: "Spot Bitcoin ETFs launch with record-breaking volume. Institutional crypto era begins.", impact: "bullish" },
  ],
  "2024-03": [
    { headline: "Bitcoin Halving Approaches", detail: "Mining reward cuts from 6.25 to 3.125 BTC. Historically precedes major rallies.", impact: "bullish" },
    { headline: "Japan Ends Negative Rate Policy", detail: "First rate hike in 17 years. Yen carry trade unwind fears.", impact: "neutral" },
  ],
  "2024-06": [
    { headline: "NVIDIA Briefly Becomes Most Valuable Company", detail: "Surpasses Apple and Microsoft. AI spending boom shows no signs of slowing.", impact: "bullish" },
  ],
  "2024-09": [
    { headline: "Fed Begins Rate Cutting Cycle", detail: "First cut in 4 years. 50bps reduction signals confidence in soft landing.", impact: "bullish" },
  ],
  "2024-11": [
    { headline: "US Presidential Election", detail: "Market volatility spikes around election. Policy uncertainty drives sector rotations.", impact: "neutral" },
  ],
  "2025-01": [
    { headline: "New Administration Takes Office", detail: "Markets adjust to new policy direction. Trade and fiscal policy in focus.", impact: "neutral" },
  ],
  "2025-03": [
    { headline: "AI Agents Transform Workflows", detail: "Major productivity gains reported across industries. New investment cycle begins.", impact: "bullish" },
  ],
  "2025-06": [
    { headline: "Global Growth Stabilizes", detail: "IMF upgrades outlook. Emerging markets attract capital as dollar weakens.", impact: "bullish" },
  ],
};

const events: Record<string, string> = {
  "2020-03": "COVID Crash",
  "2020-11": "Vaccine Rally",
  "2021-01": "GameStop Squeeze",
  "2021-11": "Crypto Peak",
  "2022-01": "Fed Rate Hikes",
  "2022-06": "Bear Market",
  "2022-11": "FTX Collapse",
  "2023-03": "SVB Bank Crisis",
  "2023-10": "AI Boom",
  "2024-03": "Bitcoin Halving",
  "2025-01": "New Era",
};

export default function TimelineController() {
  const currentDate = useGameStore((s) => s.currentDate);
  const setCurrentDate = useGameStore((s) => s.setCurrentDate);
  const dateIndex = months.indexOf(currentDate);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const moveDate = useCallback((delta: number) => {
    const newIdx = Math.max(0, Math.min(months.length - 1, dateIndex + delta));
    setCurrentDate(months[newIdx]);
  }, [dateIndex, setCurrentDate]);

  const startPlay = useCallback((spd: number) => {
    if (playRef.current) clearInterval(playRef.current);
    setIsPlaying(true);
    setSpeed(spd);
    playRef.current = setInterval(() => {
      const store = useGameStore.getState();
      const idx = months.indexOf(store.currentDate);
      if (idx >= months.length - 1) {
        if (playRef.current) clearInterval(playRef.current);
        setIsPlaying(false);
        return;
      }
      store.setCurrentDate(months[idx + 1]);
    }, spd);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      if (playRef.current) clearInterval(playRef.current);
      playRef.current = null;
      setIsPlaying(false);
    } else {
      startPlay(speed);
    }
  }, [isPlaying, speed, startPlay]);

  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const idx = Math.round(pct * (months.length - 1));
    setCurrentDate(months[idx]);
  }, [setCurrentDate]);

  const currentYear = parseInt(currentDate.split("-")[0]);

  const currentEvent = events[currentDate];
  const currentNews = newsData[currentDate] || [];

  const eventPositions = useMemo(() => {
    return Object.entries(events).map(([date, label]) => {
      const idx = months.indexOf(date);
      if (idx === -1) return null;
      const pct = (idx / (months.length - 1)) * 100;
      return { date, label, pct };
    }).filter(Boolean) as { date: string; label: string; pct: number }[];
  }, []);

  const progressPct = (dateIndex / (months.length - 1)) * 100;

  const speeds = [
    { label: "0.5×", ms: 4000 },
    { label: "1×", ms: 2000 },
    { label: "2×", ms: 1000 },
  ];

  return (
    <div className="border border-border">
      {/* Top row: controls + date display */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border">
        <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-medium shrink-0 mr-1">TIMELINE</span>
        
        <Button variant="ghost" size="icon" onClick={() => { setCurrentDate(months[0]); }} className="shrink-0 h-5 w-5" title="Reset to start">
          <SkipBack className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => moveDate(-1)} className="shrink-0 h-5 w-5" title="Previous month">
          <ChevronLeft className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" onClick={togglePlay} className="shrink-0 h-5 w-5" title={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => moveDate(1)} className="shrink-0 h-5 w-5" title="Next month">
          <ChevronRight className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => moveDate(12)} className="shrink-0 h-5 w-5" title="Skip 1 year">
          <ChevronsRight className="h-3 w-3" />
        </Button>

        {/* Speed selector */}
        <div className="flex items-center gap-0 border border-border ml-1" style={{ borderRadius: "2px" }}>
          {speeds.map((s) => (
            <button
              key={s.label}
              onClick={() => {
                setSpeed(s.ms);
                if (isPlaying) startPlay(s.ms);
              }}
              className={`px-1.5 py-0.5 text-[8px] font-medium transition-colors ${
                speed === s.ms ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {currentEvent && (
            <span className="text-[9px] font-medium text-foreground px-1.5 py-0.5 border border-border bg-muted flex items-center gap-1" style={{ borderRadius: "2px" }}>
              <MapPin className="h-2.5 w-2.5" /> {currentEvent}
            </span>
          )}
          <div className="number-display text-[13px] font-semibold text-foreground font-serif min-w-[70px] text-center">
            {currentDate}
          </div>
        </div>
      </div>

      {/* Timeline track */}
      <div className="px-2 py-2">
        {/* Year labels */}
        <div className="flex justify-between mb-1">
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => {
                const idx = months.indexOf(`${yr}-01`);
                if (idx !== -1) setCurrentDate(months[idx]);
              }}
              className={`text-[9px] font-medium transition-colors ${
                currentYear === yr ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {yr}
            </button>
          ))}
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative h-6 cursor-pointer group"
        >
          <div className="absolute top-2.5 left-0 right-0 h-1 bg-border" />
          <div
            className="absolute top-2.5 left-0 h-1 bg-foreground transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />

          {years.map((yr) => {
            const idx = months.indexOf(`${yr}-01`);
            const pct = (idx / (months.length - 1)) * 100;
            return (
              <div key={yr} className="absolute top-1 w-px h-4 bg-border" style={{ left: `${pct}%` }} />
            );
          })}

          {eventPositions.map((ev) => (
            <div
              key={ev.date}
              className="absolute top-0 w-1 h-1.5 bg-muted-foreground/60 group-hover:bg-foreground transition-colors"
              style={{ left: `${ev.pct}%`, borderRadius: "1px" }}
              title={ev.label}
            />
          ))}

          <div
            className="absolute top-0 -translate-x-1/2 transition-all duration-300"
            style={{ left: `${progressPct}%` }}
          >
            <div className="w-2.5 h-6 border border-foreground bg-background flex items-center justify-center" style={{ borderRadius: "1px" }}>
              <div className="w-0.5 h-3 bg-foreground" style={{ borderRadius: "1px" }} />
            </div>
          </div>
        </div>

        {/* Month indicators */}
        <div className="flex justify-between mt-0.5 px-0">
          {monthNames.map((m, i) => {
            const monthStr = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
            const isActive = currentDate === monthStr;
            const monthIdx = months.indexOf(monthStr);
            const hasNews = !!newsData[monthStr];
            return (
              <button
                key={i}
                onClick={() => { if (monthIdx !== -1) setCurrentDate(months[monthIdx]); }}
                className={`text-[7px] w-4 text-center transition-colors relative ${
                  isActive
                    ? "text-foreground font-bold"
                    : monthIdx !== -1
                    ? "text-muted-foreground hover:text-foreground cursor-pointer"
                    : "text-muted-foreground/30 cursor-not-allowed"
                }`}
                disabled={monthIdx === -1}
              >
                {m}
                {hasNews && <div className="absolute -top-0.5 right-0 h-1 w-1 rounded-full bg-foreground" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* News section */}
      {currentNews.length > 0 && (
        <div className="border-t border-border px-2 py-1.5">
          <div className="flex items-center gap-1 mb-1">
            <Newspaper className="h-3 w-3 text-muted-foreground" />
            <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-medium">Market News — {currentDate}</span>
          </div>
          <div className="grid gap-1">
            {currentNews.map((news, i) => (
              <div key={i} className="flex items-start gap-2 px-1.5 py-1 bg-muted/30 border border-border/50" style={{ borderRadius: "2px" }}>
                <div className={`shrink-0 mt-0.5 h-1.5 w-1.5 rounded-full ${
                  news.impact === "bullish" ? "bg-gain" : news.impact === "bearish" ? "bg-loss" : "bg-muted-foreground"
                }`} />
                <div className="min-w-0">
                  <div className="text-[10px] font-medium text-foreground leading-tight">{news.headline}</div>
                  <div className="text-[9px] text-muted-foreground leading-snug mt-0.5">{news.detail}</div>
                </div>
                <span className={`shrink-0 text-[7px] uppercase tracking-wider font-medium px-1 py-0.5 border ${
                  news.impact === "bullish" ? "text-gain border-gain/30" : news.impact === "bearish" ? "text-loss border-loss/30" : "text-muted-foreground border-border"
                }`} style={{ borderRadius: "2px" }}>
                  {news.impact === "bullish" ? "▲ BULL" : news.impact === "bearish" ? "▼ BEAR" : "— NEUTRAL"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Playing indicator */}
      {isPlaying && (
        <div className="px-2 pb-1.5 flex items-center gap-1 border-t border-border pt-1">
          <div className="h-1.5 w-1.5 rounded-full bg-gain animate-pulse" />
          <span className="text-[8px] text-muted-foreground uppercase tracking-wider">
            Auto-advancing — 1 month / {(speed / 1000).toFixed(1)}s
          </span>
        </div>
      )}
    </div>
  );
}
