import { getCopy, locales, type Locale, type PageSlug } from "@/content";
import { links } from "@/content/shared";

const navPages: PageSlug[] = ["work", "open-source", "services", "experience", "about"];

export function ExternalLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}<span className="sr-only"> ({getCopy("en").common.external})</span></a>;
}

export function SiteHeader({ locale, page = "home" }: { locale: Locale; page?: PageSlug | "home" }) {
  const copy = getCopy(locale);
  const suffix = page === "home" ? "" : `/${page}`;
  return (
    <header className="site-header">
      <a className="wordmark" href={`/${locale}`} aria-label={`Denis Nadey — ${copy.nav.home}`}>DN<span>—26</span></a>
      <nav className="desktop-nav" aria-label={copy.common.menu}>
        {navPages.map((slug) => <a key={slug} href={`/${locale}/${slug}`} aria-current={page === slug ? "page" : undefined}>{copy.nav[slug]}</a>)}
      </nav>
      <div className="header-actions">
        <details className="language-menu">
          <summary aria-label={copy.common.language}>{locale.toUpperCase()}</summary>
          <div className="language-panel">
            {locales.map((candidate) => <a key={candidate} href={`/${candidate}${suffix}`} hrefLang={candidate} aria-current={candidate === locale ? "page" : undefined}>{getCopy(candidate).localeName}</a>)}
          </div>
        </details>
        <a className="header-contact" href={`/${locale}/contact`}>{copy.common.contactDenis}<span aria-hidden="true">↗</span></a>
        <details className="mobile-menu">
          <summary>{copy.common.menu}</summary>
          <nav aria-label={copy.common.menu}>
            {["home", ...navPages, "contact"].map((slug) => {
              const href = slug === "home" ? `/${locale}` : `/${locale}/${slug}`;
              return <a key={slug} href={href} aria-current={page === slug ? "page" : undefined}>{copy.nav[slug as PageSlug | "home"]}</a>;
            })}
          </nav>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);
  return (
    <footer className="site-footer">
      <div><span className="wordmark">DN<span>—26</span></span><p>{copy.common.role}<br />{copy.common.location}</p></div>
      <nav aria-label={copy.common.menu}>
        <a href={`/${locale}/work`}>{copy.nav.work}</a>
        <a href={`/${locale}/services`}>{copy.nav.services}</a>
        <a href={`/${locale}/open-source`}>{copy.nav["open-source"]}</a>
        <a href={`/${locale}/contact`}>{copy.nav.contact}</a>
      </nav>
      <div className="footer-links">
        <a href={links.email}>Email</a>
        <ExternalLink href={links.linkedin}>LinkedIn</ExternalLink>
        <ExternalLink href={links.github}>GitHub</ExternalLink>
        <ExternalLink href={links.telegram}>Telegram</ExternalLink>
      </div>
      <p className="copyright">© 2026 Denis Nadey</p>
    </footer>
  );
}

export function FinalCta({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);
  return (
    <section className="final-cta">
      <p className="section-label">{copy.nav.contact}</p>
      <h2>{copy.common.finalTitle}</h2>
      <div><p>{copy.common.finalBody}</p><a className="button primary" href={`/${locale}/contact`}>{copy.common.discuss}<span aria-hidden="true">↗</span></a></div>
    </section>
  );
}

export function PageIntro({ label, title, intro }: { label: string; title: string; intro: string }) {
  return <section className="page-intro"><p className="section-label">{label}</p><h1>{title}</h1><p className="page-lede">{intro}</p></section>;
}
