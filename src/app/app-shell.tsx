"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apps, findAppByPath } from "@/data/apps";
import { recordLaunch } from "@/lib/launches";
import BootScreen from "./boot-screen";
import CommandPalette from "./command-palette";
import Settings from "./settings";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const barRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Route-transition progress bar.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    bar.classList.remove("route-active");
    void bar.offsetWidth;
    bar.classList.add("route-active");

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      bar.classList.remove("route-active");
    }, 200);

    return () => clearTimeout(timerRef.current);
  }, [pathname]);

  // Record a launch whenever we land on an app route (drives RECENT + stats).
  useEffect(() => {
    const app = findAppByPath(pathname);
    if (app) recordLaunch(app.id);
  }, [pathname]);

  // Number quick-dial: 1-9 launches the correspondingly-numbered top-level app.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t?.isContentEditable) return;
      if (e.key >= "1" && e.key <= "9") {
        const app = apps[Number(e.key) - 1];
        if (!app) return;
        if (app.externalUrl) window.open(app.externalUrl, "_blank", "noopener,noreferrer");
        else if (app.path) router.push(app.path);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <>
      <div
        ref={barRef}
        className="fixed left-0 top-0 z-[10000] h-[2px] w-0 bg-[#00ff41] shadow-[0_0_8px_#00ff41]"
      />
      <BootScreen />
      {children}
      <CommandPalette />
      <Settings />
    </>
  );
}
