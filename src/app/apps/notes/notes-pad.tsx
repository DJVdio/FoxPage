"use client";

import { useState } from "react";
import { usePersistent } from "@/app/use-persistent";

export default function NotesPad() {
  const [text, setText] = usePersistent<string>("notes", "");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  function onChange(value: string) {
    setText(value);
    setSavedAt(new Date().toLocaleTimeString());
  }

  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split("\n").length : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[10px] tracking-[0.15em] text-[#00aa2a]/70">
        <span>HOLOTAPE.LOG</span>
        <span className="text-[#00ff41]/80">
          {savedAt ? `AUTOSAVED @ ${savedAt}` : "READY"}
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="> 在此输入… 内容自动保存到本机"
        spellCheck={false}
        className="pip-border min-h-[55vh] w-full resize-y rounded bg-[#0d1a0d] p-4 font-mono text-sm leading-relaxed text-[#00ff41] outline-none placeholder:text-[#00aa2a]/30 focus:border-[#00ff41]"
      />

      <div className="flex items-center justify-between text-[10px] tracking-[0.15em] text-[#00aa2a]/60">
        <span>
          {chars} CHARS · {words} WORDS · {lines} LINES
        </span>
        <button
          onClick={() => onChange("")}
          disabled={!text}
          className="rounded border border-[#00aa2a]/30 px-2 py-1 tracking-[0.1em] text-[#00aa2a] transition-colors hover:border-[#ffb000] hover:text-[#ffb000] disabled:opacity-40"
        >
          CLEAR
        </button>
      </div>
    </div>
  );
}
