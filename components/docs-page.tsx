import { getDocsCopy } from "@/content/docs";
import { getCopy, type Locale } from "@/content";
import { ExternalLink, FinalCta, PageIntro } from "./site-shell";

export function DocsPage({ locale }: { locale: Locale }) {
  const docs = getDocsCopy(locale);
  const external = getCopy(locale).common.external;
  return <>
    <PageIntro label={docs.navLabel} title={docs.title} intro={docs.intro} />
    <nav className="docs-index" aria-label={docs.navLabel}>
      <p className="section-label">{docs.snapshot}</p>
      <div>{docs.packages.map((pkg, index) => <a href={`#${pkg.slug}`} key={pkg.slug}><span>0{index + 1}</span><strong>{pkg.name}</strong><small>v{pkg.version}</small><b aria-hidden="true">↓</b></a>)}</div>
    </nav>
    <div className="docs-stack">
      {docs.packages.map((pkg, index) => <article className="package-doc" id={pkg.slug} key={pkg.slug}>
        <header className="package-doc-header">
          <div><p className="section-label">0{index + 1} · Flutter package</p><h2>{pkg.name}</h2><p>{pkg.tagline}</p></div>
          <dl className="package-meta"><div><dt>Version</dt><dd>{pkg.version}</dd></div><div><dt>Pub points</dt><dd>{pkg.pubPoints}</dd></div><div><dt>License</dt><dd>{pkg.license}</dd></div></dl>
        </header>
        <section className="doc-problem"><p className="section-label">{docs.labels.problem}</p><p>{pkg.problem}</p></section>
        <div className="doc-code-grid">
          <section><p className="section-label">{docs.labels.install}</p><pre><code>{pkg.install}</code></pre></section>
          <section><p className="section-label">{docs.labels.quickStart}</p><pre><code>{pkg.quickStart}</code></pre></section>
        </div>
        <div className="doc-detail-grid">
          <section><p className="section-label">{docs.labels.capabilities}</p><ul className="doc-checklist">{pkg.capabilities.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><p className="section-label">{docs.labels.architecture}</p><p>{pkg.architecture}</p><p className="section-label doc-subhead">{docs.labels.useWhen}</p><ul>{pkg.useCases.map((item) => <li key={item}>{item}</li>)}</ul></section>
        </div>
        <section className="api-map"><p className="section-label">{docs.labels.api}</p><dl>{pkg.api.map((symbol, apiIndex) => <div key={symbol}><dt><code>{symbol}</code></dt><dd>{pkg.apiDescriptions[apiIndex]}</dd></div>)}</dl></section>
        <section className="doc-limits"><p className="section-label">{docs.labels.limits}</p><ul>{pkg.limits.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <footer className="doc-actions"><ExternalLink label={external} className="button primary" href={pkg.pubUrl}>{docs.labels.pub}<span aria-hidden="true">↗</span></ExternalLink><ExternalLink label={external} className="button line" href={pkg.sourceUrl}>{docs.labels.source}<span aria-hidden="true">↗</span></ExternalLink></footer>
      </article>)}
    </div>
    <FinalCta locale={locale} />
  </>;
}
