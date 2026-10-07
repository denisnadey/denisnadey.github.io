import assert from "node:assert/strict";
import test from "node:test";
import { listPostSlugs } from "../scripts/check-blog.mjs";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };

const locales = ["en", "ru", "de", "fr", "es", "it", "pl", "pt", "ka", "ar"];
const postSlugs = await listPostSlugs();
const linkedinPosts = ["figma-motion-to-flutter", "figma-motion-flutter-shorter-pipeline", "my-own-corner-of-the-internet", "woff2-for-flutter", "full-svg-flutter-scripts-svgator", "next-chapter"];
const pages = ["", "/work", "/open-source", "/services", "/experience", "/about", "/contact", "/docs", "/blog", ...postSlugs.map((slug) => `/blog/${slug}`)];
const bareInternalLink = /href="\/[a-z]{2}(?:\/[a-z0-9-]+)*"/;
const botUserAgent = "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)";

async function render(path, userAgent) {
  const headers = { accept: "text/html" };
  if (userAgent) headers["user-agent"] = userAgent;
  return worker.fetch(new Request(`https://denisnadey.com${path}`, { headers }), env, ctx);
}

function headOf(html) {
  return html.slice(0, html.indexOf("</head>"));
}

test("renders the English homepage with semantic and SEO essentials", async () => {
  const response = await render("/en/");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  const html = await response.text();
  assert.match(html, /<html[^>]+lang="en"/i);
  assert.match(html, /<h1[^>]*>/i);
  assert.match(html, /Engineering Manager/i);
  assert.match(html, /<title>[^<]*Denis Nadey<\/title>/i);
  assert.match(html, /rel="canonical" href="https:\/\/denisnadey\.com\/en\/"/i);
  assert.match(html, /<link rel="alternate" href="https:\/\/denisnadey\.com\/ru\/" hreflang="ru"/i);
  assert.match(html, /hreflang="x-default"/i);
  assert.match(html, /application\/ld\+json/i);
  assert.match(html, /"@type":"WebSite"/);
  assert.match(html, /"@type":"Person"/);
  assert.match(html, /og:image" content="https:\/\/denisnadey\.com\/og-image\.jpg"/i);
  assert.match(html, /property="og:locale" content="en_US"/i);
  assert.match(html, /href="\/en\/experience\/"/i, "home must link to the experience page");
});

test("places SEO metadata inside <head> for the static export (HTML-limited bot rendering)", async () => {
  for (const path of ["/en/", "/ru/work/", "/ar/docs/"]) {
    const html = await (await render(path, botUserAgent)).text();
    // Attribute names are case-insensitive in HTML; the blocking renderer emits React's `hrefLang` spelling.
    const head = headOf(html).toLowerCase();
    for (const marker of ["<title>", '<meta name="description"', '<link rel="canonical"', 'hreflang="x-default"', '<meta property="og:image"', '<link rel="icon"', '<link rel="manifest"', 'name="theme-color"', '<meta http-equiv="content-security-policy"']) {
      assert.ok(head.includes(marker), `${path}: ${marker} must be inside <head>`);
    }
    assert.doesNotMatch(html, /id="S:0"/, `${path}: bots must receive blocking metadata, not a streamed body segment`);
  }
});

test("renders every required locale and public page with canonical links and no bare internal links", async () => {
  for (const locale of locales) {
    for (const page of pages) {
      const path = `/${locale}${page}/`;
      const response = await render(path);
      assert.equal(response.status, 200, path);
      const html = await response.text();
      assert.match(html, new RegExp(`<html[^>]+lang="${locale}"`, "i"), path);
      assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, `${path} should have one H1`);
      assert.match(html, new RegExp(`rel="canonical" href="https://denisnadey\\.com${path.replace(/\//g, "\\/")}"`), `${path} canonical must match the served URL`);
      assert.match(html, /<meta property="og:image" content="https:\/\/denisnadey\.com\/og-image\.jpg"/, `${path} must carry a share image`);
      assert.match(html, /<title>[^<]*Nadey|<title>[^<]*Надей|<title>[^<]*Надея|<title>[^<]*Надеем|<title>[^<]*ნადეი|<title>[^<]*نادي/, `${path} title must carry the brand`);
      const bare = html.match(bareInternalLink);
      assert.equal(bare, null, `${path} has an internal link without trailing slash: ${bare?.[0]}`);
      assert.equal((html.match(/<link rel="alternate" href="[^"]+" hreflang="/g) ?? []).length, locales.length + 1, `${path} must list every locale plus x-default`);
    }
  }
});

test("redirects bare locale paths to the trailing-slash form", async () => {
  const response = await render("/en");
  assert.ok([301, 302, 307, 308].includes(response.status), `expected a redirect, got ${response.status}`);
  assert.match(response.headers.get("location") ?? "", /\/en\/$/);
});

test("renders localized package documentation", async () => {
  for (const locale of locales) {
    const path = `/${locale}/docs/`;
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /full_svg_flutter/i, path);
    assert.match(html, /woff2/i, path);
    assert.match(html, /quickjs_engine/i, path);
    assert.match(html, /"@type":"BreadcrumbList"/, path);
    assert.match(html, /"@type":"SoftwareSourceCode"/, path);
  }
});

test("serves sitemap, robots, and manifest with trailing-slash URLs and hreflang alternates", async () => {
  const sitemap = await (await render("/sitemap.xml")).text();
  assert.equal((sitemap.match(/<loc>/g) ?? []).length, locales.length * pages.length);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/denisnadey\.com\/[a-z]{2}(?:\/[a-z0-9-]+)*<\/loc>/, "sitemap URLs must end with a slash");
  assert.match(sitemap, /hreflang="x-default"/);
  assert.match(sitemap, /<lastmod>2026-/);
  const robots = await (await render("/robots.txt")).text();
  assert.match(robots, /Sitemap: https:\/\/denisnadey\.com\/sitemap\.xml/);
  const manifest = JSON.parse(await (await render("/manifest.webmanifest")).text());
  assert.equal(manifest.start_url, "/en/");
  assert.ok(manifest.icons.some((icon) => icon.purpose === "maskable"));
});

test("renders the blog index with every post, a feed link, and Blog structured data", async () => {
  for (const locale of locales) {
    const path = `/${locale}/blog/`;
    const html = await (await render(path, botUserAgent)).text();
    for (const slug of postSlugs) assert.match(html, new RegExp(`href="/${locale}/blog/${slug}/"`), `${path} must link to ${slug}`);
    assert.match(headOf(html), new RegExp(`<link rel="alternate" type="application/rss\\+xml" href="https://denisnadey\\.com/${locale}/blog/feed\\.xml"`), `${path} must advertise its feed`);
    assert.match(html, /"@type":"Blog"/, path);
    assert.match(html, /"@type":"BreadcrumbList"/, path);
  }
  const home = await (await render("/en/")).text();
  assert.match(home, /href="\/en\/blog\/"/, "home must link to the blog");
});

test("renders blog posts as articles with dates, origin links, and translation links", async () => {
  for (const locale of locales) {
    for (const slug of postSlugs) {
      const path = `/${locale}/blog/${slug}/`;
      const html = await (await render(path, botUserAgent)).text();
      const head = headOf(html);
      assert.match(head, /<meta property="og:type" content="article"/, `${path} og:type`);
      assert.match(head, /<meta property="article:published_time" content="2026-/, `${path} published time`);
      assert.match(html, /"@type":"BlogPosting"/, `${path} BlogPosting`);
      assert.equal((html.match(/"@type":"ListItem"/g) ?? []).length, 3, `${path} breadcrumb must be Home → Blog → post`);
      if (linkedinPosts.includes(slug)) assert.match(html, /href="https:\/\/www\.linkedin\.com\/(?:pulse|feed\/update)\//, `${path} must link to the LinkedIn original`);
      if (locale === "en") assert.doesNotMatch(html, /"translationOfWork"/, `${path} is the original`);
      else {
        assert.match(html, new RegExp(`class="post-origin" href="/en/blog/${slug}/"`), `${path} must link to the English original`);
        assert.match(html, new RegExp(`"translationOfWork":\\{"@id":"https://denisnadey\\.com/en/blog/${slug}/"\\}`), `${path} translationOfWork`);
      }
    }
  }
  const russian = await (await render("/ru/blog/figma-motion-to-flutter/")).text();
  assert.match(russian, /FSvgPicture\.asset\(/, "code blocks must survive translation");
  assert.match(russian, /class="post-flow"/, "flow diagrams must render");
  const missing = await render("/en/blog/does-not-exist/");
  assert.equal(missing.status, 404);
});

test("serves an RSS feed per locale", async () => {
  for (const locale of locales) {
    const response = await render(`/${locale}/blog/feed.xml`);
    assert.equal(response.status, 200, `/${locale}/blog/feed.xml`);
    assert.match(response.headers.get("content-type") ?? "", /application\/rss\+xml/);
    const xml = await response.text();
    assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    assert.match(xml, new RegExp(`<language>${locale}</language>`));
    assert.equal((xml.match(/<item>/g) ?? []).length, postSlugs.length, `/${locale}/blog/feed.xml must list every post`);
  }
});

test("renders Arabic as RTL and Georgian as LTR", async () => {
  const arabic = await (await render("/ar/")).text();
  assert.match(arabic, /<html[^>]+lang="ar"[^>]+dir="rtl"/i);
  assert.match(arabic, /hreflang="ka"/i);
  const georgian = await (await render("/ka/")).text();
  assert.match(georgian, /<html[^>]+lang="ka"[^>]+dir="ltr"/i);
  assert.match(georgian, /hreflang="ar"/i);
});

test("returns a useful not-found response with links to every language", async () => {
  const response = await render("/en/does-not-exist/");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /404|does not exist/i);
  for (const locale of locales) assert.match(html, new RegExp(`href="/${locale}/"`), `404 must link to /${locale}/`);
});
