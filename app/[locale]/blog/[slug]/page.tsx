import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/blog";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { getCopy, isLocale } from "@/content";
import { blogParams, blogPath, blogSourceLocale, feedPath, getBlogCopy, getPost, postLocales } from "@/content/blog";
import { documentText } from "@/content/blog/markdown.mjs";
import { absoluteUrl, ogImage } from "@/content/shared";
import { breadcrumbSchema, jsonLd, pageMetadata, personId, websiteId } from "@/app/seo";

export function generateStaticParams() { return blogParams(); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = getPost(locale, slug);
  if (!post) return {};
  return pageMetadata(locale, `blog/${slug}`, post, "article", { available: postLocales(slug), publishedTime: post.published, modifiedTime: post.updated, feed: feedPath(locale) });
}

export default async function LocalizedPost({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = getPost(locale, slug);
  if (!post) notFound();
  const copy = getCopy(locale);
  const blog = getBlogCopy(locale);
  const url = absoluteUrl(blogPath(locale, slug));
  const posting = {
    "@type": "BlogPosting",
    "@id": url,
    url,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.updated ?? post.published,
    inLanguage: locale,
    author: { "@id": personId },
    publisher: { "@id": personId },
    image: absoluteUrl(ogImage.url),
    keywords: post.tags.join(", "),
    wordCount: documentText(post.blocks).split(/\s+/).filter(Boolean).length,
    isPartOf: [{ "@id": absoluteUrl(blogPath(locale)) }, { "@id": websiteId }],
    breadcrumb: { "@id": `${url}#breadcrumb` },
    ...(locale === blogSourceLocale ? (post.linkedin ? { sameAs: [post.linkedin] } : {}) : { translationOfWork: { "@id": absoluteUrl(blogPath(blogSourceLocale, slug)) } }),
  };
  return <><a className="skip-link" href="#content">{copy.common.skip}</a><div className="site-shell"><SiteHeader locale={locale} page={`blog/${slug}`} available={postLocales(slug)} /><main id="content"><BlogPostPage post={post} locale={locale} /></main><SiteFooter locale={locale} /></div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([posting, breadcrumbSchema(locale, `blog/${slug}`, post.title, { page: "blog", name: blog.navLabel })]) }} /></>;
}
