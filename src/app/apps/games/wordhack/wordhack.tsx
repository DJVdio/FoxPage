"use client";

import { useEffect, useState } from "react";

const BANK = [
  "VAULT", "ROBOT", "LASER", "ATOMS", "STEEL", "NUKES", "WASTE", "GHOUL",
  "POWER", "RADIO", "SCRAP", "DEATH", "BLOOD", "TOXIN", "SIREN", "GUARD",
  "CACHE", "DRIVE", "LOGIC", "RAIDS", "CREEP", "TRACK", "FORGE", "PLATE",
];
const JUNK = "!@#$%^&*()-_=+[]{}|;:,.<>?/\\".split("");
const WORD_COUNT = 8;
const COLS = 12;
const ROWS = 16;
const MAX_ATTEMPTS = 4;

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
function likeness(a: string, b: string): number {
  let n = 0;
  for (let i = 0; i < a.length; i++) if (a[i] === b[i]) n++;
  return n;
}

type Part = { t: "j"; text: string } | { t: "w"; text: string; wi: number };
type Row = { addr: string; parts: Part[] };
type Puzzle = { words: string[]; answer: string; rows: Row[] };

function makePuzzle(): Puzzle {
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

export default function WordHack() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [log, setLog] = useState<string[]>([]);
  const [tried, setTried] = useState<Record<number, number>>({});

  function newGame() {
    setPuzzle(makePuzzle());
    setAttempts(MAX_ATTEMPTS);
    setStatus("playing");
    setLog(["> ROBCO INDUSTRIES TERMLINK", "> ENTER PASSWORD NOW"]);
    setTried({});
  }

  // Generate the first puzzle on the client only (Math.random would mismatch on SSR).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only puzzle init
    newGame();
  }, []);

  function guess(wi: number) {
    if (!puzzle || status !== "playing" || tried[wi] !== undefined) return;
    const word = puzzle.words[wi];
    const like = likeness(word, puzzle.answer);
    setTried((t) => ({ ...t, [wi]: like }));

    if (word === puzzle.answer) {
      setLog((l) => [...l, `> ${word}`, "> EXACT MATCH!", "> ACCESS GRANTED"]);
      setStatus("won");
      return;
    }
    const left = attempts - 1;
    setAttempts(left);
    setLog((l) => [...l, `> ${word}`, `> ENTRY DENIED`, `> LIKENESS=${like}`]);
    if (left <= 0) {
      setStatus("lost");
      setLog((l) => [...l, "> !! TERMINAL LOCKED !!", `> PASSWORD WAS: ${puzzle.answer}`]);
    }
  }

  if (!puzzle) {
    return (
      <div className="py-10 text-center text-xs tracking-[0.2em] text-[#00aa2a]/60">
        INITIALIZING TERMLINK…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs tracking-[0.15em] text-[#00aa2a]">
        <span>ATTEMPTS LEFT</span>
        <span className="text-[#00ff41]">
          {"▮".repeat(Math.max(0, attempts))}
          <span className="text-[#00aa2a]/30">{"▯".repeat(MAX_ATTEMPTS - Math.max(0, attempts))}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_minmax(0,16rem)]">
        {/* memory dump */}
        <div className="pip-border overflow-x-auto rounded bg-[#0d1a0d] p-3 font-mono text-sm leading-relaxed">
          {puzzle.rows.map((row, ri) => (
            <div key={ri} className="flex whitespace-pre">
              <span className="mr-3 select-none text-[#00aa2a]/50">{row.addr}</span>
              <span>
                {row.parts.map((p, pi) =>
                  p.t === "j" ? (
                    <span key={pi} className="select-none text-[#00aa2a]/60">
                      {p.text}
                    </span>
                  ) : (
                    <button
                      key={pi}
                      onClick={() => guess(p.wi)}
                      disabled={status !== "playing" || tried[p.wi] !== undefined}
                      className={`px-0.5 transition-colors ${
                        tried[p.wi] !== undefined
                          ? "text-[#00aa2a]/30 line-through"
                          : "text-[#00ff41] hover:bg-[#00ff41] hover:text-[#0a0f0a]"
                      }`}
                    >
                      {p.text}
                    </button>
                  ),
                )}
              </span>
            </div>
          ))}
        </div>

        {/* console log */}
        <div className="pip-border flex flex-col rounded bg-[#0d1a0d] p-3">
          <div className="flex-1 space-y-0.5 overflow-y-auto font-mono text-xs text-[#00aa2a]">
            {log.map((line, i) => (
              <div key={i} className={line.includes("GRANTED") ? "text-[#00ff41]" : line.includes("LOCKED") ? "text-[#ffb000]" : ""}>
                {line}
              </div>
            ))}
          </div>

          {status !== "playing" && (
            <div className="mt-3 border-t border-[#003a0f] pt-3">
              <div className={`mb-2 text-center text-sm font-bold tracking-[0.15em] ${status === "won" ? "text-[#00ff41]" : "text-[#ffb000]"}`}>
                {status === "won" ? "ACCESS GRANTED" : "LOCKED OUT"}
              </div>
              <button
                onClick={newGame}
                className="pip-border w-full rounded px-3 py-2 text-xs tracking-[0.15em] text-[#00ff41] transition-colors hover:bg-[#00ff41]/10"
              >
                ⟳ NEW SESSION
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-[10px] tracking-[0.1em] text-[#00aa2a]/50">
        点击候选词猜测密码 · LIKENESS = 位置正确的字母数
      </p>
    </div>
  );
}
