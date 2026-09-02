import type { Metadata } from "next";
import { getCopy, locales, type Locale, type PageSlug } from "@/content";
import { contentUpdatedAt } from "@/content/build-info";
import { absoluteUrl, brandTitle, links, ogImage, ogLocales, personSameAs, routePath, siteName, siteUrl } from "@/content/shared";

type RouteSegment = PageSlug | "docs" | undefined;

export function languageAlternates(page?: RouteSegment): Record<string, string> {
  const languages = Object.fromEntries(locales.map((item) => [item, absoluteUrl(routePath(item, page))]));
  return { ...languages, "x-default": absoluteUrl(routePath("en", page)) };
}

/** Shared metadata for every public page: brand in the title, one canonical form, hreflang, Open Graph, and Twitter cards. */
export function pageMetadata(locale: Locale, page: RouteSegment, meta: { title: string; description: string }, type: "profile" | "website" = "website"): Metadata {
  const path = routePath(locale, page);
  const title = brandTitle(meta.title);
  return {
    title,
    description: meta.description,
    alternates: { canonical: path, languages: languageAlternates(page) },
    openGraph: { type, title, description: meta.description, url: path, siteName, locale: ogLocales[locale], images: [ogImage] },
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

export function breadcrumbSchema(locale: Locale, page: PageSlug | "docs", pageName: string) {
  const copy = getCopy(locale);
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(routePath(locale, page))}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: copy.nav.home, item: absoluteUrl(routePath(locale)) },
      { "@type": "ListItem", position: 2, name: pageName, item: absoluteUrl(routePath(locale, page)) },
    ],
  };
}

export function jsonLd(graph: unknown[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}
