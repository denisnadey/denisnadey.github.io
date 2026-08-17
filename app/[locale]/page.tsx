import type { Metadata } from "next";
import { getCopy, isLocale, locales } from "@/content";
import { HomePage } from "@/components/pages";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { notFound } from "next/navigation";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const meta = getCopy(locale).seo.home;
  const languages = Object.fromEntries(locales.map((item) => [item, `https://denisnadey.com/${item}`]));
  const image = { url: "/og.png", width: 1731, height: 909, alt: "Denis Nadey — Engineering Manager and hands-on mobile engineer" };
  return { metadataBase: new URL("https://denisnadey.com"), title: meta.title, description: meta.description, alternates: { canonical: `/${locale}`, languages: { ...languages, "x-default": "https://denisnadey.com/en" } }, openGraph: { type: "profile", title: meta.title, description: meta.description, url: `/${locale}`, siteName: "Denis Nadey", locale, images: [image] }, twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: [image] }, robots: { index: true, follow: true } };
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const person = { "@context": "https://schema.org", "@type": "ProfilePage", inLanguage: locale, url: `https://denisnadey.com/${locale}`, mainEntity: { "@type": "Person", name: "Denis Nadey", jobTitle: getCopy(locale).common.role, url: "https://denisnadey.com", email: "mailto:denis.nadey@gmail.com", sameAs: ["https://www.linkedin.com/in/denisnadey/", "https://github.com/denisnadey"], knowsAbout: ["Mobile Engineering", "Engineering Management", "Flutter", "Dart", "Mobile Architecture", "CI/CD"] } };
  return <><a className="skip-link" href="#content">{getCopy(locale).common.skip}</a><div className="site-shell"><SiteHeader locale={locale} /><main id="content"><HomePage locale={locale} /></main><SiteFooter locale={locale} /></div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }} /></>;
}
