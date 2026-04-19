import { Link } from "react-router-dom";
import { InvestigoMark } from "@/components/Logo";
import { BookOpen, TrendingUp, Home, BarChart3, Shield, GraduationCap, Globe } from "lucide-react";

const navLinks = [
  { path: "/",         label: "Home",     icon: Home },
  { path: "/learn",    label: "Learn",    icon: BookOpen },
  { path: "/trade",    label: "Trade",    icon: TrendingUp },
  { path: "/analysis", label: "Analysis", icon: BarChart3 },
];

const features = [
  { icon: GraduationCap, text: "50 lessons across 10 chapters" },
  { icon: TrendingUp,    text: "130+ assets · Jan 2020 – Dec 2026" },
  { icon: Shield,        text: "No real money · risk-free simulation" },
  { icon: Globe,         text: "Live news via GDELT 2.0" },
];

export default function Footer() {
  return (
    <footer
      className="border-t border-border pb-20 md:pb-0"
      style={{ backgroundColor: "hsl(var(--ink))" }}
    >
      {/* ── Main grid ────────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-5xl px-6 md:px-8 pt-14 pb-10">
        <div className="grid gap-12 md:grid-cols-[1fr_auto_auto]">

          {/* ── Column 1: Brand ─────────────────────────────────────────── */}
          <div>
            {/* Logo lockup */}
            <div className="flex items-center gap-2 mb-6">
              <InvestigoMark
                size={26}
                fg="hsl(var(--paper))"
                accent="hsl(var(--amber))"
              />
              <span
                className="font-sans font-semibold leading-none"
                style={{
                  fontSize: 18,
                  letterSpacing: "-0.04em",
                  color: "hsl(var(--paper))",
                }}
              >
                invest
                <span
                  style={{
                    fontFamily: "Instrument Serif, Times New Roman, serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  igo
                </span>
              </span>
            </div>

            {/* Tagline */}
            <p
              className="font-serif italic leading-[1.1] mb-5"
              style={{
                fontSize: "clamp(1.35rem, 3vw, 1.8rem)",
                color: "hsl(var(--paper) / 0.92)",
              }}
            >
              Master the markets,
              <br />
              one lesson at a time.
            </p>

            {/* Sub-tagline */}
            <p
              className="font-mono uppercase tracking-[0.18em] mb-8"
              style={{ fontSize: 9, color: "hsl(var(--paper) / 0.38)" }}
            >
              Investigo · Investment Education · Educational Simulation
            </p>

            {/* Feature list */}
            <ul className="space-y-2.5">
              {features.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5">
                  <Icon
                    className="h-3 w-3 shrink-0"
                    style={{ color: "hsl(var(--amber))" }}
                  />
                  <span
                    className="font-mono"
                    style={{ fontSize: 10, color: "hsl(var(--paper) / 0.55)" }}
                  >
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 2: Navigation ─────────────────────────────────────── */}
          <div className="min-w-[120px]">
            <p
              className="font-mono uppercase tracking-[0.2em] mb-5"
              style={{ fontSize: 8, color: "hsl(var(--paper) / 0.35)" }}
            >
              Navigate
            </p>
            <nav className="flex flex-col gap-3">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className="flex items-center gap-2 transition-colors group"
                  style={{ color: "hsl(var(--paper) / 0.55)" }}
                >
                  <Icon
                    className="h-3 w-3 shrink-0 transition-colors"
                    style={{ color: "hsl(var(--paper) / 0.35)" }}
                  />
                  <span
                    className="font-mono uppercase tracking-[0.12em] group-hover:text-[hsl(var(--paper))] transition-colors"
                    style={{ fontSize: 10 }}
                  >
                    {label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Column 3: Design system tokens ──────────────────────────── */}
          <div className="min-w-[120px]">
            <p
              className="font-mono uppercase tracking-[0.2em] mb-5"
              style={{ fontSize: 8, color: "hsl(var(--paper) / 0.35)" }}
            >
              Design
            </p>
            <div className="space-y-3">
              {[
                { swatch: "hsl(var(--ink))",   border: "hsl(var(--paper)/0.2)", label: "Ink" },
                { swatch: "hsl(var(--paper))",  border: "hsl(var(--paper)/0.2)", label: "Paper" },
                { swatch: "hsl(var(--amber))",  border: "transparent",           label: "Amber" },
                { swatch: "hsl(var(--gain))",   border: "transparent",           label: "Gain" },
                { swatch: "hsl(var(--loss))",   border: "transparent",           label: "Loss" },
              ].map(({ swatch, border, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 border"
                    style={{ backgroundColor: swatch, borderColor: border, borderRadius: 1 }}
                  />
                  <span
                    className="font-mono"
                    style={{ fontSize: 10, color: "hsl(var(--paper) / 0.45)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}

              {/* Typography */}
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid hsl(var(--paper)/0.08)" }}>
                {[
                  { font: "Instrument Serif",  role: "Display",  italic: true  },
                  { font: "Geist",             role: "UI",       italic: false },
                  { font: "Geist Mono",        role: "Numbers",  italic: false },
                ].map(({ font, role, italic }) => (
                  <div key={font} className="mb-2">
                    <span
                      style={{
                        fontFamily: italic ? "Instrument Serif, serif" : font,
                        fontStyle: italic ? "italic" : "normal",
                        fontSize: 11,
                        color: "hsl(var(--paper) / 0.55)",
                      }}
                    >
                      {role}
                    </span>
                    <span
                      className="font-mono block"
                      style={{ fontSize: 8, color: "hsl(var(--paper) / 0.28)" }}
                    >
                      {font}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid hsl(var(--paper) / 0.08)" }}>
        <div className="container mx-auto max-w-5xl px-6 md:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <span
            className="font-mono"
            style={{ fontSize: 9, color: "hsl(var(--paper) / 0.30)" }}
          >
            © {new Date().getFullYear()} Investigo — All rights reserved
          </span>
          <div className="flex items-center gap-4">
            {[
              "Educational simulation only",
              "Not financial advice",
              "No real money involved",
            ].map((text, i) => (
              <span
                key={i}
                className="font-mono"
                style={{ fontSize: 9, color: "hsl(var(--paper) / 0.30)" }}
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
