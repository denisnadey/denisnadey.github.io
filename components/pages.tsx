import Image from "next/image";
import { getCopy, type Locale, type PageSlug } from "@/content";
import { getDocsCopy } from "@/content/docs";
import { getPositioning } from "@/content/positioning";
import { links, routePath } from "@/content/shared";
import { ContactForm } from "./contact-form";
import { ExternalLink, FinalCta, PageIntro } from "./site-shell";

export function HomePage({ locale }: { locale: Locale }) {
  const c = getCopy(locale);
  const position = getPositioning(locale);
  return <>
    <section className="hero">
      <div className="hero-kicker"><span>{c.common.role}</span><span>{c.common.location} · {c.common.availability}</span></div>
      <h1>{c.home.titleLead}<em>{c.home.titleEmphasis}</em></h1>
      <div className="hero-bottom"><p>{c.home.intro}</p><div className="hero-actions"><a className="button primary" href={routePath(locale, "contact")}>{c.common.discuss}<span aria-hidden="true">↗</span></a><a className="button line" href={routePath(locale, "work")}>{c.common.exploreWork}<span aria-hidden="true">→</span></a><a className="button line" href={links.cv} download>{c.common.downloadCv}<span aria-hidden="true">↓</span></a></div></div>
    </section>
    <section className="proof-section"><p className="section-label">{c.common.selectedEvidence}</p><div className="proof-grid">{c.home.proof.map((item) => <article key={item.label}><strong>{item.value}</strong><span>{item.label}</span></article>)}</div></section>
    <section className="statement-section"><p className="section-label">{c.home.mandateLabel}</p><h2>{c.home.mandateTitle}</h2><p>{c.home.mandateBody}</p></section>
    <section className="capability-section"><div className="section-heading"><p className="section-label">{position.home.capabilityLabel}</p><h2>{position.home.capabilityTitle}</h2></div><div className="capability-grid">{position.home.capabilities.map((item) => <article key={item.code}><span>{item.code}</span><h3>{item.title}</h3><p>{item.body}</p><small>{item.evidence}</small></article>)}</div></section>
    <section className="home-work" id="work"><div className="section-heading"><p className="section-label">{c.home.workLabel}</p><h2>{c.home.workTitle}</h2><p>{c.home.workIntro}</p></div><div className="work-list">{c.work.cases.slice(0, 3).map((item, index) => <a href={`${routePath(locale, "work")}#case-${index + 1}`} key={item.title}><span>{item.label}</span><h3>{item.title}</h3><p>{item.summary}</p><b aria-hidden="true">↗</b></a>)}</div><a className="text-link" href={routePath(locale, "work")}>{c.common.exploreWork}<span aria-hidden="true">→</span></a></section>
    <section className="split-feature" id="services"><div><p className="section-label">{c.home.servicesLabel}</p><h2>{c.home.servicesTitle}</h2></div><div><p>{c.home.servicesIntro}</p><ul>{c.services.items.slice(0, 4).map((item) => <li key={item.title}>{item.title}</li>)}</ul><a className="button line" href={routePath(locale, "services")}>{c.common.viewServices}<span aria-hidden="true">→</span></a></div></section>
    <section className="open-feature" id="open-source"><div className="open-mark"><span>SVG</span><i>+</i><span>WOFF2</span><i>+</i><span>JS</span></div><div><p className="section-label">{c.home.openLabel}</p><h2>{c.home.openTitle}</h2><p>{c.home.openIntro}</p><div className="inline-actions"><a className="button primary" href={routePath(locale, "docs")}>{position.docsCta}<span aria-hidden="true">→</span></a><a className="button line" href={routePath(locale, "open-source")}>{c.common.viewOpenSource}<span aria-hidden="true">→</span></a></div></div></section>
    <section className="career-preview"><div><p className="section-label">{c.home.careerLabel}</p><h2>{c.home.careerTitle}</h2><p>{c.home.careerIntro}</p><a className="text-link" href={routePath(locale, "experience")}>{c.common.viewExperience}<span aria-hidden="true">→</span></a></div><ol>{c.experience.roles.slice(0, 4).map((role) => <li key={role.period}><span>{role.period}</span><strong>{role.title}</strong><small>{role.company}</small></li>)}</ol></section>
    <section className="principles"><div><p className="section-label">{c.home.principlesLabel}</p><h2>{c.home.principlesTitle}</h2></div><ol>{c.home.principles.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></section>
    <FinalCta locale={locale} />
  </>;
}

export function DetailPage({ locale, page }: { locale: Locale; page: PageSlug }) {
  if (page === "work") return <WorkPage locale={locale} />;
  if (page === "open-source") return <OpenSourcePage locale={locale} />;
  if (page === "services") return <ServicesPage locale={locale} />;
  if (page === "experience") return <ExperiencePage locale={locale} />;
  if (page === "about") return <AboutPage locale={locale} />;
  return <ContactPage locale={locale} />;
}

function WorkPage({ locale }: { locale: Locale }) {
  const c = getCopy(locale);
  return <><PageIntro label={c.nav.work} title={c.work.title} intro={c.work.intro} /><p className="nda-note">{c.work.nda}</p><div className="case-list">{c.work.cases.map((item, index) => <article id={`case-${index + 1}`} key={item.title} className="case-study"><header><p className="section-label">{item.label}</p><h2>{item.title}</h2><p>{item.summary}</p></header><dl><Fact label={c.work.labels.context} value={item.context} /><Fact label={c.work.labels.responsibility} value={item.responsibility} /><Fact label={c.work.labels.approach} value={item.approach} /><Fact label={c.work.labels.outcome} value={item.outcome} /><Fact label={c.work.labels.stack} value={item.stack} /></dl></article>)}</div><FinalCta locale={locale} /></>;
}

function OpenSourcePage({ locale }: { locale: Locale }) {
  const c = getCopy(locale);
  const docs = getDocsCopy(locale);
  return <><PageIntro label={c.nav["open-source"]} title={c.openSource.title} intro={c.openSource.intro} /><section className="package-proof"><p className="section-label">{c.openSource.versionLabel}</p><div className="proof-grid proof-four">{c.openSource.proof.map((item) => <article key={item.label}><strong>{item.value}</strong><span>{item.label}</span></article>)}</div><div className="inline-actions"><ExternalLink label={c.common.external} className="button primary" href={links.pub}>{c.common.visitPub}<span aria-hidden="true">↗</span></ExternalLink><ExternalLink label={c.common.external} className="button line" href={links.repository}>{c.common.visitGithub}<span aria-hidden="true">↗</span></ExternalLink></div></section><section className="problem-solution"><article><p className="section-label">01 · Problem</p><h2>{c.openSource.problemTitle}</h2><p>{c.openSource.problemBody}</p></article><article><p className="section-label">02 · Engine</p><h2>{c.openSource.engineTitle}</h2><p>{c.openSource.engineBody}</p></article></section><section className="coverage"><div><p className="section-label">03 · Runtime</p><h2>{c.openSource.coverageTitle}</h2></div><ul>{c.openSource.coverage.map((item) => <li key={item}>{item}</li>)}</ul></section><section className="svg-demo"><div className="demo-canvas"><Image src="/flutter-logo-animated.svg" width={340} height={340} loading="lazy" alt="Animated Flutter logo built from one SVG file" unoptimized /></div><div><p className="section-label">04 · Demo</p><h2>{c.openSource.demoTitle}</h2><p>{c.openSource.demoBody}</p><h3>{c.openSource.migrationTitle}</h3><p>{c.openSource.migrationBody}</p></div></section><section className="package-ecosystem"><div className="section-heading"><p className="section-label">05 · Runtime stack</p><h2>{docs.title}</h2></div><div>{docs.packages.map((pkg) => <a href={`${routePath(locale, "docs")}#${pkg.slug}`} key={pkg.slug}><span>v{pkg.version}</span><h3>{pkg.name}</h3><p>{pkg.tagline}</p><b aria-hidden="true">→</b></a>)}</div></section><section className="article-card"><p className="section-label">{c.openSource.writingTitle}</p><h2>{c.openSource.articleTitle}</h2><p>{c.openSource.articleDescription}</p><ExternalLink label={c.common.external} className="button line" href={links.article}>{c.common.readArticle}<span aria-hidden="true">↗</span></ExternalLink></section><FinalCta locale={locale} /></>;
}

function ServicesPage({ locale }: { locale: Locale }) {
  const c = getCopy(locale);
  return <><PageIntro label={c.nav.services} title={c.services.title} intro={c.services.intro} /><div className="service-list">{c.services.items.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h2>{item.title}</h2><dl><Fact label={c.services.labels.signal} value={item.signal} /><Fact label={c.services.labels.action} value={item.action} /><Fact label={c.services.labels.format} value={item.format} /></dl></article>)}</div><section className="boundary"><h2>{c.services.boundaryTitle}</h2><p>{c.services.boundaryBody}</p></section><FinalCta locale={locale} /></>;
}

function ExperiencePage({ locale }: { locale: Locale }) {
  const c = getCopy(locale);
  return <><PageIntro label={c.nav.experience} title={c.experience.title} intro={c.experience.intro} /><div className="timeline">{c.experience.roles.map((role, index) => <article key={role.period}><div><span>0{index + 1}</span><time>{role.period}</time></div><div><p>{role.company}</p><h2>{role.title}</h2><p>{role.summary}</p><strong>{role.evidence}</strong></div></article>)}</div><section className="education-grid"><article><p className="section-label">{c.experience.educationTitle}</p><p>{c.experience.educationBody}</p></article><article><p className="section-label">{c.experience.languagesTitle}</p><p>{c.experience.languagesBody}</p></article></section><FinalCta locale={locale} /></>;
}

function AboutPage({ locale }: { locale: Locale }) {
  const c = getCopy(locale);
  return <><PageIntro label={c.nav.about} title={c.about.title} intro={c.about.intro} /><section className="about-copy"><div>{c.about.paragraphs.map((p) => <p key={p}>{p}</p>)}</div><aside><p className="section-label">{c.about.nowTitle}</p><p>{c.about.nowBody}</p><a className="button line" href={links.cv} download>{c.common.downloadCv}<span aria-hidden="true">↓</span></a></aside></section><section className="useful-list"><h2>{c.about.usefulTitle}</h2><ul>{c.about.usefulItems.map((item) => <li key={item}>{item}</li>)}</ul></section><FinalCta locale={locale} /></>;
}

function ContactPage({ locale }: { locale: Locale }) {
  const c = getCopy(locale);
  return <><PageIntro label={c.nav.contact} title={c.contact.title} intro={c.contact.intro} /><section className="contact-layout"><aside><p className="section-label">{c.contact.directTitle}</p><a className="email-link" href={links.email}>denis.nadey@gmail.com</a><p>{c.contact.response}</p><div className="social-stack"><ExternalLink label={c.common.external} href={links.linkedin}>LinkedIn ↗</ExternalLink><ExternalLink label={c.common.external} href={links.github}>GitHub ↗</ExternalLink><ExternalLink label={c.common.external} href={links.telegram}>Telegram ↗</ExternalLink></div></aside><div><h2>{c.contact.formTitle}</h2><p>{c.contact.formIntro}</p><ContactForm copy={c.contact} /></div></section></>;
}

function Fact({ label, value }: { label: string; value: string }) { return <div><dt>{label}</dt><dd>{value}</dd></div>; }
