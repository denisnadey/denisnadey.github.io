// A deliberately small Markdown dialect for blog posts. Plain JavaScript so the site renderer,
// `scripts/check-blog.mjs`, and the Node tests all share one parser.
//
// Blocks: paragraphs (a single newline is a line break, as in LinkedIn posts), `##` and `###`
// headings, `- ` and `1. ` lists, `> ` quotes, `---` rules, ``` code fences, and ```flow step
// diagrams (one step per line). Inline: `code`, **strong**, *emphasis*, and [text](target).
// Underscores never mean emphasis, so snake_case package names such as full_svg_flutter stay intact.

const fenceOpen = /^```\s*([\w-]*)\s*$/;
const fenceClose = /^```\s*$/;
const headingLine = /^(#{2,3})\s+(.+?)\s*$/;
const ruleLine = /^-{3,}\s*$/;
const bulletLine = /^[-*]\s+(.*)$/;
const orderedLine = /^\d+[.)]\s+(.*)$/;
const quoteLine = /^>\s?(.*)$/;
const escapable = /[\\`*_[\]()#>!-]/;

/** Split a `---` front matter block from the body. Values may be bare or JSON-quoted strings. */
export function parseFrontmatter(source) {
  const text = source.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  if (!text.startsWith("---\n")) return { data: {}, body: text };
  const end = text.indexOf("\n---\n", 3);
  if (end === -1) return { data: {}, body: text };
  const data = {};
  for (const line of text.slice(4, end).split("\n")) {
    const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (match) data[match[1]] = unquote(match[2].trim());
  }
  return { data, body: text.slice(end + 5) };
}

function unquote(value) {
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      return value.slice(1, -1);
    }
  }
  if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replace(/''/g, "'");
  return value;
}

export function parseBlocks(body) {
  const lines = body.replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];
  const usedIds = new Map();
  let paragraph = null;
  let list = null;
  let quote = null;

  const flush = () => {
    if (paragraph) blocks.push({ type: "paragraph", children: parseInline(paragraph.join("\n")) });
    if (list) blocks.push({ type: "list", ordered: list.ordered, items: list.items.map((item) => parseInline(item)) });
    if (quote) blocks.push({ type: "quote", children: parseBlocks(quote.join("\n")) });
    paragraph = null;
    list = null;
    quote = null;
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fence = line.match(fenceOpen);
    if (fence) {
      flush();
      const content = [];
      index += 1;
      while (index < lines.length && !fenceClose.test(lines[index])) {
        content.push(lines[index]);
        index += 1;
      }
      const lang = fence[1].toLowerCase();
      if (lang === "flow") blocks.push({ type: "flow", steps: content.map((step) => step.trim()).filter(Boolean).map((step) => parseInline(step)) });
      else blocks.push({ type: "code", lang, value: content.join("\n") });
      continue;
    }
    if (!line.trim()) {
      flush();
      continue;
    }
    const heading = line.match(headingLine);
    if (heading) {
      flush();
      const children = parseInline(heading[2]);
      const base = slugify(plainText(children));
      const seen = usedIds.get(base) ?? 0;
      usedIds.set(base, seen + 1);
      blocks.push({ type: "heading", level: heading[1].length, children, id: seen ? `${base}-${seen + 1}` : base });
      continue;
    }
    if (ruleLine.test(line)) {
      flush();
      blocks.push({ type: "rule" });
      continue;
    }
    const quoted = line.match(quoteLine);
    if (quoted) {
      if (paragraph || list) flush();
      quote = quote ?? [];
      quote.push(quoted[1]);
      continue;
    }
    const bullet = line.match(bulletLine);
    const ordered = bullet ? null : line.match(orderedLine);
    if (bullet || ordered) {
      const isOrdered = Boolean(ordered);
      if (paragraph || quote || (list && list.ordered !== isOrdered)) flush();
      list = list ?? { ordered: isOrdered, items: [] };
      list.items.push((bullet ?? ordered)[1].trim());
      continue;
    }
    if (list && /^\s{2,}\S/.test(line)) {
      list.items[list.items.length - 1] += ` ${line.trim()}`;
      continue;
    }
    if (list || quote) flush();
    paragraph = paragraph ?? [];
    paragraph.push(line.trim());
  }
  flush();
  return blocks;
}

export function parseInline(text) {
  const nodes = [];
  let buffer = "";
  const pushText = () => {
    if (buffer) nodes.push({ type: "text", value: buffer });
    buffer = "";
  };

  let index = 0;
  while (index < text.length) {
    const char = text[index];
    const next = text[index + 1];
    if (char === "\\" && next !== undefined && escapable.test(next)) {
      buffer += next;
      index += 2;
      continue;
    }
    if (char === "\n") {
      pushText();
      nodes.push({ type: "break" });
      index += 1;
      continue;
    }
    if (char === "`") {
      const end = text.indexOf("`", index + 1);
      if (end > index + 1) {
        pushText();
        nodes.push({ type: "code", value: text.slice(index + 1, end) });
        index = end + 1;
        continue;
      }
    }
    if (char === "*" && next === "*") {
      const end = findClosing(text, "**", index + 2);
      if (end > index + 2) {
        pushText();
        nodes.push({ type: "strong", children: parseInline(text.slice(index + 2, end)) });
        index = end + 2;
        continue;
      }
    }
    if (char === "*" && next !== undefined && next !== "*" && !/\s/.test(next)) {
      const end = findClosing(text, "*", index + 1);
      if (end > index + 1 && !/\s/.test(text[end - 1])) {
        pushText();
        nodes.push({ type: "em", children: parseInline(text.slice(index + 1, end)) });
        index = end + 1;
        continue;
      }
    }
    if (char === "[") {
      const close = findClosing(text, "]", index + 1);
      if (close !== -1 && text[close + 1] === "(") {
        const paren = text.indexOf(")", close + 2);
        if (paren !== -1) {
          pushText();
          nodes.push({ type: "link", href: text.slice(close + 2, paren).trim(), children: parseInline(text.slice(index + 1, close)) });
          index = paren + 1;
          continue;
        }
      }
    }
    buffer += char;
    index += 1;
  }
  pushText();
  return nodes;
}

/** Index of `marker` at or after `from`, skipping code spans and escaped characters; -1 if absent. */
function findClosing(text, marker, from) {
  for (let index = from; index < text.length; index += 1) {
    const char = text[index];
    if (char === "\\") {
      index += 1;
      continue;
    }
    if (char === "`" && marker !== "`") {
      const end = text.indexOf("`", index + 1);
      if (end !== -1) {
        index = end;
        continue;
      }
    }
    if (text.startsWith(marker, index)) {
      // A single `*` must not be half of a `**` pair.
      if (marker === "*" && (text[index + 1] === "*" || text[index - 1] === "*")) continue;
      return index;
    }
  }
  return -1;
}

export function plainText(nodes) {
  return nodes.map((node) => {
    if (node.type === "text" || node.type === "code") return node.value;
    if (node.type === "break") return "\n";
    return plainText(node.children);
  }).join("");
}

/** Prose of a document, one block per line, for word counts and search snippets. */
export function documentText(blocks) {
  return blocks.map((block) => {
    if (block.type === "paragraph" || block.type === "heading") return plainText(block.children);
    if (block.type === "list") return block.items.map((item) => plainText(item)).join("\n");
    if (block.type === "flow") return block.steps.map((step) => plainText(step)).join("\n");
    if (block.type === "quote") return documentText(block.children);
    return "";
  }).filter(Boolean).join("\n");
}

export function slugify(text) {
  return text.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "section";
}

/** Reading time in whole minutes at 220 words per minute; code blocks are not counted. */
export function readingMinutes(blocks) {
  const words = documentText(blocks).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
