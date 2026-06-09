import { readJSON, writeJSON } from "./storage";

export type LaunchEvent = { id: string; ts: number };

export const LAUNCHES_KEY = "launches";
const CAP = 500;

/** Append a launch event (capped). Called from the app shell on navigation. */
export function recordLaunch(id: string): void {
  const list = readJSON<LaunchEvent[]>(LAUNCHES_KEY, []);
  const last = list[list.length - 1];
  // de-dupe immediate repeats (e.g. effect firing twice for the same path)
  if (last && last.id === id && Date.now() - last.ts < 1500) return;
  list.push({ id, ts: Date.now() });
  writeJSON(LAUNCHES_KEY, list.slice(-CAP));
}

/** Most-recently-launched unique app ids, newest first. */
export function recentIds(list: LaunchEvent[], n: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (let i = list.length - 1; i >= 0 && out.length < n; i--) {
    if (!seen.has(list[i].id)) {
      seen.add(list[i].id);
      out.push(list[i].id);
    }
  }
  return out;
}

/** Launch count per app id. */
export function countsById(list: LaunchEvent[]): Record<string, number> {
  const m: Record<string, number> = {};
  for (const e of list) m[e.id] = (m[e.id] ?? 0) + 1;
  return m;
}
