import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getPriceAtDate } from '@/data/priceData';

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
  holdings: Record<string, number>; // assetId -> quantity owned
  tradeHistory: Trade[];
  currentDate: string; // YYYY-MM
  totalEarned: number; // sum of all quiz rewards ever received
  quizScores: Record<string, number>; // lessonId -> weighted percentage

  // Actions
  completeLesson: (lessonId: string, reward: number, assetsToUnlock: string[], score: number) => void;
  buyAsset: (assetId: string, quantity: number, pricePerUnit: number) => boolean;
  sellAsset: (assetId: string, quantity: number, pricePerUnit: number) => boolean;
  setCurrentDate: (date: string) => void;
  getTotalPortfolioValue: () => number;
  getProfitLoss: () => number;
  getHoldingsValue: () => number;
  /** Average cost per unit for a given asset, computed from trade history */
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
