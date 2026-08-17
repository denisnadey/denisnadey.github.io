import { de } from "./de";
import { en } from "./en";
import { fr } from "./fr";
import { ru } from "./ru";
import esData from "./es.json";
import itData from "./it.json";
import plData from "./pl.json";
import ptData from "./pt.json";
import { locales, pages, type Locale, type PageSlug, type SiteCopy } from "./types";

const copyByLocale: Record<Locale, SiteCopy> = {
  en,
  ru,
  de,
  fr,
  es: esData as SiteCopy,
  it: itData as SiteCopy,
  pl: plData as SiteCopy,
  pt: ptData as SiteCopy,
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isPage(value: string): value is PageSlug {
  return (pages as readonly string[]).includes(value);
}

export function getCopy(locale: Locale): SiteCopy {
  return copyByLocale[locale];
}

export { locales, pages };
export type { Locale, PageSlug, SiteCopy };
