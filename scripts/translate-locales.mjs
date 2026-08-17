import { writeFile } from "node:fs/promises";
import { en } from "../content/en.ts";

const targets = { es: "Español", it: "Italiano", pl: "Polski", pt: "Português" };
const protectedTerms = [
  "Denis Nadey", "BrainRocket", "CFP Technology", "CFPS", "Esh Derevenskoye", "Rosselkhozbank", "Edakratia",
  "Zinx Romania", "Betoro Denmark", "YoYo Sweden", "Swiper Ontario", "full_svg_flutter", "woff2", "Flutter", "Dart",
  "Kotlin", "Swift", "REST", "WebSockets", "Firebase", "GitLab CI/CD", "Codemagic", "Fastlane", "Sentry", "Crashlytics",
  "Clean Architecture", "BLoC", "Riverpod", "get_it", "OpenStreetMap", "QuickJS", "SVGator", "SVG", "SMIL", "CSS",
  "JavaScript", "WebView", "Android", "iOS", "macOS", "Windows", "Linux", "SvgPicture", "FSvgPicture",
  "AnimatedSvgController", "Team Lead", "Engineering Manager", "Mobile Engineering Manager", "Mobile Tech Lead",
  "Lead Flutter Engineer", "LinkedIn", "GitHub", "Telegram", "pub.dev", "MIT", "CI/CD", "KYC", "AML", "IBAN",
];

function mask(text) {
  let output = text;
  const values = [];
  for (const term of protectedTerms.sort((a, b) => b.length - a.length)) {
    if (!output.includes(term)) continue;
    const token = `ZXQ${values.length}QXZ`;
    values.push(term);
    output = output.split(term).join(token);
  }
  return { output, values };
}

function unmask(text, values) {
  return values.reduce((value, term, index) => value.split(`ZXQ${index}QXZ`).join(term), text);
}

async function translateText(text, language) {
  if (!/[A-Za-z]/.test(text) || /^https?:|^mailto:/.test(text)) return text;
  const { output, values } = mask(text);
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.search = new URLSearchParams({ client: "gtx", sl: "en", tl: language, dt: "t", q: output }).toString();
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const translated = data[0].map((part) => part[0]).join("");
      return unmask(translated, values);
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
  }
  throw new Error(`Translation failed for ${language}: ${text.slice(0, 60)}`);
}

async function translateValue(value, language) {
  if (typeof value === "string") return translateText(value, language);
  if (Array.isArray(value)) return Promise.all(value.map((item) => translateValue(item, language)));
  if (value && typeof value === "object") {
    const entries = await Promise.all(Object.entries(value).map(async ([key, item]) => [key, await translateValue(item, language)]));
    return Object.fromEntries(entries);
  }
  return value;
}

for (const [language, localeName] of Object.entries(targets)) {
  const translated = await translateValue(en, language);
  translated.localeName = localeName;
  await writeFile(new URL(`../content/${language}.json`, import.meta.url), `${JSON.stringify(translated, null, 2)}\n`);
}

