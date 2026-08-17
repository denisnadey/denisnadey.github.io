# Denis Nadey — engineering leadership portfolio

Multilingual professional website for Denis Nadey: Engineering Manager, hands-on mobile engineer, Flutter platform lead, consultant, and creator of `full_svg_flutter`.

The site is evidence-led. Public claims are traced in `CONTENT_RESEARCH.md`; positioning, route design, and search intent are documented in `SITE_STRATEGY.md`.

## Stack

- React 19 and TypeScript in strict mode
- Vinext / Vite with the Next.js App Router API
- Cloudflare Worker-compatible output through Sites
- Server-rendered content with one small client component for the enquiry form
- CSS design system with no runtime UI or animation library

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

Required locales are `en`, `ru`, `de`, `fr`, `es`, `it`, `pl`, and `pt`. Public routes live under a locale prefix and preserve the current page in the language switcher.

- Hand-edited canonical content: `content/en.ts`
- Hand-edited Russian, German, and French: `content/ru.ts`, `content/de.ts`, `content/fr.ts`
- Spanish, Italian, Polish, and Portuguese structured dictionaries: `content/*.json`
- Shared URLs: `content/shared.ts`
- Schema and route lists: `content/types.ts`

Company names, product names, package names, and programming technologies remain untranslated. When changing the English structure, update every locale and run the i18n test.

## Contact form

The enquiry form intentionally has no backend and needs no API key. It validates required fields locally, includes a honeypot, and opens a structured draft in the visitor's email application. The page states this behavior clearly and keeps a visible direct-email fallback.

No form data is uploaded, stored, or tracked. If a server-side delivery provider is added later, keep credentials in environment variables, add rate limiting, and document the required keys in `.env.example`.

## SEO

The site includes localized titles and descriptions, canonicals, hreflang plus `x-default`, correct HTML language attributes, sitemap, robots rules, web manifest, Open Graph/X metadata, and JSON-LD for `Person`, `ProfilePage`, `WebPage`, `ContactPage`, and `SoftwareSourceCode` where appropriate.

The canonical production origin is currently `https://denisnadey.com`. Update metadata, sitemap, robots, and hosting redirects together if the domain changes. Production should enforce HTTPS and one canonical host (`www` or apex) at the hosting layer.

## Deployment

The repository is configured for Sites through `.openai/hosting.json` and builds to a Cloudflare Worker-compatible bundle:

```bash
npm run build
```

No D1 database, R2 bucket, CMS, analytics service, cookie banner, or third-party runtime API is required.

