// Checks that every blog post exists in every locale and that each translation keeps the English
// structure: same blocks in the same order, identical code, the same link targets and inline code,
// and a search description that fits in a snippet. Also checks the blog UI dictionaries.
//
//   node scripts/check-blog.mjs            # every locale
//   node scripts/check-blog.mjs ru de      # selected locales
import { readdir, readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { parseBlocks, parseFrontmatter, plainText } from "../content/blog/markdown.mjs";

export const blogLocales = ["en", "ru", "de", "fr", "es", "it", "pl", "pt", "ka", "ar"];
const blogRoot = new URL("../content/blog/", import.meta.url);
const maxDescription = 160;

export async function listPostSlugs() {
  const entries = await readdir(new URL("posts/", blogRoot), { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

async function readPost(slug, locale) {
  try {
    const source = await readFile(new URL(`posts/${slug}/${locale}.md`, blogRoot), "utf8");
    const { data, body } = parseFrontmatter(source);
    return { data, blocks: parseBlocks(body) };
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function collect(nodes, type, into = []) {
  for (const node of nodes) {
    if (node.type === type) into.push(node.type === "link" ? node.href : node.value);
    if ("children" in node) collect(node.children, type, into);
  }
  return into;
}

function countStrong(nodes) {
  return nodes.reduce((total, node) => total + (node.type === "strong" ? 1 : 0) + ("children" in node ? countStrong(node.children) : 0), 0);
}

function inlineOf(block) {
  if (block.type === "paragraph" || block.type === "heading") return block.children;
  if (block.type === "list") return block.items.flat();
  if (block.type === "flow") return block.steps.flat();
  return [];
}

function describe(block) {
  if (block.type === "heading") return `h${block.level}`;
  if (block.type === "list") return `${block.ordered ? "ol" : "ul"}(${block.items.length})`;
  if (block.type === "code") return `code:${block.lang || "plain"}`;
  if (block.type === "flow") return `flow(${block.steps.length})`;
  if (block.type === "quote") return `quote(${block.children.length})`;
  if (block.type === "paragraph") return `p(${block.children.filter((node) => node.type === "break").length} br)`;
  return block.type;
}

const sameMultiset = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

function compareBlocks(source, target, where, errors, warnings) {
  const expected = source.map(describe);
  const actual = target.map(describe);
  if (expected.join(" ") !== actual.join(" ")) {
    const at = expected.findIndex((item, index) => item !== actual[index]);
    errors.push(`${where}: block structure differs at block ${at + 1}: expected ${expected[at] ?? "end"}, found ${actual[at] ?? "end"}`);
    return;
  }
  source.forEach((block, index) => {
    const other = target[index];
    const label = `${where} block ${index + 1} (${describe(block)})`;
    if (block.type === "code" && (block.value !== other.value || block.lang !== other.lang)) errors.push(`${label}: code must be copied verbatim`);
    if (block.type === "quote") compareBlocks(block.children, other.children, label, errors, warnings);
    const sourceInline = inlineOf(block);
    const targetInline = inlineOf(other);
    if (!sameMultiset(collect(sourceInline, "link"), collect(targetInline, "link"))) errors.push(`${label}: link targets differ`);
    if (!sameMultiset(collect(sourceInline, "code"), collect(targetInline, "code"))) errors.push(`${label}: inline code differs`);
    if (countStrong(sourceInline) !== countStrong(targetInline)) warnings.push(`${label}: bold emphasis count differs`);
    if (block.type === "paragraph") {
      const text = plainText(block.children).trim();
      if (text.length > 40 && text === plainText(other.children).trim()) errors.push(`${label}: paragraph is identical to English (untranslated?)`);
    }
  });
}

function keysOf(value, prefix = "") {
  return Object.entries(value).flatMap(([key, item]) => (item && typeof item === "object" ? keysOf(item, `${prefix}${key}.`) : [`${prefix}${key}`]));
}

export async function checkBlog(locales = blogLocales) {
  const errors = [];
  const warnings = [];
  const slugs = await listPostSlugs();
  if (!slugs.length) errors.push("no posts found in content/blog/posts/");
  const registry = await readFile(new URL("index.ts", blogRoot), "utf8");
  const registered = [...registry.matchAll(/\bslug: "([^"]+)"/g)].map((match) => match[1]);
  for (const slug of slugs) if (!registered.includes(slug)) errors.push(`${slug}: folder exists but the post is not registered in content/blog/index.ts`);
  for (const slug of registered) if (!slugs.includes(slug)) errors.push(`${slug}: registered in content/blog/index.ts but content/blog/posts/${slug}/ is missing`);

  for (const slug of slugs) {
    const english = await readPost(slug, "en");
    if (!english) {
      errors.push(`${slug}: missing en.md`);
      continue;
    }
    for (const locale of locales) {
      const where = `${slug}/${locale}.md`;
      const post = locale === "en" ? english : await readPost(slug, locale);
      if (!post) {
        errors.push(`${where}: missing`);
        continue;
      }
      const { title, description } = post.data;
      if (!title) errors.push(`${where}: front matter needs a title`);
      if (!description) errors.push(`${where}: front matter needs a description`);
      else if ([...description].length > maxDescription) errors.push(`${where}: description is ${[...description].length} characters; keep it at ${maxDescription} or fewer`);
      if (!post.blocks.length) errors.push(`${where}: body is empty`);
      if (locale !== "en") {
        if (title && title === english.data.title) warnings.push(`${where}: title is identical to English`);
        compareBlocks(english.blocks, post.blocks, where, errors, warnings);
      }
    }
  }

  const englishUi = JSON.parse(await readFile(new URL("ui/en.json", blogRoot), "utf8"));
  const expectedKeys = keysOf(englishUi).sort();
  for (const locale of locales) {
    let ui;
    try {
      ui = JSON.parse(await readFile(new URL(`ui/${locale}.json`, blogRoot), "utf8"));
    } catch (error) {
      errors.push(`ui/${locale}.json: ${error.code === "ENOENT" ? "missing" : error.message}`);
      continue;
    }
    const keys = keysOf(ui).sort();
    const missing = expectedKeys.filter((key) => !keys.includes(key));
    const extra = keys.filter((key) => !expectedKeys.includes(key));
    if (missing.length) errors.push(`ui/${locale}.json: missing ${missing.join(", ")}`);
    if (extra.length) errors.push(`ui/${locale}.json: unexpected ${extra.join(", ")}`);
    if (!String(ui.readingTime ?? "").includes("{minutes}")) errors.push(`ui/${locale}.json: readingTime must contain {minutes}`);
    if ([...String(ui.description ?? "")].length > maxDescription) errors.push(`ui/${locale}.json: description is longer than ${maxDescription} characters`);
  }
  return { errors, warnings, slugs };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const requested = process.argv.slice(2);
  const unknown = requested.filter((locale) => !blogLocales.includes(locale));
  if (unknown.length) {
    console.error(`Unknown locale: ${unknown.join(", ")}`);
    process.exit(2);
  }
  const { errors, warnings, slugs } = await checkBlog(requested.length ? requested : blogLocales);
  for (const warning of warnings) console.warn(`warning: ${warning}`);
  for (const error of errors) console.error(`error: ${error}`);
  console.log(`${slugs.length} posts · ${errors.length} errors · ${warnings.length} warnings`);
  process.exit(errors.length ? 1 : 0);
}
