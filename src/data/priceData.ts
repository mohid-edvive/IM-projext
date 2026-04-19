// Synthetic price data generator — realistic historical patterns
// Generates monthly prices from Jan 2020 to Dec 2026

export interface PricePoint {
  date: string; // YYYY-MM
  price: number;
}

// Seed-based deterministic random
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface AssetProfile {
  startPrice: number;
  annualReturn: number;
  volatility: number;
  // COVID crash: magnitude of drawdown (0-1)
  covidDraw: number;
  // 2022 bear: magnitude
  bear2022: number;
}

const profiles: Record<string, AssetProfile> = {
  SPY: { startPrice: 320, annualReturn: 0.12, volatility: 0.04, covidDraw: 0.34, bear2022: 0.25 },
  QQQ: { startPrice: 210, annualReturn: 0.15, volatility: 0.05, covidDraw: 0.30, bear2022: 0.33 },
  VTI: { startPrice: 160, annualReturn: 0.11, volatility: 0.04, covidDraw: 0.35, bear2022: 0.24 },
  IWM: { startPrice: 165, annualReturn: 0.08, volatility: 0.06, covidDraw: 0.42, bear2022: 0.28 },
  TLT: { startPrice: 140, annualReturn: -0.02, volatility: 0.04, covidDraw: -0.15, bear2022: 0.35 },
  GLD: { startPrice: 150, annualReturn: 0.08, volatility: 0.03, covidDraw: 0.05, bear2022: 0.05 },
  VXX: { startPrice: 40, annualReturn: -0.30, volatility: 0.15, covidDraw: -2.0, bear2022: -0.3 },
  XLE: { startPrice: 55, annualReturn: 0.10, volatility: 0.07, covidDraw: 0.55, bear2022: -0.20 },
  XLF: { startPrice: 28, annualReturn: 0.09, volatility: 0.05, covidDraw: 0.40, bear2022: 0.18 },
  ARKK: { startPrice: 45, annualReturn: -0.05, volatility: 0.10, covidDraw: 0.30, bear2022: 0.75 },

  AAPL: { startPrice: 75, annualReturn: 0.20, volatility: 0.06, covidDraw: 0.30, bear2022: 0.28 },
  MSFT: { startPrice: 160, annualReturn: 0.18, volatility: 0.05, covidDraw: 0.28, bear2022: 0.30 },
  NVDA: { startPrice: 60, annualReturn: 0.50, volatility: 0.10, covidDraw: 0.25, bear2022: 0.55 },
  GOOGL: { startPrice: 68, annualReturn: 0.16, volatility: 0.05, covidDraw: 0.25, bear2022: 0.35 },
  META: { startPrice: 210, annualReturn: 0.12, volatility: 0.08, covidDraw: 0.20, bear2022: 0.65 },
  AMZN: { startPrice: 95, annualReturn: 0.14, volatility: 0.06, covidDraw: 0.20, bear2022: 0.50 },
  TSLA: { startPrice: 90, annualReturn: 0.25, volatility: 0.15, covidDraw: 0.45, bear2022: 0.65 },
  AMD: { startPrice: 48, annualReturn: 0.22, volatility: 0.08, covidDraw: 0.30, bear2022: 0.55 },
  INTC: { startPrice: 60, annualReturn: -0.08, volatility: 0.06, covidDraw: 0.25, bear2022: 0.50 },
  QCOM: { startPrice: 88, annualReturn: 0.12, volatility: 0.06, covidDraw: 0.30, bear2022: 0.35 },

  JPM: { startPrice: 135, annualReturn: 0.10, volatility: 0.05, covidDraw: 0.40, bear2022: 0.25 },
  GS: { startPrice: 230, annualReturn: 0.12, volatility: 0.06, covidDraw: 0.35, bear2022: 0.20 },
  V: { startPrice: 190, annualReturn: 0.10, volatility: 0.04, covidDraw: 0.30, bear2022: 0.18 },
  MA: { startPrice: 310, annualReturn: 0.10, volatility: 0.04, covidDraw: 0.32, bear2022: 0.16 },
  BLK: { startPrice: 500, annualReturn: 0.12, volatility: 0.05, covidDraw: 0.35, bear2022: 0.30 },
  JNJ: { startPrice: 145, annualReturn: 0.04, volatility: 0.03, covidDraw: 0.18, bear2022: 0.08 },
  PFE: { startPrice: 37, annualReturn: 0.02, volatility: 0.05, covidDraw: 0.15, bear2022: 0.30 },
  UNH: { startPrice: 290, annualReturn: 0.15, volatility: 0.04, covidDraw: 0.25, bear2022: 0.10 },
  XOM: { startPrice: 65, annualReturn: 0.08, volatility: 0.07, covidDraw: 0.50, bear2022: -0.30 },
  CVX: { startPrice: 105, annualReturn: 0.07, volatility: 0.06, covidDraw: 0.45, bear2022: -0.20 },
  WMT: { startPrice: 120, annualReturn: 0.08, volatility: 0.03, covidDraw: 0.12, bear2022: 0.10 },
  NKE: { startPrice: 100, annualReturn: 0.06, volatility: 0.05, covidDraw: 0.30, bear2022: 0.40 },
  KO: { startPrice: 55, annualReturn: 0.05, volatility: 0.03, covidDraw: 0.25, bear2022: 0.08 },
  DIS: { startPrice: 145, annualReturn: -0.02, volatility: 0.06, covidDraw: 0.40, bear2022: 0.45 },

  "GC=F": { startPrice: 1520, annualReturn: 0.10, volatility: 0.03, covidDraw: 0.05, bear2022: 0.08 },
  "SI=F": { startPrice: 18, annualReturn: 0.08, volatility: 0.06, covidDraw: 0.15, bear2022: 0.15 },
  "CL=F": { startPrice: 60, annualReturn: 0.05, volatility: 0.12, covidDraw: 0.70, bear2022: -0.25 },
  "HG=F": { startPrice: 2.8, annualReturn: 0.06, volatility: 0.06, covidDraw: 0.20, bear2022: 0.25 },
  "ZW=F": { startPrice: 560, annualReturn: 0.03, volatility: 0.06, covidDraw: 0.10, bear2022: -0.15 },
  "NG=F": { startPrice: 2.1, annualReturn: 0.0, volatility: 0.15, covidDraw: 0.25, bear2022: -0.40 },
  "PL=F": { startPrice: 970, annualReturn: 0.02, volatility: 0.06, covidDraw: 0.30, bear2022: 0.10 },
  "ZC=F": { startPrice: 385, annualReturn: 0.04, volatility: 0.05, covidDraw: 0.12, bear2022: -0.10 },
  "KC=F": { startPrice: 1.2, annualReturn: 0.08, volatility: 0.08, covidDraw: 0.10, bear2022: -0.05 },
  "CT=F": { startPrice: 0.68, annualReturn: 0.05, volatility: 0.07, covidDraw: 0.20, bear2022: 0.20 },

  "BTC-USD": { startPrice: 7200, annualReturn: 0.60, volatility: 0.15, covidDraw: 0.50, bear2022: 0.65 },
  "ETH-USD": { startPrice: 130, annualReturn: 0.70, volatility: 0.18, covidDraw: 0.55, bear2022: 0.70 },
  "SOL-USD": { startPrice: 1.5, annualReturn: 0.80, volatility: 0.25, covidDraw: 0.50, bear2022: 0.90 },
  "BNB-USD": { startPrice: 14, annualReturn: 0.55, volatility: 0.15, covidDraw: 0.45, bear2022: 0.60 },
  "XRP-USD": { startPrice: 0.19, annualReturn: 0.20, volatility: 0.18, covidDraw: 0.45, bear2022: 0.70 },
  "ADA-USD": { startPrice: 0.035, annualReturn: 0.30, volatility: 0.20, covidDraw: 0.40, bear2022: 0.85 },
  "AVAX-USD": { startPrice: 4, annualReturn: 0.35, volatility: 0.22, covidDraw: 0.40, bear2022: 0.88 },
  "DOT-USD": { startPrice: 5, annualReturn: 0.10, volatility: 0.20, covidDraw: 0.30, bear2022: 0.85 },
  "LINK-USD": { startPrice: 2.5, annualReturn: 0.25, volatility: 0.18, covidDraw: 0.45, bear2022: 0.75 },
  "DOGE-USD": { startPrice: 0.003, annualReturn: 0.40, volatility: 0.30, covidDraw: 0.35, bear2022: 0.80 },
};

const defaultProfile: AssetProfile = {
  startPrice: 100, annualReturn: 0.08, volatility: 0.05, covidDraw: 0.30, bear2022: 0.25,
};

const priceCache: Record<string, PricePoint[]> = {};

export function generatePriceHistory(ticker: string): PricePoint[] {
  if (priceCache[ticker]) return priceCache[ticker];

  const profile = profiles[ticker] || { ...defaultProfile, startPrice: 50 + hashString(ticker) % 200 };
  const rng = seededRandom(hashString(ticker));
  const prices: PricePoint[] = [];
  let price = profile.startPrice;

  // Generate 84 months: Jan 2020 to Dec 2026
  for (let m = 0; m < 84; m++) {
    const year = 2020 + Math.floor(m / 12);
    const month = (m % 12) + 1;
    const dateStr = `${year}-${String(month).padStart(2, '0')}`;

    // COVID crash: Feb-Mar 2020 (months 1-2)
    if (m === 1 || m === 2) {
      const drawdown = profile.covidDraw * (m === 1 ? 0.4 : 0.6);
      if (profile.covidDraw > 0) {
        price *= (1 - drawdown * (0.8 + rng() * 0.4));
      } else {
        // Inverse (VXX spikes during crash)
        price *= (1 + Math.abs(drawdown) * (0.8 + rng() * 0.4));
      }
    }
    // COVID recovery: Apr-Aug 2020 (months 3-7)
    else if (m >= 3 && m <= 7) {
      const recoveryRate = 0.06 + rng() * 0.04;
      price *= (1 + recoveryRate);
    }
    // 2021 bull run (months 12-23)
    else if (m >= 12 && m <= 23) {
      const monthlyReturn = (profile.annualReturn * 1.5) / 12;
      price *= (1 + monthlyReturn + (rng() - 0.5) * profile.volatility);
    }
    // 2022 bear market (months 24-35)
    else if (m >= 24 && m <= 35) {
      if (profile.bear2022 > 0) {
        const drawPerMonth = profile.bear2022 / 12;
        price *= (1 - drawPerMonth * (0.5 + rng()));
      } else {
        // Energy/commodities did well in 2022
        const gainPerMonth = Math.abs(profile.bear2022) / 12;
        price *= (1 + gainPerMonth * (0.5 + rng() * 0.5));
      }
    }
    // 2023 recovery (months 36-47)
    else if (m >= 36 && m <= 47) {
      const monthlyReturn = profile.annualReturn / 12 * 1.2;
      price *= (1 + monthlyReturn + (rng() - 0.5) * profile.volatility * 0.8);
    }
    // 2024-2026 (months 48+)
    else if (m >= 48) {
      const monthlyReturn = profile.annualReturn / 12;
      price *= (1 + monthlyReturn + (rng() - 0.5) * profile.volatility);
    }
    // Normal months
    else {
      const monthlyReturn = profile.annualReturn / 12;
      price *= (1 + monthlyReturn + (rng() - 0.5) * profile.volatility);
    }

    price = Math.max(price * 0.01 > 0.001 ? price : 0.001, 0.0001);
    prices.push({ date: dateStr, price: Number(price.toPrecision(6)) });
  }

  priceCache[ticker] = prices;
  return prices;
}

// ── OHLC (Open / High / Low / Close) generator ──────────────────────────────

export interface OHLCPoint {
  date: string; // YYYY-MM
  open: number;
  high: number;
  low: number;
  close: number;
}

const ohlcCache: Record<string, OHLCPoint[]> = {};

/**
 * Derive monthly OHLC candlestick data from the close-price history.
 * - open  = previous month's close (first month: synthetic open near close)
 * - close = the synthetic monthly closing price
 * - high  = max(open, close) + seeded wick extension
 * - low   = min(open, close) − seeded wick extension
 */
export function generateOHLCHistory(ticker: string): OHLCPoint[] {
  if (ohlcCache[ticker]) return ohlcCache[ticker];

  const closes = generatePriceHistory(ticker);
  const profile = profiles[ticker] ?? defaultProfile;
  // Separate seeded RNG so OHLC is deterministic and independent
  const rng = seededRandom(hashString(ticker + '_ohlc'));

  const result: OHLCPoint[] = closes.map((p, i) => {
    const close = p.price;
    const open  = i === 0
      ? close * (1 - (rng() - 0.5) * profile.volatility * 0.6)
      : closes[i - 1].price;

    const bodyHigh  = Math.max(open, close);
    const bodyLow   = Math.min(open, close);
    // Wick length is proportional to intra-month volatility (seeded)
    const wiggle    = Math.max(bodyHigh * profile.volatility * 0.25, bodyHigh * 0.003);
    const high      = bodyHigh + wiggle * (0.4 + rng() * 0.8);
    const low       = Math.max(0.0001, bodyLow - wiggle * (0.4 + rng() * 0.8));

    return { date: p.date, open, high, low, close };
  });

  ohlcCache[ticker] = result;
  return result;
}

export function getPriceAtDate(ticker: string, date: string): number {
  const history = generatePriceHistory(ticker);
  const point = history.find(p => p.date === date);
  if (point) return point.price;
  // Return last known price
  return history[history.length - 1]?.price ?? 0;
}

export function getLatestPrice(ticker: string, currentDate: string): number {
  return getPriceAtDate(ticker, currentDate);
}

export function getPriceChange(ticker: string, currentDate: string): { change: number; changePercent: number } {
  const history = generatePriceHistory(ticker);
  const currentIdx = history.findIndex(p => p.date === currentDate);
  if (currentIdx <= 0) return { change: 0, changePercent: 0 };
  const current = history[currentIdx].price;
  const prev = history[currentIdx - 1].price;
  return {
    change: current - prev,
    changePercent: ((current - prev) / prev) * 100,
  };
}
