import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";

// ── Brand tokens (light / paper theme) ────────────────────────────────────────
const T = {
  ink:       "#1a2820",
  ink2:      "#243328",
  amber:     "#c8852c",
  amberLt:   "#e8a84a",
  paper:     "#f5f0e8",
  paper2:    "#ede7d8",
  paper3:    "#e2dace",
  cream:     "#faf7f2",
  text:      "#1a2820",
  textDim:   "#5a6b5e",
  textFaint: "#8a9b8e",
  border:    "rgba(26,40,32,.12)",
  gain:      "#2a7a4a",
};

// Reusable style helpers
const mono  = { fontFamily: "'DM Mono', monospace" } as const;
const serif = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const body  = { fontFamily: "'Lora', Georgia, serif" } as const;

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ ...mono, fontSize: ".68rem", letterSpacing: ".18em", textTransform: "uppercase", color: T.amber, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: ".75rem" }}>
      {n} — {label}
      <span style={{ display: "inline-block", width: 32, height: 1, background: T.amber, opacity: .5 }} />
    </div>
  );
}

function Tag({ children, variant = "default" }: { children: string; variant?: "amber" | "ink" | "default" }) {
  const color = variant === "amber" ? T.amber : variant === "ink" ? T.ink : T.textFaint;
  const borderColor = variant === "amber" ? "rgba(200,133,44,.35)" : variant === "ink" ? "rgba(26,40,32,.3)" : T.border;
  return (
    <span style={{ ...mono, fontSize: ".65rem", letterSpacing: ".06em", padding: ".2rem .65rem", borderRadius: 100, border: `1px solid ${borderColor}`, color }}>
      {children}
    </span>
  );
}

function Tags({ items }: { items: Array<{ label: string; variant?: "amber" | "ink" | "default" }> }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: ".5rem", marginTop: ".75rem" }}>
      {items.map(t => <Tag key={t.label} variant={t.variant}>{t.label}</Tag>)}
    </div>
  );
}

// ── Embed Modal ───────────────────────────────────────────────────────────────
function EmbedModal({ href, label, onClose }: { href: string; label: string; onClose: () => void }) {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Detect X-Frame-Options block via load timeout
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // If contentDocument is null the frame was blocked
        if (iframeRef.current && !iframeRef.current.contentDocument) setBlocked(true);
      } catch { setBlocked(true); }
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const hostname = (() => { try { return new URL(href).hostname; } catch { return href; } })();

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(26,40,32,.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 1100, background: T.cream, borderRadius: 10, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.35)", display: "flex", flexDirection: "column", maxHeight: "90vh" }}
      >
        {/* Modal header */}
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".75rem 1rem", borderBottom: `1px solid ${T.border}`, background: T.paper2, flexShrink: 0 }}>
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={onClose} style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", border: "none", cursor: "pointer" }} title="Close" />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: T.paper3 }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: T.paper3 }} />
          </div>
          {/* URL bar */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: ".5rem", background: T.cream, border: `1px solid ${T.border}`, borderRadius: 5, padding: ".3rem .75rem" }}>
            <img src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`} alt="" width={13} height={13} style={{ borderRadius: 2 }} />
            <span style={{ ...mono, fontSize: ".72rem", color: T.textDim, letterSpacing: ".03em" }}>{href}</span>
          </div>
          <a href={href} target="_blank" rel="noopener noreferrer"
            style={{ ...mono, fontSize: ".68rem", letterSpacing: ".08em", textTransform: "uppercase", color: T.amber, textDecoration: "none", padding: ".3rem .75rem", border: `1px solid rgba(200,133,44,.35)`, borderRadius: 4, flexShrink: 0 }}>
            Open ↗
          </a>
        </div>

        {/* iframe / blocked state */}
        <div style={{ flex: 1, position: "relative", minHeight: 480 }}>
          {blocked ? (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.25rem", background: T.paper }}>
              <img src={`https://image.thum.io/get/width/1100/crop/620/noanimate/${href}`} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", opacity: .6 }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                <p style={{ ...mono, fontSize: ".75rem", color: T.textDim, letterSpacing: ".08em" }}>This site blocks embedding — screenshot shown.</p>
                <a href={href} target="_blank" rel="noopener noreferrer"
                  style={{ ...mono, fontSize: ".72rem", letterSpacing: ".1em", textTransform: "uppercase", padding: ".65rem 1.5rem", background: T.ink, color: T.paper, borderRadius: 4, textDecoration: "none" }}>
                  View Full Site ↗
                </a>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={href}
              title={label}
              style={{ width: "100%", height: "100%", border: "none", minHeight: 520 }}
              onError={() => setBlocked(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={{ position: "relative", padding: "7rem 0 5rem", borderBottom: `1px solid ${T.border}` }}>
      {/* Decorative mark */}
      <svg style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: 260, height: 260, opacity: .06, pointerEvents: "none" }} viewBox="0 0 280 280" fill="none">
        <circle cx="120" cy="120" r="100" stroke={T.ink} strokeWidth="8"/>
        <line x1="198" y1="198" x2="272" y2="272" stroke={T.ink} strokeWidth="10" strokeLinecap="round"/>
        <rect x="96" y="72" width="48" height="96" rx="6" fill={T.amber}/>
        <line x1="120" y1="44" x2="120" y2="72" stroke={T.amber} strokeWidth="10" strokeLinecap="round"/>
        <line x1="120" y1="168" x2="120" y2="196" stroke={T.amber} strokeWidth="10" strokeLinecap="round"/>
      </svg>

      <p style={{ ...mono, fontSize: ".72rem", letterSpacing: ".18em", textTransform: "uppercase", color: T.textFaint, marginBottom: "1.5rem" }}>
        Interactive Media Capstone · NYU · 2025–2026
      </p>
      <h1 style={{ ...serif, fontStyle: "italic", fontSize: "clamp(3.5rem,7vw,6rem)", lineHeight: 1.02, marginBottom: ".5rem", color: T.ink }}>
        Investigo<span style={{ color: T.amber, fontStyle: "normal" }}>.</span>
      </h1>
      <p style={{ ...mono, fontSize: ".85rem", letterSpacing: ".15em", textTransform: "uppercase", color: T.textDim, marginBottom: "2rem" }}>
        Track · Trace · Invest
      </p>
      <p style={{ ...body, fontSize: "1.1rem", color: T.textDim, maxWidth: 560, marginBottom: "1.75rem" }}>
        A gamified financial literacy platform built for a generation that invests on hype. This is the full archive of how it was made — seven months, five prototypes, twelve user tests, and one complete rebuild.
      </p>
      <p style={{ ...mono, fontSize: ".75rem", color: T.textFaint, letterSpacing: ".06em", marginBottom: "2rem" }}>
        Mohidul Alam &nbsp;·&nbsp; Advisors: Jack B Du, Aaron Sherwood &nbsp;·&nbsp; April 2026
      </p>

      {/* Stat pills */}
      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: ".75rem", marginBottom: "2rem" }}>
        {[["5","Prototypes"],["3","User Interviews"],["12","Testing Sessions"],["50","Lessons"],["130+","Assets Simulated"],["2020–2026","Historical Range"]].map(([v,l])=>(
          <div key={l} style={{ background: T.paper2, border: `1px solid ${T.border}`, borderRadius: 100, padding: ".35rem 1rem", ...mono, fontSize: ".72rem", color: T.textDim }}>
            <strong style={{ color: T.ink }}>{v}</strong> {l}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" as const }}>
        <a href="https://im-projext.vercel.app" target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".75rem 1.75rem", background: T.ink, color: T.paper, ...mono, fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase", borderRadius: 3, textDecoration: "none" }}>
          View Live Platform ↗
        </a>
        <a href="#process"
          style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".75rem 1.75rem", background: "transparent", border: `1px solid ${T.border}`, color: T.textDim, ...mono, fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase", borderRadius: 3, textDecoration: "none" }}>
          Explore Process ↓
        </a>
      </div>
    </section>
  );
}

function Overview() {
  return (
    <section id="overview" style={{ padding: "7rem 0", borderBottom: `1px solid ${T.border}` }}>
      <SectionLabel n="00" label="Overview" />
      <h2 style={{ ...serif, fontSize: "2.5rem", marginBottom: "1.5rem", color: T.ink }}>What is Investigo?</h2>
      <p style={{ ...body, color: T.textDim, maxWidth: 680, fontSize: "1.05rem", marginBottom: "1rem" }}>
        Investigo is a web-based gamified financial literacy platform. The name pairs <em>invest</em> with the Latin <em>investigo</em> — to track, to trace, to pursue evidence with deliberate attention. It combines a 60-day curriculum, a historically accurate market simulator, a knowledge-gated earn-to-invest mechanic, and a personalized analytics dashboard.
      </p>
      <p style={{ ...body, color: T.textDim, maxWidth: 680, fontSize: "1.05rem" }}>
        The central argument: the crisis of hype-driven investing is a design problem. The solution is a platform where the architecture itself enforces the lesson — <strong style={{ color: T.ink }}>you cannot invest until you have demonstrated you understand what you are investing in.</strong>
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: T.border, border: `1px solid ${T.border}`, borderRadius: 6, overflow: "hidden", margin: "3rem 0" }}>
        {[
          { num: "50",   color: T.amber, lbl: "Lessons across 5 units" },
          { num: "60",   color: T.ink,   lbl: "Day structured curriculum" },
          { num: "130+", color: T.amber, lbl: "Assets in simulator" },
          { num: "12",   color: T.ink,   lbl: "Remote user testing sessions" },
        ].map(s => (
          <div key={s.lbl} style={{ background: T.paper, padding: "2rem 1.5rem" }}>
            <div style={{ ...serif, fontSize: "3rem", lineHeight: 1, marginBottom: ".3rem", color: s.color }}>{s.num}</div>
            <div style={{ ...mono, fontSize: ".68rem", letterSpacing: ".08em", textTransform: "uppercase", color: T.textFaint }}>{s.lbl}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const TIMELINE_ITEMS = [
  { phase: "October 2025 — Phase 1", title: "Finding the Problem", body: "The earliest direction was broad: playful finance, gamified, accessible to beginners. Advisors pushed me to research before building — identify the audience, conduct interviews, write a UX paper. I was thinking about financial literacy in emerging markets and about making investing feel less like a spreadsheet and more like something human.", link: null, tags: [{label:"Research",variant:"amber" as const},{label:"Competitive Analysis"},{label:"Audience Definition"}] },
  { phase: "Early November 2025 — Phase 2", title: "Prototype 1 — Stock Seer", body: "First working prototype: a DCF valuation tool. Type in a company name, get a verdict — undervalued, overvalued, or fairly priced. Built on Lovable with static data. The idea came from my VC background: valuation logic is always hidden in spreadsheets. I wanted to make it visible and teachable. What I learned: simplicity builds trust. But it had a ceiling — it was a calculator, not a learning platform.", link: { href: "https://preview--stock-seer-valuator.lovable.app/", label: "preview--stock-seer-valuator.lovable.app" }, tags: [{label:"Prototype 1",variant:"amber" as const},{label:"Lovable"},{label:"DCF Model"},{label:"Static Data"}] },
  { phase: "Mid November 2025 — Phase 3", title: "Prototype 2 — Early Alpha Finder", body: "After in-class feedback I ran a '5 alternative meanings' exercise and pivoted. Added an Alpha Score, Hidden Compounders watchlist, Catalyst Timeline, and Scenario Modeling. The framing shifted from 'understand valuations' to 'build wealth.' It felt more exciting. It also felt like I was solving the wrong problem.", link: { href: "https://hidden-compounders.lovable.app/", label: "hidden-compounders.lovable.app" }, tags: [{label:"Prototype 2",variant:"amber" as const},{label:"Alpha Score"},{label:"Watchlist"},{label:"Scenario Modeling"}] },
  { phase: "Late November 2025 — Phase 4", title: "Prototype 3 — Calm Money Jars", body: "I ran the 'Why?' process again and hit something uncomfortable: even if you pick the right stocks, bad money management destroys you. Three jars: Now (bills, emergencies), Soon (mid-term goals), Later (long-term compounding). The most counterintuitive prototype — and the most useful design lesson.", link: { href: "https://calm-money-jars.lovable.app/", label: "calm-money-jars.lovable.app" }, tags: [{label:"Prototype 3",variant:"amber" as const},{label:"Money Management"},{label:"Behavioral Design"}] },
  { phase: "Early December 2025 — Phase 5", title: "Prototype 4 — Flip & Fun", body: "The assignment: break your own idea. I ran two exercises. Reversal: flipped Calm Money Jars into 'Stress Seer.' Random stimulation: random word was 'Garden.' Built a Money Garden where dollars are seeds. The lesson: finance apps don't have to look like spreadsheets. This thinking directly influenced Investigo's final design.", link: null, tags: [{label:"Prototype 4",variant:"amber" as const},{label:"Reversal Method"},{label:"Random Stimulation"},{label:"Conceptual Exploration"}] },
  { phase: "November–December 2025 — Phase 6", title: "User Research — Three Interviews", body: "My advisor pushed me to stop building and listen properly. Three formal user interviews. Kashpia (25, PM): wants micro-learning, no jargon, human and habit-forming. Atiq (22, engineering student): wants chat, not courses. Faisal (CS student): wants a sandbox, not a curriculum. Three people. Three completely different mental models. All three pushed the project in useful directions.", link: null, tags: [{label:"User Research",variant:"amber" as const},{label:"3 Interviews"},{label:"Mental Models"}] },
  { phase: "After Midterm, December 2025 — Phase 7", title: "The Big Pivot — Duolingo for Stock Trading", body: "Threw out everything. Built a 'Duolingo for Stock Trading' on Replit over a weekend: 25 interactive lessons, leaderboard, profiles, quizzes, games. Learning stock trading should feel as smooth and habit-forming as learning a language. The first prototype that felt like it could actually become something.", link: { href: "https://stock-duel-ma7264.replit.app/", label: "stock-duel-ma7264.replit.app" }, tags: [{label:"Major Pivot",variant:"amber" as const},{label:"Replit"},{label:"25 Lessons"},{label:"Gamification"}] },
  { phase: "Week 12, December 2025 — Phase 8", title: "AI Agent Experiment", body: "Built a Chatbase AI agent trained on NVIDIA investor relations data. This experiment didn't become the final product, but it gave me clarity on where AI fits in financial education, and confirmation that the structured lesson approach was actually stronger than pure conversational AI for beginners.", link: null, tags: [{label:"AI Experiment",variant:"amber" as const},{label:"Chatbase"},{label:"NVIDIA IR Data"},{label:"Conversational UI"}] },
  { phase: "January 22, 2026 — Phase 9", title: "React Rebuild — Proper Codebase", body: 'Advisor meeting. Feedback: "Very good app, gamified, fun — but it feels like a Duolingo replica. Create something people haven\'t seen before." Rebuilt from scratch in React — not Replit, not Lovable. A real codebase, pushed to GitHub, deployed to Vercel.', link: null, tags: [{label:"React Rebuild",variant:"amber" as const},{label:"GitHub"},{label:"Vercel"},{label:"Final Direction Set",variant:"ink" as const}] },
  { phase: "February 2026 — Phase 10", title: "Building the Learning Experience", body: "Deepest heads-down building period. Built the 50-lesson curriculum across 5 thematic units, flashcard and quiz system, the earn-to-invest mechanic, the historical simulator (Jan 2020–2026) with annotated news events at every major market moment, and the Deep Space Finance design system.", link: null, tags: [{label:"50 Lessons",variant:"amber" as const},{label:"Simulator Build"},{label:"Design System"},{label:"Earn-to-Invest"}] },
  { phase: "March–April 2026 — Phase 11", title: "12 Remote User Testing Sessions", body: "All research was remote. Twelve sessions across three rounds via Zoom and Google Meet, think-aloud protocol, structured debrief questions. Round 1: early prototype. Round 2: curriculum and simulator integrated. Round 3: near-complete platform, full flow from onboarding to analytics.", link: { href: "https://im-projext.vercel.app", label: "im-projext.vercel.app (final platform)" }, tags: [{label:"12 Sessions",variant:"amber" as const},{label:"Think-Aloud Protocol"},{label:"3 Rounds"},{label:"Final Platform",variant:"ink" as const}] },
];

function TimelineCard({ item, index }: { item: typeof TIMELINE_ITEMS[number]; index: number }) {
  const phaseNum = String(index + 1).padStart(2, "0");
  const isMilestone = item.tags.some(t => t.variant === "ink");
  const [embedOpen, setEmbedOpen] = useState(false);
  const hostname = item.link ? (() => { try { return new URL(item.link.href).hostname; } catch { return ""; } })() : "";

  return (
    <>
      {embedOpen && item.link && (
        <EmbedModal href={item.link.href} label={item.link.label} onClose={() => setEmbedOpen(false)} />
      )}
      <div style={{
        position: "relative",
        background: T.paper,
        border: `1px solid ${isMilestone ? T.amber : T.border}`,
        borderRadius: 8,
        padding: "2rem",
        overflow: "hidden",
        transition: "box-shadow .2s, transform .2s",
      }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 32px rgba(26,40,32,.1)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ""; el.style.boxShadow = ""; }}
      >
        {/* Large watermark phase number */}
        <div style={{ position: "absolute", top: -8, right: 16, ...serif, fontSize: "7rem", fontWeight: 700, color: T.border, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
          {phaseNum}
        </div>

        {/* Top row: phase label + milestone badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".75rem" }}>
          <span style={{ ...mono, fontSize: ".65rem", letterSpacing: ".18em", textTransform: "uppercase", color: T.amber }}>
            {item.phase}
          </span>
          {isMilestone && (
            <span style={{ ...mono, fontSize: ".6rem", letterSpacing: ".1em", textTransform: "uppercase", padding: ".2rem .6rem", background: T.ink, color: T.paper, borderRadius: 3 }}>
              Milestone
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ ...serif, fontSize: "1.35rem", marginBottom: ".75rem", color: T.ink, lineHeight: 1.2, maxWidth: "85%" }}>
          {item.title}
        </h3>

        {/* Body */}
        <p style={{ ...body, color: T.textDim, fontSize: ".9rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
          {item.body}
        </p>

        {/* Tags */}
        <Tags items={item.tags} />

        {/* Embed link button */}
        {item.link && (
          <button
            onClick={() => setEmbedOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "1.25rem",
              padding: ".75rem 1rem",
              background: T.cream,
              border: `1px solid ${T.border}`,
              borderRadius: 4,
              cursor: "pointer",
              transition: "background .15s, border-color .15s",
              textAlign: "left",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = T.paper2; el.style.borderColor = T.amber; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = T.cream; el.style.borderColor = T.border; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem", minWidth: 0 }}>
              <img
                src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
                alt="" width={14} height={14}
                style={{ borderRadius: 2, flexShrink: 0 }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              <span style={{ ...mono, fontSize: ".7rem", color: T.textDim, letterSpacing: ".04em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.link.label}
              </span>
            </div>
            <span style={{ ...mono, fontSize: ".68rem", color: T.amber, flexShrink: 0, marginLeft: ".5rem", letterSpacing: ".06em" }}>
              View →
            </span>
          </button>
        )}
      </div>
    </>
  );
}

function Process() {
  return (
    <section id="process" style={{ padding: "7rem 0", borderBottom: `1px solid ${T.border}` }}>
      <SectionLabel n="01" label="Process" />
      <h2 style={{ ...serif, fontSize: "2.5rem", marginBottom: ".75rem", color: T.ink }}>Seven Months of Making</h2>
      <p style={{ ...body, color: T.textDim, maxWidth: 620, marginBottom: "3rem" }}>
        The project went through five completely different directions before arriving at the final platform. Each pivot was driven by real feedback, real user data, or an honest moment of realizing I was solving the wrong problem.
      </p>

      {/* Progress bar showing months */}
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "3rem", overflowX: "auto", paddingBottom: ".5rem" }}>
        {["Oct '25","Nov '25","Dec '25","Jan '26","Feb '26","Mar '26","Apr '26"].map((m, i) => (
          <div key={m} style={{ display: "flex", alignItems: "center", gap: ".5rem", flexShrink: 0 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: i === 6 ? T.ink : T.amber, margin: "0 auto .3rem" }} />
              <span style={{ ...mono, fontSize: ".6rem", color: T.textFaint, letterSpacing: ".06em" }}>{m}</span>
            </div>
            {i < 6 && <div style={{ width: 48, height: 1, background: `linear-gradient(to right, ${T.amber}, ${T.border})`, flexShrink: 0 }} />}
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1.25rem" }}>
        {TIMELINE_ITEMS.map((item, i) => (
          <TimelineCard key={item.title} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

const PRECEDENTS = [
  { year: "SIFMA Foundation · 1977", name: "The Stock Market Game", body: "The longest-running financial simulation in American education, 4M+ students annually. Research confirms significantly greater financial knowledge gains over matched control groups (Mandell, 2009).", lesson: '"Real stakes inside a safe container. I kept the principle, added the prerequisite curriculum that was missing."' },
  { year: "Luis von Ahn · 2011", name: "Duolingo", body: "500M+ users sustained by design, not willpower. Von Ahn's core insight: motivation — not content quality — is the binding constraint in self-directed education (von Ahn, 2013).", lesson: '"The earn-to-invest mechanic is Duolingo\'s XP system — except the reward is investable capital, not a badge."' },
  { year: "UW Center for Game Science · 2008", name: "Foldit", body: "Players solved a 15-year-old HIV protein structure problem in 10 days. The team chose scientific accuracy over simplified gameplay — and it worked (Cooper et al., 2010).", lesson: '"I simulated real historical price data, not randomized markets. The fidelity is the lesson."' },
  { year: "Investopedia · 2000s", name: "Stock Simulator", body: "Equity simulations improve knowledge scores by 42% on average (Moffit et al., 2010). But the simulator and education exist as entirely separate products — users can trade without reading anything.", lesson: '"I inverted this completely: curriculum completion is the only path to the simulator."' },
];

const INTERVIEWS = [
  { initial: "K", name: "Kashpia, 25", role: "Product Manager · AI Startup · San Diego", body: "Confirmed the Duolingo-for-investing direction but demanded nuance. Wants micro-learning — 5–10 minutes, small wins, one concept at a time, human tone, real-life context. Shaped the entire pacing and voice of the final curriculum." },
  { initial: "A", name: "Atiq, 22", role: "Engineering Student · Invests $100/month", body: "Didn't want levels or courses — wanted chat. Learns by asking questions in his own words and getting answers that match his level and his specific situation. Introduced the personalization angle that became the analytics dashboard." },
  { initial: "F", name: "Faisal", role: "CS Student", body: "Didn't want chat or lessons — wanted a sandbox. Change variables, see results, test scenarios, learn through cause and effect. His feedback pushed the simulator toward higher fidelity and more interactive scenario framing." },
];

function Research() {
  return (
    <section id="research" style={{ padding: "7rem 0", borderBottom: `1px solid ${T.border}` }}>
      <SectionLabel n="02" label="Research" />
      <h2 style={{ ...serif, fontSize: "2.5rem", marginBottom: ".75rem", color: T.ink }}>Precedents & Academic Grounding</h2>
      <p style={{ ...body, color: T.textDim, maxWidth: 620, marginBottom: ".5rem" }}>
        Four projects shaped the intellectual architecture of Investigo — each one teaching a specific lesson about what to build and what to avoid.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1.5rem", marginTop: "2.5rem" }}>
        {PRECEDENTS.map(p => (
          <div key={p.name} style={{ background: T.paper, border: `1px solid ${T.border}`, borderRadius: 6, padding: "2rem" }}>
            <p style={{ ...mono, fontSize: ".65rem", letterSpacing: ".12em", textTransform: "uppercase", color: T.textFaint, marginBottom: ".5rem" }}>{p.year}</p>
            <h3 style={{ ...serif, fontSize: "1.3rem", marginBottom: ".6rem", color: T.ink }}>{p.name}</h3>
            <p style={{ ...body, fontSize: ".875rem", color: T.textDim, marginBottom: "1rem" }}>{p.body}</p>
            <p style={{ ...body, fontSize: ".85rem", fontStyle: "italic", color: T.amber, paddingTop: ".75rem", borderTop: `1px solid ${T.border}` }}>{p.lesson}</p>
          </div>
        ))}
      </div>

      <h3 style={{ ...serif, fontSize: "1.6rem", margin: "4rem 0 .5rem", color: T.ink }}>User Interviews</h3>
      <p style={{ ...body, color: T.textDim, fontSize: ".9rem", maxWidth: 560, marginBottom: ".5rem" }}>Three formal interviews conducted November–December 2025. Each reshaped the project in a different direction.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem", marginTop: "2rem" }}>
        {INTERVIEWS.map(i => (
          <div key={i.name} style={{ background: T.paper, border: `1px solid ${T.border}`, borderRadius: 6, padding: "1.75rem" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: T.ink, color: T.paper, ...serif, fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>{i.initial}</div>
            <div style={{ ...serif, fontSize: "1.1rem", marginBottom: ".15rem", color: T.ink }}>{i.name}</div>
            <div style={{ ...mono, fontSize: ".65rem", color: T.textFaint, letterSpacing: ".06em", marginBottom: ".75rem" }}>{i.role}</div>
            <div style={{ ...body, fontSize: ".85rem", color: T.textDim }}>{i.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const BASE_URL = "https://im-projext.vercel.app";
// Thum.io renders a real browser screenshot — no API key required.
function screenshotUrl(path: string) {
  return `https://image.thum.io/get/width/1200/crop/675/noanimate/${BASE_URL}${path}`;
}

const SCREEN_ITEMS = [
  {
    title: "Landing Page",
    desc:  "Hero with S&P 500 simulation chart annotated with COVID crash, meme stocks, Fed rate hikes, and AI rally.",
    img:   screenshotUrl("/"),
    href:  "/",
    internal: true,
  },
  {
    title: "Learn — Curriculum",
    desc:  "50 lessons across 5 units. Earn virtual capital by completing quizzes. Progress gates access to the simulator.",
    img:   screenshotUrl("/learn"),
    href:  "/learn",
    internal: true,
  },
  {
    title: "Trading Simulator",
    desc:  "Real historical data 2020–2026. Annotated news events, P&L tracking, open positions, real-time simulation clock.",
    img:   screenshotUrl("/trade"),
    href:  "/trade",
    internal: true,
  },
  {
    title: "Analytics Dashboard",
    desc:  "Investor type classification, behavioral radar, buy/sell timing scores, and personalized insight cards.",
    img:   screenshotUrl("/analysis"),
    href:  "/analysis",
    internal: true,
  },
];

function ScreenCard({ s }: { s: typeof SCREEN_ITEMS[number] }) {
  const [loaded, setLoaded] = useState(false);
  const content = (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", background: T.paper, transition: "transform .2s, box-shadow .2s", cursor: "pointer" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(26,40,32,.12)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}>
      {/* Screenshot */}
      <div style={{ width: "100%", aspectRatio: "16/9", background: "#1a2820", position: "relative", overflow: "hidden" }}>
        {!loaded && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ ...mono, fontSize: ".65rem", color: "rgba(245,240,232,.3)", letterSpacing: ".1em" }}>Loading screenshot…</span>
          </div>
        )}
        <img
          src={s.img}
          alt={s.title}
          onLoad={() => setLoaded(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: loaded ? "block" : "none" }}
        />
        {/* Overlay badge */}
        <div style={{ position: "absolute", top: 10, right: 10, ...mono, fontSize: ".62rem", letterSpacing: ".08em", textTransform: "uppercase", padding: ".25rem .6rem", background: "rgba(26,40,32,.75)", color: "rgba(245,240,232,.7)", backdropFilter: "blur(6px)", borderRadius: 3 }}>
          Open ↗
        </div>
      </div>
      <div style={{ padding: "1.1rem 1.25rem" }}>
        <h4 style={{ ...serif, fontSize: "1rem", marginBottom: ".25rem", color: T.ink }}>{s.title}</h4>
        <p style={{ ...body, fontSize: ".82rem", color: T.textDim }}>{s.desc}</p>
      </div>
    </div>
  );
  return s.internal
    ? <Link to={s.href} style={{ textDecoration: "none" }}>{content}</Link>
    : <a href={s.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>{content}</a>;
}

const EARN_ROWS = [
  { lessons: "1–10",  topic: "Foundations: stocks, markets, exchanges", reward: "$100–$200", assets: "SPY, VTI" },
  { lessons: "11–20", topic: "Funds: index, ETF, mutual", reward: "$200–$300", assets: "QQQ, IWM" },
  { lessons: "21–30", topic: "Portfolio strategy & diversification", reward: "$300–$400", assets: "Sector ETFs" },
  { lessons: "31–40", topic: "Risk, technicals, macroeconomics", reward: "$400–$500", assets: "Individual equities" },
  { lessons: "41–50", topic: "Behavioral finance & psychology", reward: "$500–$600", assets: "Full 130+ universe" },
  { lessons: "Total", topic: "All 50 lessons, perfect scores", reward: "~$15,000", assets: "130+ assets", bold: true },
];

function Platform() {
  return (
    <section id="platform" style={{ padding: "7rem 0", borderBottom: `1px solid ${T.border}` }}>
      <SectionLabel n="03" label="Platform" />
      <h2 style={{ ...serif, fontSize: "2.5rem", marginBottom: ".75rem", color: T.ink }}>What Was Built</h2>
      <p style={{ ...body, color: T.textDim, maxWidth: 680, marginBottom: "1rem" }}>
        The final platform — <strong>Investigo</strong> — brings together four interconnected systems built over February–April 2026.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1.5rem", marginTop: "2.5rem" }}>
        {SCREEN_ITEMS.map(s => <ScreenCard key={s.title} s={s} />)}
      </div>


      {/* Earn-to-invest table */}
      <h3 style={{ ...serif, fontSize: "1.5rem", margin: "4rem 0 .5rem", color: T.ink }}>Earn-to-Invest Reward Structure</h3>
      <p style={{ ...body, color: T.textDim, fontSize: ".9rem", maxWidth: 560, marginBottom: ".5rem" }}>You start with zero capital. Every quiz pass earns virtual currency. That currency is the only way to fund trades.</p>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "2rem", fontSize: ".875rem" }}>
        <thead>
          <tr>
            {["Lessons","Topic Area","Reward (Perfect)","Assets Unlocked"].map(h => (
              <th key={h} style={{ background: T.paper2, color: T.textFaint, ...mono, fontSize: ".68rem", letterSpacing: ".08em", textTransform: "uppercase", padding: ".75rem 1rem", textAlign: "left", borderBottom: `1px solid ${T.border}`, fontWeight: 400 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {EARN_ROWS.map(r => (
            <tr key={r.lessons}>
              <td style={{ padding: ".75rem 1rem", borderBottom: r.bold ? "none" : `1px solid rgba(26,40,32,.05)`, ...mono, color: T.amber, fontWeight: r.bold ? 500 : 400 }}>{r.lessons}</td>
              <td style={{ padding: ".75rem 1rem", borderBottom: r.bold ? "none" : `1px solid rgba(26,40,32,.05)`, color: r.bold ? T.ink : T.textDim, ...body, fontSize: ".875rem", fontWeight: r.bold ? 500 : 400 }}>{r.topic}</td>
              <td style={{ padding: ".75rem 1rem", borderBottom: r.bold ? "none" : `1px solid rgba(26,40,32,.05)`, ...mono, color: T.gain, fontWeight: r.bold ? 500 : 400 }}>{r.reward}</td>
              <td style={{ padding: ".75rem 1rem", borderBottom: r.bold ? "none" : `1px solid rgba(26,40,32,.05)`, color: r.bold ? T.ink : T.textDim, ...body, fontSize: ".875rem", fontWeight: r.bold ? 500 : 400 }}>{r.assets}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

const FINDINGS = [
  { icon: "✓", type: "good", title: "The simulator's emotional power confirmed", body: "Multiple participants — including self-described experienced investors — sold during the COVID crash sequence, locked in losses, then watched the market recover past their entry point in the same session. The experiential lesson landed in a way no reading could replicate.", quote: { text: '"Oh. That is what people mean when they say do not sell the bottom."', cite: "— Participant, 24, 2 years on Robinhood" } },
  { icon: "⚠", type: "bad", title: "Curriculum completion friction — 6 of 12 testers", body: "Users with prior investing knowledge were frustrated by foundational lessons before simulator access. The mechanic is architecturally correct but creates real friction for users who arrive with prior knowledge. Resolution: a placement assessment at onboarding.", quote: { text: '"I know what a stock is. I do not need a lesson on what a stock is before I can practice buying one."', cite: "— Participant, Robinhood user, 2 years experience" } },
  { icon: "◈", type: "insight", title: "Investor identity resonates more than instruction", body: "Participants across all skill levels paused to study their analytics results. Several asked to screenshot their investor type classification. Being told what kind of investor you are — based on your own decisions — resonated far more than any explicit lesson content." },
  { icon: "↗", type: "bad", title: "Mobile responsiveness broken — top complaint", body: "Almost everyone tried the demo on their phone. Elements overlapped, buttons pushed off-screen, scrolling unpredictable, app freezing. This became the immediate top priority for fixes after the walkthrough." },
  { icon: "+", type: "good", title: "XP gates and Daily Wisdom AI got strong positive response", body: "The lesson → XP → unlocked assets loop felt motivating and intuitive to most testers. The Gemini-powered Daily Wisdom AI mentor was noted for how calm and non-trading-app-like it felt — a deliberate design choice validated by real users." },
];

function Testing() {
  return (
    <section id="testing" style={{ padding: "7rem 0", borderBottom: `1px solid ${T.border}` }}>
      <SectionLabel n="04" label="User Testing" />
      <h2 style={{ ...serif, fontSize: "2.5rem", marginBottom: ".75rem", color: T.ink }}>12 Remote Sessions</h2>
      <p style={{ ...body, color: T.textDim, maxWidth: 660, marginBottom: "2rem" }}>
        All sessions were remote. Zoom and Google Meet, think-aloud protocol, structured debrief questions. Three rounds across the semester: early, mid-stage, and near-final.
      </p>

      <div style={{ display: "grid", gap: "1rem" }}>
        {FINDINGS.map(f => (
          <div key={f.title}>
            <div style={{ display: "grid", gridTemplateColumns: "3rem 1fr", gap: "1.25rem", alignItems: "start", background: T.paper, border: `1px solid ${T.border}`, borderRadius: 6, padding: "1.5rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", background: f.type === "good" ? "rgba(200,133,44,.1)" : f.type === "insight" ? "rgba(200,133,44,.07)" : "rgba(26,40,32,.07)", flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ ...serif, fontWeight: 600, fontSize: ".9rem", marginBottom: ".3rem", color: T.ink }}>{f.title}</div>
                <div style={{ ...body, fontSize: ".85rem", color: T.textDim }}>{f.body}</div>
              </div>
            </div>
            {f.quote && (
              <blockquote style={{ borderLeft: `3px solid ${T.amber}`, padding: "1rem 1.5rem", margin: "1rem 0", background: "rgba(200,133,44,.05)", borderRadius: "0 6px 6px 0", fontStyle: "italic", fontSize: "1rem", color: T.ink }}>
                {f.quote.text}
                <cite style={{ display: "block", fontSize: ".75rem", color: T.textFaint, fontStyle: "normal", ...mono, marginTop: ".5rem", letterSpacing: ".04em" }}>{f.quote.cite}</cite>
              </blockquote>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Reflection() {
  return (
    <section id="reflection" style={{ padding: "7rem 0", borderBottom: `1px solid ${T.border}` }}>
      <SectionLabel n="05" label="Reflection" />
      <h2 style={{ ...serif, fontSize: "2.5rem", marginBottom: "2rem", color: T.ink }}>What Building This Taught Me</h2>
      <div style={{ maxWidth: 680 }}>
        {[
          "Seven months of building Investigo taught me things I could not have learned by reading about them — which is appropriately on-theme for a project about experiential learning. The most important discovery was how emotionally powerful the simulator became. I designed it as an educational tool. In practice it functioned as something closer to a mirror.",
          "The most humbling: six of twelve testers hit friction I designed into the system deliberately. The earn-to-invest mechanic is architecturally correct — and it annoyed half my test group. Good design and correct design are not always the same thing. The placement assessment I am now building is not a workaround. It is the design becoming more honest about who actually shows up.",
          "The most useful lesson from the early prototypes: the Calm Money Jars pivot in Prototype 3 forced me to think about what investing education is actually for. Not picking winners. Surviving long enough to benefit when you do. That reframing lives inside Investigo's curriculum today even though the jars are gone.",
          "The hardest thing to admit: Investigo can make you a more informed investor. It cannot change the environment in which you invest. Social media platforms and brokerage apps are designed to reward emotional reactivity over deliberate analysis. That is a larger design problem this platform alone cannot solve. Worth naming — not as a reason to stop, but as an honest acknowledgment of where the work ends and a harder problem begins.",
        ].map((p, i) => (
          <p key={i} style={{ ...body, color: T.textDim, marginBottom: "1.5rem", fontSize: ".975rem" }}>{p}</p>
        ))}
      </div>
    </section>
  );
}

const FUTURE_ITEMS = [
  { num: "01", title: "Placement Assessment", body: "20-question onboarding diagnostic. Bypass lessons you already know, still receive the equivalent virtual currency. Directly addresses friction raised by 6 of 12 testers." },
  { num: "02", title: "Mobile Responsiveness", body: "Fix what broke. The platform is meant to be accessible on any device. Elements overlapping, buttons off-screen, freezing on phones. Top priority before any public launch." },
  { num: "03", title: "Real-Time Simulation", body: "After the historical simulation, apply learning to live market conditions. One-week delayed analytics preserves the reflective structure that historical hindsight currently provides." },
  { num: "04", title: "Empirical Outcome Study", body: "Pre/post assessment measuring financial literacy, hype susceptibility, and investment confidence. The central claim needs data, not just argument." },
  { num: "05", title: "Behavioral Benchmarking", body: "Cohort comparisons on process metrics — timing discipline, risk management, consistency — not raw returns. Reward decision quality over luck." },
  { num: "06", title: "Fintech Integration", body: "Payment infrastructure, subscription tiers, wallet top-ups. AppSumo launch strategy for early adopters. Turn the capstone prototype into a real product." },
];

function Future() {
  return (
    <section id="next" style={{ padding: "7rem 0" }}>
      <SectionLabel n="06" label="Future Steps" />
      <h2 style={{ ...serif, fontSize: "2.5rem", marginBottom: ".75rem", color: T.ink }}>Where This Goes Next</h2>
      <p style={{ ...body, color: T.textDim, maxWidth: 580, marginBottom: ".5rem" }}>Six priorities — all direct responses to specific findings from testing and production, not a wishlist.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem", marginTop: "2.5rem" }}>
        {FUTURE_ITEMS.map(f => (
          <div key={f.num} style={{ background: T.paper, border: `1px solid ${T.border}`, borderRadius: 6, padding: "1.5rem" }}>
            <div style={{ ...serif, fontSize: "2.5rem", color: T.paper3, lineHeight: 1, marginBottom: ".75rem" }}>{f.num}</div>
            <div style={{ ...serif, fontSize: "1rem", marginBottom: ".4rem", color: T.ink }}>{f.title}</div>
            <div style={{ ...body, fontSize: ".82rem", color: T.textDim }}>{f.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Archive() {
  const topRef = useRef<HTMLDivElement>(null);

  // Inject Google Fonts for the archive's own typography if not already loaded
  useEffect(() => {
    const id = "archive-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id   = id;
      link.rel  = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Mono:wght@400;500&family=Lora:ital,wght@0,400;0,500;1,400&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div
      ref={topRef}
      style={{
        background:  T.cream,
        color:       T.text,
        fontFamily:  "'Lora', Georgia, serif",
        fontSize:    17,
        lineHeight:  1.75,
        overflowX:   "hidden",
        // Override the dark theme applied by the parent <div className="dark">
        colorScheme: "light",
      }}
      className="light"
    >
      {/* Subtle paper grain */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", pointerEvents: "none", zIndex: 0, opacity: .6 }} />

      {/* Sticky in-page nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "2rem", padding: "0 3rem", height: 48, background: "rgba(245,240,232,.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.border}` }}>
        {[["#overview","Overview"],["#process","Process"],["#research","Research"],["#platform","Platform"],["#testing","Testing"],["#reflection","Reflection"],["#next","Next"]].map(([href,label])=>(
          <a key={href} href={href} style={{ ...mono, fontSize: ".7rem", letterSpacing: ".1em", textTransform: "uppercase", color: T.textDim, textDecoration: "none" }}>{label}</a>
        ))}
      </nav>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1080, margin: "0 auto", padding: "0 3rem" }}>
        <Hero />
        <Overview />
        <Process />
        <Research />
        <Platform />
        <Testing />
        <Reflection />
        <Future />

        {/* Page footer */}
        <div style={{ borderTop: `1px solid ${T.border}`, padding: "3rem 0", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap" as const, gap: "1rem" }}>
          <div>
            <div style={{ ...serif, fontStyle: "italic", fontSize: "1.5rem", color: T.ink, marginBottom: ".4rem" }}>Investigo</div>
            <div style={{ ...mono, fontSize: ".7rem", color: T.textFaint, letterSpacing: ".04em" }}>
              Mohidul Alam &nbsp;·&nbsp; Interactive Media Capstone · NYU · April 2026<br />
              Advisors: Jack B Du, Aaron Sherwood
            </div>
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="https://im-projext.vercel.app" target="_blank" rel="noopener noreferrer" style={{ ...mono, fontSize: ".72rem", letterSpacing: ".06em", color: T.textDim, textDecoration: "none" }}>Live Platform ↗</a>
            <a href="#" style={{ ...mono, fontSize: ".72rem", letterSpacing: ".06em", color: T.textDim, textDecoration: "none" }}>Back to Top ↑</a>
          </div>
        </div>
      </div>
    </div>
  );
}
