import type { Metadata } from "next";
import { DetailPage } from "@/components/pages";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { getCopy, isLocale, isPage, locales, pages } from "@/content";
import { contentUpdatedAt } from "@/content/build-info";
import { getDocsCopy } from "@/content/docs";
import { absoluteUrl, brandTitle, routePath } from "@/content/shared";
import { breadcrumbSchema, jsonLd, pageMetadata, personId, websiteId } from "@/app/seo";
import { notFound } from "next/navigation";

export function generateStaticParams() { return locales.flatMap((locale) => pages.map((page) => ({ locale, page }))); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; page: string }> }): Promise<Metadata> {
  const { locale, page } = await params;
  if (!isLocale(locale) || !isPage(page)) return {};
  return pageMetadata(locale, page, getCopy(locale).seo[page]);
}

const licenseUrls: Record<string, string> = { MIT: "https://opensource.org/license/mit", "Apache-2.0": "https://www.apache.org/licenses/LICENSE-2.0" };

export default async function LocalizedDetail({ params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale, page } = await params;
  if (!isLocale(locale) || !isPage(page)) notFound();
  const copy = getCopy(locale);
  const meta = copy.seo[page];
  const url = absoluteUrl(routePath(locale, page));
  const webPage = {
    "@type": page === "contact" ? "ContactPage" : page === "about" ? "AboutPage" : "WebPage",
    "@id": url,
    url,
    name: brandTitle(meta.title),
    description: meta.description,
    inLanguage: locale,
    isPartOf: { "@id": websiteId },
    about: { "@id": personId },
    dateModified: contentUpdatedAt,
    breadcrumb: { "@id": `${url}#breadcrumb` },
  };
  const graph: unknown[] = [webPage, breadcrumbSchema(locale, page, copy.nav[page])];
  if (page === "open-source") {
    const docs = getDocsCopy(locale);
    for (const pkg of docs.packages) {
      graph.push({
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
        keywords: pkg.capabilities.join(", "),
      });
    }
  }
  return <><a className="skip-link" href="#content">{copy.common.skip}</a><div className="site-shell"><SiteHeader locale={locale} page={page} /><main id="content"><DetailPage locale={locale} page={page} /></main><SiteFooter locale={locale} /></div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} /></>;
}
