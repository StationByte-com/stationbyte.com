import type { Metadata } from "next";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = { title: "Page not found · StationByte" };

/**
 * For URLs no route matches at all. The root layout lives under [locale], so this page renders on its own,
 * outside any layout. Unknown paths inside a language (/es/…, /ja/…) get that language's [locale]/not-found.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en-GB" className={GeistSans.variable}>
      <body>
        <main className="shell flex min-h-screen flex-col items-center justify-center gap-6 text-center">
          <p className="eyebrow text-steel">Error 404</p>
          <h1 className="display text-[clamp(44px,7vw,96px)]">This slot is empty.</h1>
          <Link href="/" className="rounded-full bg-ink px-6 py-4 font-medium text-paper transition-colors hover:bg-signal">
            Back to the homepage
          </Link>
        </main>
      </body>
    </html>
  );
}
