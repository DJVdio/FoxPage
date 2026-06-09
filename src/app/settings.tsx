"use client";

import { useEffect, useState } from "react";
import { usePersistent } from "./use-persistent";

const PHOSPHORS: { id: string; label: string; swatch: string }[] = [
  { id: "green", label: "GREEN", swatch: "#00ff41" },
  { id: "amber", label: "AMBER", swatch: "#ffb000" },
  { id: "blue", label: "BLUE", swatch: "#00b3ff" },
  { id: "white", label: "WHITE", swatch: "#d8ffd8" },
];

export default function Settings() {
  const [open, setOpen] = useState(false);
  const [phosphor, setPhosphor] = usePersistent<string>("phosphor", "green");
  const [scanline, setScanline] = usePersistent<boolean>("scanline", true);
  const [motion, setMotion] = usePersistent<boolean>("motion", true);

  // Sync settings → <html> data-attributes (DOM side effects, not state).
  useEffect(() => {
    const d = document.documentElement;
    if (phosphor === "green") d.removeAttribute("data-phosphor");
    else d.setAttribute("data-phosphor", phosphor);
  }, [phosphor]);

  useEffect(() => {
    const d = document.documentElement;
    if (scanline) d.removeAttribute("data-scanline");
    else d.setAttribute("data-scanline", "off");
  }, [scanline]);

  useEffect(() => {
    const d = document.documentElement;
    if (motion) d.removeAttribute("data-motion");
    else d.setAttribute("data-motion", "off");
  }, [motion]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="settings"
        className="pip-border fixed bottom-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#0a0f0a] text-[#00ff41] transition-colors hover:bg-[#00ff41]/10"
      >
        <span className="text-base">⚙</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[45] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="pip-border w-full max-w-sm rounded bg-[#0d1a0d] p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-[0.2em] text-[#00ff41]">G.E.C.K. SETTINGS</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="close"
                className="text-[#00aa2a] transition-colors hover:text-[#00ff41]"
              >
                ✕
              </button>
            </div>

            <div className="mb-5">
              <div className="mb-2 text-[10px] tracking-[0.2em] text-[#00aa2a]/70">PHOSPHOR</div>
              <div className="grid grid-cols-4 gap-2">
                {PHOSPHORS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPhosphor(p.id)}
                    className={`flex flex-col items-center gap-1.5 rounded border px-2 py-2 transition-colors ${
                      phosphor === p.id ? "border-[#00ff41]" : "border-[#00aa2a]/30 hover:border-[#00aa2a]"
                    }`}
                  >
                    <span
                      className="h-5 w-5 rounded-full"
                      style={{ background: p.swatch, boxShadow: `0 0 6px ${p.swatch}` }}
                    />
                    <span className="text-[9px] tracking-[0.1em] text-[#00aa2a]">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Toggle label="SCANLINE" on={scanline} onToggle={() => setScanline((v) => !v)} />
            <Toggle label="MOTION / ANIMATION" on={motion} onToggle={() => setMotion((v) => !v)} />
          </div>
        </div>
      )}
    </>
  );
}

function Toggle({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between border-t border-[#003a0f] py-3 text-xs tracking-[0.1em] text-[#00aa2a] transition-colors hover:text-[#00ff41]"
    >
      <span>{label}</span>
      <span className={on ? "text-[#00ff41]" : "text-[#00aa2a]/40"}>{on ? "● ON" : "○ OFF"}</span>
    </button>
  );
}
