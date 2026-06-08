"use client";

import { useEffect, useRef, useState } from "react";

const bootLines = [
  "VAULT-TEC INDUSTRIES",
  "FOXPAGE.OS v0.1 — BOOT SEQUENCE INITIATED",
  "CHECKING INTEGRITY... OK",
  "MOUNTING FILE SYSTEM... OK",
  "INITIALIZING DISPLAY DRIVER... OK",
  "LOADING APP.LIBRARY... OK",
  "SYSTEM READY.",
];

function domPrefetch(paths: string[]) {
  for (const p of paths) {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = p;
    document.head.appendChild(link);
  }
}

export default function BootScreen({ prefetchPaths = [] }: { prefetchPaths?: string[] }) {
  const [hidden, setHidden] = useState(false);
  const [lines, setLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const mounted = useRef(false);
  const animDone = useRef(false);

  useEffect(() => {
    mounted.current = true;

    if (sessionStorage.getItem("foxpage_booted")) {
      setHidden(true);
      return;
    }

    domPrefetch(prefetchPaths);

    let lc = 0;
    const lTimer = setInterval(() => {
      lc++;
      setLines(lc);
      if (lc >= bootLines.length) clearInterval(lTimer);
    }, 280);

    let steps = 0;
    const pTimer = setInterval(() => {
      steps++;
      setProgress(Math.min(100, (steps / 90) * 100));
      if (steps >= 90) clearInterval(pTimer);
    }, 30);

    const doneTimer = setTimeout(() => {
      if (!mounted.current) return;
      animDone.current = true;
      sessionStorage.setItem("foxpage_booted", "1");
      setFading(true);
      setTimeout(() => {
        if (!mounted.current) return;
        setHidden(true);
      }, 400);
    }, 3200);

    return () => {
      mounted.current = false;
      clearInterval(lTimer);
      clearInterval(pTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`boot-screen-wrapper fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0f0a] transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
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
          {bootLines.slice(0, lines).map((line, i) => (
            <div key={i} className="flex">
              <span className="mr-2 text-[#00aa2a]">&gt;</span>
              <span
                className={`${
                  i === bootLines.length - 1 ? "text-[#00ff41]" : "text-[#00aa2a]"
                } ${i < lines - 1 ? "animate-pulse" : ""}`}
              >
                {line}
                {i === lines - 1 && i < bootLines.length && (
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
