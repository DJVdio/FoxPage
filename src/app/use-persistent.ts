"use client";

import { useCallback, useSyncExternalStore } from "react";
import { readRaw, subscribe, writeJSON } from "@/lib/storage";

// Per-key snapshot cache so `getSnapshot` returns a STABLE reference when the
// underlying raw string is unchanged. Without this, useSyncExternalStore would
// see a new object every render (JSON.parse) and loop forever.
const cache = new Map<string, { raw: string | null; value: unknown }>();

function snapshot<T>(key: string, fallback: T): T {
  const raw = readRaw(key);
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;
  let value: T;
  try {
    value = raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    value = fallback;
  }
  cache.set(key, { raw, value });
  return value;
}

/**
 * Reactive, SSR-safe persisted state. Mirrors `useState`'s API.
 *
 * On the server and during hydration it returns `fallback` (matching SSR output,
 * so no hydration mismatch); after mount it syncs to the stored value and
 * re-renders. Pass a STABLE `fallback` (define array/object literals outside the
 * component) — the cache guards against loops, but it keeps intent clear.
 */
export function usePersistent<T>(
  key: string,
  fallback: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const subscribeFn = useCallback((cb: () => void) => subscribe(key, cb), [key]);
  const getSnapshot = useCallback(() => snapshot(key, fallback), [key, fallback]);
  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  const value = useSyncExternalStore(subscribeFn, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = snapshot(key, fallback);
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      writeJSON(key, resolved); // dispatches the change event → subscribers re-read
    },
    [key, fallback],
  );

  return [value, setValue];
}
