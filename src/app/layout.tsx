import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AppShell from "./app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "FOXPAGE · Pip-Boy 3000",
  description: "Vault-Tec™ App Market — browse and launch web apps",
  appleWebApp: { capable: true, title: "FoxPage", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0a0f0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var d=document.documentElement;if(sessionStorage.getItem('foxpage_booted')){d.classList.add('foxpage-booted')}var g=function(k){try{var v=localStorage.getItem('foxpage:'+k);return v?JSON.parse(v):null}catch(e){return null}};var p=g('phosphor');if(p&&p!=='green')d.setAttribute('data-phosphor',p);if(g('scanline')===false)d.setAttribute('data-scanline','off');if(g('motion')===false)d.setAttribute('data-motion','off')}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col font-mono">
        <div className="pip-scanline" />
        <div className="flex flex-1 flex-col">
          <AppShell>{children}</AppShell>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
