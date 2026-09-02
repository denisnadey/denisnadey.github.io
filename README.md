# Denis Nadey — engineering leadership portfolio

Multilingual professional website for Denis Nadey: Engineering Manager, Web/Mobile/AI product engineer, Flutter platform lead, consultant, and creator of `full_svg_flutter`, `woff2`, and `quickjs_engine`.

The site is evidence-led. Public claims are traced in `CONTENT_RESEARCH.md`; positioning, route design, and search intent are documented in `SITE_STRATEGY.md`.

## Stack

- React 19 and TypeScript in strict mode
- Vinext / Vite with the Next.js App Router API
- Cloudflare Worker-compatible output through Sites
- Server-rendered content with small client components for the enquiry form and theme preference
- CSS design system with no runtime UI or animation library
- Light/dark theme with system detection and local preference

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The development server normally opens at `http://localhost:3000` and redirects to `/en`.

## Validation

```bash
npm run lint
npm run typecheck
npm test
```

`npm test` creates the production bundle and checks representative localized pages, route-specific metadata, structured data, the 404 response, and locale content parity.

## Content and internationalization

Required locales are `en`, `ru`, `de`, `fr`, `es`, `it`, `pl`, `pt`, `ka`, and `ar`. Public routes live under a locale prefix and preserve the current page in the language switcher. Arabic renders right-to-left; Georgian and the other locales render left-to-right. The package documentation hub is available at `/{locale}/docs`.

- Hand-edited canonical content: `content/en.ts`
- Hand-written Russian, German, French, Georgian, and Arabic: `content/ru.ts`, `content/de.ts`, `content/fr.ts`, `content/ka.ts`, `content/ar.ts`
- Hand-written Spanish, Italian, Polish, and Portuguese dictionaries: `content/*.json`
- Shared URLs: `content/shared.ts`
- Current Web/Mobile/AI positioning: `content/positioning.ts`
- Localized runtime documentation: `content/docs.ts`
- Schema and route lists: `content/types.ts`

Every locale is written by hand as native copy, not machine-translated. `content/positioning.ts` overrides the hero, SEO, work/services/about/contact intros, and final CTA of each base dictionary at render time, so keep those fields identical in both places. Conventions shared by all locales: the site speaks about Denis in the third person; company names, product names, package names, job titles (Engineering Manager, Flutter Team Lead, Senior Flutter Developer), `42 Paris`, `School 21`, and programming technologies stay in English; the hero `titleLead` ends with a space because it is concatenated directly with `titleEmphasis`. When changing the English structure, update every locale and run the i18n test.

## Contact form

The enquiry form intentionally has no backend and needs no API key. It validates required fields locally, includes a honeypot, and opens a structured draft in the visitor's email application. The page states this behavior clearly and keeps a visible direct-email fallback.

No form data is uploaded, stored, or tracked. If a server-side delivery provider is added later, keep credentials in environment variables, add rate limiting, and document the required keys in `.env.example`.

## SEO

The site includes localized titles with the brand appended (`… · Denis Nadey`), descriptions, canonicals, hreflang plus `x-default` in both the HTML and the sitemap, correct HTML language attributes, a share image on every page, robots rules, a web manifest with PNG and maskable icons, Open Graph/X metadata, and a JSON-LD graph: `WebSite`, `Person`, `ProfilePage`, `WebPage`/`AboutPage`/`ContactPage`, `CollectionPage`, `BreadcrumbList`, and `SoftwareSourceCode`. Shared helpers live in `app/seo.ts` and `content/shared.ts`.

Conventions that keep this working:

- Every public URL ends with a trailing slash (`/en/`, `/en/work/`). GitHub Pages serves directory indexes that way and 301-redirects the bare form, so canonicals, hreflang, sitemap entries, and internal links must all use `routePath()` from `content/shared.ts`.
- vinext streams page metadata into `<body>` for browsers and renders it blocking inside `<head>` only for HTML-limited bots. Search engines ignore `rel=canonical` and hreflang outside `<head>`, so `scripts/export-static.mjs` requests every page with a bot user agent and fails the export if any required tag is not in `<head>`. `tests/rendered-html.test.mjs` covers the same rule.
- `scripts/build-info.mjs` runs before each build (`prebuild`) and writes `content/build-info.ts` with the last commit date, which feeds `lastmod` in the sitemap and `dateModified` in structured data.
- GitHub Pages cannot send response headers, so the Content Security Policy is mirrored as a `<meta http-equiv>` tag in `app/[locale]/layout.tsx`. HSTS, `X-Frame-Options`, long cache lifetimes for `/_next/static/*`, Brotli, and HTTP/3 need a CDN in front of Pages (Cloudflare on the free plan works: Transform Rules for headers, Cache Rules for immutable assets).

The canonical production origin is currently `https://denisnadey.com`. Update metadata, sitemap, robots, and hosting redirects together if the domain changes. Production should enforce HTTPS and one canonical host (`www` or apex) at the hosting layer.

## Deployment

The repository supports two production targets. Sites uses `.openai/hosting.json` and a Cloudflare Worker-compatible bundle:

```bash
npm run build
```

GitHub Pages uses a fully static export and deploys from `main`:

```bash
npm run export:github
```

The GitHub Actions workflow publishes `out/` to the public user site, with `denisnadey.com` configured as the canonical domain.

No D1 database, R2 bucket, CMS, analytics service, cookie banner, or third-party runtime API is required.
