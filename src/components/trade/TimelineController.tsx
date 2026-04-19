import { useEffect, useState } from "react";
import { useGameStore, dateToIndex, indexToDate, MONTHS_TOTAL, MS_PER_GAME_MONTH } from "@/store/gameStore";
import { Newspaper, MapPin, Clock, CheckCircle2, Lock } from "lucide-react";

// ── Static data ──────────────────────────────────────────────────────────────

const months = Array.from({ length: MONTHS_TOTAL }, (_, i) => indexToDate(i));
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
  "2021-01": "GameStop",
  "2021-11": "Crypto Peak",
  "2022-01": "Rate Hikes",
  "2022-06": "Bear Market",
  "2022-11": "FTX Collapse",
  "2023-03": "SVB Crisis",
  "2023-10": "AI Boom",
  "2024-03": "BTC Halving",
  "2025-01": "New Era",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatSimDate(date: string) {
  const [yr, mo] = date.split("-").map(Number);
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${names[mo - 1]} ${yr}`;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function TimelineController() {
  const currentDate     = useGameStore((s) => s.currentDate);
  const clockStartedAt  = useGameStore((s) => s.clockStartedAt);
  const syncCurrentDate = useGameStore((s) => s.syncCurrentDate);

  // Tick every second to re-render the countdown + trigger date sync
  const [, setTick] = useState(0);
  useEffect(() => {
    syncCurrentDate();
    const id = setInterval(() => {
      syncCurrentDate();
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [syncCurrentDate]);

  const dateIndex   = dateToIndex(currentDate);
  const progressPct = (dateIndex / (MONTHS_TOTAL - 1)) * 100;
  const isComplete  = dateIndex >= MONTHS_TOTAL - 1;
  const currentYear = parseInt(currentDate.split("-")[0]);

  // Live countdown — recomputed every render tick
  let countdown: { h: number; m: number; s: number } | null = null;
  if (clockStartedAt && !isComplete) {
    const elapsed          = Date.now() - clockStartedAt;
    const msIntoMonth      = elapsed % MS_PER_GAME_MONTH;
    const msUntilNext      = MS_PER_GAME_MONTH - msIntoMonth;
    countdown = {
      h: Math.floor(msUntilNext / 3_600_000),
      m: Math.floor((msUntilNext % 3_600_000) / 60_000),
      s: Math.floor((msUntilNext % 60_000) / 1_000),
    };
  }

  const currentEvent = events[currentDate];
  const currentNews  = newsData[currentDate] || [];

  return (
    <div className="border border-border">

      {/* ── Header row ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2 border-b border-border">

        {/* Label */}
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground shrink-0">
          Simulation
        </span>

        {/* Current sim date */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">Date</span>
          <span className="font-mono text-[13px] font-semibold text-foreground">
            {formatSimDate(currentDate)}
          </span>
          <span className="font-mono text-[9px] text-muted-foreground">
            · month {dateIndex + 1} / {MONTHS_TOTAL}
          </span>
        </div>

        {/* Separator */}
        <div className="h-3 w-px bg-border hidden sm:block" />

        {/* Countdown or complete badge */}
        {isComplete ? (
          <div className="flex items-center gap-1 text-gain">
            <CheckCircle2 className="h-3 w-3" />
            <span className="font-mono text-[9px] font-medium uppercase tracking-wider">
              Simulation complete
            </span>
          </div>
        ) : clockStartedAt ? (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            <span className="font-mono text-[9px] uppercase tracking-wider">Next month in</span>
            <span className="font-mono text-[11px] font-semibold text-foreground tabular-nums">
              {pad(countdown!.h)}h {pad(countdown!.m)}m {pad(countdown!.s)}s
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span className="font-mono text-[9px] uppercase tracking-wider">Clock initialising…</span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Rate badge + current event */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[8px] text-muted-foreground border border-border px-1.5 py-0.5 hidden sm:inline">
            1h = 1mo
          </span>
          {currentEvent && (
            <span className="font-mono text-[9px] font-medium text-foreground px-1.5 py-0.5 border border-border bg-muted flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5 shrink-0" />
              {currentEvent}
            </span>
          )}
        </div>
      </div>

      {/* ── Timeline track ─────────────────────────────────────────────────── */}
      <div className="px-3 py-2">

        {/* Year labels — read-only */}
        <div className="flex justify-between mb-1">
          {years.map((yr) => (
            <span
              key={yr}
              className={`font-mono text-[9px] select-none ${
                currentYear === yr
                  ? "text-foreground font-semibold"
                  : dateIndex >= (yr - 2020) * 12
                  ? "text-muted-foreground"
                  : "text-muted-foreground/30"
              }`}
            >
              {yr}
            </span>
          ))}
        </div>

        {/* Track — read-only, no cursor/click */}
        <div className="relative h-6">
          {/* Background rail */}
          <div className="absolute top-2.5 left-0 right-0 h-px bg-border" />

          {/* Elapsed fill */}
          <div
            className="absolute top-2.5 left-0 h-px bg-foreground transition-all duration-1000"
            style={{ width: `${progressPct}%` }}
          />

          {/* Year tick marks */}
          {years.map((yr) => {
            const idx = months.indexOf(`${yr}-01`);
            const pct = (idx / (MONTHS_TOTAL - 1)) * 100;
            const isPast = dateIndex >= idx;
            return (
              <div
                key={yr}
                className={`absolute top-1 w-px h-4 transition-colors ${isPast ? "bg-border" : "bg-border/40"}`}
                style={{ left: `${pct}%` }}
              />
            );
          })}

          {/* Event markers */}
          {Object.entries(events).map(([date, label]) => {
            const idx = months.indexOf(date);
            if (idx === -1) return null;
            const pct    = (idx / (MONTHS_TOTAL - 1)) * 100;
            const isPast = idx <= dateIndex;
            return (
              <div
                key={date}
                title={label}
                className={`absolute top-[3px] w-1 h-1.5 transition-colors ${
                  isPast ? "bg-muted-foreground" : "bg-border"
                }`}
                style={{ left: `${pct}%`, borderRadius: "1px" }}
              />
            );
          })}

          {/* Thumb — shows current position */}
          <div
            className="absolute top-0 -translate-x-1/2 transition-all duration-1000"
            style={{ left: `${progressPct}%` }}
          >
            <div className="w-2.5 h-6 border border-foreground bg-background flex items-center justify-center" style={{ borderRadius: "1px" }}>
              <div className="w-0.5 h-3 bg-foreground" style={{ borderRadius: "1px" }} />
            </div>
          </div>

          {/* Future lock overlay — faded pattern */}
          <div
            className="absolute top-0 right-0 bottom-0 pointer-events-none"
            style={{
              left: `${progressPct}%`,
              backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 3px, hsl(var(--border)/0.15) 3px, hsl(var(--border)/0.15) 4px)",
            }}
          />
        </div>

        {/* Month indicators — current year, read-only */}
        <div className="flex justify-between mt-0.5 px-0">
          {monthNames.map((m, i) => {
            const monthStr = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
            const isActive = currentDate === monthStr;
            const monthIdx = months.indexOf(monthStr);
            const isPast   = monthIdx !== -1 && monthIdx <= dateIndex;
            const hasNews  = !!newsData[monthStr];
            return (
              <span
                key={i}
                className={`font-mono text-[7px] w-4 text-center select-none relative ${
                  isActive
                    ? "text-foreground font-bold"
                    : isPast
                    ? "text-muted-foreground"
                    : "text-muted-foreground/25"
                }`}
              >
                {m}
                {hasNews && isPast && (
                  <span className="absolute -top-0.5 right-0 h-1 w-1 rounded-full bg-foreground" />
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Explanation strip (shown while simulation is still in progress) ── */}
      {!isComplete && clockStartedAt && (
        <div className="border-t border-border px-3 py-1.5 flex items-center gap-2 bg-muted/20">
          <Lock className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
          <span className="font-mono text-[8px] text-muted-foreground">
            Time advances automatically · 1 real-world hour = 1 month of market history · future data is locked
          </span>
        </div>
      )}

      {/* ── Current month news ──────────────────────────────────────────────── */}
      {currentNews.length > 0 && (
        <div className="border-t border-border px-3 py-1.5">
          <div className="flex items-center gap-1 mb-1.5">
            <Newspaper className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">
              Market News — {formatSimDate(currentDate)}
            </span>
          </div>
          <div className="grid gap-1">
            {currentNews.map((news, i) => (
              <div key={i} className="flex items-start gap-2 px-2 py-1.5 bg-muted/30 border border-border/50" style={{ borderRadius: "2px" }}>
                <div className={`shrink-0 mt-0.5 h-1.5 w-1.5 rounded-full ${
                  news.impact === "bullish" ? "bg-gain" : news.impact === "bearish" ? "bg-loss" : "bg-muted-foreground"
                }`} />
                <div className="min-w-0">
                  <div className="text-[10px] font-medium text-foreground leading-tight">{news.headline}</div>
                  <div className="text-[9px] text-muted-foreground leading-snug mt-0.5">{news.detail}</div>
                </div>
                <span className={`shrink-0 font-mono text-[7px] uppercase tracking-wider font-medium px-1 py-0.5 border ${
                  news.impact === "bullish" ? "text-gain border-gain/30" : news.impact === "bearish" ? "text-loss border-loss/30" : "text-muted-foreground border-border"
                }`} style={{ borderRadius: "2px" }}>
                  {news.impact === "bullish" ? "▲ BULL" : news.impact === "bearish" ? "▼ BEAR" : "— NEUT"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Simulation complete banner ───────────────────────────────────────── */}
      {isComplete && (
        <div className="border-t border-border px-3 py-2 flex items-center gap-2 bg-muted/20">
          <CheckCircle2 className="h-3.5 w-3.5 text-gain shrink-0" />
          <span className="font-mono text-[9px] text-muted-foreground">
            You have reached December 2026 — the end of the simulation. All 84 months of market history are unlocked.
          </span>
        </div>
      )}
    </div>
  );
}
