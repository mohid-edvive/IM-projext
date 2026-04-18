import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "@/store/gameStore";

describe("gameStore", () => {
  beforeEach(() => {
    useGameStore.setState({
      walletBalance: 0,
      completedLessons: [],
      unlockedAssets: [],
      holdings: {},
      tradeHistory: [],
      currentDate: "2020-01",
      totalEarned: 0,
      quizScores: {},
    });
  });

  it("starts with zero balance", () => {
    expect(useGameStore.getState().walletBalance).toBe(0);
  });

  it("completes a lesson and earns reward", () => {
    useGameStore.getState().completeLesson("1-1", 100, ["SPY"], 90);
    const state = useGameStore.getState();
    expect(state.walletBalance).toBe(100);
    expect(state.completedLessons).toContain("1-1");
    expect(state.unlockedAssets).toContain("SPY");
    expect(state.totalEarned).toBe(100);
    expect(state.quizScores["1-1"]).toBe(90);
  });

  it("does not double-complete a lesson", () => {
    useGameStore.getState().completeLesson("1-1", 100, ["SPY"], 90);
    useGameStore.getState().completeLesson("1-1", 100, ["SPY"], 95);
    expect(useGameStore.getState().walletBalance).toBe(100);
    expect(useGameStore.getState().completedLessons.length).toBe(1);
  });

  it("buys an asset", () => {
    useGameStore.setState({ walletBalance: 1000, unlockedAssets: ["SPY"] });
    const result = useGameStore.getState().buyAsset("SPY", 2, 100);
    expect(result).toBe(true);
    expect(useGameStore.getState().walletBalance).toBe(800);
    expect(useGameStore.getState().holdings["SPY"]).toBe(2);
    expect(useGameStore.getState().tradeHistory.length).toBe(1);
  });

  it("rejects buy with insufficient funds", () => {
    useGameStore.setState({ walletBalance: 50, unlockedAssets: ["SPY"] });
    const result = useGameStore.getState().buyAsset("SPY", 1, 100);
    expect(result).toBe(false);
    expect(useGameStore.getState().walletBalance).toBe(50);
  });

  it("rejects buy for locked asset", () => {
    useGameStore.setState({ walletBalance: 1000, unlockedAssets: [] });
    const result = useGameStore.getState().buyAsset("SPY", 1, 100);
    expect(result).toBe(false);
  });

  it("sells an asset", () => {
    useGameStore.setState({ walletBalance: 500, unlockedAssets: ["SPY"], holdings: { SPY: 5 } });
    const result = useGameStore.getState().sellAsset("SPY", 3, 120);
    expect(result).toBe(true);
    expect(useGameStore.getState().walletBalance).toBe(860);
    expect(useGameStore.getState().holdings["SPY"]).toBe(2);
  });

  it("rejects sell with insufficient holdings", () => {
    useGameStore.setState({ holdings: { SPY: 1 } });
    const result = useGameStore.getState().sellAsset("SPY", 5, 100);
    expect(result).toBe(false);
  });

  it("updates current date", () => {
    useGameStore.getState().setCurrentDate("2023-06");
    expect(useGameStore.getState().currentDate).toBe("2023-06");
  });

  it("calculates holdings value", () => {
    useGameStore.setState({ holdings: { SPY: 10 }, currentDate: "2022-01" });
    const value = useGameStore.getState().getHoldingsValue();
    expect(value).toBeGreaterThan(0);
  });

  it("calculates portfolio value", () => {
    useGameStore.setState({ walletBalance: 500, holdings: { SPY: 10 }, currentDate: "2022-01" });
    const total = useGameStore.getState().getTotalPortfolioValue();
    expect(total).toBeGreaterThan(500);
  });
});
