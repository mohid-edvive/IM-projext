import { useEffect, useState, useMemo, useRef } from "react";
import { useGameStore, dateToIndex, indexToDate, MONTHS_TOTAL, MS_PER_GAME_MONTH } from "@/store/gameStore";
import { Newspaper, Clock, ChevronRight, RefreshCw } from "lucide-react";

// ── Month array ───────────────────────────────────────────────────────────────
const months = Array.from({ length: MONTHS_TOTAL }, (_, i) => indexToDate(i));
const years   = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
const MONTH_NAMES_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatSimDate(date: string) {
  const [yr, mo] = date.split("-").map(Number);
  return `${MONTH_NAMES_SHORT[mo - 1]} ${yr}`;
}
function pad(n: number) { return String(n).padStart(2, "0"); }

// ── Market eras ───────────────────────────────────────────────────────────────
interface Era {
  from: string;
  to: string;
  name: string;
  sentiment: "bullish" | "bearish" | "neutral";
  context: string;
  lesson: string;
}

const ERAS: Era[] = [
  { from: "2020-01", to: "2020-01", name: "Pre-Pandemic Calm", sentiment: "neutral",
    context: "Markets at all-time highs after a decade-long bull run. A US-China trade deal was just signed. COVID-19 had been detected in Wuhan but global markets were largely unconcerned.",
    lesson: "Market complacency is often at its peak right before a crash." },
  { from: "2020-02", to: "2020-05", name: "COVID-19 Crash", sentiment: "bearish",
    context: "The fastest bear market in recorded history. Global lockdowns halted entire economies. The Fed cut rates to zero and launched a $700B QE program. Oil futures went negative for the first time ever.",
    lesson: "Black swan events are unpredictable, but diversification and cash reserves help you survive them." },
  { from: "2020-06", to: "2020-12", name: "V-Shape Recovery", sentiment: "bullish",
    context: "Stimulus checks, near-zero interest rates, and vaccine optimism triggered a historic recovery. Tech companies thrived as the world went remote. Apple became the first $2T company.",
    lesson: "Markets often recover faster than the economy. Those who sell in panic miss the rebound." },
  { from: "2021-01", to: "2021-10", name: "2021 Everything Rally", sentiment: "bullish",
    context: "Stocks, crypto, SPACs, and NFTs all surged. Retail traders flooded markets via Robinhood. GameStop's short squeeze showed the power of social media. Inflation began to stir quietly.",
    lesson: "When everything rises together, it often signals speculative excess — tread carefully." },
  { from: "2021-11", to: "2022-01", name: "Peak & Hawkish Pivot", sentiment: "neutral",
    context: "Bitcoin hit $69K all-time high. The Fed signalled aggressive rate hikes to fight inflation. Growth stocks began cracking under the weight of rising rate expectations.",
    lesson: "Interest rates are the gravity of all asset prices. When rates rise, valuations fall." },
  { from: "2022-02", to: "2022-12", name: "2022 Bear Market", sentiment: "bearish",
    context: "Russia invaded Ukraine, spiking oil and wheat prices. The Fed hiked rates 425bps in one year — the most aggressive cycle since the 1980s. The S&P fell 25%. FTX collapsed in November, wiping $32B in crypto.",
    lesson: "Bear markets test conviction. Panic selling at the bottom locks in losses permanently." },
  { from: "2023-01", to: "2023-04", name: "Banking Crisis", sentiment: "bearish",
    context: "Silicon Valley Bank and Credit Suisse collapsed within days of each other. Regional bank contagion fears spread. The Fed had to backstop depositors while still fighting inflation.",
    lesson: "When multiple things break at once, it's usually the same root cause — in this case, rising rates." },
  { from: "2023-05", to: "2023-12", name: "AI-Led Rally", sentiment: "bullish",
    context: "NVIDIA's AI chip revenues exploded. The 'Magnificent 7' (Apple, Microsoft, Google, Amazon, NVIDIA, Meta, Tesla) drove the entire S&P 500's gains. Inflation cooled. Rate hikes appeared over.",
    lesson: "A handful of companies can drive an entire index. Concentration risk cuts both ways." },
  { from: "2024-01", to: "2024-12", name: "Rate Cut Cycle", sentiment: "bullish",
    context: "The SEC approved spot Bitcoin ETFs in January. The Fed began cutting rates in September — the first cut in 4 years. Markets hit new all-time highs. Soft landing achieved.",
    lesson: "Rate cuts are rocket fuel for markets. The anticipation of cuts often matters more than the cuts themselves." },
  { from: "2025-01", to: "2026-12", name: "New Era", sentiment: "bullish",
    context: "AI agents began transforming how work gets done across industries. Global growth stabilized. New investment cycles emerged in infrastructure, energy, and digital assets.",
    lesson: "Every era ends and a new one begins. The investors who adapt and keep learning thrive." },
];

function getEra(date: string): Era {
  return ERAS.find(e => date >= e.from && date <= e.to) ?? ERAS[ERAS.length - 1];
}

// ── Events (for track markers + coming next) ──────────────────────────────────
const EVENTS: { date: string; label: string; impact: "bullish" | "bearish" | "neutral" }[] = [
  { date: "2020-02", label: "COVID Spreads", impact: "bearish" },
  { date: "2020-03", label: "Pandemic Declared", impact: "bearish" },
  { date: "2020-11", label: "Vaccine Announced", impact: "bullish" },
  { date: "2021-01", label: "GameStop Squeeze", impact: "neutral" },
  { date: "2021-11", label: "Bitcoin ATH $69K", impact: "bullish" },
  { date: "2022-02", label: "Russia Invades Ukraine", impact: "bearish" },
  { date: "2022-06", label: "Bear Market −25%", impact: "bearish" },
  { date: "2022-11", label: "FTX Collapse", impact: "bearish" },
  { date: "2023-03", label: "SVB Bank Run", impact: "bearish" },
  { date: "2023-05", label: "NVIDIA AI Surge", impact: "bullish" },
  { date: "2024-01", label: "Bitcoin ETF Approved", impact: "bullish" },
  { date: "2024-09", label: "Fed Rate Cuts Begin", impact: "bullish" },
  { date: "2025-03", label: "AI Agents Boom", impact: "bullish" },
];

// ── News data ─────────────────────────────────────────────────────────────────
interface NewsItem { headline: string; detail: string; impact: "bullish" | "bearish" | "neutral" }

const NEWS: Record<string, NewsItem[]> = {
  "2020-01": [{ headline: "US-China Phase 1 Trade Deal Signed", detail: "Markets rally as trade tensions ease between the world's two largest economies.", impact: "bullish" }],
  "2020-02": [{ headline: "COVID-19 Spreads Beyond China", detail: "WHO warns of pandemic potential. Italy reports surge in cases. Markets begin to price in risk.", impact: "bearish" }],
  "2020-03": [
    { headline: "WHO Declares COVID-19 a Pandemic", detail: "Global markets crash 30%+ in weeks. Circuit breakers triggered multiple times on NYSE.", impact: "bearish" },
    { headline: "Fed Cuts Rates to Near Zero", detail: "Emergency rate cut and $700B QE program announced to stabilize credit markets.", impact: "bullish" },
  ],
  "2020-04": [
    { headline: "Oil Prices Go Negative", detail: "WTI crude futures drop below $0 for the first time in history as storage fills up.", impact: "bearish" },
    { headline: "US Unemployment Hits 14.7%", detail: "Worst jobless rate since the Great Depression. 20M+ jobs lost in April alone.", impact: "bearish" },
  ],
  "2020-06": [{ headline: "Tech Stocks Lead Recovery", detail: "NASDAQ reaches new highs as stay-at-home stocks surge. V-shaped recovery debate intensifies.", impact: "bullish" }],
  "2020-08": [{ headline: "Apple Becomes $2T Company", detail: "First US company to reach $2 trillion market cap. Tech dominance continues unabated.", impact: "bullish" }],
  "2020-11": [
    { headline: "Pfizer Vaccine Shows 95% Efficacy", detail: "Markets surge on vaccine news. Rotation from tech to value stocks begins.", impact: "bullish" },
    { headline: "Bitcoin Breaks $19K All-Time High", detail: "Institutional adoption drives crypto rally. PayPal adds crypto support for 346M users.", impact: "bullish" },
  ],
  "2021-01": [
    { headline: "GameStop Short Squeeze", detail: "Reddit's WallStreetBets drives GME up 1,600%. Robinhood halts buying, sparking congressional hearings.", impact: "neutral" },
    { headline: "Biden Inaugurated, $1.9T Stimulus Proposed", detail: "New administration pushes massive American Rescue Plan. Markets watch for inflation consequences.", impact: "bullish" },
  ],
  "2021-02": [{ headline: "Tesla Buys $1.5B in Bitcoin", detail: "Elon Musk's move sends Bitcoin above $50K. Corporate treasury Bitcoin strategy debate begins.", impact: "bullish" }],
  "2021-04": [{ headline: "Coinbase IPO at $86B Valuation", detail: "Largest crypto exchange goes public via direct listing. Crypto market cap exceeds $2 trillion.", impact: "bullish" }],
  "2021-05": [
    { headline: "China Bans Crypto Mining", detail: "Bitcoin drops 50% from peak. Miners relocate to US and Central Asia.", impact: "bearish" },
    { headline: "Inflation Fears Rise: CPI Hits 5%", detail: "Consumer prices surge at fastest rate in 13 years. Fed insists it's 'transitory'.", impact: "bearish" },
  ],
  "2021-09": [{ headline: "Evergrande Debt Crisis", detail: "Chinese property giant teeters on $300B debt. Global contagion fears spread to equities.", impact: "bearish" }],
  "2021-11": [
    { headline: "Bitcoin Hits $69K All-Time High", detail: "Crypto market cap peaks at $3 trillion. NFT mania reaches full swing.", impact: "bullish" },
    { headline: "Omicron Variant Discovered", detail: "New COVID variant triggers selloff. Travel stocks plunge 20%+ in days.", impact: "bearish" },
  ],
  "2022-01": [{ headline: "Fed Signals Aggressive Rate Hikes", detail: "Hawkish pivot sends growth stocks tumbling. NASDAQ enters correction territory in January alone.", impact: "bearish" }],
  "2022-02": [{ headline: "Russia Invades Ukraine", detail: "Largest European conflict since WWII. Oil spikes above $100, wheat prices soar 50%, global inflation accelerates.", impact: "bearish" }],
  "2022-05": [{ headline: "Terra/LUNA Collapses to Zero", detail: "$40B wiped out in days. Algorithmic stablecoin depegs, triggering crypto credit contagion.", impact: "bearish" }],
  "2022-06": [
    { headline: "S&P 500 Enters Bear Market", detail: "Down 20%+ from peak. Fed hikes 75bps — largest single hike since 1994.", impact: "bearish" },
    { headline: "Inflation Hits 9.1% — 40-Year High", detail: "Gas prices exceed $5/gallon nationally. Cost-of-living crisis deepens globally.", impact: "bearish" },
  ],
  "2022-09": [{ headline: "UK Pension Fund Crisis", detail: "British gilt market crashes after mini-budget. Bank of England forced to intervene with emergency bond buying.", impact: "bearish" }],
  "2022-11": [{ headline: "FTX Exchange Collapses", detail: "Sam Bankman-Fried's $32B crypto empire implodes in 72 hours. Customer funds missing. SBF arrested.", impact: "bearish" }],
  "2023-01": [{ headline: "Tech Layoffs Accelerate", detail: "Google, Meta, Amazon, Microsoft cut 50,000+ jobs. AI pivot reshapes Silicon Valley hiring.", impact: "neutral" }],
  "2023-03": [
    { headline: "Silicon Valley Bank Collapses", detail: "Largest bank failure since 2008. FDIC seizes SVB. $175B in deposits temporarily frozen.", impact: "bearish" },
    { headline: "Credit Suisse Acquired by UBS", detail: "167-year-old Swiss bank forced into emergency merger. $17B in AT1 bonds wiped out overnight.", impact: "bearish" },
  ],
  "2023-05": [
    { headline: "Debt Ceiling Crisis Narrowly Averted", detail: "US comes within days of technical default. Last-minute deal raises the ceiling.", impact: "neutral" },
    { headline: "NVIDIA Surges on AI Demand", detail: "Revenue guidance beats estimates by 50%. Data center revenue triples. AI chip shortage declared.", impact: "bullish" },
  ],
  "2023-07": [{ headline: "Fed Raises to 5.25–5.5%", detail: "Highest rates in 22 years. Markets debate whether this is the final hike of the cycle.", impact: "neutral" }],
  "2023-10": [{ headline: "Magnificent 7 Drive Market Returns", detail: "Apple, MSFT, Google, Amazon, NVIDIA, Meta, Tesla account for 70%+ of S&P 500 gains YTD.", impact: "bullish" }],
  "2023-12": [{ headline: "Fed Signals Rate Cuts in 2024", detail: "Dovish pivot sparks Santa rally. S&P 500 nears all-time high. Bond yields fall sharply.", impact: "bullish" }],
  "2024-01": [{ headline: "Bitcoin ETFs Approved by SEC", detail: "Spot Bitcoin ETFs launch with record $4.6B first-week volume. Institutional crypto era begins.", impact: "bullish" }],
  "2024-03": [{ headline: "Bitcoin Halving Approaches", detail: "Mining reward cuts from 6.25 to 3.125 BTC per block. Historically precedes major bull runs.", impact: "bullish" }],
  "2024-06": [{ headline: "NVIDIA Briefly Most Valuable Company", detail: "Surpasses Apple and Microsoft at $3.3T market cap. AI spending boom shows no signs of slowing.", impact: "bullish" }],
  "2024-09": [{ headline: "Fed Begins Rate Cutting Cycle", detail: "First cut in 4 years — 50bps. Signals confidence in soft landing. Stocks hit new highs.", impact: "bullish" }],
  "2024-11": [{ headline: "US Presidential Election", detail: "Market volatility spikes around election. Policy uncertainty drives sector rotations.", impact: "neutral" }],
  "2025-01": [{ headline: "New Administration Takes Office", detail: "Markets adjust to new policy direction. Trade tariffs and fiscal policy in focus.", impact: "neutral" }],
  "2025-03": [{ headline: "AI Agents Transform Workflows", detail: "Major productivity gains reported across industries. New investment cycle begins in AI infrastructure.", impact: "bullish" }],
  "2025-06": [{ headline: "Global Growth Stabilizes", detail: "IMF upgrades global outlook. Emerging markets attract capital as US dollar weakens.", impact: "bullish" }],
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function TimelineController() {
  const currentDate      = useGameStore((s) => s.currentDate);
  const clockStartedAt   = useGameStore((s) => s.clockStartedAt);
  const simulationCycle  = useGameStore((s) => s.simulationCycle);
  const syncCurrentDate  = useGameStore((s) => s.syncCurrentDate);

  const [, setTick]         = useState(0);
  const [cycleFlash, setCycleFlash] = useState(false);
  const prevCycleRef        = useRef(simulationCycle);

  // Detect cycle increment and show flash notification
  useEffect(() => {
    if (simulationCycle !== prevCycleRef.current) {
      prevCycleRef.current = simulationCycle;
      setCycleFlash(true);
      const t = setTimeout(() => setCycleFlash(false), 5000);
      return () => clearTimeout(t);
    }
  }, [simulationCycle]);

  useEffect(() => {
    syncCurrentDate();
    const id = setInterval(() => { syncCurrentDate(); setTick((t) => t + 1); }, 1000);
    return () => clearInterval(id);
  }, [syncCurrentDate]);

  const dateIndex   = dateToIndex(currentDate);
  const progressPct = (dateIndex / (MONTHS_TOTAL - 1)) * 100;
  const era         = useMemo(() => getEra(currentDate), [currentDate]);
  const currentNews = NEWS[currentDate] ?? [];

  // Live countdown
  let countdown: { h: number; m: number; s: number } | null = null;
  if (clockStartedAt) {
    const elapsed     = Date.now() - clockStartedAt;
    const msIntoMonth = elapsed % MS_PER_GAME_MONTH;
    const msLeft      = MS_PER_GAME_MONTH - msIntoMonth;
    countdown = { h: Math.floor(msLeft / 3_600_000), m: Math.floor((msLeft % 3_600_000) / 60_000), s: Math.floor((msLeft % 60_000) / 1_000) };
  }

  // Upcoming events (next 3 that haven't happened yet in this cycle)
  const upcomingEvents = useMemo(() =>
    EVENTS.filter(e => e.date > currentDate).slice(0, 3),
  [currentDate]);

  // Era color helpers
  const eraColor = {
    bullish: { bg: "bg-gain/6", dot: "bg-gain", text: "text-gain", badge: "text-gain border-gain/30" },
    bearish: { bg: "bg-loss/6", dot: "bg-loss", text: "text-loss", badge: "text-loss border-loss/30" },
    neutral: { bg: "bg-muted/30", dot: "bg-muted-foreground", text: "text-muted-foreground", badge: "text-muted-foreground border-border" },
  }[era.sentiment];

  const currentYear = parseInt(currentDate.split("-")[0]);

  return (
    <div className="border border-border overflow-hidden">

      {/* ── Cycle reset flash banner ──────────────────────────────────────── */}
      {cycleFlash && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-amber/10 border-b border-amber/30">
          <RefreshCw className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(var(--amber))" }} />
          <div className="flex-1 min-w-0">
            <span className="font-serif italic text-foreground text-sm">
              Cycle {simulationCycle} begins — back to January 2020
            </span>
            <span className="font-mono text-[9px] text-muted-foreground ml-3">
              All holdings liquidated at Dec 2026 prices · capital carried forward
            </span>
          </div>
          <button onClick={() => setCycleFlash(false)}
            className="font-mono text-[9px] text-muted-foreground hover:text-foreground shrink-0">✕</button>
        </div>
      )}

      {/* ── Row 1: Live header ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 border-b border-border bg-muted/20">

        {/* LIVE badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gain opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gain" />
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
            Live Simulation
          </span>
          {/* Cycle badge */}
          {simulationCycle > 1 && (
            <span className="font-mono text-[7px] uppercase tracking-wider px-1.5 py-0.5 border border-border text-muted-foreground ml-1">
              Cycle {simulationCycle}
            </span>
          )}
        </div>

        <div className="h-3 w-px bg-border hidden sm:block" />

        {/* Large date */}
        <div className="flex items-baseline gap-2">
          <span className="font-serif italic text-xl text-foreground leading-none">
            {formatSimDate(currentDate)}
          </span>
          <span className="font-mono text-[9px] text-muted-foreground">
            month {dateIndex + 1}/{MONTHS_TOTAL}
          </span>
        </div>

        <div className="h-3 w-px bg-border hidden sm:block" />

        {/* Countdown */}
        {countdown ? (
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Next month</span>
            <span className="font-mono text-[13px] font-semibold text-foreground tabular-nums leading-none">
              {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
            </span>
          </div>
        ) : null}

        {/* Rate badge */}
        <span className="ml-auto font-mono text-[8px] text-muted-foreground border border-border px-1.5 py-0.5 hidden md:inline shrink-0">
          1h real = 1mo sim · loops
        </span>
      </div>

      {/* ── Row 2: Era banner ───────────────────────────────────────────────── */}
      <div className={`flex items-start gap-3 px-4 py-3 border-b border-border ${eraColor.bg}`}>
        <div className={`shrink-0 mt-1.5 h-2 w-2 rounded-full ${eraColor.dot}`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-serif italic text-[15px] text-foreground">{era.name}</span>
            <span className={`font-mono text-[7px] uppercase tracking-wider font-medium px-1.5 py-0.5 border ${eraColor.badge}`}>
              {era.sentiment === "bullish" ? "▲ Bull Era" : era.sentiment === "bearish" ? "▼ Bear Era" : "— Transition"}
            </span>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground leading-relaxed mb-1.5">{era.context}</p>
          <div className="flex items-start gap-1.5">
            <span className="font-mono text-[7px] uppercase tracking-wider text-muted-foreground/60 shrink-0 mt-0.5">Lesson</span>
            <span className="font-serif italic text-[11px] text-muted-foreground">{era.lesson}</span>
          </div>
        </div>
      </div>

      {/* ── Row 3: Timeline track ───────────────────────────────────────────── */}
      <div className="px-4 py-2.5">
        {/* Year labels */}
        <div className="flex justify-between mb-1.5">
          {years.map((yr) => (
            <span key={yr} className={`font-mono text-[9px] select-none ${
              currentYear === yr ? "text-foreground font-semibold" :
              dateIndex >= (yr - 2020) * 12 ? "text-muted-foreground" : "text-muted-foreground/30"
            }`}>{yr}</span>
          ))}
        </div>

        {/* Track */}
        <div className="relative h-5">
          {/* Era color bands */}
          {ERAS.map((e) => {
            const si = months.indexOf(e.from);
            const ei = months.indexOf(e.to);
            if (si === -1) return null;
            const sp = (si / (MONTHS_TOTAL - 1)) * 100;
            const ep = (Math.min(ei, MONTHS_TOTAL - 1) / (MONTHS_TOTAL - 1)) * 100;
            const isPast = dateIndex >= si;
            return (
              <div key={e.from} className="absolute top-1.5 h-2"
                style={{
                  left: `${sp}%`,
                  width: `${ep - sp + (100 / MONTHS_TOTAL)}%`,
                  background: isPast
                    ? e.sentiment === "bullish" ? "hsl(156 50% 22% / 0.12)"
                    : e.sentiment === "bearish" ? "hsl(12 65% 42% / 0.12)"
                    : "hsl(47 7% 51% / 0.08)"
                    : "transparent",
                }}
              />
            );
          })}

          {/* Rail */}
          <div className="absolute top-2 left-0 right-0 h-px bg-border" />

          {/* Progress fill */}
          <div className="absolute top-2 left-0 h-px bg-foreground transition-all duration-1000"
            style={{ width: `${progressPct}%` }} />

          {/* Year tick marks */}
          {years.map((yr) => {
            const idx = months.indexOf(`${yr}-01`);
            const pct = (idx / (MONTHS_TOTAL - 1)) * 100;
            return <div key={yr} className="absolute top-0.5 w-px h-4 bg-border/50"
              style={{ left: `${pct}%` }} />;
          })}

          {/* Event markers */}
          {EVENTS.map((ev) => {
            const idx = months.indexOf(ev.date);
            if (idx === -1) return null;
            const pct    = (idx / (MONTHS_TOTAL - 1)) * 100;
            const isPast = idx <= dateIndex;
            return (
              <div key={ev.date} title={ev.label}
                className={`absolute top-[1px] w-1 h-2 transition-colors ${
                  isPast
                    ? ev.impact === "bullish" ? "bg-gain/70"
                    : ev.impact === "bearish" ? "bg-loss/70"
                    : "bg-muted-foreground/50"
                    : "bg-border/40"
                }`}
                style={{ left: `${pct}%`, borderRadius: "1px" }}
              />
            );
          })}

          {/* Thumb */}
          <div className="absolute top-[1px] -translate-x-1/2 transition-all duration-1000"
            style={{ left: `${progressPct}%` }}>
            <div className="w-2.5 h-4 border border-foreground bg-background flex items-center justify-center"
              style={{ borderRadius: "1px" }}>
              <div className="w-0.5 h-2 bg-foreground" style={{ borderRadius: "1px" }} />
            </div>
          </div>

          {/* Future lock overlay */}
          <div className="absolute top-0 right-0 bottom-0 pointer-events-none"
            style={{
              left: `${progressPct}%`,
              backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 3px, hsl(var(--border)/0.12) 3px, hsl(var(--border)/0.12) 4px)",
            }} />
        </div>

        {/* Month strip for current year */}
        <div className="flex justify-between mt-1">
          {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m, i) => {
            const ms   = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
            const idx  = months.indexOf(ms);
            const isCurrent = currentDate === ms;
            const past = idx !== -1 && idx <= dateIndex;
            const hasNews = !!NEWS[ms];
            return (
              <span key={i} className={`font-mono text-[7px] w-4 text-center select-none relative ${
                isCurrent ? "text-foreground font-bold" :
                past ? "text-muted-foreground" : "text-muted-foreground/25"
              }`}>
                {m}
                {hasNews && past && <span className="absolute -top-0.5 right-0 h-1 w-1 rounded-full bg-foreground/50" />}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Row 4: Coming next ─────────────────────────────────────────────── */}
      {upcomingEvents.length > 0 && (
        <div className="border-t border-border px-4 py-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 bg-muted/10">
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground/60 shrink-0">
            Coming up
          </span>
          {upcomingEvents.map((ev, i) => (
            <div key={ev.date} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-2.5 w-2.5 text-border" />}
              <span className={`font-mono text-[8px] ${
                ev.impact === "bullish" ? "text-gain/60" :
                ev.impact === "bearish" ? "text-loss/60" : "text-muted-foreground/60"
              }`}>●</span>
              <span className="font-mono text-[9px] text-muted-foreground/70">{ev.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Row 5: Current month news ───────────────────────────────────────── */}
      {currentNews.length > 0 && (
        <div className="border-t border-border px-4 py-2.5">
          <div className="flex items-center gap-1.5 mb-2">
            <Newspaper className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
              Market News — {formatSimDate(currentDate)}
            </span>
          </div>
          <div className="grid gap-1.5">
            {currentNews.map((n, i) => (
              <div key={i} className="flex items-start gap-2.5 px-2.5 py-2 bg-muted/30 border border-border/50"
                style={{ borderRadius: "2px" }}>
                <div className={`shrink-0 mt-1 h-1.5 w-1.5 rounded-full ${
                  n.impact === "bullish" ? "bg-gain" : n.impact === "bearish" ? "bg-loss" : "bg-muted-foreground"
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-medium text-foreground leading-snug">{n.headline}</div>
                  <div className="text-[9px] text-muted-foreground leading-relaxed mt-0.5">{n.detail}</div>
                </div>
                <span className={`shrink-0 font-mono text-[7px] uppercase tracking-wider font-medium px-1 py-0.5 border ${
                  n.impact === "bullish" ? "text-gain border-gain/30" :
                  n.impact === "bearish" ? "text-loss border-loss/30" : "text-muted-foreground border-border"
                }`} style={{ borderRadius: "2px" }}>
                  {n.impact === "bullish" ? "▲ Bull" : n.impact === "bearish" ? "▼ Bear" : "— Neut"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Row 6: Rate info strip ─────────────────────────────────────────── */}
      {clockStartedAt && (
        <div className="border-t border-border px-4 py-1.5 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-gain/50" />
          <span className="font-mono text-[8px] text-muted-foreground/60">
            Time advances automatically at 1 real-world hour per in-game month · future prices are locked
          </span>
        </div>
      )}
    </div>
  );
}
