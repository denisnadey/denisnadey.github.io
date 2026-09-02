export const siteUrl = "https://denisnadey.com";
export const siteName = "Denis Nadey";

export const links = {
  email: "mailto:denis.nadey@gmail.com",
  linkedin: "https://www.linkedin.com/in/denisnadey/",
  github: "https://github.com/denisnadey",
  repository: "https://github.com/denisnadey/flutter_full_svg_support",
  pub: "https://pub.dev/packages/full_svg_flutter",
  woff2: "https://pub.dev/packages/woff2",
  quickjs: "https://pub.dev/packages/quickjs_engine",
  telegram: "https://t.me/denisdandy",
  medium: "https://medium.com/@denis.nadey",
  article: "https://medium.com/@denis.nadey/the-problem-flutter-svg-support-is-usually-static-e91457cecc7f",
  cv: "/Denis_Nadey_Engineering_Manager_CV_2026.pdf",
} as const;

/** Every public route ends with a trailing slash: GitHub Pages serves `/en/`, and `/en` is a 301 to it. */
export function routePath(locale: string, page?: string): string {
  return page ? `/${locale}/${page}/` : `/${locale}/`;
}

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path}`;
}

const personNameForms = /nadey|надей|надея|надеем|ნადეი|نادي/i;

/** Append the brand to a page title unless the title already contains the name in any script. */
export function brandTitle(title: string): string {
  return personNameForms.test(title) ? title : `${title} · ${siteName}`;
}

export const ogLocales: Record<string, string> = {
  en: "en_US",
  ru: "ru_RU",
  de: "de_DE",
  fr: "fr_FR",
  es: "es_ES",
  it: "it_IT",
  pl: "pl_PL",
  pt: "pt_BR",
  ka: "ka_GE",
  ar: "ar_AR",
};

export const ogImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Denis Nadey — Engineering Manager and hands-on web, mobile, and AI product engineer",
} as const;

export const personSameAs = [links.linkedin, links.github, links.medium, links.telegram, links.pub, links.woff2, links.quickjs];
