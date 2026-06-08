"use client";

import Link from "next/link";
import PipHeader from "@/app/pip-header";
import { useCallback, useEffect, useRef, useState } from "react";

type Mode = "stopwatch" | "countdown" | "pomodoro";

const POMO_WORK = 25;
const POMO_BREAK = 5;

const modes: { id: Mode; label: string }[] = [
  { id: "stopwatch", label: "STOPWATCH" },
  { id: "countdown", label: "COUNTDOWN" },
  { id: "pomodoro", label: "POMODORO" },
];

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TimerPage() {
  const [mode, setMode] = useState<Mode>("stopwatch");
  const [display, setDisplay] = useState("00:00");
  const [running, setRunning] = useState(false);
  const [inputMin, setInputMin] = useState("5");
  const [pomoPhase, setPomoPhase] = useState<"work" | "break">("work");
  const [pomoCount, setPomoCount] = useState(0);

  const totalSec = useRef(0);
  const targetSec = useRef(0);
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
    setRunning(false);
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setRunning(true);
    intervalId.current = setInterval(() => {
      if (mode === "stopwatch") {
        totalSec.current += 1;
        setDisplay(fmt(totalSec.current));
      } else if (mode === "countdown") {
        totalSec.current -= 1;
        if (totalSec.current <= 0) {
          totalSec.current = 0;
          stopTimer();
        }
        setDisplay(fmt(totalSec.current));
      } else {
        totalSec.current -= 1;
        if (totalSec.current <= 0) {
          if (pomoPhase === "work") {
            const next = pomoCount + 1;
            setPomoCount(next);
            setPomoPhase("break");
            totalSec.current = POMO_BREAK * 60;
          } else {
            setPomoPhase("work");
            totalSec.current = POMO_WORK * 60;
          }
        }
        setDisplay(fmt(totalSec.current));
      }
    }, 1000);
  }, [mode, stopTimer, pomoPhase, pomoCount]);

  const resetTimer = useCallback(() => {
    stopTimer();
    if (mode === "stopwatch") {
      totalSec.current = 0;
      setDisplay("00:00");
    } else if (mode === "countdown") {
      const sec = parseInt(inputMin, 10) * 60 || 0;
      totalSec.current = sec;
      setDisplay(fmt(sec));
    } else {
      totalSec.current = POMO_WORK * 60;
      setPomoPhase("work");
      setPomoCount(0);
      setDisplay(fmt(POMO_WORK * 60));
    }
  }, [mode, stopTimer, inputMin]);

  const switchMode = useCallback(
    (m: Mode) => {
      stopTimer();
      setMode(m);
      if (m === "stopwatch") {
        totalSec.current = 0;
        setDisplay("00:00");
      } else if (m === "countdown") {
        const sec = parseInt(inputMin, 10) * 60 || 0;
        totalSec.current = sec;
        setDisplay(fmt(sec));
      } else {
        totalSec.current = POMO_WORK * 60;
        setPomoPhase("work");
        setPomoCount(0);
        setDisplay(fmt(POMO_WORK * 60));
      }
    },
    [stopTimer, inputMin],
  );

  useEffect(() => {
    return () => { if (intervalId.current) clearInterval(intervalId.current); };
  }, []);

  return (
    <>
      <PipHeader />
      <div className="flex flex-1 flex-col px-4 py-6">
        <div className="mx-auto w-full max-w-lg flex-1">
          <nav className="mb-6">
            <Link
              href="/"
              prefetch={true}
              className="inline-flex items-center gap-1 text-xs tracking-[0.1em] text-[#00aa2a] transition-colors hover:text-[#00ff41]"
            >
              <span aria-hidden="true">&lt;</span>
              <span>RETURN</span>
            </Link>
          </nav>

          <div className="flex border-b border-[#003a0f] mb-6">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => switchMode(m.id)}
                className={`flex-1 pb-2 text-xs tracking-[0.15em] transition-colors ${
                  mode === m.id
                    ? "border-b border-[#00ff41] text-[#00ff41]"
                    : "border-b border-transparent text-[#00aa2a]/50 hover:text-[#00aa2a]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="pip-border rounded p-8 text-center">
            <div className="text-6xl font-bold tracking-[0.08em] text-[#00ff41] tabular-nums">
              {display}
            </div>

            {mode === "countdown" && !running && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={inputMin}
                  onChange={(e) => {
                    const v = e.target.value;
                    setInputMin(v);
                    const sec = parseInt(v, 10) * 60 || 0;
                    totalSec.current = sec;
                    setDisplay(fmt(sec));
                  }}
                  className="w-20 rounded border border-[#00aa2a]/30 bg-transparent px-3 py-1.5 text-center text-sm tracking-[0.1em] text-[#00ff41] outline-none focus:border-[#00ff41] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-xs tracking-[0.1em] text-[#00aa2a]">MIN</span>
              </div>
            )}

            {mode === "pomodoro" && (
              <div className="mt-3 text-xs tracking-[0.15em] text-[#00aa2a]">
                {pomoPhase === "work" ? "WORK" : "BREAK"}
                <span className="mx-2">·</span>
                {pomoCount} SESSION{pomoCount !== 1 ? "S" : ""}
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={running ? stopTimer : startTimer}
                className="pip-border rounded px-6 py-2 text-xs tracking-[0.15em] text-[#00ff41] transition hover:bg-[#00ff41]/5"
              >
                {running ? "PAUSE" : "START"}
              </button>
              <button
                onClick={resetTimer}
                className="pip-border rounded px-6 py-2 text-xs tracking-[0.15em] text-[#00aa2a]/60 transition hover:text-[#ffb000]"
              >
                RESET
              </button>
            </div>
          </div>
        </div>

        <footer className="mt-6 border-t border-[#003a0f] pt-3 text-center">
          <p className="text-[10px] tracking-[0.15em] text-[#00aa2a]/40">
            VAULT-TEC™ UTILITY SOFTWARE · TIMER.EXE
          </p>
        </footer>
      </div>
    </>
  );
}
