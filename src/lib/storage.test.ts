import { describe, it, expect, beforeEach, vi } from "vitest";
import { readJSON, readRaw, subscribe, writeJSON } from "./storage";

beforeEach(() => window.localStorage.clear());

describe("readJSON / writeJSON / readRaw", () => {
  it("returns fallback when key missing", () => {
    expect(readJSON("missing", 42)).toBe(42);
    expect(readRaw("missing")).toBeNull();
  });
  it("round-trips values under the foxpage prefix", () => {
    writeJSON("k", { a: 1 });
    expect(readJSON("k", null)).toEqual({ a: 1 });
    expect(window.localStorage.getItem("foxpage:k")).toBe(JSON.stringify({ a: 1 }));
  });
  it("returns fallback on malformed JSON", () => {
    window.localStorage.setItem("foxpage:bad", "{not json");
    expect(readJSON("bad", "fallback")).toBe("fallback");
  });
});

describe("subscribe", () => {
  it("notifies on same-key write and stops after cleanup", () => {
    const cb = vi.fn();
    const off = subscribe("k", cb);

    writeJSON("k", 1);
    expect(cb).toHaveBeenCalledTimes(1);

    writeJSON("other", 2);
    expect(cb).toHaveBeenCalledTimes(1); // different key — no call

    off();
    writeJSON("k", 3);
    expect(cb).toHaveBeenCalledTimes(1); // unsubscribed — no further call
  });
});
