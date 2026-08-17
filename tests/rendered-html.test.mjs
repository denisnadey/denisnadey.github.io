import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };

async function render(path) {
  return worker.fetch(new Request(`https://denisnadey.com${path}`, { headers: { accept: "text/html" } }), env, ctx);
}

test("renders the English homepage with semantic and SEO essentials", async () => {
  const response = await render("/en");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  const html = await response.text();
  assert.match(html, /<html[^>]+lang="en"/i);
  assert.match(html, /<h1[^>]*>/i);
  assert.match(html, /Engineering Manager/i);
  assert.match(html, /rel="canonical"[^>]+\/en/i);
  assert.match(html, /hreflang="ru"/i);
  assert.match(html, /application\/ld\+json/i);
  assert.match(html, /og:image/i);
});

test("renders every required locale and public page", async () => {
  const locales = ["en", "ru", "de", "fr", "es", "it", "pl", "pt"];
  const pages = ["", "/work", "/open-source", "/services", "/experience", "/about", "/contact"];
  for (const locale of locales) {
    for (const page of pages) {
      const path = `/${locale}${page}`;
      const response = await render(path);
      assert.equal(response.status, 200, path);
      const html = await response.text();
      assert.match(html, new RegExp(`<html[^>]+lang="${locale}"`, "i"), path);
      assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, `${path} should have one H1`);
    }
  }
});

test("renders representative detail routes with route-specific metadata", async () => {
  for (const path of ["/en/work", "/de/open-source", "/ru/services", "/fr/contact", "/es/about", "/it/experience", "/pl/work", "/pt/contact"]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /<h1[^>]*>/i, path);
    assert.match(html, /rel="canonical"/i, path);
    assert.doesNotMatch(html, /og(?:-web-mobile-ai)?\.png/i, `${path} must not inherit the generic social image`);
  }
});

test("renders localized package documentation", async () => {
  for (const path of ["/en/docs", "/ru/docs", "/de/docs", "/fr/docs", "/es/docs", "/it/docs", "/pl/docs", "/pt/docs"]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /full_svg_flutter/i, path);
    assert.match(html, /woff2/i, path);
    assert.match(html, /quickjs_engine/i, path);
    assert.match(html, /rel="canonical"[^>]+\/docs/i, path);
  }
});

test("returns a useful not-found response", async () => {
  const response = await render("/en/does-not-exist");
  assert.equal(response.status, 404);
  assert.match(await response.text(), /404|does not exist/i);
});
