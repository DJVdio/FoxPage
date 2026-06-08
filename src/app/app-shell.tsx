"use client";

import { usePathname } from "next/navigation";
import BootScreen from "./boot-screen";

const paths = ["/apps/hello-world", "/apps/games", "/apps/games/snake", "/apps/games/flappybird"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BootScreen prefetchPaths={paths} />
      {children}
    </>
  );
}
