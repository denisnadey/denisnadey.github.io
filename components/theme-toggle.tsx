"use client";

export function ThemeToggle({ toDark, toLight }: { toDark: string; toLight: string }) {
  function toggleTheme() {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    localStorage.setItem("theme", next);
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`${toDark} / ${toLight}`} title={`${toDark} / ${toLight}`}>
      <span className="theme-toggle-light" aria-hidden="true">☼</span>
      <span className="theme-toggle-dark" aria-hidden="true">☾</span>
    </button>
  );
}
