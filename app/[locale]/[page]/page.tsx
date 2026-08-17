import type { Metadata } from "next";
import { DetailPage } from "@/components/pages";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { getCopy, isLocale, isPage, locales, pages } from "@/content";
import { notFound } from "next/navigation";

export function generateStaticParams() { return locales.flatMap((locale) => pages.map((page) => ({ locale, page }))); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; page: string }> }): Promise<Metadata> {
  const { locale, page } = await params;
  if (!isLocale(locale) || !isPage(page)) return {};
  const meta = getCopy(locale).seo[page];
  const languages = Object.fromEntries(locales.map((item) => [item, `https://denisnadey.com/${item}/${page}`]));
  return { metadataBase: new URL("https://denisnadey.com"), title: meta.title, description: meta.description, alternates: { canonical: `/${locale}/${page}`, languages: { ...languages, "x-default": `https://denisnadey.com/en/${page}` } }, openGraph: { type: "website", title: meta.title, description: meta.description, url: `/${locale}/${page}`, siteName: "Denis Nadey", locale, images: [] }, twitter: { card: "summary", title: meta.title, description: meta.description, images: [] }, robots: { index: true, follow: true } };
}

export default async function LocalizedDetail({ params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale, page } = await params;
  if (!isLocale(locale) || !isPage(page)) notFound();
  const copy = getCopy(locale);
  const schema = page === "open-source" ? { "@context": "https://schema.org", "@type": "SoftwareSourceCode", name: "full_svg_flutter", codeRepository: "https://github.com/denisnadey/flutter_full_svg_support", programmingLanguage: "Dart", runtimePlatform: "Flutter", license: "https://opensource.org/license/mit", author: { "@type": "Person", name: "Denis Nadey" } } : { "@context": "https://schema.org", "@type": page === "contact" ? "ContactPage" : "WebPage", name: copy.seo[page].title, description: copy.seo[page].description, inLanguage: locale, url: `https://denisnadey.com/${locale}/${page}` };
  return <><a className="skip-link" href="#content">{copy.common.skip}</a><div className="site-shell"><SiteHeader locale={locale} page={page} /><main id="content"><DetailPage locale={locale} page={page} /></main><SiteFooter locale={locale} /></div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /></>;
}

