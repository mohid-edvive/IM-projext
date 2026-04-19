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
        <div className="grid gap-12 md:grid-cols-[1fr_auto]">

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
