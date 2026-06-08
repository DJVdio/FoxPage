"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BootScreen from "./boot-screen";

const allPaths = ["/apps/hello-world", "/apps/games", "/apps/games/snake", "/apps/games/flappybird"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    for (const p of allPaths) {
      try { router.prefetch(p); } catch {}
    }
  }, []);

  return (
    <>
      <BootScreen prefetchPaths={allPaths} />
      {children}
    </>
  );
}
