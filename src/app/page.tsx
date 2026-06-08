"use client";

import Link from "next/link";
import { useState } from "react";
import { apps } from "@/data/apps";
import BootScreen from "./boot-screen";

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      {!booted && <BootScreen onFinish={() => setBooted(true)} />}
      <div className={`transition-opacity duration-500 ${booted ? "opacity-100" : "opacity-0"}`}>
        <header className="border-b border-[#003a0f] px-4 py-3">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl leading-none tracking-[0.3em] text-[#00ff41]">[::]</span>
              <h1 className="text-lg font-bold tracking-[0.15em] text-[#00ff41]">
                FOXPAGE<span className="text-[#00aa2a]">.OS</span>
              </h1>
            </div>
            <div className="flex items-center gap-4 text-xs tracking-[0.1em] text-[#00aa2a]">
              <span className="pip-blink">&#9632;</span>
              <span>ONLINE</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">{apps.length} APP{apps.length !== 1 ? "S" : ""}</span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col px-4 py-6">
          <div className="mx-auto w-full max-w-3xl flex-1">
            <div className="mb-6 flex items-center gap-2 text-xs tracking-[0.2em] text-[#00aa2a]">
              <span className="h-px flex-1 bg-gradient-to-r from-[#00ff41]/20 to-transparent" />
              <span>APP.LIBRARY</span>
              <span className="h-px flex-1 bg-gradient-to-l from-[#00ff41]/20 to-transparent" />
            </div>

            <div className="space-y-3">
              {apps.map((app, i) => {
                const isExternal = !!app.externalUrl
                const Tag = isExternal ? "a" : Link
                const href = app.externalUrl || app.path!
                const externalProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {}

                return (
                  <Tag
                    key={app.id}
                    href={href}
                    {...externalProps}
                    className="pip-card pip-border group flex items-center gap-4 rounded px-4 py-3 transition-all duration-200"
                  >
                    <span className="w-6 text-center text-xs font-bold text-[#00aa2a]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="pip-border flex h-10 w-10 items-center justify-center rounded text-lg">
                      {app.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate text-sm font-semibold tracking-[0.05em] text-[#00ff41] group-hover:text-[#00ff41]">
                          {app.name}
                        </h2>
                        <span className="shrink-0 rounded border border-[#00aa2a]/30 px-1.5 py-0.5 text-[10px] tracking-[0.1em] text-[#00aa2a]">
                          {isExternal ? "EXTERNAL" : "READY"}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-[#00aa2a]/70">
                        {app.description}
                      </p>
                    </div>
                    <span className="text-[#00aa2a]/40 group-hover:text-[#00ff41]">&gt;</span>
                  </Tag>
                )
              })}
            </div>
          </div>

          <footer className="mt-6 border-t border-[#003a0f] pt-3 text-center">
            <p className="text-[10px] tracking-[0.15em] text-[#00aa2a]/40">
              VAULT-TEC™ · SELECT AN APPLICATION TO LAUNCH
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
