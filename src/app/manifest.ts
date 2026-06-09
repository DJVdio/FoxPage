import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FoxPage · Pip-Boy 3000",
    short_name: "FoxPage",
    description: "Vault-Tec™ App Market — browse and launch web apps",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0f0a",
    theme_color: "#00ff41",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
