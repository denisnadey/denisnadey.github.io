import { IBM_Plex_Mono, Manrope, Newsreader } from "next/font/google";
import { isLocale } from "@/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";

const sans = Manrope({ variable: "--font-sans", subsets: ["latin", "cyrillic"], display: "swap" });
const serif = Newsreader({ variable: "--font-serif", subsets: ["latin"], display: "swap", style: ["normal", "italic"] });
const mono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin", "cyrillic"], display: "swap", weight: ["400", "500"] });

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  manifest: "/manifest.webmanifest",
  authors: [{ name: "Denis Nadey", url: "https://denisnadey.com" }],
  creator: "Denis Nadey",
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}})()`;
  return <html lang={locale} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body className={`${sans.variable} ${serif.variable} ${mono.variable}`}>{children}</body></html>;
}
