import { useState, useMemo, useCallback } from "react";
import { generateOHLCHistory, getPriceChange } from "@/data/priceData";
import { getAssetById } from "@/data/assets";
import { useGameStore } from "@/store/gameStore";
import {
  ComposedChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Customized,
} from "recharts";

// ── Brand colors (matching index.css tokens) ─────────────────────────────────
const GAIN_COLOR = "hsl(156, 50%, 22%)";  // --gain  (ink-green)
const LOSS_COLOR = "hsl(12, 65%, 42%)";   // --loss  (warm rust)
const AXIS_COLOR = "hsl(47, 7%, 51%)";    // --muted-foreground
const BORDER_COLOR = "hsl(156, 20%, 80%)"; // --border

// ── Price formatter ───────────────────────────────────────────────────────────
function fmtPrice(p: number): string {
  if (p >= 1000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 1)    return `$${p.toFixed(2)}`;
  if (p >= 0.01) return `$${p.toFixed(4)}`;
  return `$${p.toFixed(6)}`;
}

// ── Time-range options ────────────────────────────────────────────────────────
type TimeRange = "3M" | "6M" | "1Y" | "2Y" | "ALL";
const RANGE_MONTHS: Record<TimeRange, number> = { "3M": 3, "6M": 6, "1Y": 12, "2Y": 24, "ALL": 9999 };

// ── Candlestick renderer (rendered inside Recharts Customized) ────────────────
interface CandleRendererProps {
  xAxisMap?: Record<string, any>;
  yAxisMap?: Record<string, any>;
  data?: any[];
}

function CandleRenderer({ xAxisMap = {}, yAxisMap = {} }: CandleRendererProps) {
  const xEntry = Object.values(xAxisMap)[0] as any;
  const yEntry = Object.values(yAxisMap)[0] as any;
  if (!xEntry?.scale || !yEntry?.scale) return null;

  const xs = xEntry.scale;
  const ys = yEntry.scale;
  // band scale: xs(date) = left edge; xs.bandwidth() = band width
  const bw = typeof xs.bandwidth === "function" ? xs.bandwidth() : 8;
  const bodyW = Math.max(2, bw * 0.72);

  // The data is passed via closure from the outer component (see makeCandleRenderer)
  return null; // replaced by the factory below
}
void CandleRenderer; // keep TS happy

// Factory: close over the actual OHLC data so Recharts' Customized receives it
function makeCandleRenderer(ohlcData: ReturnType<typeof generateOHLCHistory>) {
  return function CandlesLayer({ xAxisMap = {}, yAxisMap = {} }: CandleRendererProps) {
    const xEntry = Object.values(xAxisMap)[0] as any;
    const yEntry = Object.values(yAxisMap)[0] as any;
    if (!xEntry?.scale || !yEntry?.scale) return null;

    const xs = xEntry.scale;
    const ys = yEntry.scale;
    const bw     = typeof xs.bandwidth === "function" ? xs.bandwidth() : 8;
    const bodyW  = Math.max(2, bw * 0.72);
    const wickW  = Math.max(1, bw * 0.12);

    return (
      <g>
        {ohlcData.map((c) => {
          const bullish  = c.close >= c.open;
          const fill     = bullish ? GAIN_COLOR : LOSS_COLOR;

          const cx        = (xs(c.date) ?? 0) + bw / 2;
          const bodyTop   = ys(Math.max(c.open, c.close));
          const bodyBot   = ys(Math.min(c.open, c.close));
          const wickTop   = ys(c.high);
          const wickBot   = ys(c.low);
          const bodyH     = Math.max(1, bodyBot - bodyTop);

          return (
            <g key={c.date}>
              {/* Upper wick */}
              <line
                x1={cx} y1={wickTop}
                x2={cx} y2={bodyTop}
                stroke={fill}
                strokeWidth={wickW}
                strokeLinecap="square"
              />
              {/* Candle body */}
              <rect
                x={cx - bodyW / 2}
                y={bodyTop}
                width={bodyW}
                height={bodyH}
                fill={bullish ? fill : fill}
                fillOpacity={bullish ? 0.82 : 0.88}
                stroke={fill}
                strokeWidth={0.75}
              />
              {/* Lower wick */}
              <line
                x1={cx} y1={bodyBot}
                x2={cx} y2={wickBot}
                stroke={fill}
                strokeWidth={wickW}
                strokeLinecap="square"
              />
            </g>
          );
        })}
      </g>
    );
  };
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
function CandleTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  const c = payload[0].payload;
  if (!c) return null;
  const bullish = c.close >= c.open;
  const pct = ((c.close - c.open) / c.open) * 100;

  return (
    <div
      style={{
        background: "hsl(44, 33%, 94%)",
        border: "1px solid hsl(156, 20%, 80%)",
        borderRadius: 2,
        padding: "6px 10px",
        fontFamily: "Geist Mono, monospace",
        fontSize: 10,
        minWidth: 130,
      }}
    >
      <div style={{ color: "hsl(47, 7%, 51%)", fontSize: 9, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>{c.date}</div>
      {[
        { label: "O", value: fmtPrice(c.open) },
        { label: "H", value: fmtPrice(c.high) },
        { label: "L", value: fmtPrice(c.low)  },
        { label: "C", value: fmtPrice(c.close) },
      ].map(({ label, value }) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span style={{ color: "hsl(47, 7%, 51%)" }}>{label}</span>
          <span style={{ color: "hsl(156, 35%, 11%)", fontWeight: 500 }}>{value}</span>
        </div>
      ))}
      <div style={{
        marginTop: 4,
        paddingTop: 4,
        borderTop: "1px solid hsl(156, 20%, 80%)",
        color: bullish ? GAIN_COLOR : LOSS_COLOR,
        fontWeight: 500,
      }}>
        {bullish ? "▲" : "▼"} {Math.abs(pct).toFixed(2)}%
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface TradeChartProps {
  assetId: string;
}

export default function TradeChart({ assetId }: TradeChartProps) {
  const currentDate   = useGameStore((s) => s.currentDate);
  const unlockedAssets = useGameStore((s) => s.unlockedAssets);
  const [timeRange, setTimeRange] = useState<TimeRange>("ALL");

  const asset      = getAssetById(assetId);
  const isUnlocked = unlockedAssets.includes(assetId);

  const { changePercent } = getPriceChange(assetId, currentDate);
  const isPositive = changePercent >= 0;

  // Full OHLC history — memoised by assetId
  const ohlcHistory = useMemo(() => generateOHLCHistory(assetId), [assetId]);

  // Slice to visible range
  const chartData = useMemo(() => {
    const visible = ohlcHistory.filter((p) => p.date <= currentDate);
    const count   = RANGE_MONTHS[timeRange];
    return visible.slice(-count);
  }, [ohlcHistory, currentDate, timeRange]);

  // Y domain (including wicks, with 5% padding)
  const yDomain = useMemo((): [number, number] => {
    if (!chartData.length) return [0, 100];
    const lows  = chartData.map((d) => d.low);
    const highs = chartData.map((d) => d.high);
    const lo    = Math.min(...lows);
    const hi    = Math.max(...highs);
    const pad   = (hi - lo) * 0.06;
    return [lo - pad, hi + pad];
  }, [chartData]);

  // Period stats (open of first candle → close of last)
  const stats = useMemo(() => {
    if (chartData.length < 2) return null;
    const first = chartData[0];
    const last  = chartData[chartData.length - 1];
    const hi    = Math.max(...chartData.map((d) => d.high));
    const lo    = Math.min(...chartData.map((d) => d.low));
    const ret   = ((last.close - first.open) / first.open) * 100;
    // Avg intra-month range as volatility proxy
    const avgRange = chartData.reduce((s, d) => s + (d.high - d.low) / d.close, 0) / chartData.length * 100;
    return { hi, lo, ret, vol: avgRange };
  }, [chartData]);

  // Stable candle renderer — only re-created when visible data changes
  const CandlesLayer = useCallback(makeCandleRenderer(chartData), [chartData]);

  // Current close price
  const currentClose = chartData.length ? chartData[chartData.length - 1].close : 0;

  if (!asset) return null;

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-2 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg font-semibold text-foreground">{asset.ticker}</h2>
            <span className="text-[9px] px-1.5 py-0.5 border border-border text-muted-foreground font-medium uppercase font-mono tracking-wider">
              {asset.category}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground font-mono">{asset.name}</p>
        </div>
        <div className="text-right">
          <div className="number-display text-xl font-semibold text-foreground">
            {fmtPrice(currentClose)}
          </div>
          <div className={`text-[11px] number-display font-medium ${isPositive ? "text-gain" : "text-loss"}`}>
            {isPositive ? "+" : ""}{changePercent.toFixed(2)}% MoM
          </div>
        </div>
      </div>

      {/* ── Timeframe selector ─────────────────────────────────────────────── */}
      <div className="flex gap-0 mb-3 border border-border self-start">
        {(["3M", "6M", "1Y", "2Y", "ALL"] as TimeRange[]).map((t) => (
          <button
            key={t}
            onClick={() => setTimeRange(t)}
            className={`px-2.5 py-1 font-mono text-[9px] font-medium uppercase tracking-wider transition-colors border-r border-border last:border-r-0 ${
              timeRange === t
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {!isUnlocked ? (
        <div className="flex-1 flex items-center justify-center border border-border">
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Asset Locked
            </p>
            <p className="font-serif italic text-sm text-foreground">
              Complete the required lesson to unlock.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* ── Candlestick chart ─────────────────────────────────────────── */}
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: AXIS_COLOR, fontSize: 9, fontFamily: "Geist Mono, monospace" }}
                  tickLine={false}
                  axisLine={{ stroke: BORDER_COLOR }}
                  interval={Math.max(1, Math.floor(chartData.length / 6))}
                />
                <YAxis
                  domain={yDomain}
                  tick={{ fill: AXIS_COLOR, fontSize: 9, fontFamily: "Geist Mono, monospace" }}
                  tickLine={false}
                  axisLine={{ stroke: BORDER_COLOR }}
                  tickFormatter={(v: number) => fmtPrice(v).replace("$", "")}
                  width={52}
                />
                <Tooltip content={<CandleTooltip />} cursor={{ stroke: BORDER_COLOR, strokeWidth: 1, strokeDasharray: "3 3" }} />
                {/* Candles rendered as a custom SVG layer on top of the axes */}
                <Customized component={CandlesLayer as any} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* ── Period stats ───────────────────────────────────────────────── */}
          {stats && (
            <div className="grid grid-cols-4 mt-2 pt-2 border-t border-border divide-x divide-border">
              {[
                { label: "HIGH",   value: fmtPrice(stats.hi),  color: "text-foreground" },
                { label: "LOW",    value: fmtPrice(stats.lo),  color: "text-foreground" },
                { label: "RETURN", value: `${stats.ret >= 0 ? "+" : ""}${stats.ret.toFixed(1)}%`,
                  color: stats.ret >= 0 ? "text-gain" : "text-loss" },
                { label: "VOL",    value: `${stats.vol.toFixed(1)}%`, color: "text-muted-foreground" },
              ].map((s) => (
                <div key={s.label} className="px-2 text-center">
                  <div className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
                  <div className={`number-display text-[11px] font-medium ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
