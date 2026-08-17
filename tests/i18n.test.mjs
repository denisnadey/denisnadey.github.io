import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const locales = ["es", "it", "pl", "pt"];

test("locale dictionaries contain every public content group", async () => {
  for (const locale of locales) {
    const data = JSON.parse(await readFile(new URL(`../content/${locale}.json`, import.meta.url), "utf8"));
    for (const key of ["seo", "nav", "common", "home", "work", "openSource", "services", "experience", "about", "contact"]) {
      assert.ok(data[key], `${locale} missing ${key}`);
    }
    assert.equal(data.work.cases.length, 4);
    assert.equal(data.services.items.length, 6);
    assert.equal(data.experience.roles.length, 6);
    assert.ok(data.seo.home.title && data.seo.contact.description);
  }
});

