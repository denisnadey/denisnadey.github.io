/// <reference types="vite/types/importMeta.d.ts" />
import { routePath } from "../shared";
import { locales, type Locale } from "../types";
import { parseBlocks, parseFrontmatter, readingMinutes, type Block } from "./markdown.mjs";
import enUi from "./ui/en.json";

export type BlogKind = "article" | "post";
export type BlogCopy = typeof enUi;

type BlogPostMeta = {
  slug: string;
  /** ISO 8601 date or UTC date-time. LinkedIn times are decoded from the activity ID. */
  published: string;
  updated?: string;
  kind: BlogKind;
  /** Canonical LinkedIn URL when the post was first published there. */
  linkedin?: string;
  /** Topic labels shared by every locale, like the hashtags of the original posts. */
  tags: string[];
};

export type BlogPost = BlogPostMeta & {
  locale: Locale;
  title: string;
  description: string;
  blocks: Block[];
  minutes: number;
};

/** Every post is written in English first; translations live next to it as `<locale>.md`. */
export const blogSourceLocale: Locale = "en";

const postMeta: BlogPostMeta[] = [
  { slug: "full-svg-flutter-1-5", published: "2026-10-07", kind: "article", tags: ["full_svg_flutter", "Flutter DevTools", "Animated SVG", "Release notes"] },
  { slug: "quickjs-engine-0-1-6", published: "2026-10-07", kind: "article", tags: ["quickjs_engine", "Swift Package Manager", "Android", "Release notes"] },
  { slug: "my-own-corner-of-the-internet", published: "2026-09-02T20:39:16Z", kind: "post", linkedin: "https://www.linkedin.com/feed/update/urn:li:activity:7501015913970864129/", tags: ["Flutter", "Engineering leadership", "Open source"] },
  { slug: "figma-motion-flutter-shorter-pipeline", published: "2026-08-24T12:24:23Z", kind: "post", linkedin: "https://www.linkedin.com/feed/update/urn:li:activity:7497629883775500289/", tags: ["Figma Motion", "Flutter", "Animated SVG", "Motion design"] },
  { slug: "figma-motion-to-flutter", published: "2026-08-24", kind: "article", linkedin: "https://www.linkedin.com/pulse/figma-motion-flutter-already-here-denis-nadey-c8iaf/", tags: ["Figma Motion", "Flutter", "Animated SVG", "Motion design"] },
  { slug: "woff2-for-flutter", published: "2026-05-19T21:56:20Z", kind: "post", linkedin: "https://www.linkedin.com/feed/update/urn:li:activity:7462622195954143232/", tags: ["woff2", "Flutter", "Fonts"] },
  { slug: "full-svg-flutter-scripts-svgator", published: "2026-05-12T09:06:25Z", kind: "post", linkedin: "https://www.linkedin.com/feed/update/urn:li:activity:7459891724673384449/", tags: ["full_svg_flutter", "Flutter", "SVG", "Open source"] },
  { slug: "next-chapter", published: "2026-05-11T22:33:35Z", kind: "post", linkedin: "https://www.linkedin.com/feed/update/urn:li:activity:7459732467017564161/", tags: ["Flutter", "Mobile Tech Lead", "Open to work"] },
];

const sources = import.meta.glob("./posts/*/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const uiSources = import.meta.glob("./ui/*.json", { import: "default", eager: true }) as Record<string, BlogCopy>;

// Sources are bundled and immutable, so each post is parsed once per locale.
const parsed = new Map<string, BlogPost | undefined>();

function readSource(slug: string, locale: Locale): BlogPost | undefined {
  const key = `./posts/${slug}/${locale}.md`;
  if (parsed.has(key)) return parsed.get(key);
  const source = sources[key];
  const meta = postMeta.find((item) => item.slug === slug);
  let post: BlogPost | undefined;
  if (source !== undefined && meta) {
    const { data, body } = parseFrontmatter(source);
    const blocks = parseBlocks(body);
    post = { ...meta, locale, title: data.title ?? slug, description: data.description ?? "", blocks, minutes: readingMinutes(blocks) };
  }
  parsed.set(key, post);
  return post;
}

/** Milliseconds for a date-only or date-time value; date-only values are midnight UTC. */
export const postTimestamp = (value: string) => Date.parse(value.length === 10 ? `${value}T00:00:00Z` : value);

/** Posts available in a locale, newest first. */
export function getPosts(locale: Locale): BlogPost[] {
  return postMeta
    .map((meta) => readSource(meta.slug, locale))
    .filter((post): post is BlogPost => Boolean(post))
    .sort((a, b) => postTimestamp(b.published) - postTimestamp(a.published));
}

export function getPost(locale: Locale, slug: string): BlogPost | undefined {
  return readSource(slug, locale);
}

/** Locales that have a translation of the post, in site order. */
export function postLocales(slug: string): Locale[] {
  return locales.filter((locale) => sources[`./posts/${slug}/${locale}.md`] !== undefined);
}

export function blogParams(): Array<{ locale: Locale; slug: string }> {
  return locales.flatMap((locale) => getPosts(locale).map((post) => ({ locale, slug: post.slug })));
}

export function blogPath(locale: Locale, slug?: string): string {
  return routePath(locale, slug ? `blog/${slug}` : "blog");
}

export function feedPath(locale: Locale): string {
  return `/${locale}/blog/feed.xml`;
}

export function getBlogCopy(locale: Locale): BlogCopy {
  return uiSources[`./ui/${locale}.json`] ?? enUi;
}

/** Publication date in the reader's language. UTC keeps the build output independent of the machine's time zone. */
export function formatPostDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(postTimestamp(value));
}

export function readingTime(copy: BlogCopy, minutes: number): string {
  return copy.readingTime.replace("{minutes}", String(minutes));
}
