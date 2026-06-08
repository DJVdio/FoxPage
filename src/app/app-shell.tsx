"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import BootScreen from "./boot-screen";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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

  return (
    <>
      <div
        ref={barRef}
        className="fixed left-0 top-0 z-[10000] h-[2px] w-0 bg-[#00ff41] shadow-[0_0_8px_#00ff41]"
      />
      <BootScreen />
      {children}
    </>
  );
}
