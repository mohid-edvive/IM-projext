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

// ── Section wrapper helpers ───────────────────────────────────────────────────
const W = { maxWidth: 1080, margin: "0 auto", padding: "0 3rem" };

// ── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={{ background: T.ink, position: "relative", overflow: "hidden" }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(200,133,44,.12) 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ ...W, padding: "8rem 3rem 6rem" }}>
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
          <div style={{ width: 28, height: 1, background: T.amber }} />
          <span style={{ ...mono, fontSize: ".68rem", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(245,240,232,.45)" }}>
            Interactive Media Capstone · NYU · 2025–2026
          </span>
        </div>

        {/* Title */}
        <h1 style={{ ...serif, fontStyle: "italic", fontSize: "clamp(4rem,9vw,7.5rem)", lineHeight: .95, marginBottom: "1.5rem", color: T.paper }}>
          Invest<span style={{ color: T.amber }}>igo</span><span style={{ color: T.amber, fontStyle: "normal" }}>.</span>
        </h1>

        {/* Tagline */}
        <p style={{ ...mono, fontSize: ".82rem", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(245,240,232,.4)", marginBottom: "2rem" }}>
          Track · Trace · Invest
        </p>

        {/* Description + CTA in a grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "3rem", alignItems: "end", marginBottom: "3.5rem" }}>
          <p style={{ ...body, fontSize: "1.1rem", color: "rgba(245,240,232,.65)", maxWidth: 540, lineHeight: 1.7 }}>
            A gamified financial literacy platform built for a generation that invests on hype. This is the full archive — seven months, five prototypes, twelve user tests, one complete rebuild.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", flexShrink: 0 }}>
            <a href="https://im-projext.vercel.app" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: ".75rem 1.5rem", background: T.amber, color: T.ink, ...mono, fontSize: ".72rem", letterSpacing: ".1em", textTransform: "uppercase", borderRadius: 4, textDecoration: "none", fontWeight: 500 }}>
              View Live ↗
            </a>
            <a href="#overview"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: ".75rem 1.5rem", background: "transparent", border: "1px solid rgba(245,240,232,.15)", color: "rgba(245,240,232,.55)", ...mono, fontSize: ".72rem", letterSpacing: ".1em", textTransform: "uppercase", borderRadius: 4, textDecoration: "none" }}>
              Read Archive ↓
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 1, background: "rgba(245,240,232,.06)", borderRadius: 6, overflow: "hidden", border: "1px solid rgba(245,240,232,.08)" }}>
          {[["5","Prototypes"],["3","Interviews"],["12","Test Sessions"],["50","Lessons"],["130+","Assets"],["84 mo","Simulation"]].map(([v,l])=>(
            <div key={l} style={{ padding: "1.5rem 1rem", textAlign: "center" as const }}>
              <div style={{ ...serif, fontSize: "1.8rem", fontStyle: "italic", color: T.amber, lineHeight: 1, marginBottom: ".3rem" }}>{v}</div>
              <div style={{ ...mono, fontSize: ".6rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(245,240,232,.3)" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Author */}
        <p style={{ ...mono, fontSize: ".68rem", color: "rgba(245,240,232,.25)", letterSpacing: ".06em", marginTop: "2rem" }}>
          Mohidul Alam &nbsp;·&nbsp; Advisors: Jack B Du, Aaron Sherwood &nbsp;·&nbsp; April 2026
        </p>
      </div>
    </section>
  );
}

function Overview() {
  return (
    <section id="overview" style={{ background: T.cream }}>
      <div style={{ ...W, padding: "6rem 3rem" }}>
        {/* Top label */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
          <span style={{ ...mono, fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase", color: T.amber }}>00 — Overview</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>

        {/* Two-col layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start", marginBottom: "4rem" }}>
          <div>
            <h2 style={{ ...serif, fontStyle: "italic", fontSize: "clamp(2.5rem,4vw,3.5rem)", lineHeight: 1.05, color: T.ink, marginBottom: "1.5rem" }}>
              What is<br/>Investigo?
            </h2>
            <p style={{ ...body, color: T.textDim, fontSize: "1rem", lineHeight: 1.75, marginBottom: "1rem" }}>
              Investigo is a web-based gamified financial literacy platform. The name pairs <em>invest</em> with the Latin <em>investigo</em> — to track, to trace, to pursue evidence with deliberate attention.
            </p>
            <p style={{ ...body, color: T.textDim, fontSize: "1rem", lineHeight: 1.75 }}>
              It combines a 60-day curriculum, a historically accurate market simulator, a knowledge-gated earn-to-invest mechanic, and a personalized analytics dashboard.
            </p>
          </div>
          <div>
            {/* Pull quote */}
            <div style={{ borderLeft: `3px solid ${T.amber}`, paddingLeft: "1.75rem", marginBottom: "2rem" }}>
              <p style={{ ...serif, fontStyle: "italic", fontSize: "1.25rem", color: T.ink, lineHeight: 1.5, marginBottom: ".75rem" }}>
                "The crisis of hype-driven investing is a design problem."
              </p>
              <p style={{ ...body, color: T.textDim, fontSize: ".9rem", lineHeight: 1.7 }}>
                The solution is a platform where the architecture itself enforces the lesson — you cannot invest until you have demonstrated you understand what you are investing in.
              </p>
            </div>
            <p style={{ ...mono, fontSize: ".68rem", letterSpacing: ".1em", color: T.textFaint, textTransform: "uppercase" }}>
              NYU Interactive Media Capstone · Built Feb–Apr 2026
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: T.ink, borderRadius: 8, overflow: "hidden" }}>
          {[
            { num: "50",   color: T.amber, lbl: "Lessons across 5 units", sub: "with quizzes & flashcards" },
            { num: "60",   color: "rgba(245,240,232,.9)", lbl: "Day curriculum", sub: "structured learning path" },
            { num: "130+", color: T.amber, lbl: "Assets in simulator", sub: "stocks, ETFs, indices" },
            { num: "12",   color: "rgba(245,240,232,.9)", lbl: "Testing sessions", sub: "3 rounds, think-aloud" },
          ].map(s => (
            <div key={s.lbl} style={{ padding: "2.5rem 2rem", position: "relative" as const, overflow: "hidden" }}>
              <div style={{ ...serif, fontStyle: "italic", fontSize: "3.5rem", lineHeight: 1, color: s.color, marginBottom: ".4rem" }}>{s.num}</div>
              <div style={{ ...mono, fontSize: ".68rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(245,240,232,.6)", marginBottom: ".2rem" }}>{s.lbl}</div>
              <div style={{ ...mono, fontSize: ".6rem", color: "rgba(245,240,232,.25)", letterSpacing: ".04em" }}>{s.sub}</div>
            </div>
          ))}
        </div>
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
    <section id="process" style={{ background: T.paper }}>
      {/* Dark header band */}
      <div style={{ background: T.ink }}>
        <div style={{ ...W, padding: "4rem 3rem 3.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <span style={{ ...mono, fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase", color: T.amber }}>01 — Process</span>
            <div style={{ flex: 1, height: 1, background: "rgba(245,240,232,.1)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "3rem", alignItems: "end" }}>
            <h2 style={{ ...serif, fontStyle: "italic", fontSize: "clamp(2.5rem,5vw,4rem)", color: T.paper, lineHeight: 1.05 }}>
              Seven Months<br/>of Making
            </h2>
            <p style={{ ...body, color: "rgba(245,240,232,.5)", fontSize: ".9rem", maxWidth: 360, lineHeight: 1.7 }}>
              Five completely different directions before arriving at the final platform. Each pivot driven by real feedback, real data, or an honest moment of realizing I was solving the wrong problem.
            </p>
          </div>
        </div>
      </div>

      {/* Month track */}
      <div style={{ background: T.ink, borderBottom: `1px solid rgba(245,240,232,.06)` }}>
        <div style={{ ...W, padding: "0 3rem 2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto" as const, paddingBottom: ".25rem" }}>
            {["Oct '25","Nov '25","Dec '25","Jan '26","Feb '26","Mar '26","Apr '26"].map((m, i) => (
              <div key={m} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <div style={{ textAlign: "center" as const, padding: "0 .5rem" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 6 ? T.amber : "rgba(200,133,44,.4)", margin: "0 auto .4rem" }} />
                  <span style={{ ...mono, fontSize: ".58rem", color: "rgba(245,240,232,.3)", letterSpacing: ".06em", whiteSpace: "nowrap" as const }}>{m}</span>
                </div>
                {i < 6 && <div style={{ width: 60, height: 1, background: "rgba(200,133,44,.2)", flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={{ ...W, padding: "3rem 3rem 5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem" }}>
          {TIMELINE_ITEMS.map((item, i) => (
            <TimelineCard key={item.title} item={item} index={i} />
          ))}
        </div>
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
    <section id="research" style={{ background: T.ink }}>
      <div style={{ ...W, padding: "6rem 3rem" }}>
        {/* Label */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3.5rem" }}>
          <span style={{ ...mono, fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase", color: T.amber }}>02 — Research</span>
          <div style={{ flex: 1, height: 1, background: "rgba(245,240,232,.1)" }} />
        </div>

        {/* Precedents */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", alignItems: "start", marginBottom: "5rem" }}>
          <div>
            <h2 style={{ ...serif, fontStyle: "italic", fontSize: "clamp(2rem,4vw,3rem)", color: T.paper, lineHeight: 1.1, marginBottom: "1rem" }}>
              Precedents &amp;<br/>Academic<br/>Grounding
            </h2>
            <p style={{ ...body, color: "rgba(245,240,232,.45)", fontSize: ".9rem", lineHeight: 1.7 }}>
              Four projects shaped the intellectual architecture — each teaching a specific lesson about what to build and what to avoid.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(245,240,232,.08)", borderRadius: 8, overflow: "hidden" }}>
            {PRECEDENTS.map(p => (
              <div key={p.name} style={{ background: T.ink2, padding: "1.75rem" }}>
                <p style={{ ...mono, fontSize: ".6rem", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(245,240,232,.3)", marginBottom: ".5rem" }}>{p.year}</p>
                <h3 style={{ ...serif, fontSize: "1.15rem", marginBottom: ".6rem", color: T.paper }}>{p.name}</h3>
                <p style={{ ...body, fontSize: ".82rem", color: "rgba(245,240,232,.5)", marginBottom: "1rem", lineHeight: 1.65 }}>{p.body}</p>
                <p style={{ ...body, fontSize: ".8rem", fontStyle: "italic", color: T.amber, paddingTop: ".75rem", borderTop: "1px solid rgba(245,240,232,.08)", lineHeight: 1.55 }}>{p.lesson}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(245,240,232,.08)", marginBottom: "4rem" }} />

        {/* User interviews */}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "2.5rem" }}>
            <h3 style={{ ...serif, fontStyle: "italic", fontSize: "2rem", color: T.paper }}>User Interviews</h3>
            <span style={{ ...mono, fontSize: ".65rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(245,240,232,.3)" }}>Nov–Dec 2025 · 3 sessions · Remote</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: "rgba(245,240,232,.08)", borderRadius: 8, overflow: "hidden" }}>
            {INTERVIEWS.map(i => (
              <div key={i.name} style={{ background: T.ink2, padding: "2rem" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: T.amber, color: T.ink, ...serif, fontSize: "1.2rem", fontStyle: "italic", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", fontWeight: 700 }}>{i.initial}</div>
                <div style={{ ...serif, fontSize: "1.05rem", color: T.paper, marginBottom: ".2rem" }}>{i.name}</div>
                <div style={{ ...mono, fontSize: ".6rem", color: "rgba(245,240,232,.3)", letterSpacing: ".06em", marginBottom: "1rem" }}>{i.role}</div>
                <div style={{ ...body, fontSize: ".82rem", color: "rgba(245,240,232,.5)", lineHeight: 1.65 }}>{i.body}</div>
              </div>
            ))}
          </div>
        </div>
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
  const content = (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", background: T.paper, transition: "transform .2s, box-shadow .2s", cursor: "pointer" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(26,40,32,.12)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}>
      {/* Screenshot */}
      <div style={{ width: "100%", aspectRatio: "16/9", background: "#1a2820", position: "relative", overflow: "hidden" }}>
        <img
          src={s.img}
          alt={s.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
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

const SYSTEMS = [
  { icon: "📚", label: "Learn", stat: "50 lessons", desc: "5 thematic units, flashcards, quizzes, earn-to-invest rewards" },
  { icon: "📈", label: "Trade", stat: "130+ assets", desc: "Historical simulator Jan 2020–Dec 2026, real-time clock, annotated events" },
  { icon: "📊", label: "Analysis", stat: "8 metrics", desc: "Investor type, behavioral radar, timing scores, personalized insight cards" },
  { icon: "📰", label: "News", stat: "Live feed", desc: "GDELT 2.0 API — real market news contextualised for each in-game month" },
];

const FLOW_STEPS = [
  { n: "01", label: "Complete a Lesson", sub: "Read, flashcard, or quiz format" },
  { n: "02", label: "Pass the Quiz", sub: "Score above threshold to earn" },
  { n: "03", label: "Earn Virtual Capital", sub: "$100 – $600 per lesson" },
  { n: "04", label: "Unlock Assets", sub: "Gates open as knowledge grows" },
  { n: "05", label: "Enter the Simulator", sub: "Trade with your earned capital" },
];

function Platform() {
  return (
    <section id="platform" style={{ background: T.cream }}>
      <div style={{ ...W, padding: "6rem 3rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <span style={{ ...mono, fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase", color: T.amber }}>03 — Platform</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
          <a href="https://im-projext.vercel.app" target="_blank" rel="noopener noreferrer"
            style={{ ...mono, fontSize: ".68rem", letterSpacing: ".1em", textTransform: "uppercase", padding: ".5rem 1rem", background: T.ink, color: T.paper, borderRadius: 4, textDecoration: "none" }}>
            View Live ↗
          </a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "end", marginBottom: "3.5rem" }}>
          <h2 style={{ ...serif, fontStyle: "italic", fontSize: "clamp(2.5rem,4vw,3.5rem)", color: T.ink, lineHeight: 1.05 }}>What Was Built</h2>
          <p style={{ ...body, color: T.textDim, fontSize: ".95rem", lineHeight: 1.7 }}>
            Four interconnected systems — curriculum, simulator, analytics, and live news — all built over February–April 2026.
          </p>
        </div>

        {/* Systems strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: T.ink, borderRadius: 8, overflow: "hidden", marginBottom: "2.5rem" }}>
          {SYSTEMS.map(s => (
            <div key={s.label} style={{ background: T.ink2, padding: "1.75rem 1.5rem" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: ".75rem" }}>{s.icon}</div>
              <div style={{ ...mono, fontSize: ".6rem", letterSpacing: ".15em", textTransform: "uppercase", color: T.amber, marginBottom: ".3rem" }}>{s.label}</div>
              <div style={{ ...serif, fontStyle: "italic", fontSize: "1.4rem", color: T.paper, marginBottom: ".5rem", lineHeight: 1 }}>{s.stat}</div>
              <div style={{ ...body, fontSize: ".78rem", color: "rgba(245,240,232,.45)", lineHeight: 1.55 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Large screenshot */}
        <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: "1rem", boxShadow: "0 8px 40px rgba(26,40,32,.15)" }}>
          <ScreenCard s={SCREEN_ITEMS[0]} />
        </div>

        {/* 3 smaller screenshots */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "4rem" }}>
          {SCREEN_ITEMS.slice(1).map(s => <ScreenCard key={s.title} s={s} />)}
        </div>

        {/* Earn-to-invest */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: T.ink, borderRadius: 10, overflow: "hidden" }}>
          {/* Left: flow */}
          <div style={{ background: T.ink2, padding: "2.5rem" }}>
            <h3 style={{ ...serif, fontStyle: "italic", fontSize: "1.6rem", color: T.paper, marginBottom: ".4rem" }}>Earn-to-Invest</h3>
            <p style={{ ...body, color: "rgba(245,240,232,.4)", fontSize: ".82rem", marginBottom: "2rem" }}>Zero starting capital. Knowledge converts to currency.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {FLOW_STEPS.map((step, i) => (
                <div key={step.n} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: i === FLOW_STEPS.length - 1 ? T.amber : "rgba(200,133,44,.15)", border: `1.5px solid ${T.amber}`, display: "flex", alignItems: "center", justifyContent: "center", ...mono, fontSize: ".58rem", color: i === FLOW_STEPS.length - 1 ? T.ink : T.amber, fontWeight: 600 }}>
                      {step.n}
                    </div>
                    {i < FLOW_STEPS.length - 1 && <div style={{ width: 1, height: 26, background: "rgba(200,133,44,.2)", margin: "3px 0" }} />}
                  </div>
                  <div style={{ paddingBottom: i < FLOW_STEPS.length - 1 ? ".9rem" : 0 }}>
                    <div style={{ ...serif, fontSize: ".9rem", color: T.paper, marginBottom: ".1rem" }}>{step.label}</div>
                    <div style={{ ...mono, fontSize: ".62rem", color: "rgba(245,240,232,.3)", letterSpacing: ".04em" }}>{step.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: table */}
          <div style={{ background: T.ink, padding: "2.5rem" }}>
            <h3 style={{ ...serif, fontStyle: "italic", fontSize: "1.6rem", color: T.paper, marginBottom: "1.5rem" }}>Reward Structure</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Unit","Topic","Reward","Unlocks"].map(h => (
                    <th key={h} style={{ ...mono, fontSize: ".58rem", letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(245,240,232,.25)", padding: ".5rem .6rem", textAlign: "left", borderBottom: "1px solid rgba(245,240,232,.07)", fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EARN_ROWS.map((r, i) => (
                  <tr key={r.lessons}>
                    <td style={{ padding: ".55rem .6rem", borderBottom: r.bold ? "none" : "1px solid rgba(245,240,232,.04)", ...mono, color: T.amber, fontSize: r.bold ? ".78rem" : ".72rem", fontWeight: r.bold ? 600 : 400 }}>{r.lessons}</td>
                    <td style={{ padding: ".55rem .6rem", borderBottom: r.bold ? "none" : "1px solid rgba(245,240,232,.04)", color: r.bold ? T.paper : "rgba(245,240,232,.45)", ...body, fontSize: ".78rem" }}>{r.topic}</td>
                    <td style={{ padding: ".55rem .6rem", borderBottom: r.bold ? "none" : "1px solid rgba(245,240,232,.04)", ...mono, color: "#4ade80", fontSize: ".72rem" }}>{r.reward}</td>
                    <td style={{ padding: ".55rem .6rem", borderBottom: r.bold ? "none" : "1px solid rgba(245,240,232,.04)", color: "rgba(245,240,232,.35)", ...body, fontSize: ".75rem" }}>{r.assets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: "1.25rem", padding: ".75rem 1rem", background: "rgba(200,133,44,.1)", border: "1px solid rgba(200,133,44,.2)", borderRadius: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ ...body, fontSize: ".8rem", color: "rgba(245,240,232,.45)" }}>Perfect scores, all 50 lessons</span>
              <span style={{ ...serif, fontStyle: "italic", fontSize: "1.35rem", color: T.amber }}>~$15,000</span>
            </div>
          </div>
        </div>
      </div>
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
    <section id="testing" style={{ background: T.paper }}>
      <div style={{ ...W, padding: "6rem 3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
          <span style={{ ...mono, fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase", color: T.amber }}>04 — User Testing</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
          <span style={{ ...mono, fontSize: ".65rem", color: T.textFaint, letterSpacing: ".06em" }}>12 sessions · 3 rounds · Remote</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "5rem", alignItems: "start" }}>
          <div style={{ position: "sticky" as const, top: "80px" }}>
            <h2 style={{ ...serif, fontStyle: "italic", fontSize: "clamp(2rem,3.5vw,2.8rem)", color: T.ink, lineHeight: 1.1, marginBottom: "1rem" }}>
              12 Remote<br/>Sessions
            </h2>
            <p style={{ ...body, color: T.textDim, fontSize: ".9rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              All research was remote. Zoom and Google Meet, think-aloud protocol, structured debrief questions. Three rounds across the semester.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: T.border, borderRadius: 6, overflow: "hidden" }}>
              {[["4","Round 1 — Early"],["4","Round 2 — Mid"],["4","Round 3 — Final"],["3","Interviews"]].map(([n,l])=>(
                <div key={l} style={{ background: T.cream, padding: "1rem" }}>
                  <div style={{ ...serif, fontStyle: "italic", fontSize: "1.6rem", color: T.amber, lineHeight: 1, marginBottom: ".25rem" }}>{n}</div>
                  <div style={{ ...mono, fontSize: ".58rem", color: T.textFaint, letterSpacing: ".06em", textTransform: "uppercase" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {FINDINGS.map(f => (
              <div key={f.title}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.25rem", alignItems: "start", background: T.cream, border: `1px solid ${T.border}`, borderRadius: 8, padding: "1.5rem" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0, background: f.type === "good" ? "rgba(42,122,74,.1)" : f.type === "insight" ? "rgba(200,133,44,.12)" : "rgba(220,50,50,.08)", border: `1px solid ${f.type === "good" ? "rgba(42,122,74,.2)" : f.type === "insight" ? "rgba(200,133,44,.2)" : "rgba(220,50,50,.15)"}` }}>{f.icon}</div>
                  <div>
                    <div style={{ ...serif, fontSize: ".95rem", marginBottom: ".35rem", color: T.ink }}>{f.title}</div>
                    <div style={{ ...body, fontSize: ".84rem", color: T.textDim, lineHeight: 1.65 }}>{f.body}</div>
                  </div>
                </div>
                {f.quote && (
                  <div style={{ margin: ".75rem 0 0 3.5rem", padding: "1rem 1.25rem", borderLeft: `3px solid ${T.amber}`, background: "rgba(200,133,44,.04)", borderRadius: "0 6px 6px 0" }}>
                    <p style={{ ...serif, fontStyle: "italic", fontSize: ".95rem", color: T.ink, marginBottom: ".4rem" }}>{f.quote.text}</p>
                    <cite style={{ ...mono, fontSize: ".62rem", color: T.textFaint, letterSpacing: ".04em", fontStyle: "normal" }}>{f.quote.cite}</cite>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Reflection() {
  const grafs = [
    { lead: "The most important discovery", text: "Seven months of building Investigo taught me things I could not have learned by reading about them — which is appropriately on-theme. I designed the simulator as an educational tool. In practice it functioned as something closer to a mirror." },
    { lead: "The most humbling", text: "Six of twelve testers hit friction I designed into the system deliberately. The earn-to-invest mechanic is architecturally correct — and it annoyed half my test group. Good design and correct design are not always the same thing." },
    { lead: "The most useful lesson", text: "The Calm Money Jars pivot forced me to think about what investing education is actually for. Not picking winners. Surviving long enough to benefit when you do. That reframing lives inside Investigo today even though the jars are gone." },
    { lead: "The hardest thing to admit", text: "Investigo can make you a more informed investor. It cannot change the environment in which you invest. Social media and brokerage apps reward emotional reactivity over deliberate analysis. That is a larger design problem this platform alone cannot solve." },
  ];
  return (
    <section id="reflection" style={{ background: T.ink }}>
      <div style={{ ...W, padding: "6rem 3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "4rem" }}>
          <span style={{ ...mono, fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase", color: T.amber }}>05 — Reflection</span>
          <div style={{ flex: 1, height: 1, background: "rgba(245,240,232,.1)" }} />
        </div>

        <h2 style={{ ...serif, fontStyle: "italic", fontSize: "clamp(2.5rem,5vw,4rem)", color: T.paper, lineHeight: 1.05, maxWidth: 700, marginBottom: "4rem" }}>
          What Building This<br/>Taught Me
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(245,240,232,.06)", borderRadius: 10, overflow: "hidden" }}>
          {grafs.map(g => (
            <div key={g.lead} style={{ background: T.ink2, padding: "2.5rem" }}>
              <div style={{ ...mono, fontSize: ".62rem", letterSpacing: ".15em", textTransform: "uppercase", color: T.amber, marginBottom: ".75rem" }}>{g.lead}</div>
              <p style={{ ...body, fontSize: ".95rem", color: "rgba(245,240,232,.65)", lineHeight: 1.75 }}>{g.text}</p>
            </div>
          ))}
        </div>
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
    <section id="next" style={{ background: T.cream }}>
      <div style={{ ...W, padding: "6rem 3rem 7rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3.5rem" }}>
          <span style={{ ...mono, fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase", color: T.amber }}>06 — Future Steps</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", alignItems: "start", marginBottom: "3rem" }}>
          <h2 style={{ ...serif, fontStyle: "italic", fontSize: "clamp(2rem,3.5vw,3rem)", color: T.ink, lineHeight: 1.1 }}>
            Where This<br/>Goes Next
          </h2>
          <p style={{ ...body, color: T.textDim, fontSize: ".95rem", lineHeight: 1.7 }}>
            Six priorities — all direct responses to specific findings from testing and production. Not a wishlist; a roadmap driven by evidence.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: T.border, borderRadius: 10, overflow: "hidden" }}>
          {FUTURE_ITEMS.map((f, i) => (
            <div key={f.num} style={{ background: i % 2 === 0 ? T.paper : T.cream, padding: "2rem 1.75rem" }}>
              <div style={{ ...serif, fontStyle: "italic", fontSize: "3rem", color: T.border, lineHeight: 1, marginBottom: ".75rem" }}>{f.num}</div>
              <div style={{ ...serif, fontSize: "1.05rem", color: T.ink, marginBottom: ".5rem" }}>{f.title}</div>
              <div style={{ ...body, fontSize: ".82rem", color: T.textDim, lineHeight: 1.65 }}>{f.body}</div>
            </div>
          ))}
        </div>
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
      style={{ color: T.text, fontFamily: "'Lora', Georgia, serif", fontSize: 17, lineHeight: 1.75, overflowX: "hidden", colorScheme: "light" as const }}
      className="light"
    >
      {/* Sticky in-page nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", height: 44, background: "rgba(26,40,32,.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(245,240,232,.08)" }}>
        <span style={{ ...serif, fontStyle: "italic", fontSize: ".95rem", color: T.amber }}>Investigo</span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {[["#overview","Overview"],["#process","Process"],["#research","Research"],["#platform","Platform"],["#testing","Testing"],["#reflection","Reflection"],["#next","Next"]].map(([href,label])=>(
            <a key={href} href={href} style={{ ...mono, fontSize: ".62rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(245,240,232,.4)", textDecoration: "none" }}>{label}</a>
          ))}
        </div>
      </nav>

      {/* Sections — each owns its own full-width background */}
      <Hero />
      <Overview />
      <Process />
      <Research />
      <Platform />
      <Testing />
      <Reflection />
      <Future />

      {/* Footer */}
      <div style={{ background: T.ink, borderTop: "1px solid rgba(245,240,232,.08)" }}>
        <div style={{ ...W, padding: "2.5rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: "1rem" }}>
          <div>
            <div style={{ ...serif, fontStyle: "italic", fontSize: "1.25rem", color: T.paper, marginBottom: ".25rem" }}>Investigo</div>
            <div style={{ ...mono, fontSize: ".62rem", color: "rgba(245,240,232,.25)", letterSpacing: ".04em" }}>
              Mohidul Alam · Interactive Media Capstone · NYU · April 2026 · Advisors: Jack B Du, Aaron Sherwood
            </div>
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="https://im-projext.vercel.app" target="_blank" rel="noopener noreferrer" style={{ ...mono, fontSize: ".65rem", letterSpacing: ".06em", color: T.amber, textDecoration: "none" }}>Live Platform ↗</a>
            <a href="#" style={{ ...mono, fontSize: ".65rem", letterSpacing: ".06em", color: "rgba(245,240,232,.3)", textDecoration: "none" }}>Back to Top ↑</a>
          </div>
        </div>
      </div>
    </div>
  );
}
