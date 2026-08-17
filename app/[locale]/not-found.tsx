import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><p className="section-label">404</p><h1>This route does not exist.</h1><p>The page may have moved. Return to the English homepage or contact Denis directly.</p><Link className="button primary" href="/en">Return home <span aria-hidden="true">→</span></Link></main>;
}

