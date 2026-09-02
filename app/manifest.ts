import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Denis Nadey — Engineering Manager · Web, Mobile & AI",
    short_name: "Denis Nadey",
    description: "Engineering Manager and hands-on product engineer across web, mobile platforms, open source, and AI-enabled delivery.",
    start_url: "/en/",
    scope: "/",
    display: "standalone",
    background_color: "#f3f1e9",
    theme_color: "#1649ff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
