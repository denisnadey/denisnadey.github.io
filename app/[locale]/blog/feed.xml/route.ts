import { isLocale, locales } from "@/content";
import { blogPath, feedPath, getBlogCopy, getPosts, postTimestamp } from "@/content/blog";
import { absoluteUrl, brandTitle } from "@/content/shared";

export const dynamic = "force-static";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rfc822 = (value: string) => new Date(postTimestamp(value)).toUTCString();

/** RSS 2.0 feed for one locale's blog. */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  const copy = getBlogCopy(locale);
  const posts = getPosts(locale);
  const items = posts.map((post) => {
    const url = absoluteUrl(blogPath(locale, post.slug));
    return `<item><title>${escapeXml(post.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${rfc822(post.published)}</pubDate><description>${escapeXml(post.description)}</description>${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("")}</item>`;
  });
  const lastBuild = posts[0] ? `<lastBuildDate>${rfc822(posts[0].updated ?? posts[0].published)}</lastBuildDate>` : "";
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(brandTitle(copy.seoTitle))}</title><link>${absoluteUrl(blogPath(locale))}</link><description>${escapeXml(copy.description)}</description><language>${locale}</language><atom:link href="${absoluteUrl(feedPath(locale))}" rel="self" type="application/rss+xml"/>${lastBuild}${items.join("")}</channel></rss>\n`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
