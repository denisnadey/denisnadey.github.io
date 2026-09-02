import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage } from "@/components/docs-page";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { getCopy, isLocale, locales } from "@/content";
import { contentUpdatedAt } from "@/content/build-info";
import { getDocsCopy } from "@/content/docs";
import { absoluteUrl, brandTitle, routePath } from "@/content/shared";
import { breadcrumbSchema, jsonLd, pageMetadata, personId, websiteId } from "@/app/seo";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, "docs", getDocsCopy(locale).seo);
}

const licenseUrls: Record<string, string> = { MIT: "https://opensource.org/license/mit", "Apache-2.0": "https://www.apache.org/licenses/LICENSE-2.0" };

export default async function LocalizedDocs({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getCopy(locale);
  const docs = getDocsCopy(locale);
  const url = absoluteUrl(routePath(locale, "docs"));
  const collection = {
    "@type": "CollectionPage",
    "@id": url,
    url,
    name: brandTitle(docs.seo.title),
    description: docs.seo.description,
    inLanguage: locale,
    isPartOf: { "@id": websiteId },
    about: { "@id": personId },
    dateModified: contentUpdatedAt,
    breadcrumb: { "@id": `${url}#breadcrumb` },
    hasPart: docs.packages.map((pkg) => ({
      "@type": "SoftwareSourceCode",
      "@id": pkg.pubUrl,
      name: pkg.name,
      description: pkg.tagline,
      url: pkg.pubUrl,
      codeRepository: pkg.sourceUrl,
      version: pkg.version,
      programmingLanguage: "Dart",
      runtimePlatform: "Flutter",
      license: licenseUrls[pkg.license] ?? pkg.license,
      dateModified: contentUpdatedAt,
      author: { "@id": personId },
    })),
  };
  return <><a className="skip-link" href="#content">{copy.common.skip}</a><div className="site-shell"><SiteHeader locale={locale} page="docs" /><main id="content"><DocsPage locale={locale} /></main><SiteFooter locale={locale} /></div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([collection, breadcrumbSchema(locale, "docs", docs.navLabel)]) }} /></>;
}
