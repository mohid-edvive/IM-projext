import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getPriceAtDate } from '@/data/priceData';

// ── Simulation clock constants ───────────────────────────────────────────────
// 1 real-world hour = 1 in-game month.
// The 84-month simulation (Jan 2020 → Dec 2026) takes 84 real hours.
// When the cycle completes, all holdings are auto-liquidated at Dec 2026
// prices, proceeds are carried into the wallet, and the clock restarts at
// Jan 2020 — so the simulation loops indefinitely with compounding wealth.
export const MONTHS_TOTAL = 84;
export const MS_PER_GAME_MONTH = 60 * 60 * 1000; // 1 hour in milliseconds
export const SIMULATION_END_DATE = '2026-12';

/** Convert a 0-based month index to a "YYYY-MM" string. */
export function indexToDate(idx: number): string {
  const i = Math.max(0, Math.min(MONTHS_TOTAL - 1, idx));
  const year = 2020 + Math.floor(i / 12);
  const month = (i % 12) + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
}

/** Convert a "YYYY-MM" string to a 0-based month index. */
export function dateToIndex(date: string): number {
  const [yr, mo] = date.split('-').map(Number);
  return (yr - 2020) * 12 + (mo - 1);
}

export interface Trade {
  id: string;
  assetId: string;
  type: 'buy' | 'sell';
  quantity: number;
  pricePerUnit: number;
  totalValue: number;
  date: string;
  timestamp: number;
}

interface GameState {
  walletBalance: number;
  completedLessons: string[];
  unlockedAssets: string[];
  holdings: Record<string, number>;
  tradeHistory: Trade[];
  currentDate: string; // YYYY-MM — derived from clockStartedAt, not set by UI
  totalEarned: number;
  quizScores: Record<string, number>;
  /** Wall-clock timestamp (ms) when the current simulation cycle started. */
  clockStartedAt: number | null;
  /**
   * Which run-through of the 84-month simulation we are on.
   * Starts at 1, increments on every auto-cycle-reset.
   */
  simulationCycle: number;

  // Actions
  completeLesson: (lessonId: string, reward: number, assetsToUnlock: string[], score: number) => void;
  buyAsset: (assetId: string, quantity: number, pricePerUnit: number) => boolean;
  sellAsset: (assetId: string, quantity: number, pricePerUnit: number) => boolean;
  /** Internal setter — not exposed to UI directly. */
  setCurrentDate: (date: string) => void;
  /**
   * Start the simulation clock. Safe to call multiple times — a no-op if
   * already started. For users with existing trade history the clock is
   * initialised so that the current game date matches their latest trade.
   */
  startClock: () => void;
  /**
   * Recompute currentDate from real-world elapsed time and update the store.
   * When all 84 months have elapsed, triggers an auto-cycle-reset:
   *   1. All open holdings are liquidated at Dec 2026 prices.
   *   2. Proceeds are added to walletBalance.
   *   3. clockStartedAt resets to Date.now() → simulation restarts at Jan 2020.
   *   4. simulationCycle increments.
   * Learning progress (completedLessons, unlockedAssets) is preserved.
   */
  syncCurrentDate: () => void;
  /**
   * Liquidate all holdings at SIMULATION_END_DATE prices, carry proceeds
   * forward, and restart the clock. Called automatically by syncCurrentDate.
   */
  cycleReset: () => void;
  getTotalPortfolioValue: () => number;
  getProfitLoss: () => number;
  getHoldingsValue: () => number;
  getAvgCost: (assetId: string) => number;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      walletBalance: 0,
      completedLessons: [],
      unlockedAssets: [],
      holdings: {},
      tradeHistory: [],
      currentDate: '2020-01',
      totalEarned: 0,
      quizScores: {},
      clockStartedAt: null,
      simulationCycle: 1,

      completeLesson: (lessonId, reward, assetsToUnlock, score) => {
        set((state) => {
          if (state.completedLessons.includes(lessonId)) return state;
          const newUnlocked = assetsToUnlock.filter((a) => !state.unlockedAssets.includes(a));
          return {
            walletBalance: state.walletBalance + reward,
            completedLessons: [...state.completedLessons, lessonId],
            unlockedAssets: [...state.unlockedAssets, ...newUnlocked],
            totalEarned: state.totalEarned + reward,
            quizScores: { ...state.quizScores, [lessonId]: score },
          };
        });
      },

      buyAsset: (assetId, quantity, pricePerUnit) => {
        const state = get();
        const totalCost = quantity * pricePerUnit;
        if (state.walletBalance < totalCost) return false;
        if (!state.unlockedAssets.includes(assetId)) return false;

        const trade: Trade = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          assetId,
          type: 'buy',
          quantity,
          pricePerUnit,
          totalValue: totalCost,
          date: state.currentDate,
          timestamp: Date.now(),
        };

        set((s) => ({
          walletBalance: s.walletBalance - totalCost,
          holdings: {
            ...s.holdings,
            [assetId]: (s.holdings[assetId] || 0) + quantity,
          },
          tradeHistory: [...s.tradeHistory, trade],
        }));
        return true;
      },

      sellAsset: (assetId, quantity, pricePerUnit) => {
        const state = get();
        if ((state.holdings[assetId] || 0) < quantity) return false;

        const totalValue = quantity * pricePerUnit;
        const trade: Trade = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          assetId,
          type: 'sell',
          quantity,
          pricePerUnit,
          totalValue,
          date: state.currentDate,
          timestamp: Date.now(),
        };

        set((s) => ({
          walletBalance: s.walletBalance + totalValue,
          holdings: {
            ...s.holdings,
            [assetId]: (s.holdings[assetId] || 0) - quantity,
          },
          tradeHistory: [...s.tradeHistory, trade],
        }));
        return true;
      },

      setCurrentDate: (date) => set({ currentDate: date }),

      startClock: () => {
        const state = get();
        if (state.clockStartedAt !== null) return; // already running

        // If the user has existing trade history, initialise the clock so
        // that the current game date aligns with their most recent trade date.
        // This preserves progress for returning users migrating to the new system.
        let startMonthIndex = 0;
        if (state.tradeHistory.length > 0) {
          const latestDate = [...state.tradeHistory]
            .sort((a, b) => a.timestamp - b.timestamp)
            .pop()!.date;
          startMonthIndex = Math.max(0, dateToIndex(latestDate));
        }

        set({ clockStartedAt: Date.now() - startMonthIndex * MS_PER_GAME_MONTH });
      },

      syncCurrentDate: () => {
        const { clockStartedAt } = get();
        if (clockStartedAt === null) return;

        const elapsed = Date.now() - clockStartedAt;
        const monthsElapsed = Math.floor(elapsed / MS_PER_GAME_MONTH);

        // Full cycle elapsed → auto-reset and restart
        if (monthsElapsed >= MONTHS_TOTAL) {
          get().cycleReset();
          return;
        }

        const newDate = indexToDate(Math.max(0, monthsElapsed));
        if (newDate !== get().currentDate) {
          set({ currentDate: newDate });
        }
      },

      cycleReset: () => {
        const state = get();

        // Liquidate every open holding at Dec 2026 (end-of-simulation) prices.
        // This converts all unrealised gains/losses to cash and carries them
        // forward as the user's starting capital for the next cycle.
        let liquidationProceeds = 0;
        const liquidationTrades: Trade[] = [];
        const clearedHoldings: Record<string, number> = {};

        for (const [assetId, qty] of Object.entries(state.holdings)) {
          if (qty <= 0) continue;
          const exitPrice = getPriceAtDate(assetId, SIMULATION_END_DATE);
          const proceeds  = qty * exitPrice;
          liquidationProceeds += proceeds;
          liquidationTrades.push({
            id:           `cycle${state.simulationCycle}-liq-${assetId}-${Date.now()}`,
            assetId,
            type:         'sell',
            quantity:     qty,
            pricePerUnit: exitPrice,
            totalValue:   proceeds,
            date:         SIMULATION_END_DATE,
            timestamp:    Date.now(),
          });
          clearedHoldings[assetId] = 0;
        }

        set({
          // Carry full wallet + liquidated proceeds into new cycle
          walletBalance:   state.walletBalance + liquidationProceeds,
          holdings:        { ...state.holdings, ...clearedHoldings },
          tradeHistory:    [...state.tradeHistory, ...liquidationTrades],
          // Restart clock from right now → game date = Jan 2020
          clockStartedAt:  Date.now(),
          currentDate:     '2020-01',
          simulationCycle: state.simulationCycle + 1,
          // Learning progress intentionally preserved
        });
      },

      getHoldingsValue: () => {
        const state = get();
        return Object.entries(state.holdings).reduce((sum, [assetId, qty]) => {
          if (qty <= 0) return sum;
          return sum + qty * getPriceAtDate(assetId, state.currentDate);
        }, 0);
      },

      getTotalPortfolioValue: () => {
        const state = get();
        return state.walletBalance + get().getHoldingsValue();
      },

      getProfitLoss: () => {
        return get().getTotalPortfolioValue() - get().totalEarned;
      },

      getAvgCost: (assetId) => {
        const { tradeHistory } = get();
        let totalQty = 0;
        let totalCost = 0;
        for (const t of tradeHistory) {
          if (t.assetId !== assetId) continue;
          if (t.type === 'buy') {
            totalCost += t.quantity * t.pricePerUnit;
            totalQty += t.quantity;
          } else {
            // Reduce cost basis proportionally on sells (average cost method)
            if (totalQty > 0) {
              const avgBefore = totalCost / totalQty;
              totalCost -= t.quantity * avgBefore;
              totalQty -= t.quantity;
            }
          }
        }
        return totalQty > 0 ? totalCost / totalQty : 0;
      },
    }),
    {
      name: 'investigo-game-state', // localStorage key
      version: 1,
    }
  )
);
