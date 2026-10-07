import type { MetadataRoute } from "next";
import { locales, pages } from "@/content";
import { blogPath, getPosts, postLocales, postTimestamp } from "@/content/blog";
import { contentUpdatedAt } from "@/content/build-info";
import { absoluteUrl, routePath } from "@/content/shared";
import { languageAlternates } from "@/app/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(contentUpdatedAt);
  // A post can be dated after the last commit until it is committed; lastmod never precedes publication.
  const notBefore = (value: string) => new Date(Math.max(lastModified.getTime(), postTimestamp(value)));
  return locales.flatMap((locale) => [
    { url: absoluteUrl(routePath(locale)), lastModified, changeFrequency: "monthly" as const, priority: locale === "en" ? 1 : 0.9, alternates: { languages: languageAlternates() } },
    ...pages.map((page) => ({ url: absoluteUrl(routePath(locale, page)), lastModified, changeFrequency: page === "open-source" ? ("weekly" as const) : ("monthly" as const), priority: page === "contact" ? 0.8 : 0.7, alternates: { languages: languageAlternates(page) } })),
    { url: absoluteUrl(routePath(locale, "docs")), lastModified, changeFrequency: "weekly" as const, priority: 0.8, alternates: { languages: languageAlternates("docs") } },
    { url: absoluteUrl(blogPath(locale)), lastModified: notBefore(getPosts(locale)[0]?.published ?? contentUpdatedAt), changeFrequency: "weekly" as const, priority: 0.8, alternates: { languages: languageAlternates("blog") } },
    ...getPosts(locale).map((post) => ({ url: absoluteUrl(blogPath(locale, post.slug)), lastModified: notBefore(post.updated ?? post.published), changeFrequency: "yearly" as const, priority: 0.6, alternates: { languages: languageAlternates(`blog/${post.slug}`, postLocales(post.slug)) } })),
  ]);
}
