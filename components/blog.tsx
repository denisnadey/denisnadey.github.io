import { Fragment } from "react";
import { getCopy, isPage, type Locale } from "@/content";
import { blogPath, blogSourceLocale, formatPostDate, getBlogCopy, getPosts, readingTime, type BlogPost } from "@/content/blog";
import type { Block, Inline } from "@/content/blog/markdown.mjs";
import { routePath } from "@/content/shared";
import { ExternalLink, FinalCta, PageIntro } from "./site-shell";

/** Markdown link targets: `post:slug#hash` and `page:slug#hash` resolve inside the current locale. */
function resolveHref(href: string, locale: Locale): { href: string; external: boolean } {
  const [scheme, rest = ""] = href.includes(":") ? [href.slice(0, href.indexOf(":")), href.slice(href.indexOf(":") + 1)] : ["", href];
  const [target, hash] = rest.split("#");
  const anchor = hash ? `#${hash}` : "";
  if (scheme === "post") return { href: `${blogPath(locale, target)}${anchor}`, external: false };
  if (scheme === "page") {
    if (target === "home" || target === "") return { href: `${routePath(locale)}${anchor}`, external: false };
    if (target === "docs" || target === "blog" || isPage(target)) return { href: `${routePath(locale, target)}${anchor}`, external: false };
    throw new Error(`Unknown page link "${href}" in a blog post`);
  }
  if (scheme === "http" || scheme === "https") return { href, external: true };
  return { href, external: false };
}

function Inlines({ nodes, locale, external }: { nodes: Inline[]; locale: Locale; external: string }) {
  return nodes.map((node, index) => {
    if (node.type === "text") return <Fragment key={index}>{node.value}</Fragment>;
    if (node.type === "code") return <code key={index}>{node.value}</code>;
    if (node.type === "break") return <br key={index} />;
    const children = <Inlines nodes={node.children} locale={locale} external={external} />;
    if (node.type === "strong") return <strong key={index}>{children}</strong>;
    if (node.type === "em") return <em key={index}>{children}</em>;
    const target = resolveHref(node.href, locale);
    return target.external ? <ExternalLink key={index} href={target.href} label={external}>{children}</ExternalLink> : <a key={index} href={target.href}>{children}</a>;
  });
}

function BlockView({ block, locale, external }: { block: Block; locale: Locale; external: string }) {
  const inline = (nodes: Inline[]) => <Inlines nodes={nodes} locale={locale} external={external} />;
  switch (block.type) {
    case "paragraph":
      return <p>{inline(block.children)}</p>;
    case "heading":
      return block.level === 2 ? <h2 id={block.id}>{inline(block.children)}</h2> : <h3 id={block.id}>{inline(block.children)}</h3>;
    case "list": {
      const items = block.items.map((item, index) => <li key={index}>{inline(item)}</li>);
      return block.ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
    }
    case "code":
      return <pre data-lang={block.lang || undefined}><code>{block.value}</code></pre>;
    case "flow":
      return <ol className="post-flow">{block.steps.map((step, index) => <li key={index}>{inline(step)}</li>)}</ol>;
    case "quote":
      return <blockquote>{block.children.map((child, index) => <BlockView key={index} block={child} locale={locale} external={external} />)}</blockquote>;
    case "rule":
      return <hr />;
  }
}

function PostMeta({ post, locale }: { post: BlogPost; locale: Locale }) {
  const copy = getBlogCopy(locale);
  return <><time dateTime={post.published}>{formatPostDate(post.published, locale)}</time><span>{copy.kinds[post.kind]}</span><span>{readingTime(copy, post.minutes)}</span></>;
}

export function BlogIndexPage({ locale }: { locale: Locale }) {
  const copy = getBlogCopy(locale);
  return <>
    <PageIntro className="blog-intro" label={copy.navLabel} title={copy.title} intro={copy.intro} />
    <ol className="post-list">
      {getPosts(locale).map((post) => <li key={post.slug}>
        <a href={blogPath(locale, post.slug)}>
          <p className="post-list-meta"><PostMeta post={post} locale={locale} />{post.linkedin ? <span>LinkedIn</span> : null}</p>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
          <b aria-hidden="true">→</b>
        </a>
      </li>)}
    </ol>
    <FinalCta locale={locale} />
  </>;
}

export function BlogPostPage({ post, locale }: { post: BlogPost; locale: Locale }) {
  const copy = getBlogCopy(locale);
  const external = getCopy(locale).common.external;
  return <>
    <article className="post">
      <header className="post-header">
        <p className="section-label"><a href={blogPath(locale)}>{copy.navLabel}</a> · {copy.kinds[post.kind]}</p>
        <h1>{post.title}</h1>
      </header>
      <div className="post-layout">
        <aside className="post-aside">
          <p className="post-facts"><PostMeta post={post} locale={locale} /></p>
          {post.linkedin ? <ExternalLink className="post-origin" href={post.linkedin} label={external}>{copy.originallyPublished}<span aria-hidden="true"> ↗</span></ExternalLink> : null}
          {locale !== blogSourceLocale ? <a className="post-origin" href={blogPath(blogSourceLocale, post.slug)} hrefLang={blogSourceLocale}>{copy.translatedFrom}<span aria-hidden="true"> →</span></a> : null}
          {post.tags.length ? <div className="post-tags"><p className="section-label">{copy.tagsLabel}</p><ul>{post.tags.map((tag) => <li key={tag} lang="en">{tag}</li>)}</ul></div> : null}
        </aside>
        <div className="prose">{post.blocks.map((block, index) => <BlockView key={index} block={block} locale={locale} external={external} />)}</div>
      </div>
      <footer className="post-footer">
        <a className="button line" href={blogPath(locale)}>{copy.allPosts}<span aria-hidden="true">→</span></a>
        {post.linkedin ? <ExternalLink className="button line" href={post.linkedin} label={external}>{copy.readOriginal}<span aria-hidden="true">↗</span></ExternalLink> : null}
      </footer>
    </article>
    <FinalCta locale={locale} />
  </>;
}

/** Home page teaser: the latest long-form articles. */
export function LatestWriting({ locale }: { locale: Locale }) {
  const copy = getBlogCopy(locale);
  const articles = getPosts(locale).filter((post) => post.kind === "article").slice(0, 3);
  if (!articles.length) return null;
  return <section className="home-work home-writing">
    <div className="section-heading"><p className="section-label">{copy.latestLabel}</p><h2>{copy.latestTitle}</h2><p>{copy.latestIntro}</p></div>
    <div className="work-list">{articles.map((post) => <a href={blogPath(locale, post.slug)} key={post.slug}><span><time dateTime={post.published}>{formatPostDate(post.published, locale)}</time></span><h3>{post.title}</h3><p>{post.description}</p><b aria-hidden="true">→</b></a>)}</div>
    <a className="text-link" href={blogPath(locale)}>{copy.viewAll}<span aria-hidden="true">→</span></a>
  </section>;
}
