import type { MetadataRoute } from "next";
import { locales, pages } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-08-17");
  return locales.flatMap((locale) => [
    { url: `https://denisnadey.com/${locale}`, lastModified: now, changeFrequency: "monthly" as const, priority: locale === "en" ? 1 : 0.9 },
    ...pages.map((page) => ({ url: `https://denisnadey.com/${locale}/${page}`, lastModified: now, changeFrequency: page === "open-source" ? "weekly" as const : "monthly" as const, priority: page === "contact" ? 0.8 : 0.7 })),
    { url: `https://denisnadey.com/${locale}/docs`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
  ]);
}
