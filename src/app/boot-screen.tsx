"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const bootLines = [
  "VAULT-TEC INDUSTRIES",
  "FOXPAGE.OS v0.1 — BOOT SEQUENCE INITIATED",
  "CHECKING INTEGRITY... OK",
  "MOUNTING FILE SYSTEM... OK",
  "INITIALIZING DISPLAY DRIVER... OK",
  "LOADING APP.LIBRARY... OK",
  "SYSTEM READY.",
];

export default function BootScreen({ prefetchPaths = [] }: { prefetchPaths?: string[] }) {
  const router = useRouter();
  const [live, setLive] = useState(true);
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const finished = useRef(false);
  const started = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    localStorage.setItem("foxpage_booted", "1");
    setFadeOut(true);
    setTimeout(() => setLive(false), 400);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("foxpage_booted")) {
      finished.current = true;
      setLive(false);
      return;
    }

    started.current = true;

    let lineCount = 0;
    const lineTimer = setInterval(() => {
      lineCount++;
      setVisibleLines(lineCount);
      if (lineCount >= bootLines.length) {
        clearInterval(lineTimer);
      }
    }, 280);

    const totalSteps = 90;
    let step = 0;
    const progTimer = setInterval(() => {
      step++;
      setProgress(Math.min(100, (step / totalSteps) * 100));
      if (step >= totalSteps) {
        clearInterval(progTimer);
      }
    }, 30);

    return () => {
      clearInterval(lineTimer);
      clearInterval(progTimer);
    };
  }, []);

  useEffect(() => {
    if (started.current && visibleLines >= bootLines.length && progress >= 100 && !finished.current) {
      const t = setTimeout(finish, 500);
      return () => clearTimeout(t);
    }
  }, [visibleLines, progress, finish]);

  useEffect(() => {
    if (!started.current) return;
    const t = setTimeout(() => {
      for (const p of prefetchPaths) {
        try { router.prefetch(p); } catch {}
      }
    }, 100);
    return () => clearTimeout(t);
  }, []);

  if (!live) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0f0a] transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-lg px-6">
        <div className="mb-8 text-center">
          <div className="mb-2 text-xs tracking-[0.3em] text-[#00aa2a]">
            VAULT-TEC INDUSTRIES
          </div>
          <div className="text-3xl font-bold tracking-[0.15em] text-[#00ff41]">
            [::] FOXPAGE.OS
          </div>
          <div className="mt-1 text-[10px] tracking-[0.2em] text-[#00aa2a]/50">
            PIP-BOY 3000 · SOFTWARE v0.1
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-sm">
          {bootLines.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="flex">
              <span className="mr-2 text-[#00aa2a]">&gt;</span>
              <span
                className={`${
                  i === bootLines.length - 1 ? "text-[#00ff41]" : "text-[#00aa2a]"
                } ${i < visibleLines - 1 ? "animate-pulse" : ""}`}
              >
                {line}
                {i === visibleLines - 1 && i < bootLines.length && (
                  <span className="pip-blink ml-0.5 text-[#00ff41]">&#9608;</span>
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between text-[10px] tracking-[0.15em] text-[#00aa2a] mb-1">
            <span>BOOTING...</span>
            <span>{Math.min(100, Math.floor(progress))}%</span>
          </div>
          <div className="pip-progress w-full">
            <div
              className="pip-progress-fill transition-none"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
