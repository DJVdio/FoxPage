"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const bootLines = [
  "VAULT-TEC INDUSTRIES",
  "FOXPAGE.OS v0.1 — BOOT SEQUENCE INITIATED",
  "CHECKING INTEGRITY... OK",
  "MOUNTING FILE SYSTEM... OK",
  "INITIALIZING DISPLAY DRIVER... OK",
  "LOADING APP.LIBRARY... OK",
  "SYSTEM READY.",
];

export default function BootScreen({ onFinish }: { onFinish: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [bootDone, setBootDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    localStorage.setItem("foxpage_booted", "1");
    setFadeOut(true);
    setTimeout(onFinish, 400);
  }, [onFinish]);

  useEffect(() => {
    const lineTimer = setInterval(() => {
      setVisibleLines((v) => {
        if (v >= bootLines.length) {
          clearInterval(lineTimer);
          return v;
        }
        return v + 1;
      });
    }, 280);
    return () => clearInterval(lineTimer);
  }, []);

  useEffect(() => {
    const duration = 2700;
    const interval = 30;
    const step = 100 / (duration / interval);
    const prog = setInterval(() => {
      setProgress((p) => {
        const next = p + step;
        if (next >= 100) {
          clearInterval(prog);
          return 100;
        }
        return next;
      });
    }, interval);
    return () => clearInterval(prog);
  }, []);

  useEffect(() => {
    if (visibleLines >= bootLines.length && progress >= 100 && !bootDone) {
      setBootDone(true);
      setTimeout(finish, 500);
    }
  }, [visibleLines, progress, bootDone, finish]);

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
