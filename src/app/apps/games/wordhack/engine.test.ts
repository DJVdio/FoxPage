import { describe, it, expect } from "vitest";
import { BANK, COLS, ROWS, WORD_COUNT, likeness, makePuzzle } from "./engine";

describe("likeness", () => {
  it("counts position matches", () => {
    expect(likeness("VAULT", "VAULT")).toBe(5);
    expect(likeness("VAULT", "VOULT")).toBe(4);
    expect(likeness("ABCDE", "VWXYZ")).toBe(0);
  });
});

describe("makePuzzle", () => {
  it("produces a well-formed puzzle (over many runs)", () => {
    for (let run = 0; run < 30; run++) {
      const p = makePuzzle();
      expect(p.words).toHaveLength(WORD_COUNT);
      expect(new Set(p.words).size).toBe(WORD_COUNT); // distinct
      expect(p.words.every((w) => BANK.includes(w))).toBe(true);
      expect(p.words).toContain(p.answer);
      expect(p.rows).toHaveLength(ROWS);

      const wordParts = p.rows.flatMap((r) => r.parts).filter((part) => part.t === "w");
      expect(wordParts).toHaveLength(WORD_COUNT);

      // each word row totals exactly COLS characters and indexes a real word
      for (const row of p.rows) {
        const len = row.parts.reduce((n, part) => n + part.text.length, 0);
        expect(len).toBe(COLS);
        for (const part of row.parts) {
          if (part.t === "w") {
            expect(part.text).toBe(p.words[part.wi]);
          }
        }
      }
    }
  });
});
