"use client";

import { useEffect, useState } from "react";
import {
  type Enabled,
  type SetKey,
  entropyBits,
  poolFrom,
  secureGenerate,
  strengthLabel,
} from "@/lib/password";

const TOGGLES: { key: SetKey; label: string }[] = [
  { key: "lower", label: "小写 a-z" },
  { key: "upper", label: "大写 A-Z" },
  { key: "digits", label: "数字 0-9" },
  { key: "symbols", label: "符号 !@#" },
];

export default function PasswordGen() {
  const [length, setLength] = useState(20);
  const [enabled, setEnabled] = useState<Enabled>({
    lower: true,
    upper: true,
    digits: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  // One-time client-side initial password. Random values must be generated on
  // the client only (server would mismatch on hydration), which is a legitimate
  // mount effect; the lint rule's cascading-render concern does not apply here.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time client-only init
    setPassword(secureGenerate(20, poolFrom({ lower: true, upper: true, digits: true, symbols: true })));
  }, []);

  const pool = poolFrom(enabled);
  const entropy = entropyBits(length, pool.length);
  const strength = strengthLabel(entropy);

  function regenerate(len = length, en = enabled) {
    setPassword(secureGenerate(len, poolFrom(en)));
    setCopied(false);
  }

  function changeLength(v: number) {
    setLength(v);
    regenerate(v, enabled);
  }

  function toggle(key: SetKey) {
    const next = { ...enabled, [key]: !enabled[key] };
    setEnabled(next);
    regenerate(length, next);
  }

  async function copy() {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — ignore
    }
  }

  return (
    <div className="space-y-5">
      <div className="pip-border relative rounded bg-[#0d1a0d] p-4">
        <div className="break-all pr-2 font-mono text-lg text-[#00ff41]">
          {password || <span className="text-[#00aa2a]/40">— SELECT AT LEAST ONE SET —</span>}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => regenerate()}
          className="pip-border flex-1 rounded px-4 py-2 text-sm tracking-[0.15em] text-[#00ff41] transition-colors hover:bg-[#00ff41]/10"
        >
          ⟳ REGENERATE
        </button>
        <button
          onClick={copy}
          disabled={!password}
          className="pip-border rounded px-4 py-2 text-sm tracking-[0.15em] text-[#00aa2a] transition-colors hover:text-[#00ff41] disabled:opacity-40"
        >
          {copied ? "✓ COPIED" : "COPY"}
        </button>
      </div>

      <div className="pip-card pip-border space-y-4 rounded p-4">
        <div>
          <div className="mb-1 flex items-center justify-between text-[10px] tracking-[0.15em] text-[#00aa2a]/70">
            <span>LENGTH</span>
            <span className="text-[#00ff41]">{length}</span>
          </div>
          <input
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={(e) => changeLength(Number(e.target.value))}
            className="w-full accent-[#00ff41]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {TOGGLES.map((t) => (
            <button
              key={t.key}
              onClick={() => toggle(t.key)}
              className={`rounded border px-3 py-2 text-xs tracking-[0.1em] transition-colors ${
                enabled[t.key]
                  ? "border-[#00ff41] text-[#00ff41]"
                  : "border-[#00aa2a]/30 text-[#00aa2a]/50 hover:border-[#00aa2a]"
              }`}
            >
              <span className="mr-1.5">{enabled[t.key] ? "▣" : "▢"}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-[10px] tracking-[0.15em] text-[#00aa2a]/70">
          <span>ENTROPY · {entropy} bits</span>
          <span style={{ color: strength.color }}>{strength.text}</span>
        </div>
        <div className="pip-progress w-full">
          <div
            className="h-full transition-all"
            style={{ width: `${strength.pct}%`, background: strength.color, boxShadow: `0 0 6px ${strength.color}` }}
          />
        </div>
      </div>
    </div>
  );
}
