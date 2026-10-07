import { getCopy, locales, type Locale, type PageSlug } from "@/content";
import { getBlogCopy } from "@/content/blog";
import { getDocsCopy } from "@/content/docs";
import { getPositioning } from "@/content/positioning";
import { links, routePath, siteName } from "@/content/shared";
import { ThemeToggle } from "./theme-toggle";

type NavSlug = PageSlug | "docs" | "blog";
type HeaderPage = NavSlug | "home" | `blog/${string}`;
const navPages: NavSlug[] = ["work", "services", "open-source", "docs", "blog", "experience", "about"];

export function ExternalLink({ href, children, className, label }: { href: string; children: React.ReactNode; className?: string; label?: string }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}<span className="sr-only"> ({label ?? getCopy("en").common.external})</span></a>;
}

/** `available` lists the locales that have this page; the language menu sends the others to their blog index. */
export function SiteHeader({ locale, page = "home", available = locales }: { locale: Locale; page?: HeaderPage; available?: readonly Locale[] }) {
  const copy = getCopy(locale);
  const docs = getDocsCopy(locale);
  const blog = getBlogCopy(locale);
  const position = getPositioning(locale);
  const label = (slug: NavSlug | "home") => (slug === "docs" ? docs.navLabel : slug === "blog" ? blog.navLabel : copy.nav[slug]);
  // A blog post is inside the Blog section, but only the index is the current page.
  const current = (slug: NavSlug | "home") => (page === slug ? "page" : slug === "blog" && page.startsWith("blog/") ? "true" : undefined);
  const translationHref = (candidate: Locale) => (page === "home" ? routePath(candidate) : available.includes(candidate) ? routePath(candidate, page) : routePath(candidate, "blog"));
  return (
    <header className="site-header">
      <a className="wordmark" href={routePath(locale)}>DN<span>—26</span><span className="sr-only"> · {siteName} · {copy.nav.home}</span></a>
      <nav className="desktop-nav" aria-label={copy.common.menu}>
        {navPages.map((slug) => <a key={slug} href={routePath(locale, slug)} aria-current={current(slug)}>{label(slug)}</a>)}
      </nav>
      <div className="header-actions">
        <ThemeToggle toDark={position.themeToDark} toLight={position.themeToLight} />
        <details className="language-menu">
          <summary><span className="sr-only">{copy.common.language}: </span>{locale.toUpperCase()}</summary>
          <div className="language-panel">
            {locales.map((candidate) => <a key={candidate} href={translationHref(candidate)} hrefLang={candidate} lang={candidate} aria-current={candidate === locale ? "page" : undefined}>{getCopy(candidate).localeName}</a>)}
          </div>
        </details>
        <a className="header-contact" href={routePath(locale, "contact")}>{copy.common.contactDenis}<span aria-hidden="true">↗</span></a>
        <details className="mobile-menu">
          <summary>{copy.common.menu}</summary>
          <nav aria-label={copy.common.menu}>
            {(["home", ...navPages, "contact"] as Array<NavSlug | "home">).map((slug) => {
              const href = slug === "home" ? routePath(locale) : routePath(locale, slug);
              return <a key={slug} href={href} aria-current={current(slug)}>{label(slug)}</a>;
            })}
          </nav>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);
  const docs = getDocsCopy(locale);
  const blog = getBlogCopy(locale);
  return (
    <footer className="site-footer">
      <div><span className="wordmark">DN<span>—26</span></span><p>{siteName}<br />{copy.common.role}<br />{copy.common.location}</p></div>
      <nav aria-label={copy.common.menu}>
        <a href={routePath(locale, "work")}>{copy.nav.work}</a>
        <a href={routePath(locale, "services")}>{copy.nav.services}</a>
        <a href={routePath(locale, "open-source")}>{copy.nav["open-source"]}</a>
        <a href={routePath(locale, "docs")}>{docs.navLabel}</a>
        <a href={routePath(locale, "blog")}>{blog.navLabel}</a>
        <a href={routePath(locale, "experience")}>{copy.nav.experience}</a>
        <a href={routePath(locale, "about")}>{copy.nav.about}</a>
        <a href={routePath(locale, "contact")}>{copy.nav.contact}</a>
      </nav>
      <div className="footer-links">
        <a href={links.email}>Email</a>
        <ExternalLink href={links.linkedin} label={copy.common.external}>LinkedIn</ExternalLink>
        <ExternalLink href={links.github} label={copy.common.external}>GitHub</ExternalLink>
        <ExternalLink href={links.telegram} label={copy.common.external}>Telegram</ExternalLink>
      </div>
      <p className="copyright">© 2026 {siteName}</p>
    </footer>
  );
}

export function FinalCta({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);
  return (
    <section className="final-cta">
      <p className="section-label">{copy.nav.contact}</p>
      <h2>{copy.common.finalTitle}</h2>
      <div><p>{copy.common.finalBody}</p><a className="button primary" href={routePath(locale, "contact")}>{copy.common.discuss}<span aria-hidden="true">↗</span></a></div>
    </section>
  );
}

export function PageIntro({ label, title, intro, className }: { label: string; title: string; intro: string; className?: string }) {
  return <section className={className ? `page-intro ${className}` : "page-intro"}><p className="section-label">{label}</p><h1>{title}</h1><p className="page-lede">{intro}</p></section>;
}
