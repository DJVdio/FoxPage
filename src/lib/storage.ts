// SSR-safe, swappable key/value persistence for FoxPage.
//
// Today this is backed by `localStorage`. The read/write/subscribe surface is
// intentionally tiny so a future DB / cross-device-sync backend can replace the
// internals here WITHOUT touching any caller. (Per Phase-0 decision: abstract
// persistence now, defer the actual database.)

const PREFIX = "foxpage:";
const EVENT = "foxpage:storage";

/** Raw string read — used by the reactive hook for cheap change detection. */
export function readRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  const raw = readRaw(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    // Notify same-tab subscribers (the native `storage` event only fires cross-tab).
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }));
  } catch {
    // storage full / disabled / private mode — degrade silently
  }
}

/** Subscribe to changes for one key, both same-tab (custom event) and cross-tab. */
export function subscribe(key: string, callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    if (e.type === EVENT && (e as CustomEvent).detail?.key === key) callback();
    if (e.type === "storage" && (e as StorageEvent).key === PREFIX + key) callback();
  };
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
