import { Link, useLocation } from "react-router-dom";
import { useGameStore } from "@/store/gameStore";
import { getPriceAtDate } from "@/data/priceData";
import { BookOpen, TrendingUp, Home, BarChart3 } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { InvestigoMark, InvestigoWordmark } from "@/components/Logo";

const navItems = [
  { path: "/",         label: "Home",     icon: Home },
  { path: "/learn",    label: "Learn",    icon: BookOpen },
  { path: "/trade",    label: "Trade",    icon: TrendingUp },
  { path: "/analysis", label: "Analysis", icon: BarChart3 },
];

function AnimatedBalance({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);

  useEffect(() => {
    if (value === displayed) return;
    const start = displayed;
    const diff = value - start;
    const startTime = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - startTime) / 500, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(start + diff * e));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span className="number-display text-xs font-medium text-foreground">${displayed.toLocaleString()}</span>;
}

export default function Header() {
  const location      = useLocation();
  const walletBalance = useGameStore((s) => s.walletBalance);
  const holdings      = useGameStore((s) => s.holdings);
  const currentDate   = useGameStore((s) => s.currentDate);

  const holdingsValue = useMemo(() =>
    Object.entries(holdings).reduce((sum, [id, qty]) =>
      qty > 0 ? sum + qty * getPriceAtDate(id, currentDate) : sum, 0),
  [holdings, currentDate]);

  const totalValue = walletBalance + holdingsValue;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background">
        <div className="container mx-auto flex h-12 items-center justify-between px-5 md:px-8 max-w-5xl">

          {/* logo */}
          <Link to="/" className="flex items-center gap-2">
            <InvestigoMark size={20} />
            <InvestigoWordmark size={20} variant="mixed" />
          </Link>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors rounded-sm ${
                    active
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}>
                  <item.icon className="h-3 w-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* balances */}
          <div className="flex items-center gap-2">
            <div className="border border-border px-3 py-1.5 flex flex-col items-end"
              title="Total portfolio value">
              <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-muted-foreground leading-none mb-0.5">Portfolio</span>
              <AnimatedBalance value={Math.round(totalValue)} />
            </div>
            <div className="border border-border px-3 py-1.5 flex flex-col items-end"
              title="Cash available to trade">
              <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-muted-foreground leading-none mb-0.5">Cash</span>
              <span className="number-display text-xs font-medium text-foreground">
                ${Math.round(walletBalance).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-1 font-mono text-[8px] uppercase tracking-[0.12em] transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="h-12" />
    </>
  );
}
