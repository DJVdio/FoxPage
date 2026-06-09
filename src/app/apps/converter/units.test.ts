import { describe, it, expect } from "vitest";
import { CATEGORIES, convert, factor, fmt, type Unit } from "./units";

function unit(catId: string, unitId: string): Unit {
  const cat = CATEGORIES.find((c) => c.id === catId)!;
  return cat.units.find((u) => u.id === unitId)!;
}

describe("factor", () => {
  it("scales to/from base", () => {
    const f = factor(1000);
    expect(f.toBase(1)).toBe(1000);
    expect(f.fromBase(1000)).toBe(1);
  });
});

describe("convert — length", () => {
  it("km → m", () => expect(convert(unit("length", "km"), unit("length", "m"), 1)).toBe(1000));
  it("m → km", () => expect(convert(unit("length", "m"), unit("length", "km"), 1000)).toBe(1));
  it("cm → m", () => expect(convert(unit("length", "cm"), unit("length", "m"), 100)).toBeCloseTo(1));
});

describe("convert — data", () => {
  it("KB → B", () => expect(convert(unit("data", "KB"), unit("data", "B"), 1)).toBe(1024));
  it("MB → KB", () => expect(convert(unit("data", "MB"), unit("data", "KB"), 1)).toBe(1024));
});

describe("convert — weight", () => {
  it("kg → g", () => expect(convert(unit("weight", "kg"), unit("weight", "g"), 1)).toBe(1000));
});

describe("convert — temperature", () => {
  const C = () => unit("temp", "C");
  const F = () => unit("temp", "F");
  const K = () => unit("temp", "K");
  it("0°C → 32°F", () => expect(convert(C(), F(), 0)).toBeCloseTo(32));
  it("100°C → 212°F", () => expect(convert(C(), F(), 100)).toBeCloseTo(212));
  it("32°F → 0°C", () => expect(convert(F(), C(), 32)).toBeCloseTo(0));
  it("273.15K → 0°C", () => expect(convert(K(), C(), 273.15)).toBeCloseTo(0));
  it("0°C → 273.15K", () => expect(convert(C(), K(), 0)).toBeCloseTo(273.15));
});

describe("fmt", () => {
  it("formats zero and NaN", () => {
    expect(fmt(0)).toBe("0");
    expect(fmt(NaN)).toBe("—");
    expect(fmt(Infinity)).toBe("—");
  });
  it("trims trailing zeros", () => {
    expect(fmt(1000)).toBe("1000");
    expect(fmt(1.5)).toBe("1.5");
  });
  it("uses exponential for very small magnitudes", () => {
    expect(fmt(1e-8)).toContain("e");
  });
  it("renders large finite numbers as full digits", () => {
    expect(fmt(1e16)).toBe("10000000000000000");
  });
});
