import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndexPage } from "@/components/blog";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { getCopy, isLocale, locales } from "@/content";
import { blogPath, feedPath, getBlogCopy, getPosts, postTimestamp } from "@/content/blog";
import { contentUpdatedAt } from "@/content/build-info";
import { absoluteUrl, brandTitle } from "@/content/shared";
import { breadcrumbSchema, jsonLd, pageMetadata, personId, websiteId } from "@/app/seo";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = getBlogCopy(locale);
  return pageMetadata(locale, "blog", { title: copy.seoTitle, description: copy.description }, "website", { feed: feedPath(locale) });
}

export default async function LocalizedBlog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getCopy(locale);
  const blog = getBlogCopy(locale);
  const url = absoluteUrl(blogPath(locale));
  const posts = getPosts(locale);
  const blogNode = {
    "@type": "Blog",
    "@id": url,
    url,
    name: brandTitle(blog.seoTitle),
    description: blog.description,
    inLanguage: locale,
    isPartOf: { "@id": websiteId },
    author: { "@id": personId },
    publisher: { "@id": personId },
    dateModified: posts[0] && postTimestamp(posts[0].published) > postTimestamp(contentUpdatedAt) ? posts[0].published : contentUpdatedAt,
    breadcrumb: { "@id": `${url}#breadcrumb` },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": absoluteUrl(blogPath(locale, post.slug)),
      url: absoluteUrl(blogPath(locale, post.slug)),
      headline: post.title,
      description: post.description,
      datePublished: post.published,
      dateModified: post.updated ?? post.published,
      inLanguage: locale,
      author: { "@id": personId },
    })),
  };
  return <><a className="skip-link" href="#content">{copy.common.skip}</a><div className="site-shell"><SiteHeader locale={locale} page="blog" /><main id="content"><BlogIndexPage locale={locale} /></main><SiteFooter locale={locale} /></div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([blogNode, breadcrumbSchema(locale, "blog", blog.navLabel)]) }} /></>;
}
