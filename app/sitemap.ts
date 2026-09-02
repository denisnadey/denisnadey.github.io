import type { MetadataRoute } from "next";
import { locales, pages } from "@/content";
import { contentUpdatedAt } from "@/content/build-info";
import { absoluteUrl, routePath } from "@/content/shared";
import { languageAlternates } from "@/app/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(contentUpdatedAt);
  return locales.flatMap((locale) => [
    { url: absoluteUrl(routePath(locale)), lastModified, changeFrequency: "monthly" as const, priority: locale === "en" ? 1 : 0.9, alternates: { languages: languageAlternates() } },
    ...pages.map((page) => ({ url: absoluteUrl(routePath(locale, page)), lastModified, changeFrequency: page === "open-source" ? ("weekly" as const) : ("monthly" as const), priority: page === "contact" ? 0.8 : 0.7, alternates: { languages: languageAlternates(page) } })),
    { url: absoluteUrl(routePath(locale, "docs")), lastModified, changeFrequency: "weekly" as const, priority: 0.8, alternates: { languages: languageAlternates("docs") } },
  ]);
}
