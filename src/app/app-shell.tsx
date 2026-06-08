"use client";

import BootScreen from "./boot-screen";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BootScreen />
      {children}
    </>
  );
}
