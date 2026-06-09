// Pure password-generation logic, extracted from the component for unit testing.

export const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/",
};

export type SetKey = keyof typeof SETS;
export type Enabled = Record<SetKey, boolean>;

export function poolFrom(enabled: Enabled): string {
  return (Object.keys(SETS) as SetKey[])
    .filter((k) => enabled[k])
    .map((k) => SETS[k])
    .join("");
}

/** Cryptographically-secure pick without modulo bias (rejection sampling). */
export function secureGenerate(length: number, pool: string): string {
  if (pool.length === 0 || length <= 0) return "";
  const out: string[] = [];
  const max = 256 - (256 % pool.length);
  const buf = new Uint8Array(length * 2);
  while (out.length < length) {
    crypto.getRandomValues(buf);
    for (let i = 0; i < buf.length && out.length < length; i++) {
      if (buf[i] < max) out.push(pool[buf[i] % pool.length]);
    }
  }
  return out.join("");
}

export function entropyBits(length: number, poolSize: number): number {
  return poolSize > 0 ? Math.round(length * Math.log2(poolSize)) : 0;
}

export function strengthLabel(bits: number): { text: string; color: string; pct: number } {
  const pct = Math.min(100, (bits / 128) * 100);
  if (bits < 40) return { text: "WEAK", color: "#ffb000", pct };
  if (bits < 70) return { text: "FAIR", color: "#ffb000", pct };
  if (bits < 110) return { text: "STRONG", color: "#00ff41", pct };
  return { text: "FORTRESS", color: "#00ff41", pct };
}
