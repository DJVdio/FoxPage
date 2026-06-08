import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-dvh flex flex-col">
        <div className="pip-scanline" />
        <div className="flex flex-1 flex-col pip-boy-frame">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
