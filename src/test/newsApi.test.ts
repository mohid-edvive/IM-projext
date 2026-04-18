import { describe, it, expect } from "vitest";
import { timeAgo } from "@/lib/newsApi";

describe("newsApi utilities", () => {
  it("timeAgo returns 'just now' for recent timestamps", () => {
    const now = Math.floor(Date.now() / 1000);
    expect(timeAgo(now)).toBe("just now");
  });

  it("timeAgo returns minutes for recent past", () => {
    const fiveMinAgo = Math.floor(Date.now() / 1000) - 300;
    expect(timeAgo(fiveMinAgo)).toBe("5m ago");
  });

  it("timeAgo returns hours for older timestamps", () => {
    const twoHoursAgo = Math.floor(Date.now() / 1000) - 7200;
    expect(timeAgo(twoHoursAgo)).toBe("2h ago");
  });

  it("timeAgo returns days for timestamps over 24h", () => {
    const twoDaysAgo = Math.floor(Date.now() / 1000) - 172800;
    expect(timeAgo(twoDaysAgo)).toBe("2d ago");
  });
});
