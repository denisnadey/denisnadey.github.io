import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage } from "@/components/docs-page";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { getCopy, isLocale, locales } from "@/content";
import { getDocsCopy } from "@/content/docs";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const meta = getDocsCopy(locale).seo;
  const languages = Object.fromEntries(locales.map((item) => [item, `https://denisnadey.com/${item}/docs`]));
  return { metadataBase: new URL("https://denisnadey.com"), title: meta.title, description: meta.description, alternates: { canonical: `/${locale}/docs`, languages: { ...languages, "x-default": "https://denisnadey.com/en/docs" } }, openGraph: { type: "website", title: meta.title, description: meta.description, url: `/${locale}/docs`, siteName: "Denis Nadey", locale, images: [] }, twitter: { card: "summary", title: meta.title, description: meta.description, images: [] } };
}

export default async function LocalizedDocs({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getCopy(locale);
  const docs = getDocsCopy(locale);
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: docs.seo.title, description: docs.seo.description, inLanguage: locale, url: `https://denisnadey.com/${locale}/docs`, hasPart: docs.packages.map((pkg) => ({ "@type": "SoftwareSourceCode", name: pkg.name, version: pkg.version, codeRepository: pkg.sourceUrl, programmingLanguage: "Dart", runtimePlatform: "Flutter", license: pkg.license })) };
  return <><a className="skip-link" href="#content">{copy.common.skip}</a><div className="site-shell"><SiteHeader locale={locale} page="docs" /><main id="content"><DocsPage locale={locale} /></main><SiteFooter locale={locale} /></div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /></>;
}
