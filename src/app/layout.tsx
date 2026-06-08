import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import PipBoyFrame from "./pipboy-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: "FOXPAGE · Pip-Boy 3000",
  description: "Vault-Tec™ App Market — browse and launch web apps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-dvh font-mono">
        <div className="pip-scanline" />
        <PipBoyFrame>
          <div className="flex min-h-[400px] flex-col">{children}</div>
        </PipBoyFrame>
        <Analytics />
      </body>
    </html>
  );
}
