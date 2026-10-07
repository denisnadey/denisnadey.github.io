import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "out");
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("static-export", `${Date.now()}`);

const { default: worker } = await import(workerUrl.href);
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const locales = ["en", "ru", "de", "fr", "es", "it", "pl", "pt", "ka", "ar"];
const siteUrl = "https://denisnadey.com";

// vinext streams metadata into <body> for browsers and renders it blocking inside <head> for HTML-limited bots.
// The static export must carry the <head> variant, because that is what search engines and link previews read.
const exportUserAgent = "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) denisnadey-static-export";

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(join(root, "dist/client"), output, { recursive: true });

async function request(path, accept = "text/html") {
  return worker.fetch(new Request(`${siteUrl}${path}`, { headers: { accept, "user-agent": exportUserAgent } }), env, ctx);
}

function assertHeadMetadata(path, source) {
  const html = source.toLowerCase();
  const headEnd = html.indexOf("</head>");
  const required = ['<link rel="canonical"', '<meta name="description"', 'hreflang="x-default"', '<meta property="og:image"', '<link rel="icon"'];
  for (const marker of required) {
    const at = html.indexOf(marker);
    if (at === -1 || at > headEnd) throw new Error(`${path}: ${marker} is missing from <head>; static export would ship metadata search engines ignore`);
  }
  const bareLink = html.match(/href="\/[a-z]{2}(?:\/[a-z0-9-]+)*"/);
  if (bareLink) throw new Error(`${path}: internal link without trailing slash: ${bareLink[0]}`);
}

async function writeResponse(path, destination, expectedStatus = 200) {
  const response = await request(path, path.endsWith(".txt") ? "text/plain" : "*/*");
  if (response.status !== expectedStatus) {
    throw new Error(`${path} returned ${response.status}; expected ${expectedStatus}`);
  }
  const body = Buffer.from(await response.arrayBuffer());
  if (expectedStatus === 200 && destination.endsWith(".html")) assertHeadMetadata(path, body.toString("utf8"));
  const target = join(output, destination);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, body);
}

// The sitemap is the list of public pages, so every page it advertises is exported and nothing else.
const sitemap = await (await request("/sitemap.xml", "*/*")).text();
const pagePaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
if (!pagePaths.length) throw new Error("sitemap.xml lists no pages");
for (const path of pagePaths) {
  if (!path.endsWith("/")) throw new Error(`${path}: sitemap URL without a trailing slash`);
  await writeResponse(path, `${path.slice(1)}index.html`);
}
for (const locale of locales) await writeResponse(`/${locale}/blog/feed.xml`, `${locale}/blog/feed.xml`);

await writeResponse("/robots.txt", "robots.txt");
await writeResponse("/sitemap.xml", "sitemap.xml");
await writeResponse("/manifest.webmanifest", "manifest.webmanifest");
await writeResponse("/en/does-not-exist/", "404.html", 404);

await writeFile(join(output, ".nojekyll"), "");
await writeFile(
  join(output, "index.html"),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=/en/"><meta name="description" content="Denis Nadey — Engineering Manager and hands-on web, mobile, and AI product engineer. Continue to the English site or pick another language."><link rel="canonical" href="${siteUrl}/en/"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><title>Denis Nadey</title><script>location.replace("/en/"+location.search+location.hash)</script></head><body><p><a href="/en/">Continue to the website</a></p><p>${locales.map((locale) => `<a href="/${locale}/" hreflang="${locale}">${locale}</a>`).join(" · ")}</p></body></html>\n`,
);

console.log(`Exported ${pagePaths.length} pages and ${locales.length} feeds to ${output}`);
