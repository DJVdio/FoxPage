"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import BootScreen from "./boot-screen";

const allPaths = ["/apps/hello-world", "/apps/games", "/apps/games/snake", "/apps/games/flappybird", "/apps/timer"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);
  const prevPath = useRef(pathname);

  useEffect(() => {
    for (const p of allPaths) {
      try { router.prefetch(p); } catch {}
    }
  }, []);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    setNavigating(true);
    const t = setTimeout(() => setNavigating(false), 120);
    return () => clearTimeout(t);
  }, [pathname]);

  if (navigating) {
    return (
      <>
        <BootScreen prefetchPaths={allPaths} />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="pip-progress mx-auto w-48">
              <div className="pip-progress-fill w-2/3 animate-pulse" />
            </div>
            <p className="mt-2 text-[10px] tracking-[0.15em] text-[#00aa2a]/60">LOADING...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BootScreen prefetchPaths={allPaths} />
      {children}
    </>
  );
}
