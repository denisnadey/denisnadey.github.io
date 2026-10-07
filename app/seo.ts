import type { Metadata } from "next";
import { getCopy, locales, type Locale, type PageSlug } from "@/content";
import { contentUpdatedAt } from "@/content/build-info";
import { absoluteUrl, brandTitle, links, ogImage, ogLocales, personSameAs, routePath, siteName, siteUrl } from "@/content/shared";

export type RouteSegment = PageSlug | "docs" | "blog" | `blog/${string}` | undefined;

/** hreflang map; `available` narrows it for content that does not exist in every locale. */
export function languageAlternates(page?: RouteSegment, available: readonly Locale[] = locales): Record<string, string> {
  const languages = Object.fromEntries(available.map((item) => [item, absoluteUrl(routePath(item, page))]));
  const fallback = available.includes("en") ? "en" : available[0];
  return { ...languages, "x-default": absoluteUrl(routePath(fallback, page)) };
}

type MetadataExtras = {
  available?: readonly Locale[];
  /** Blog posts: Open Graph `article:*` dates. */
  publishedTime?: string;
  modifiedTime?: string;
  /** Blog pages advertise the locale's RSS feed. */
  feed?: string;
};

/** Shared metadata for every public page: brand in the title, one canonical form, hreflang, Open Graph, and Twitter cards. */
export function pageMetadata(locale: Locale, page: RouteSegment, meta: { title: string; description: string }, type: "profile" | "website" | "article" = "website", extras: MetadataExtras = {}): Metadata {
  const path = routePath(locale, page);
  const title = brandTitle(meta.title);
  const article = type === "article" ? { publishedTime: extras.publishedTime, modifiedTime: extras.modifiedTime ?? extras.publishedTime, authors: [absoluteUrl(routePath(locale))] } : {};
  return {
    title,
    description: meta.description,
    alternates: { canonical: path, languages: languageAlternates(page, extras.available), ...(extras.feed ? { types: { "application/rss+xml": extras.feed } } : {}) },
    openGraph: { type, title, description: meta.description, url: path, siteName, locale: ogLocales[locale], images: [ogImage], ...article },
    twitter: { card: "summary_large_image", title, description: meta.description, images: [ogImage] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export const personId = `${siteUrl}/#person`;
export const websiteId = `${siteUrl}/#website`;

export function personSchema(locale: Locale) {
  const copy = getCopy(locale);
  return {
    "@type": "Person",
    "@id": personId,
    name: siteName,
    givenName: "Denis",
    familyName: "Nadey",
    jobTitle: "Engineering Manager",
    description: copy.seo.about.description,
    url: siteUrl,
    email: links.email,
    image: absoluteUrl(ogImage.url),
    homeLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Tbilisi", addressCountry: "GE" } },
    alumniOf: [{ "@type": "EducationalOrganization", name: "42 Paris" }, { "@type": "EducationalOrganization", name: "School 21" }],
    knowsLanguage: ["ru", "en", "lv"],
    knowsAbout: ["Engineering Management", "Web Engineering", "Mobile Engineering", "Flutter", "Dart", "Kotlin", "Swift", "JavaScript", "TypeScript", "Mobile Architecture", "CI/CD", "Release Engineering", "Applied AI", "AI-assisted Software Engineering"],
    sameAs: personSameAs,
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: `${siteUrl}/`,
    name: siteName,
    alternateName: "Denis Nadey — Engineering Manager · Web, Mobile & AI",
    inLanguage: [...locales],
    publisher: { "@id": personId },
    dateModified: contentUpdatedAt,
  };
}

type Crumb = { page: Exclude<RouteSegment, undefined>; name: string };

/** Home → (optional parent) → page. */
export function breadcrumbSchema(locale: Locale, page: Crumb["page"], pageName: string, parent?: Crumb) {
  const copy = getCopy(locale);
  const trail = [{ name: copy.nav.home, path: routePath(locale) }, ...(parent ? [{ name: parent.name, path: routePath(locale, parent.page) }] : []), { name: pageName, path: routePath(locale, page) }];
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(routePath(locale, page))}#breadcrumb`,
    itemListElement: trail.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: absoluteUrl(crumb.path) })),
  };
}

export function jsonLd(graph: unknown[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}
