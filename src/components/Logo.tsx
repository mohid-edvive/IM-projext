import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  fg?: string; // CSS color
  accent?: string; // CSS color
  filled?: boolean;
}

/**
 * Investigo — Magnified Candle mark.
 * A lens framing a single rising candlestick. Reads as
 * "investigate" + "invest" in one symbol. Works at favicon size.
 */
export function InvestigoMark({
  size = 32,
  className,
  fg = "hsl(var(--ink))",
  accent = "hsl(var(--amber))",
  filled = false,
}: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {filled && <circle cx="96" cy="96" r="72" fill={fg} />}
      <circle
        cx="96"
        cy="96"
        r="66"
        stroke={filled ? accent : fg}
        strokeWidth="14"
      />
      {/* upper wick */}
      <line
        x1="96"
        y1="44"
        x2="96"
        y2="66"
        stroke={filled ? accent : fg}
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* candle body */}
      <rect
        x="82"
        y="66"
        width="28"
        height="52"
        fill={accent}
        stroke={filled ? "hsl(var(--paper))" : fg}
        strokeWidth="6"
      />
      {/* lower wick */}
      <line
        x1="96"
        y1="118"
        x2="96"
        y2="140"
        stroke={filled ? accent : fg}
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* handle */}
      <rect
        x="150"
        y="150"
        width="16"
        height="36"
        rx="2"
        transform="rotate(-45 158 168)"
        fill={filled ? accent : fg}
      />
    </svg>
  );
}

interface WordmarkProps {
  size?: number;
  className?: string;
  /** "mixed" = the signature (sans 'invest' + serif italic 'igo'). */
  variant?: "mixed" | "serif" | "sans";
}

export function InvestigoWordmark({
  size = 22,
  className,
  variant = "mixed",
}: WordmarkProps) {
  if (variant === "serif") {
    return (
      <span
        className={cn("font-serif italic text-foreground leading-none", className)}
        style={{ fontSize: size, letterSpacing: "-0.01em" }}
      >
        Investigo
      </span>
    );
  }
  if (variant === "sans") {
    return (
      <span
        className={cn("font-sans font-semibold text-foreground leading-none", className)}
        style={{ fontSize: size * 0.78, letterSpacing: "-0.04em" }}
      >
        investigo<span style={{ color: "hsl(var(--amber))" }}>.</span>
      </span>
    );
  }
  return (
    <span
      className={cn("font-sans font-semibold text-foreground leading-none", className)}
      style={{ fontSize: size * 0.78, letterSpacing: "-0.04em" }}
    >
      invest
      <span className="font-serif italic font-normal">igo</span>
    </span>
  );
}

export function InvestigoLogo({
  size = 28,
  className,
  variant = "mixed",
}: {
  size?: number;
  className?: string;
  variant?: "mixed" | "serif" | "sans";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <InvestigoMark size={size} />
      <InvestigoWordmark size={size * 0.78} variant={variant} />
    </span>
  );
}
