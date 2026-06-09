"use client";

import { useMemo } from "react";
import { allApps, type AppInfo } from "@/data/apps";
import { usePersistent } from "@/app/use-persistent";
import { countsById, LAUNCHES_KEY, type LaunchEvent } from "@/lib/launches";

const NO_LAUNCHES: LaunchEvent[] = [];
const NO_FAVS: string[] = [];

function clampStat(v: number) {
  return Math.max(1, Math.min(10, Math.round(v)));
}

function streakDays(launches: LaunchEvent[]): number {
  if (launches.length === 0) return 0;
  const days = new Set(launches.map((e) => new Date(e.ts).toDateString()));
  const count = (start: Date) => {
    let s = 0;
    const d = new Date(start);
    while (days.has(d.toDateString())) {
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  };
  const today = count(new Date());
  if (today > 0) return today;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return count(y);
}

function StatBar({ value }: { value: number }) {
  return (
    <span className="font-mono tracking-tight">
      <span className="text-[#00ff41]">{"▮".repeat(value)}</span>
      <span className="text-[#00aa2a]/25">{"▯".repeat(10 - value)}</span>
    </span>
  );
}

export default function Profile() {
  const [launches] = usePersistent<LaunchEvent[]>(LAUNCHES_KEY, NO_LAUNCHES);
  const [favorites] = usePersistent<string[]>("favorites", NO_FAVS);

  const byId = useMemo(() => {
    const m = new Map<string, AppInfo>();
    allApps().forEach((a) => m.set(a.id, a));
    return m;
  }, []);

  if (launches.length === 0) {
    return (
      <div className="pip-border rounded bg-[#0d1a0d] p-8 text-center">
        <div className="mb-2 text-4xl">🧑‍🚀</div>
        <div className="text-sm tracking-[0.15em] text-[#00ff41]">NO RECORDS YET</div>
        <p className="mt-2 text-xs text-[#00aa2a]/60">
          启动一些应用后，你的 Vault Dweller 档案会在这里生成。
        </p>
      </div>
    );
  }

  const counts = countsById(launches);
  const total = launches.length;
  const unique = Object.keys(counts).length;
  const maxMastery = Math.max(...Object.values(counts));
  const todayStr = new Date().toDateString();
  const todayCount = launches.filter((e) => new Date(e.ts).toDateString() === todayStr).length;
  const streak = streakDays(launches);
  const level = Math.floor(total / 5) + 1;

  const special = [
    { name: "STRENGTH", v: clampStat(total / 3) },
    { name: "PERCEPTION", v: clampStat(unique * 2) },
    { name: "ENDURANCE", v: clampStat(streak * 2) },
    { name: "CHARISMA", v: clampStat(favorites.length * 2 + 1) },
    { name: "INTELLIGENCE", v: clampStat(maxMastery) },
    { name: "AGILITY", v: clampStat(todayCount * 2) },
    { name: "LUCK", v: clampStat((total % 7) + 3) },
  ];

  const topApps = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id, n]) => ({ app: byId.get(id), n }))
    .filter((x): x is { app: AppInfo; n: number } => Boolean(x.app));
  const topMax = topApps.length ? topApps[0].n : 1;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toDateString();
    return {
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      count: launches.filter((e) => new Date(e.ts).toDateString() === key).length,
    };
  });
  const weekMax = Math.max(1, ...last7.map((d) => d.count));

  const perks = [
    { name: "VAULT RESIDENT", desc: "首次启动应用", on: total >= 1 },
    { name: "EXPLORER", desc: "使用过 ≥4 个应用", on: unique >= 4 },
    { name: "TINKERER", desc: "用过实用工具", on: ["converter", "password", "notes"].some((id) => counts[id]) },
    { name: "TERMLINK HACKER", desc: "打开过 WORD.HACK", on: Boolean(counts["wordhack"]) },
    { name: "CURATOR", desc: "收藏 ≥3 个应用", on: favorites.length >= 3 },
    { name: "REGULAR", desc: "连续 ≥3 天访问", on: streak >= 3 },
    { name: "POWER USER", desc: "累计 ≥25 次启动", on: total >= 25 },
  ];

  return (
    <div className="space-y-6">
      {/* header card */}
      <div className="pip-border flex items-center gap-4 rounded bg-[#0d1a0d] p-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#00ff41] text-3xl">
          🧑‍🚀
        </div>
        <div>
          <div className="text-lg font-bold tracking-[0.1em] text-[#00ff41]">VAULT DWELLER</div>
          <div className="text-xs tracking-[0.15em] text-[#00aa2a]">
            LVL {level} · VAULT 111 · {streak}-DAY STREAK
          </div>
        </div>
      </div>

      {/* S.P.E.C.I.A.L. */}
      <div>
        <div className="mb-2 text-[10px] tracking-[0.2em] text-[#00aa2a]/70">S.P.E.C.I.A.L.</div>
        <div className="pip-border space-y-1.5 rounded bg-[#0d1a0d] p-4">
          {special.map((s) => (
            <div key={s.name} className="flex items-center justify-between gap-3 text-xs">
              <span className="w-28 shrink-0 tracking-[0.1em] text-[#00aa2a]">{s.name}</span>
              <StatBar value={s.v} />
              <span className="w-5 text-right text-[#00ff41]">{s.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "LAUNCHES", v: total },
          { label: "APPS USED", v: unique },
          { label: "STREAK", v: `${streak}d` },
        ].map((s) => (
          <div key={s.label} className="pip-border rounded bg-[#0d1a0d] p-3 text-center">
            <div className="text-2xl font-bold text-[#00ff41]">{s.v}</div>
            <div className="text-[10px] tracking-[0.15em] text-[#00aa2a]/60">{s.label}</div>
          </div>
        ))}
      </div>

      {/* top apps */}
      <div>
        <div className="mb-2 text-[10px] tracking-[0.2em] text-[#00aa2a]/70">MOST USED</div>
        <div className="pip-border space-y-2 rounded bg-[#0d1a0d] p-4">
          {topApps.map(({ app, n }) => (
            <div key={app.id} className="flex items-center gap-2 text-xs">
              <span className="w-5">{app.icon}</span>
              <span className="w-24 shrink-0 truncate text-[#00aa2a]">{app.name}</span>
              <span className="pip-progress h-2 flex-1">
                <span className="pip-progress-fill block" style={{ width: `${(n / topMax) * 100}%` }} />
              </span>
              <span className="w-6 text-right text-[#00ff41]">{n}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7-day activity */}
      <div>
        <div className="mb-2 text-[10px] tracking-[0.2em] text-[#00aa2a]/70">7-DAY ACTIVITY</div>
        <div className="pip-border flex items-end justify-between gap-2 rounded bg-[#0d1a0d] p-4" style={{ height: "8rem" }}>
          {last7.map((d) => (
            <div key={d.label} className="flex flex-1 flex-col items-center justify-end gap-1">
              <div
                className="w-full rounded-t bg-[#00ff41]"
                style={{ height: `${(d.count / weekMax) * 70}%`, minHeight: d.count ? "4px" : "0", boxShadow: d.count ? "0 0 6px #00aa2a" : "none" }}
              />
              <span className="text-[9px] text-[#00aa2a]/60">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* perks */}
      <div>
        <div className="mb-2 text-[10px] tracking-[0.2em] text-[#00aa2a]/70">PERKS</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {perks.map((p) => (
            <div
              key={p.name}
              className={`pip-border rounded p-3 ${p.on ? "bg-[#00ff41]/5" : "opacity-40"}`}
            >
              <div className={`text-xs font-bold tracking-[0.1em] ${p.on ? "text-[#00ff41]" : "text-[#00aa2a]"}`}>
                {p.on ? "★ " : "☆ "}
                {p.name}
              </div>
              <div className="mt-1 text-[10px] text-[#00aa2a]/60">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
