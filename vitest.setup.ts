import "@testing-library/jest-dom/vitest";

// Node 25 ships a half-configured experimental global `localStorage` that
// shadows jsdom's and lacks a working `.clear()`. Install a clean in-memory
// Storage on both globalThis and window so the app + tests behave predictably.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear() {
    this.store.clear();
  }
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }
  [name: string]: unknown;
}

const mem = new MemoryStorage();
for (const target of [globalThis, typeof window !== "undefined" ? window : undefined]) {
  if (!target) continue;
  try {
    Object.defineProperty(target, "localStorage", { configurable: true, get: () => mem });
  } catch {
    // non-configurable in this runtime — ignore
  }
}
