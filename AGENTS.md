<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Languages (i18n)

The site is published in every language listed in `src/i18n/locales.ts` with next-intl (spec: `docs/i18n/SPEC.md`).
- Never hard-code visitor-facing text in components: add it to `messages/en.json` and to every other `messages/<locale>.json`, written as native copy for that market (see `docs/i18n/TRANSLATION_BRIEF.md`), then run `npm run i18n:check`.
- Internal links use `Link`/`usePathname` from `@/i18n/navigation`, never `next/link`, so the language prefix is kept.
- New pages: put them under `src/app/[locale]/`, call `loadLocale(params)` first, and build metadata with `pageMetadata({ locale, ... })` so canonical and hreflang are set. Add the path to `src/app/sitemap.ts`.
- After changing a page headline, run `npm run og:build` to refresh social images in every language.

