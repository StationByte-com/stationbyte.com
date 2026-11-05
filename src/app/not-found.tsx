import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <main id="main" className="shell flex min-h-[80vh] flex-col items-center justify-center gap-10 py-40 text-center">
        <svg viewBox="0 0 64 64" width="120" height="120" aria-hidden="true">
          {[0, 23, 46].flatMap((y, r) =>
            [0, 23, 46].map((x, c) =>
              r === 2 && c === 2 ? null : r === 1 && c === 1 ? (
                <rect key={`${r}${c}`} x={x + 0.75} y={y + 0.75} width="16.5" height="16.5" rx="4.5" fill="none" stroke="var(--color-signal)" strokeWidth="1.5" strokeDasharray="3 3" />
              ) : (
                <rect key={`${r}${c}`} x={x} y={y} width="18" height="18" rx="4.5" fill="var(--color-ink)" />
              ),
            ),
          )}
        </svg>
        <div className="flex flex-col items-center gap-5">
          <p className="eyebrow text-steel">Error 404</p>
          <h1 className="display text-[clamp(44px,7vw,96px)]">This slot is empty.</h1>
          <p className="max-w-[460px] text-lg text-steel">The page you asked for isn&apos;t here. It may have moved when we rebuilt the site.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <Link href="/" className="rounded-full bg-ink px-6 py-4 font-medium text-paper transition-colors hover:bg-signal">
            Back to the homepage
          </Link>
          <Link href="/contact" className="border-b border-ink px-1 py-3 font-medium hover:border-signal hover:text-signal-deep">
            Start a project
          </Link>
        </div>
    </main>
  );
}
