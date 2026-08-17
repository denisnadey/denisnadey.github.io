import "../globals.css";

export default function RootOnlyLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}

