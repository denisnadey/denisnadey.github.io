import type { Metadata } from "next";
import { getCopy, isLocale, locales } from "@/content";
import { contentUpdatedAt } from "@/content/build-info";
import { absoluteUrl, brandTitle, routePath } from "@/content/shared";
import { HomePage } from "@/components/pages";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { jsonLd, pageMetadata, personId, personSchema, websiteId, websiteSchema } from "@/app/seo";
import { notFound } from "next/navigation";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, undefined, getCopy(locale).seo.home, "profile");
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getCopy(locale);
  const url = absoluteUrl(routePath(locale));
  const profilePage = {
    "@type": "ProfilePage",
    "@id": url,
    url,
    name: brandTitle(copy.seo.home.title),
    description: copy.seo.home.description,
    inLanguage: locale,
    isPartOf: { "@id": websiteId },
    dateModified: contentUpdatedAt,
    mainEntity: { "@id": personId },
  };
  return <><a className="skip-link" href="#content">{copy.common.skip}</a><div className="site-shell"><SiteHeader locale={locale} /><main id="content"><HomePage locale={locale} /></main><SiteFooter locale={locale} /></div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([websiteSchema(), personSchema(locale), profilePage]) }} /></>;
}
