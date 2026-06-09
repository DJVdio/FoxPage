"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { allApps, type AppInfo } from "@/data/apps";

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(false);

  // Single entry point for open/close so resets happen in event handlers (not effects).
  function setPalette(next: boolean) {
    openRef.current = next;
    setOpen(next);
    if (next) {
      setQuery("");
      setActive(0);
    }
  }

  const items = useMemo(() => allApps(), []);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q),
    );
  }, [items, query]);

  // Global Cmd/Ctrl+K to toggle.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette(!openRef.current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus the input when opened (DOM side effect only).
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function launch(app: AppInfo) {
    setPalette(false);
    if (app.externalUrl) {
      window.open(app.externalUrl, "_blank", "noopener,noreferrer");
    } else if (app.path) {
      router.push(app.path);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setPalette(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const app = results[active];
      if (app) launch(app);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[48] flex items-start justify-center bg-black/60 p-4 pt-[12vh]"
      onClick={() => setPalette(false)}
    >
      <div
        className="pip-border w-full max-w-lg overflow-hidden rounded bg-[#0d1a0d]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[#003a0f] px-4 py-3">
          <span className="text-[#00aa2a]">&gt;</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="V.A.T.S. — 搜索应用…"
            className="flex-1 bg-transparent font-mono text-sm text-[#00ff41] outline-none placeholder:text-[#00aa2a]/40"
          />
          <kbd className="rounded border border-[#00aa2a]/30 px-1.5 py-0.5 text-[10px] text-[#00aa2a]/60">ESC</kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto py-1">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs tracking-[0.15em] text-[#00aa2a]/50">
              NO MATCH
            </div>
          ) : (
            results.map((app, i) => (
              <button
                key={app.id}
                onClick={() => launch(app)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                  i === active ? "bg-[#00ff41]/10" : ""
                }`}
              >
                <span className="text-lg">{app.icon}</span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate text-sm text-[#00ff41]">{app.name}</span>
                  <span className="block truncate text-xs text-[#00aa2a]/60">{app.description}</span>
                </span>
                {app.externalUrl && (
                  <span className="text-[10px] tracking-[0.1em] text-[#00aa2a]/50">EXT</span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
