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
const pages = ["work", "open-source", "services", "experience", "about", "contact"];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(join(root, "dist/client"), output, { recursive: true });

async function request(path, accept = "text/html") {
  return worker.fetch(new Request(`https://denisnadey.com${path}`, { headers: { accept } }), env, ctx);
}

async function writeResponse(path, destination, expectedStatus = 200) {
  const response = await request(path, path.endsWith(".txt") ? "text/plain" : "*/*");
  if (response.status !== expectedStatus) {
    throw new Error(`${path} returned ${response.status}; expected ${expectedStatus}`);
  }
  const target = join(output, destination);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(await response.arrayBuffer()));
}

for (const locale of locales) {
  await writeResponse(`/${locale}`, `${locale}/index.html`);
  await writeResponse(`/${locale}/docs`, `${locale}/docs/index.html`);
  for (const page of pages) {
    await writeResponse(`/${locale}/${page}`, `${locale}/${page}/index.html`);
  }
}

await writeResponse("/robots.txt", "robots.txt");
await writeResponse("/sitemap.xml", "sitemap.xml");
await writeResponse("/manifest.webmanifest", "manifest.webmanifest");
await writeResponse("/en/does-not-exist", "404.html", 404);

await writeFile(join(output, ".nojekyll"), "");
await writeFile(
  join(output, "index.html"),
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=/en/"><link rel="canonical" href="https://denisnadey.com/en"><title>Denis Nadey</title><script>location.replace("/en/"+location.search+location.hash)</script></head><body><a href="/en/">Continue to the website</a></body></html>\n',
);

console.log(`Exported ${locales.length * (pages.length + 2)} pages to ${output}`);
