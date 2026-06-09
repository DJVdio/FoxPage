import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { LAUNCHES_KEY, countsById, recentIds, recordLaunch, type LaunchEvent } from "./launches";
import { readJSON } from "./storage";

beforeEach(() => window.localStorage.clear());

describe("recentIds", () => {
  it("returns newest-first unique ids", () => {
    const list: LaunchEvent[] = [
      { id: "a", ts: 1 },
      { id: "b", ts: 2 },
      { id: "a", ts: 3 },
      { id: "c", ts: 4 },
    ];
    expect(recentIds(list, 5)).toEqual(["c", "a", "b"]);
  });
  it("respects the limit", () => {
    const list: LaunchEvent[] = [
      { id: "a", ts: 1 },
      { id: "b", ts: 2 },
      { id: "c", ts: 3 },
    ];
    expect(recentIds(list, 2)).toEqual(["c", "b"]);
  });
});

describe("countsById", () => {
  it("counts per id", () => {
    const list: LaunchEvent[] = [
      { id: "a", ts: 1 },
      { id: "a", ts: 2 },
      { id: "b", ts: 3 },
    ];
    expect(countsById(list)).toEqual({ a: 2, b: 1 });
  });
});

describe("recordLaunch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-09T00:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("appends launch events", () => {
    recordLaunch("a");
    vi.advanceTimersByTime(2000);
    recordLaunch("b");
    const list = readJSON<LaunchEvent[]>(LAUNCHES_KEY, []);
    expect(list.map((e) => e.id)).toEqual(["a", "b"]);
  });

  it("dedupes immediate repeats within 1.5s", () => {
    recordLaunch("a");
    recordLaunch("a");
    expect(readJSON<LaunchEvent[]>(LAUNCHES_KEY, [])).toHaveLength(1);
    vi.advanceTimersByTime(2000);
    recordLaunch("a");
    expect(readJSON<LaunchEvent[]>(LAUNCHES_KEY, [])).toHaveLength(2);
  });
});
