import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
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
      <body className="min-h-dvh flex flex-col font-mono">
        <div className="pip-scanline" />
        <div className="flex flex-1 flex-col">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
