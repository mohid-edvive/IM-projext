import { describe, it, expect } from "vitest";
import { assets, getAssetById } from "@/data/assets";
import { getPriceAtDate, getPriceChange, generatePriceHistory } from "@/data/priceData";

describe("assets data", () => {
  it("has 40+ assets", () => {
    expect(assets.length).toBeGreaterThanOrEqual(40);
  });

  it("each asset has required fields", () => {
    assets.forEach((a) => {
      expect(a.id).toBeTruthy();
      expect(a.name).toBeTruthy();
      expect(a.ticker).toBeTruthy();
      expect(a.category).toBeTruthy();
      expect(a.description).toBeTruthy();
    });
  });

  it("getAssetById works", () => {
    const spy = getAssetById("SPY");
    expect(spy).toBeTruthy();
    expect(spy?.ticker).toBe("SPY");
  });
});

describe("price data", () => {
  it("generates price history for SPY", () => {
    const history = generatePriceHistory("SPY");
    expect(history.length).toBeGreaterThan(60);
  });

  it("getPriceAtDate returns a number", () => {
    const price = getPriceAtDate("SPY", "2022-06");
    expect(price).toBeGreaterThan(0);
  });

  it("getPriceChange returns change data", () => {
    const { change, changePercent } = getPriceChange("SPY", "2022-06");
    expect(typeof change).toBe("number");
    expect(typeof changePercent).toBe("number");
  });
});
