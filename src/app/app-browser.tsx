"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { allApps, apps, type AppInfo } from "@/data/apps";
import AppCard from "./app-card";
import { usePersistent } from "./use-persistent";
import { LAUNCHES_KEY, recentIds, type LaunchEvent } from "@/lib/launches";

const FAVS_KEY = "favorites";
const NO_FAVS: string[] = [];
const NO_LAUNCHES: LaunchEvent[] = [];

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-xs tracking-[0.2em] text-[#00aa2a]">
        <span className="h-px flex-1 bg-gradient-to-r from-[#00ff41]/20 to-transparent" />
        <span>{label}</span>
        <span className="h-px flex-1 bg-gradient-to-l from-[#00ff41]/20 to-transparent" />
      </div>
      {children}
    </div>
  );
}

function MiniLaunch({ app }: { app: AppInfo }) {
  const cls =
    "pip-border flex shrink-0 items-center gap-2 rounded px-3 py-1.5 text-xs text-[#00ff41] transition-colors hover:bg-[#00ff41]/10";
  const inner = (
    <>
      <span>{app.icon}</span>
      <span className="max-w-[8rem] truncate">{app.name}</span>
    </>
  );
  if (app.externalUrl) {
    return (
      <a href={app.externalUrl} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={app.path!} prefetch={true} className={cls}>
      {inner}
    </Link>
  );
}

export default function AppBrowser() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = usePersistent<string[]>(FAVS_KEY, NO_FAVS);
  const [launches] = usePersistent<LaunchEvent[]>(LAUNCHES_KEY, NO_LAUNCHES);

  const flat = useMemo(() => allApps(), []);
  const byId = useMemo(() => {
    const m = new Map<string, AppInfo>();
    flat.forEach((a) => m.set(a.id, a));
    return m;
  }, [flat]);

  const q = query.trim().toLowerCase();
  const results = q
    ? flat.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q),
      )
    : [];

  const recent = recentIds(launches, 5)
    .map((id) => byId.get(id))
    .filter((a): a is AppInfo => Boolean(a));
  const favApps = favorites
    .map((id) => byId.get(id))
    .filter((a): a is AppInfo => Boolean(a));

  function toggleFav(id: string) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function CardWithPin({ app, index }: { app: AppInfo; index: number }) {
    const fav = favorites.includes(app.id);
    return (
      <div className="relative">
        <AppCard app={app} index={index} />
        <button
          onClick={() => toggleFav(app.id)}
          aria-label={fav ? "unpin" : "pin"}
          className={`absolute right-2 top-2 z-10 text-sm transition-colors ${
            fav ? "text-[#ffb000]" : "text-[#00aa2a]/40 hover:text-[#ffb000]"
          }`}
        >
          {fav ? "★" : "☆"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pip-border flex items-center gap-2 rounded bg-[#0d1a0d] px-3 py-2">
        <span className="text-[#00aa2a]">⌕</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH · 搜索应用…   (⌘/Ctrl + K 命令面板)"
          className="flex-1 bg-transparent text-sm text-[#00ff41] outline-none placeholder:text-[#00aa2a]/40"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-[#00aa2a]/60 hover:text-[#00ff41]">
            ✕
          </button>
        )}
      </div>

      {q ? (
        results.length > 0 ? (
          <div className="space-y-3">
            {results.map((app, i) => (
              <CardWithPin key={app.id} app={app} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs tracking-[0.2em] text-[#00aa2a]/50">
            NO MATCH FOUND
          </div>
        )
      ) : (
        <>
          {recent.length > 0 && (
            <Section label="RECENT">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {recent.map((a) => (
                  <MiniLaunch key={a.id} app={a} />
                ))}
              </div>
            </Section>
          )}

          {favApps.length > 0 && (
            <Section label="FAVORITES">
              <div className="flex flex-wrap gap-2">
                {favApps.map((a) => (
                  <MiniLaunch key={a.id} app={a} />
                ))}
              </div>
            </Section>
          )}

          <Section label="APP.LIBRARY">
            <div className="space-y-3">
              {apps.map((app, i) => (
                <CardWithPin key={app.id} app={app} index={i} />
              ))}
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
