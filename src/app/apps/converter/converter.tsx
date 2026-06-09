"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, convert, fmt } from "./units";

const selectClass =
  "w-full rounded border border-[#00aa2a]/40 bg-[#0d1a0d] px-3 py-2 text-sm text-[#00ff41] outline-none focus:border-[#00ff41]";

export default function Converter() {
  const [catId, setCatId] = useState(CATEGORIES[0].id);
  const cat = useMemo(() => CATEGORIES.find((c) => c.id === catId)!, [catId]);
  const [fromId, setFromId] = useState(cat.units[0].id);
  const [toId, setToId] = useState(cat.units[1].id);
  const [input, setInput] = useState("1");

  function pickCategory(id: string) {
    const next = CATEGORIES.find((c) => c.id === id)!;
    setCatId(id);
    setFromId(next.units[0].id);
    setToId(next.units[1].id);
  }

  function swap() {
    setFromId(toId);
    setToId(fromId);
  }

  const from = cat.units.find((u) => u.id === fromId) ?? cat.units[0];
  const to = cat.units.find((u) => u.id === toId) ?? cat.units[1];
  const value = parseFloat(input);
  const result = Number.isNaN(value) ? NaN : convert(from, to, value);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => pickCategory(c.id)}
            className={`rounded border px-3 py-1.5 text-xs tracking-[0.1em] transition-colors ${
              c.id === catId
                ? "border-[#00ff41] text-[#00ff41]"
                : "border-[#00aa2a]/30 text-[#00aa2a] hover:border-[#00aa2a]"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="pip-card pip-border space-y-4 rounded p-4">
        <div>
          <label className="mb-1 block text-[10px] tracking-[0.15em] text-[#00aa2a]/70">
            INPUT
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded border border-[#00aa2a]/40 bg-[#0d1a0d] px-3 py-2 font-mono text-lg text-[#00ff41] outline-none focus:border-[#00ff41]"
          />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          <div>
            <label className="mb-1 block text-[10px] tracking-[0.15em] text-[#00aa2a]/70">FROM</label>
            <select value={fromId} onChange={(e) => setFromId(e.target.value)} className={selectClass}>
              {cat.units.map((u) => (
                <option key={u.id} value={u.id} className="bg-[#0d1a0d]">
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={swap}
            aria-label="swap units"
            className="mb-1 rounded border border-[#00aa2a]/40 px-3 py-2 text-[#00aa2a] transition-colors hover:border-[#00ff41] hover:text-[#00ff41]"
          >
            ⇄
          </button>
          <div>
            <label className="mb-1 block text-[10px] tracking-[0.15em] text-[#00aa2a]/70">TO</label>
            <select value={toId} onChange={(e) => setToId(e.target.value)} className={selectClass}>
              {cat.units.map((u) => (
                <option key={u.id} value={u.id} className="bg-[#0d1a0d]">
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="pip-border rounded bg-[#0d1a0d] p-4 text-center">
        <div className="text-[10px] tracking-[0.2em] text-[#00aa2a]/70">RESULT</div>
        <div className="mt-1 break-all font-mono text-3xl font-bold text-[#00ff41]">
          {fmt(result)}
        </div>
        <div className="mt-1 text-xs tracking-[0.1em] text-[#00aa2a]/60">
          {from.label} → {to.label}
        </div>
      </div>
    </div>
  );
}
