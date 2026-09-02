import { getCopy, locales } from "@/content";
import { routePath } from "@/content/shared";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="section-label">404</p>
      <h1>This page does not exist.</h1>
      <p>The address may have changed. Pick a language to return to the homepage, or contact Denis directly.</p>
      <nav className="not-found-languages" aria-label="Languages">
        {locales.map((locale) => <a key={locale} href={routePath(locale)} hrefLang={locale} lang={locale}>{getCopy(locale).localeName}</a>)}
      </nav>
      <a className="button primary" href={routePath("en")}>Return home <span aria-hidden="true">→</span></a>
    </main>
  );
}
