// Pure WORD.HACK game logic, extracted from the component for unit testing.

export const BANK = [
  "VAULT", "ROBOT", "LASER", "ATOMS", "STEEL", "NUKES", "WASTE", "GHOUL",
  "POWER", "RADIO", "SCRAP", "DEATH", "BLOOD", "TOXIN", "SIREN", "GUARD",
  "CACHE", "DRIVE", "LOGIC", "RAIDS", "CREEP", "TRACK", "FORGE", "PLATE",
];

const JUNK = "!@#$%^&*()-_=+[]{}|;:,.<>?/\\".split("");
export const WORD_COUNT = 8;
export const COLS = 12;
export const ROWS = 16;
export const MAX_ATTEMPTS = 4;

function rand(n: number) {
  return Math.floor(Math.random() * n);
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function junk(n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += JUNK[rand(JUNK.length)];
  return s;
}

/** Number of letters that match by position — the Fallout "likeness" metric. */
export function likeness(a: string, b: string): number {
  let n = 0;
  for (let i = 0; i < a.length; i++) if (a[i] === b[i]) n++;
  return n;
}

export type Part = { t: "j"; text: string } | { t: "w"; text: string; wi: number };
export type Row = { addr: string; parts: Part[] };
export type Puzzle = { words: string[]; answer: string; rows: Row[] };

export function makePuzzle(): Puzzle {
  const words = shuffle(BANK).slice(0, WORD_COUNT);
  const answer = words[rand(words.length)];
  const wordRows = shuffle([...Array(ROWS).keys()]).slice(0, WORD_COUNT).sort((a, b) => a - b);
  const wordByRow = new Map<number, number>();
  wordRows.forEach((r, i) => wordByRow.set(r, i));

  const rows: Row[] = [];
  let addr = 0xf964;
  for (let r = 0; r < ROWS; r++) {
    const parts: Part[] = [];
    if (wordByRow.has(r)) {
      const wi = wordByRow.get(r)!;
      const word = words[wi];
      const prefix = rand(Math.max(1, COLS - word.length));
      parts.push({ t: "j", text: junk(prefix) });
      parts.push({ t: "w", text: word, wi });
      parts.push({ t: "j", text: junk(COLS - prefix - word.length) });
    } else {
      parts.push({ t: "j", text: junk(COLS) });
    }
    rows.push({ addr: "0x" + addr.toString(16).toUpperCase().padStart(4, "0"), parts });
    addr += 0x0c;
  }
  return { words, answer, rows };
}
