import { describe, it, expect } from "vitest";
import {
  type Enabled,
  SETS,
  entropyBits,
  poolFrom,
  secureGenerate,
  strengthLabel,
} from "./password";

const ALL: Enabled = { lower: true, upper: true, digits: true, symbols: true };
const NONE: Enabled = { lower: false, upper: false, digits: false, symbols: false };

describe("poolFrom", () => {
  it("joins enabled sets", () => {
    expect(poolFrom(ALL)).toBe(SETS.lower + SETS.upper + SETS.digits + SETS.symbols);
  });
  it("is empty when nothing enabled", () => {
    expect(poolFrom(NONE)).toBe("");
  });
  it("includes only enabled sets", () => {
    expect(poolFrom({ ...NONE, digits: true })).toBe(SETS.digits);
  });
});

describe("secureGenerate", () => {
  it("returns a string of the requested length", () => {
    expect(secureGenerate(20, "abc")).toHaveLength(20);
  });
  it("uses only characters from the pool", () => {
    const pool = "abc123";
    for (let i = 0; i < 50; i++) {
      const pw = secureGenerate(16, pool);
      expect([...pw].every((ch) => pool.includes(ch))).toBe(true);
    }
  });
  it("returns empty for empty pool or non-positive length", () => {
    expect(secureGenerate(10, "")).toBe("");
    expect(secureGenerate(0, "abc")).toBe("");
  });
  it("produces varied output (not constant)", () => {
    const a = secureGenerate(24, poolFrom(ALL));
    const b = secureGenerate(24, poolFrom(ALL));
    expect(a).not.toBe(b);
  });
});

describe("entropyBits", () => {
  it("computes length * log2(poolSize)", () => {
    expect(entropyBits(20, 26)).toBe(Math.round(20 * Math.log2(26)));
  });
  it("is zero for empty pool", () => {
    expect(entropyBits(10, 0)).toBe(0);
  });
});

describe("strengthLabel", () => {
  it("buckets by bits", () => {
    expect(strengthLabel(10).text).toBe("WEAK");
    expect(strengthLabel(50).text).toBe("FAIR");
    expect(strengthLabel(90).text).toBe("STRONG");
    expect(strengthLabel(130).text).toBe("FORTRESS");
  });
  it("clamps pct to 100", () => {
    expect(strengthLabel(500).pct).toBe(100);
  });
});
