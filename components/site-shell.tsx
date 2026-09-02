import { getCopy, locales, type Locale, type PageSlug } from "@/content";
import { getDocsCopy } from "@/content/docs";
import { getPositioning } from "@/content/positioning";
import { links, routePath, siteName } from "@/content/shared";
import { ThemeToggle } from "./theme-toggle";

type HeaderPage = PageSlug | "home" | "docs";
const navPages: Array<PageSlug | "docs"> = ["work", "services", "open-source", "docs", "experience", "about"];

export function ExternalLink({ href, children, className, label }: { href: string; children: React.ReactNode; className?: string; label?: string }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}<span className="sr-only"> ({label ?? getCopy("en").common.external})</span></a>;
}

export function SiteHeader({ locale, page = "home" }: { locale: Locale; page?: HeaderPage }) {
  const copy = getCopy(locale);
  const docs = getDocsCopy(locale);
  const position = getPositioning(locale);
  const label = (slug: PageSlug | "docs" | "home") => (slug === "docs" ? docs.navLabel : copy.nav[slug]);
  return (
    <header className="site-header">
      <a className="wordmark" href={routePath(locale)}>DN<span>—26</span><span className="sr-only"> · {siteName} · {copy.nav.home}</span></a>
      <nav className="desktop-nav" aria-label={copy.common.menu}>
        {navPages.map((slug) => <a key={slug} href={routePath(locale, slug)} aria-current={page === slug ? "page" : undefined}>{label(slug)}</a>)}
      </nav>
      <div className="header-actions">
        <ThemeToggle toDark={position.themeToDark} toLight={position.themeToLight} />
        <details className="language-menu">
          <summary><span className="sr-only">{copy.common.language}: </span>{locale.toUpperCase()}</summary>
          <div className="language-panel">
            {locales.map((candidate) => <a key={candidate} href={routePath(candidate, page === "home" ? undefined : page)} hrefLang={candidate} lang={candidate} aria-current={candidate === locale ? "page" : undefined}>{getCopy(candidate).localeName}</a>)}
          </div>
        </details>
        <a className="header-contact" href={routePath(locale, "contact")}>{copy.common.contactDenis}<span aria-hidden="true">↗</span></a>
        <details className="mobile-menu">
          <summary>{copy.common.menu}</summary>
          <nav aria-label={copy.common.menu}>
            {(["home", ...navPages, "contact"] as HeaderPage[]).map((slug) => {
              const href = slug === "home" ? routePath(locale) : routePath(locale, slug);
              return <a key={slug} href={href} aria-current={page === slug ? "page" : undefined}>{label(slug)}</a>;
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
  return (
    <footer className="site-footer">
      <div><span className="wordmark">DN<span>—26</span></span><p>{siteName}<br />{copy.common.role}<br />{copy.common.location}</p></div>
      <nav aria-label={copy.common.menu}>
        <a href={routePath(locale, "work")}>{copy.nav.work}</a>
        <a href={routePath(locale, "services")}>{copy.nav.services}</a>
        <a href={routePath(locale, "open-source")}>{copy.nav["open-source"]}</a>
        <a href={routePath(locale, "docs")}>{docs.navLabel}</a>
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

export function PageIntro({ label, title, intro }: { label: string; title: string; intro: string }) {
  return <section className="page-intro"><p className="section-label">{label}</p><h1>{title}</h1><p className="page-lede">{intro}</p></section>;
}
