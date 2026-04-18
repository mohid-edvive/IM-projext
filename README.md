# Investigo

> *Invest* · Latin *investigo* — to track, to trace, to investigate.

An investment-education web app where you learn stock-market fundamentals through 50 structured lessons, earn virtual capital by passing quizzes, then apply what you've learned by trading across 7 years of real historical market data — all without risking a cent.

---

## Features

| | |
|---|---|
| **50 lessons across 10 chapters** | From "What is a stock?" to options, leverage, and long-term strategy |
| **Quiz-to-earn system** | Score 80 %+ to unlock the next lesson and credit your virtual account |
| **Historical trading terminal** | 130+ assets (stocks, ETFs, crypto, commodities) · Jan 2020 – Dec 2026 |
| **Portfolio analysis** | Skill radar, investor archetype, win rate, Sharpe ratio, P&L per position |
| **Persistent state** | Progress saved to `localStorage` — picks up exactly where you left off |
| **Market news feed** | Live headlines via GDELT 2.0 (no API key required) |

### Curriculum

| # | Chapter | Reward |
|---|---|---|
| 01 | What Is the Stock Market? | $500 |
| 02 | How to Buy and Sell | $750 |
| 03 | Understanding Risk | $1,000 |
| 04 | Reading the Market | $1,250 |
| 05 | Your Brain Is the Enemy | $1,500 |
| 06 | Commodities & Real Assets | $1,750 |
| 07 | Crypto & Digital Assets | $2,000 |
| 08 | ETFs & Passive Investing | $2,500 |
| 09 | Advanced Concepts | $3,000 |
| 10 | Thinking Long Term | $5,000 |

Complete all 50 lessons to earn up to **$18,250** in virtual trading capital.

---

## Tech stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** + **shadcn/ui** (component primitives)
- **Zustand** (state + localStorage persistence)
- **Recharts** (portfolio & price charts)
- **Framer Motion** (page transitions)
- **GDELT 2.0 API** (free live market news, no key required)

---

## Getting started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & run

```bash
git clone https://github.com/your-username/investigo.git
cd investigo
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

### Other commands

```bash
npm run build      # production build → dist/
npm run preview    # preview production build locally
npm run lint       # ESLint
npm run test       # Vitest unit tests
```

---

## Project structure

```
src/
├── components/
│   ├── trade/         # TradeChart, TradePanel, HoldingsPanel, AnalysisTab …
│   ├── lesson/        # InteractiveBlock renderer
│   └── ui/            # shadcn/ui primitives
├── data/
│   ├── lessons.ts     # All 50 lessons, quizzes, chapter metadata
│   ├── assets.ts      # 130+ tradeable assets
│   └── priceData.ts   # Deterministic synthetic price history (2020–2026)
├── lib/
│   └── newsApi.ts     # GDELT 2.0 market-news fetcher
├── pages/
│   ├── Index.tsx      # Homepage / dashboard
│   ├── Learn.tsx      # Curriculum browser
│   ├── Lesson.tsx     # Reading + quiz + results flow
│   ├── Trade.tsx      # Trading terminal
│   ├── Analysis.tsx   # Portfolio analysis page
│   └── NotFound.tsx
└── store/
    └── gameStore.ts   # Zustand store with localStorage persistence
```

---

## Design system

**Palette**

| Token | Hex | Usage |
|---|---|---|
| Ink | `#12261F` | Foreground, borders, text |
| Paper | `#F5F2EA` | Background |
| Amber | `#C8852C` | Single accent — rewards, active states |
| Mute | `#8A8778` | Secondary text, labels |

**Typography**

| Role | Font |
|---|---|
| Display / headings | Instrument Serif (italic) |
| UI / body | Geist |
| Numbers / labels | Geist Mono |

---

## Environment variables

No secrets are required. See [`.env.example`](.env.example) for future extensibility notes.

---

## License

MIT
