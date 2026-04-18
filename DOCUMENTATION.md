# Investigo — Full Technical Documentation

> *Invest* · Latin *investigo* — to track, to trace, to investigate.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Design System](#4-design-system)
5. [State Management](#5-state-management)
6. [Learning System](#6-learning-system)
7. [Trading System](#7-trading-system)
8. [Price Data Engine](#8-price-data-engine)
9. [News System](#9-news-system)
10. [Pages & Routes](#10-pages--routes)
11. [Components Reference](#11-components-reference)
12. [Data Catalogue](#12-data-catalogue)
13. [Development Guide](#13-development-guide)
14. [Build & Deployment](#14-build--deployment)

---

## 1. Project Overview

**Investigo** is a browser-based investment-education platform. Users learn stock-market fundamentals through structured lessons, pass quizzes to earn virtual capital, then deploy that capital in a historical trading simulator covering 7 years of real market events (January 2020 – December 2026).

### Core Loop

```
Read lesson → Pass quiz (80%+) → Earn virtual capital → Trade historical data → Analyse performance
```

### Goals

- Make investing education interactive and consequence-free
- Reward knowledge with real trading ability
- Cover the full investment journey: basics → psychology → advanced strategy
- Zero financial risk — all trading is simulated with virtual money

---

## 2. Tech Stack

| Layer | Library / Tool | Version |
|---|---|---|
| UI framework | React | 18.3.1 |
| Language | TypeScript | 5.8 |
| Build tool | Vite + SWC | 5.4 |
| Routing | React Router DOM | 6.30 |
| State | Zustand | 5.0 |
| Persistence | Zustand `persist` middleware → `localStorage` | — |
| Data fetching | TanStack Query | 5.83 |
| Charts | Recharts | 3.8 |
| Animation | Framer Motion | 12.38 |
| Styling | Tailwind CSS | 3.4 |
| Component primitives | shadcn/ui + Radix UI | — |
| Icons | Lucide React | 0.462 |
| Confetti | canvas-confetti | 1.9 |
| News API | GDELT 2.0 DOC API (free, no auth) | — |
| Testing | Vitest + Testing Library | 3.2 / 16.0 |

---

## 3. Project Structure

```
Market Mastery/
├── public/
│   ├── favicon.svg          # Investigo "Magnified Candle" mark
│   └── robots.txt
├── src/
│   ├── App.tsx              # Router + providers root
│   ├── main.tsx             # React entry point
│   ├── index.css            # Tailwind + design tokens
│   ├── App.css              # Global overrides
│   │
│   ├── components/
│   │   ├── Header.tsx       # Fixed top nav + balance display
│   │   ├── Logo.tsx         # InvestigoMark, InvestigoWordmark, InvestigoLogo
│   │   ├── NavLink.tsx      # Shared nav link component
│   │   ├── lesson/
│   │   │   └── InteractiveBlock.tsx   # Renders callouts, calculators, scenarios
│   │   ├── trade/
│   │   │   ├── AnalysisTab.tsx        # Skill radar, archetype, P&L breakdown
│   │   │   ├── AssetSidebar.tsx       # Searchable asset list with live prices
│   │   │   ├── HoldingsPanel.tsx      # Portfolio table with cost basis & P&L
│   │   │   ├── OrderBook.tsx          # Simulated bid/ask depth display
│   │   │   ├── PortfolioBar.tsx       # 6-stat bar at top of Trade page
│   │   │   ├── TimelineController.tsx # Date scrubber + market news events
│   │   │   ├── TradeChart.tsx         # Area chart with timeframe selector
│   │   │   ├── TradeHistory.tsx       # Paginated trade log table
│   │   │   ├── TradeNewsWidget.tsx    # Per-stock news sidebar (GDELT)
│   │   │   └── TradePanel.tsx         # Buy/sell form with P&L preview
│   │   └── ui/                        # 40+ shadcn/ui component primitives
│   │
│   ├── data/
│   │   ├── assets.ts        # 130+ asset definitions (id, ticker, category)
│   │   ├── interactives.ts  # Interactive block definitions per lesson
│   │   ├── lessons.ts       # All 50 lessons, 500 quiz questions, chapters
│   │   └── priceData.ts     # Deterministic synthetic price generator
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx   # Breakpoint detection hook
│   │   └── use-toast.ts     # Toast notification hook
│   │
│   ├── lib/
│   │   ├── newsApi.ts       # GDELT 2.0 API client with caching
│   │   └── utils.ts         # cn() class merge utility
│   │
│   ├── pages/
│   │   ├── Index.tsx        # Home / dashboard
│   │   ├── Learn.tsx        # Curriculum browser
│   │   ├── Lesson.tsx       # Reading + quiz + results flow
│   │   ├── Trade.tsx        # Full trading terminal
│   │   ├── Analysis.tsx     # Portfolio analysis page
│   │   └── NotFound.tsx     # 404 page
│   │
│   ├── store/
│   │   └── gameStore.ts     # Zustand store — all app state + actions
│   │
│   └── test/
│       ├── assets.test.ts
│       ├── example.test.ts
│       ├── gameStore.test.ts
│       ├── lessons.test.ts
│       ├── newsApi.test.ts
│       └── setup.ts
│
├── .env.example             # Environment variable template
├── .gitignore
├── components.json          # shadcn/ui configuration
├── eslint.config.js
├── index.html               # HTML entry + meta tags
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts           # Code-split build configuration
└── vitest.config.ts
```

---

## 4. Design System

### Brand Identity

The name pairs *invest* (finance) with the Latin *investigo* (to track, trace, investigate). The primary mark is a **Magnified Candle** — a circular lens framing a single rising candlestick, with a magnifying-glass handle. It reads at 16 px (favicon size) and scales to full app-icon use.

### Palette

| Token | Hex | CSS variable | Usage |
|---|---|---|---|
| Ink | `#12261F` | `--ink` | Primary foreground, borders |
| Ink Soft | `#1A3A2E` | `--ink-soft` | Hover states |
| Paper | `#F5F2EA` | `--paper` | Page background |
| Paper Alt | `#EDE8DB` | `--paper-alt` | Card / muted surface |
| Amber | `#C8852C` | `--amber` | Single accent — rewards, active indicators |
| Amber Soft | `#E8B974` | `--amber-soft` | Subtle amber tints |
| Mute | `#8A8778` | `--muted-foreground` | Labels, secondary text |
| Gain | `hsl(156 50% 22%)` | `--gain` | Positive P&L, completed states |
| Loss | `hsl(12 65% 42%)` | `--loss` | Negative P&L, errors |

### Typography

| Role | Font | Weight | Style |
|---|---|---|---|
| Display headings | Instrument Serif | 400 | Italic |
| Body / UI | Geist | 300–700 | Normal |
| Numbers / labels / captions | Geist Mono | 400–600 | Normal |

**Conventions:**
- All section labels: `font-mono text-[9–10px] uppercase tracking-[0.2em] text-muted-foreground`
- Page headings: `font-serif italic text-[clamp(2rem,...)]`
- Reward numbers: amber mono
- Progress bars: single-pixel `h-px` lines (not rounded pills)
- Cards: flat `border border-border` grids using `gap-px bg-border` with `bg-background` cells — no `rounded-lg`
- Buttons: `rounded-sm` maximum; primary = `bg-foreground text-background`

### Logo Component (`src/components/Logo.tsx`)

```tsx
<InvestigoMark size={32} />           // SVG mark only
<InvestigoWordmark size={22} variant="mixed" />  // "invest" sans + "igo" serif italic
<InvestigoLogo size={28} variant="mixed" />      // mark + wordmark lockup
```

**Wordmark variants:** `mixed` (signature), `serif` (full italic), `sans` (with amber period).

---

## 5. State Management

### Store (`src/store/gameStore.ts`)

Built with Zustand + `persist` middleware. All state is automatically saved to `localStorage` under the key `investigo-game-state`.

#### State Shape

```ts
interface GameState {
  walletBalance:    number;                    // Spendable cash
  totalEarned:      number;                    // Cumulative quiz rewards (cost basis for P&L)
  completedLessons: string[];                  // ["1-1", "1-2", ...]
  unlockedAssets:   string[];                  // ["SPY", "AAPL", ...]
  holdings:         Record<string, number>;    // { "AAPL": 12.5, "BTC-USD": 0.03 }
  tradeHistory:     Trade[];                   // Ordered chronologically
  currentDate:      string;                    // "YYYY-MM" — the timeline cursor
  quizScores:       Record<string, number>;    // { "1-1": 95.3, ... }
}
```

#### Actions

| Action | Signature | Description |
|---|---|---|
| `completeLesson` | `(lessonId, reward, assetsToUnlock, score)` | Idempotent — ignores if already completed. Adds reward to wallet and totalEarned, pushes assets to unlockedAssets. |
| `buyAsset` | `(assetId, quantity, pricePerUnit) → boolean` | Returns `false` if insufficient funds or asset locked. Deducts `qty × price` from wallet, adds qty to holdings. |
| `sellAsset` | `(assetId, quantity, pricePerUnit) → boolean` | Returns `false` if holding < quantity. Adds `qty × price` to wallet, reduces holding. |
| `setCurrentDate` | `(date: string)` | Advances or rewinds the timeline. All prices recalculate reactively. |
| `getHoldingsValue` | `() → number` | Sum of `qty × currentPrice` across all positive holdings. |
| `getTotalPortfolioValue` | `() → number` | `walletBalance + getHoldingsValue()` |
| `getProfitLoss` | `() → number` | `getTotalPortfolioValue() - totalEarned` |
| `getAvgCost` | `(assetId) → number` | Average-cost-method calculation from trade history. Handles partial sells correctly. |

#### P&L Model

```
totalEarned   = all quiz rewards ever paid in
walletBalance = cash currently available
holdingsValue = market value of open positions at currentDate prices
portfolioValue = walletBalance + holdingsValue
P&L = portfolioValue − totalEarned
```

This means P&L measures how much the user has grown (or shrunk) their capital relative to what they started with from quizzes. It correctly accounts for capital still invested in stocks.

#### Persistence

State is serialised to JSON in `localStorage` on every mutation. On mount, Zustand rehydrates from the stored value. No manual save/load calls required. State survives:
- Page refresh ✅
- Browser close and reopen ✅
- Closing the tab ✅

---

## 6. Learning System

### Curriculum Structure

10 chapters → 50 lessons → ~500 quiz questions

| Ch | Name | Lessons | Reward / lesson | Total reward |
|---|---|---|---|---|
| 1 | What Is the Stock Market? | 5 | $100 | $500 |
| 2 | How to Buy and Sell | 5 | $150 | $750 |
| 3 | Understanding Risk | 5 | $200 | $1,000 |
| 4 | Reading the Market | 5 | $250 | $1,250 |
| 5 | Your Brain Is the Enemy | 5 | $300 | $1,500 |
| 6 | Commodities & Real Assets | 5 | $350 | $1,750 |
| 7 | Crypto & Digital Assets | 5 | $400 | $2,000 |
| 8 | ETFs & Passive Investing | 5 | $500 | $2,500 |
| 9 | Advanced Concepts | 5 | $600 | $3,000 |
| 10 | Thinking Long Term | 5 | $1,000 | $5,000 |
| | **Total** | **50** | | **$18,250** |

Actual reward per lesson = `Math.round((scorePercent / 100) × baseReward)` — so a perfect score earns the full amount; partial credit scales linearly.

### Lesson Unlock Rules

```
Lessons 1-1 through 1-5 → Always available (free tier)
All other lessons:
  - First lesson in a chapter → unlocked when last lesson of previous chapter is completed
  - Subsequent lessons → unlocked when previous lesson in same chapter is completed
```

### Quiz System

Each lesson has 6 questions. Questions are weighted:

| Position | Weight | Label |
|---|---|---|
| Q1, Q2 | 1.0 pt | 1 pt |
| Q3, Q4 | 1.5 pts | 1.5 pts |
| Q5 | 2.0 pts | 2 pts |
| Q6 | 3.0 pts | 3 pts (scenario question) |

**Max score per quiz:** `1 + 1 + 1.5 + 1.5 + 2 + 3 = 10 pts`

**Pass threshold:** 80% weighted score.

**Retaking:** Users can retake any quiz, but the lesson only rewards once (`alreadyCompleted` flag). Score is always recalculated on submit.

### Lesson Reading Flow

Long lesson text is split into **sections** (every 2 paragraphs). Users page through sections with Prev / Next buttons. A progress bar shows which section they are on. The "Start Quiz" button appears after reaching the last section.

### Interactive Blocks (`src/data/interactives.ts`)

Each lesson can have embedded interactive elements inserted after specific paragraphs:

| Block type | Description |
|---|---|
| `callout` | Highlighted insight box with icon and text |
| `calculator` | User inputs values, formula evaluates in real time |
| `scenario` | Multiple-choice scenario with explanatory feedback |
| `fact` | Key statistic with amber highlight |
| `key_takeaway` | Summary bullet list |
| `matching` | Match terms to definitions |
| `slider_challenge` | Drag a slider to answer a range question |
| `chart_example` | Embedded Recharts illustration |

Interactive blocks are rendered by `InteractiveBlock.tsx` which switches on `block.type`.

### Asset Unlocking

Each lesson's `assetToUnlock` array specifies which trading assets become available when the lesson is passed. Example:

```ts
// Lesson 1-1: "What Is a Stock?"
assetToUnlock: ["SPY"]

// Lesson 2-1: "What Is a Brokerage?"
assetToUnlock: ["AAPL", "MSFT"]

// Lesson 9-1: "Short Selling"
assetToUnlock: ["JPM", "GS", "V", "MA", "BLK", "JNJ", "PFE", "UNH", "XOM", "CVX"]
```

This creates a progressive unlock loop: the more you learn, the more assets you can trade.

---

## 7. Trading System

### Trading Terminal Layout (Desktop)

```
┌─────────────────────────────────────────────────────────┐
│ PortfolioBar — 6 stats: Portfolio · Cash · Holdings ·   │
│               P&L · Return % · Positions count          │
├─────────────────────────────────────────────────────────┤
│ TimelineController — date scrubber, play/pause, events  │
├──────────┬──────────────────┬────────────┬──────────────┤
│ Asset    │  TradeChart      │ OrderBook  │ TradePanel   │
│ Sidebar  │  (area chart +   │ (bid/ask   │ (buy/sell    │
│ (search, │  timeframe       │  depth)    │  form)       │
│ filter,  │  selector +      │            │              │
│ prices)  │  period stats)   │            │              │
├──────────┴──────────────────┴────────────┴──────────────┤
│ Bottom tabs: Portfolio | History | Analysis             │
│                                │ TradeNewsWidget        │
└────────────────────────────────┴────────────────────────┘
```

### AssetSidebar

- Search by ticker or name
- Filter by category: ALL / STK / ETF / CRY / CMD
- Shows live price and day-change % at `currentDate`
- Locked assets shown at 30% opacity with lock icon
- ⓘ button expands inline description row
- Dot indicator on ticker if user currently holds this asset

### TradeChart

- Full area chart with X (date) and Y (price) axes
- Timeframe selector: `3M · 6M · 1Y · 2Y · ALL`
- Shows only data up to `currentDate` — users cannot see the "future"
- Period stats below chart: HIGH · LOW · RETURN · VOL (avg monthly volatility)
- Chart colour: ink-green when period return ≥ 0, rust-red when negative

### OrderBook

- Simulated bid/ask depth (8 levels each side)
- Prices calculated as `currentPrice ± spread × level` where `spread = price × 0.2%`
- Sizes are random (50–550 shares) re-generated each date change
- Visual depth bars proportional to size

### TradePanel

- **Mode toggle:** Buy / Sell
- **Input mode toggle:** $ Amount / # Shares
- **Quick amounts:** $10 · $25 · $50 · $100 (or qty 10/25/50/100 in shares mode)
- **MAX button:** fills in full wallet balance (buy) or full holding (sell)
- **Order summary** shows: price, estimated shares or total cost, cash available, avg cost of current position, unrealised P&L with %
- **Error states:** "Insufficient funds" / "Insufficient shares"
- **Success animation:** Framer Motion "Filled" confirmation on trade execution

### Buy Mechanics

```
cost = quantity × pricePerUnit
if walletBalance < cost → return false
if assetId not in unlockedAssets → return false

walletBalance -= cost
holdings[assetId] += quantity
tradeHistory.push(buy trade record)
```

### Sell Mechanics

```
proceeds = quantity × pricePerUnit
if holdings[assetId] < quantity → return false

walletBalance += proceeds
holdings[assetId] -= quantity
tradeHistory.push(sell trade record)
```

### Unrealised P&L Calculation (Average Cost Method)

```
For each BUY trade on assetId:
  totalCost += qty × price
  totalQty  += qty

For each SELL trade on assetId (in order):
  avgCostAtSell = totalCost / totalQty
  totalCost -= sellQty × avgCostAtSell
  totalQty  -= sellQty

avgCost = totalCost / currentQty
unrealisedPL = currentQty × currentPrice − avgCost × currentQty
unrealisedPLPct = unrealisedPL / (avgCost × currentQty) × 100
```

### HoldingsPanel

Displays a table per open position:

| Column | Description |
|---|---|
| Asset | Ticker symbol |
| Qty | Shares held (4dp for fractional) |
| Avg Cost | Average purchase price |
| Price | Current price at `currentDate` |
| Value | `qty × currentPrice` |
| P&L | Unrealised dollar + percentage, colour-coded |
| Alloc% | `positionValue / totalPortfolio × 100` |

Summary bar above table shows: **Invested** (total cost basis) · **Market Value** · **Unrealised P&L** with trend arrow.

### TimelineController

- Covers January 2020 – December 2026 (84 months)
- **Controls:** Reset to start · Prev month · Play/Pause · Next month · Skip 1 year
- **Speed selector:** 0.5× (4s/month) · 1× (2s/month) · 2× (1s/month)
- **Track:** Click anywhere to jump; event markers show major market moments
- **Year labels:** Click a year to jump to January of that year
- **Month labels:** Click individual month; news dot shown when that month has data

**Market events marked on timeline:**

| Date | Event |
|---|---|
| 2020-03 | COVID Crash |
| 2020-11 | Vaccine Rally |
| 2021-01 | GameStop Squeeze |
| 2021-11 | Crypto Peak |
| 2022-01 | Fed Rate Hikes |
| 2022-06 | Bear Market |
| 2022-11 | FTX Collapse |
| 2023-03 | SVB Bank Crisis |
| 2023-10 | AI Boom |
| 2024-03 | Bitcoin Halving |
| 2025-01 | New Era |

**Historical news:** 30+ months have contextual news cards with impact labels (BULL / BEAR / NEUTRAL).

---

## 8. Price Data Engine

### Overview (`src/data/priceData.ts`)

All prices are **deterministic synthetic data** generated algorithmically. The same ticker always produces the same price history. No external price API is called at runtime.

### Asset Profiles

Each asset has a profile:

```ts
interface AssetProfile {
  startPrice:    number;  // Jan 2020 starting price
  annualReturn:  number;  // Target annualised return (e.g. 0.12 = 12%/yr)
  volatility:    number;  // Monthly volatility factor
  covidDraw:     number;  // COVID crash drawdown magnitude (0–1)
  bear2022:      number;  // 2022 bear market drawdown magnitude
}
```

### Price Generation Algorithm

84 months are simulated in sequence with regime-specific logic:

| Period | Months | Behaviour |
|---|---|---|
| COVID crash | Feb–Mar 2020 (1–2) | Price × (1 − covidDraw × factor) |
| COVID recovery | Apr–Aug 2020 (3–7) | +6–10% per month |
| 2021 bull run | Jan–Dec 2021 (12–23) | annualReturn × 1.5 / 12 + noise |
| 2022 bear market | Jan–Dec 2022 (24–35) | −bear2022/12 per month + noise |
| 2023 recovery | Jan–Dec 2023 (36–47) | annualReturn × 1.2 / 12 + noise |
| 2024–2026 | Months 48–83 | Standard monthly return + noise |

Randomness uses a **seeded PRNG** (`seededRandom(hashString(ticker))`) so results are reproducible across sessions and users. Results are **memoised** in a `priceCache` object for performance.

### Key Functions

```ts
generatePriceHistory(ticker): PricePoint[]     // Full 84-month array
getPriceAtDate(ticker, "YYYY-MM"): number       // Price at specific month
getPriceChange(ticker, "YYYY-MM"):
  { change: number, changePercent: number }     // vs previous month
```

### Notable Price Profiles

| Ticker | Start | Ann. Return | Notes |
|---|---|---|---|
| SPY | $320 | +12% | Moderate draw, strong recovery |
| NVDA | $60 | +50% | Massive AI-driven gains |
| BTC-USD | $7,200 | +60% | High vol, 65% COVID draw |
| TLT | $140 | −2% | Inverse rate sensitivity |
| VXX | $40 | −30% | Volatility ETF, decays |

---

## 9. News System

### GDELT 2.0 DOC API (`src/lib/newsApi.ts`)

The app fetches live market news from the [GDELT 2.0 Document API](https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/). No API key or authentication is required.

**Query strategy:**

```
Market news: major finance keywords across 8 top outlets
  (reuters.com, bloomberg.com, cnbc.com, wsj.com, ft.com,
   marketwatch.com, finance.yahoo.com, investing.com)

Company news: "$TICKER OR TICKER" across same + seekingalpha.com
```

### Caching

Results are cached in memory with a 5-minute TTL (`CACHE_TTL_MS = 300_000`) to respect GDELT rate limits (~1 req/5s). Each unique query string maps to a cache entry.

### Fallback

`fetchMarketNews()` catches all errors and returns `[]`. The Learn page and TimelineController ship with hardcoded placeholder news so the UI is never empty even when GDELT is unavailable.

### `timeAgo()` Utility

Converts Unix timestamp → human-readable relative time:
- `< 60s` → "just now"
- `< 1hr` → "Xm ago"
- `< 24hr` → "Xh ago"
- `< 7d` → "Xd ago"
- Older → localised date string

---

## 10. Pages & Routes

```
/           → Index.tsx    (Home / Dashboard)
/learn      → Learn.tsx    (Curriculum browser)
/lesson/:id → Lesson.tsx   (Lesson reading + quiz + results)
/trade      → Trade.tsx    (Trading terminal)
/analysis   → Analysis.tsx (Portfolio analysis)
*           → NotFound.tsx (404)
```

### `Index.tsx` — Home Page

**New user state** (no lessons completed, no capital earned):
- Hero section: overline · italic serif headline · description · two CTA buttons
- "How it works" 4-step grid (01 Read → 02 Quiz → 03 Earn → 04 Trade)
- Live Markets snapshot (6 featured tickers)
- Full curriculum table (all 10 chapters with rewards)
- Outcomes section (6 learning goals + 3 platform stats)
- Final CTA with logo lockup

**Returning user state** (has progress):
- Dashboard with 4 stats (Portfolio · P&L · Lessons · Trades)
- Portfolio area chart + Quick Actions panel (Continue / Trade / Analysis)
- Learning progress bar with next chapter name
- Live Markets snapshot
- Curriculum (with per-chapter progress bars and "In progress" badges)

### `Learn.tsx` — Curriculum Browser

- Page header with progress % and total earned
- Single-pixel progress bar (overall 0–100%)
- Chapter accordion: each chapter has its own header card + 5-lesson grid
- Lesson cards show: lesson number · title · reward amount · unlock tags · status icon
- Status states: `completed` (checkmark) · `active` (amber dot + arrow) · `locked` (opacity 30%)
- Right sidebar (desktop): market news feed from GDELT, refreshed on mount

### `Lesson.tsx` — Lesson Flow

Three sequential phases rendered with Framer Motion `AnimatePresence`:

**Phase 1: Reading**
- Multi-section paging (2 paragraphs per section)
- Progress dots at top (click to jump to section)
- Inline interactive blocks rendered between paragraphs
- Prev / Next navigation
- "Start Quiz" CTA appears on last section

**Phase 2: Quiz**
- 6 questions displayed simultaneously (scroll to answer all)
- Answer progress bar updates on each selection
- Difficulty badge per question (1pt / 1.5pts / 2pts / 3pts)
- Submit disabled until all 6 answered

**Phase 3: Results**
- Score card: percentage score · pass/fail · reward earned (amber)
- Unlocked assets display (if lesson unlocked new assets)
- Full question-by-question breakdown with correct answer revealed for wrong answers
- Actions: Retake (if failed) · Trade · Next Lesson · All Lessons
- Confetti on first-time pass (brand palette: ink, amber, paper)

### `Trade.tsx` — Trading Terminal

Full-featured trading environment. Gated behind capital check — shows "No Trading Capital" screen if `walletBalance === 0 && totalEarned === 0`.

Layout components:
1. **PortfolioBar** — always visible top strip
2. **TimelineController** — date navigation and historical news
3. **Main grid** (desktop 4-column): AssetSidebar + TradeChart + OrderBook + TradePanel
4. **Mobile fallback:** native `<select>` dropdown for asset selection
5. **Bottom tabs:** Holdings · History · Analysis (with TradeNewsWidget beside on desktop)

### `Analysis.tsx` — Portfolio Analysis

Gated: requires at least one trade or earned capital. Shows:
- Page header with mono overline + italic serif title
- `AnalysisTab` component

**AnalysisTab content:**
- **Investor Archetype** card (derived from trade behaviour) + 4 key stats (Win Rate · Sharpe · Return · Trades)
- **Skill Radar** — pentagon chart scoring: Timing · Diversification · Risk Mgmt · Discipline · Patience
- **Allocation** — donut chart of holdings by asset category
- **Best/Worst Trades** — highest and lowest return completed sell trades

**Archetype logic:**

| Archetype | Condition |
|---|---|
| Fresh Start | < 3 total trades |
| Active Trader | ≥ 20 trades |
| Diversifier | ≥ 8 unique assets |
| Diamond Hand | ≥ 3 buys, 0 sells |
| Balanced Investor | Profitable + ≥ 4 asset types |
| Learning Phase | Portfolio in the red |
| Momentum Rider | Default (profitable, trending) |

---

## 11. Components Reference

### Header (`components/Header.tsx`)

Fixed top bar, `z-50`. Contains:
- Logo (mark + mixed wordmark)
- Desktop nav: Home · Learn · Trade · Analysis (all mono caps)
- Portfolio badge (total value, animated count-up)
- Cash badge (wallet balance, static)

Mobile: bottom nav bar with icon + label for all 4 routes.

`AnimatedBalance` component: smooth number count-up animation using `requestAnimationFrame` with cubic ease-out over 500ms.

### InteractiveBlock (`components/lesson/InteractiveBlock.tsx`)

Renders any of 8 block types inline within lesson text. Each type has its own display logic:
- `calculator` — controlled inputs with live formula evaluation (`eval`-free, uses explicit field mapping)
- `scenario` — shows result/explanation after user selects an option
- `slider_challenge` — range input with live feedback text

### PortfolioBar (`components/trade/PortfolioBar.tsx`)

6-cell grid, hairline-divided:

```
Portfolio | Cash | Holdings | P&L | Return% | Positions
```

All values recalculate reactively when `currentDate` changes (i.e., as user scrubs the timeline).

---

## 12. Data Catalogue

### Asset Categories

| Category | Count | Examples |
|---|---|---|
| ETFs | 10 | SPY, QQQ, VTI, TLT, GLD, ARKK |
| Stocks — Tech | 10 | AAPL, MSFT, NVDA, GOOGL, META, TSLA |
| Stocks — Finance | 5 | JPM, GS, V, MA, BLK |
| Stocks — Healthcare | 3 | JNJ, PFE, UNH |
| Stocks — Energy | 2 | XOM, CVX |
| Stocks — Consumer | 4 | WMT, NKE, KO, DIS |
| Commodities | 10 | Gold, Silver, Oil, Copper, Wheat, Gas |
| Crypto | 10 | BTC, ETH, SOL, BNB, XRP, ADA, AVAX, DOT, LINK, DOGE |

**Total: ~54 unique assets** (some are available through multiple categories)

### Lesson Topics by Chapter

**Ch 1 — What Is the Stock Market?**
`1-1` What Is a Stock · `1-2` How a Stock Exchange Works · `1-3` What Moves Stock Prices · `1-4` What Is an Index Fund · `1-5` How to Read a Stock Chart

**Ch 2 — How to Buy and Sell**
`2-1` What Is a Brokerage · `2-2` Market Orders vs Limit Orders · `2-3` What Does Going Long Mean · `2-4` Transaction Fees · `2-5` Calculating Profit and Loss

**Ch 3 — Understanding Risk**
`3-1` What Is Investment Risk · `3-2` Volatility · `3-3` Diversification · `3-4` Correlation · `3-5` The Risk-Reward Tradeoff

**Ch 4 — Reading the Market**
`4-1` Fundamental Analysis · `4-2` The P/E Ratio · `4-3` Earnings Reports · `4-4` Sector Rotation · `4-5` Economic Indicators

**Ch 5 — Your Brain Is the Enemy**
`5-1` Loss Aversion · `5-2` Confirmation Bias · `5-3` FOMO · `5-4` Anchoring · `5-5` Herd Mentality

**Ch 6 — Commodities & Real Assets**
`6-1` What Are Commodities · `6-2` Gold as an Investment · `6-3` Oil Markets · `6-4` Silver and Industrial Metals · `6-5` Real Estate and REITs

**Ch 7 — Crypto & Digital Assets**
`7-1` What Is Blockchain · `7-2` Bitcoin · `7-3` Ethereum and Smart Contracts · `7-4` Crypto Risks · `7-5` DeFi and the Future

**Ch 8 — ETFs & Passive Investing**
`8-1` Why ETFs Beat Active Funds · `8-2` Index Theory · `8-3` The Three-Fund Portfolio · `8-4` Dollar-Cost Averaging · `8-5` Bond ETFs

**Ch 9 — Advanced Concepts**
`9-1` Short Selling · `9-2` Options Explained · `9-3` Leverage · `9-4` Market Makers · `9-5` Stock Splits

**Ch 10 — Thinking Long Term**
`10-1` Compound Growth · `10-2` How Taxes Affect Returns · `10-3` Portfolio Rebalancing · `10-4` Reading Financial News Without Being Manipulated · `10-5` Building Your Personal Investment Plan

---

## 13. Development Guide

### Prerequisites

- **Node.js** ≥ 18.0
- **npm** ≥ 9.0

### Setup

```bash
git clone https://github.com/mohid-edvive/IM-projext.git
cd IM-projext
npm install
npm run dev
```

App runs at `http://localhost:8080` (falls back to 8081 if occupied).

### Environment Variables

No secrets required. See `.env.example`.

### npm Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start dev server with HMR |
| `build` | `vite build` | Production build → `dist/` |
| `build:dev` | `vite build --mode development` | Build without minification |
| `preview` | `vite preview` | Serve production build locally |
| `lint` | `eslint .` | ESLint check (TypeScript + React Hooks rules) |
| `test` | `vitest run` | Run all unit tests once |
| `test:watch` | `vitest` | Watch mode for TDD |

### TypeScript Path Alias

All imports use `@/` to resolve from `src/`:

```ts
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
```

### Adding a New Asset

1. Add an entry to `src/data/assets.ts` with a unique `id`/`ticker`
2. Add a price profile to `src/data/priceData.ts` `profiles` object
3. Assign it to a lesson's `assetToUnlock` array in `src/data/lessons.ts`

### Adding a New Lesson

1. Add a `Lesson` object to the relevant chapter in `src/data/lessons.ts`
2. Use `makeQuiz(lessonId, [...])` to generate the 6 quiz questions
3. Add optional interactive blocks to `src/data/interactives.ts`
4. Increment the chapter's lesson count in the frontend curriculum arrays if hardcoded

### Resetting Progress (Development)

Open browser DevTools → Application → Local Storage → delete the `investigo-game-state` key, then refresh.

---

## 14. Build & Deployment

### Production Build

```bash
npm run build
```

Output in `dist/`. Code is split into 7 parallel chunks:

| Chunk | Contents | Gzipped |
|---|---|---|
| `index.js` | App code (pages, components, data) | ~110 KB |
| `vendor-react.js` | React + React Router | ~53 KB |
| `vendor-charts.js` | Recharts | ~114 KB |
| `vendor-icons.js` | Lucide React | ~115 KB |
| `vendor-motion.js` | Framer Motion | ~43 KB |
| `vendor-radix.js` | Radix UI primitives | ~17 KB |
| `vendor-state.js` | Zustand + TanStack Query | ~8 KB |
| `index.css` | Tailwind + design tokens | ~12 KB |

**Total gzipped transfer: ~472 KB**

### Deployment Options

**Vercel** (recommended for Vite React apps):
```bash
npm install -g vercel
vercel --prod
```
No configuration needed — Vercel auto-detects Vite.

**Netlify:**
- Build command: `npm run build`
- Publish directory: `dist`
- Add `public/_redirects` with `/* /index.html 200` for SPA routing

**GitHub Pages:**
Add `base: "/IM-projext/"` to `vite.config.ts`, then:
```bash
npm run build
gh-pages -d dist
```

**Self-hosted (nginx):**
```nginx
location / {
  root /var/www/investigo/dist;
  try_files $uri $uri/ /index.html;
}
```

### Git Workflow

```bash
# Stage and commit changes
git add .
git commit -m "description of change"
git push

# Check status
git status
git log --oneline
```

Repository: **https://github.com/mohid-edvive/IM-projext**

---

*Documentation last updated: April 2026*
