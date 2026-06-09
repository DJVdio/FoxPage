import Link from "next/link";
import type { AppInfo, AppStatus } from "@/data/apps";

const STATUS_LABELS: Record<AppStatus, string> = {
  ready: "READY",
  new: "NEW",
  beta: "BETA",
  wip: "WIP",
  offline: "OFFLINE",
};

// 沿用现有暗绿描边；new 亮绿，offline 琥珀。
const STATUS_STYLES: Record<AppStatus, string> = {
  ready: "border-[#00aa2a]/30 text-[#00aa2a]",
  beta: "border-[#00aa2a]/30 text-[#00aa2a]",
  wip: "border-[#00aa2a]/30 text-[#00aa2a]",
  new: "border-[#00ff41]/40 text-[#00ff41]",
  offline: "border-[#ffb000]/40 text-[#ffb000]",
};

const EXTERNAL_STYLE = "border-[#00aa2a]/30 text-[#00aa2a]";

function badge(app: AppInfo): { label: string; style: string } {
  if (app.status) {
    return { label: STATUS_LABELS[app.status], style: STATUS_STYLES[app.status] };
  }
  if (app.externalUrl) {
    return { label: "EXTERNAL", style: EXTERNAL_STYLE };
  }
  return { label: "READY", style: STATUS_STYLES.ready };
}

export default function AppCard({ app, index }: { app: AppInfo; index: number }) {
  const { label, style } = badge(app);

  const cardClass =
    "pip-card pip-border group flex items-center gap-4 rounded px-4 py-3 transition-all duration-200";

  const inner = (
    <>
      <span className="w-6 text-center text-xs font-bold text-[#00aa2a]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="pip-border flex h-10 w-10 items-center justify-center rounded text-lg">
        {app.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-sm font-semibold tracking-[0.05em] text-[#00ff41]">
            {app.name}
          </h2>
          <span
            className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] tracking-[0.1em] ${style}`}
          >
            {label}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-[#00aa2a]/70">{app.description}</p>
      </div>
      <span className="text-[#00aa2a]/40 group-hover:text-[#00ff41]">&gt;</span>
    </>
  );

  if (app.externalUrl) {
    return (
      <a
        href={app.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
      >
        {inner}
      </a>
    );
  }

  if (app.path) {
    return (
      <Link href={app.path} prefetch={true} className={cardClass}>
        {inner}
      </Link>
    );
  }

  // 既无 externalUrl 也无 path：无可导航目标，不渲染（防御未来的非导航条目）
  return null;
}
