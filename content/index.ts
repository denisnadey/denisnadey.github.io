import { de } from "./de";
import { en } from "./en";
import { fr } from "./fr";
import { ru } from "./ru";
import esData from "./es.json";
import itData from "./it.json";
import plData from "./pl.json";
import ptData from "./pt.json";
import { getPositioning } from "./positioning";
import { locales, pages, type Locale, type PageSlug, type SiteCopy } from "./types";

const baseCopyByLocale: Record<Locale, SiteCopy> = {
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
  const base = baseCopyByLocale[locale];
  const position = getPositioning(locale);
  return {
    ...base,
    seo: { ...base.seo, ...position.seo },
    common: {
      ...base.common,
      role: position.role,
      finalTitle: position.finalTitle,
      finalBody: position.finalBody,
    },
    home: {
      ...base.home,
      titleLead: position.home.titleLead,
      titleEmphasis: position.home.titleEmphasis,
      intro: position.home.intro,
      proof: position.home.proof,
      mandateLabel: position.home.mandateLabel,
      mandateTitle: position.home.mandateTitle,
      mandateBody: position.home.mandateBody,
      careerTitle: position.home.careerTitle,
      careerIntro: position.home.careerIntro,
    },
    work: {
      ...base.work,
      title: position.work.title,
      intro: position.work.intro,
      cases: [...base.work.cases, position.work.webCase],
    },
    services: {
      ...base.services,
      title: position.services.title,
      intro: position.services.intro,
      items: [...position.services.additions, ...base.services.items],
    },
    about: {
      ...base.about,
      title: position.about.title,
      intro: position.about.intro,
      paragraphs: position.about.paragraphs,
    },
    contact: {
      ...base.contact,
      title: position.contact.title,
      intro: position.contact.intro,
    },
  };
}

export { locales, pages };
export type { Locale, PageSlug, SiteCopy };
export { getPositioning } from "./positioning";
