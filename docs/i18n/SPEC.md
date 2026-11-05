# Multi-language stationbyte.com: spec, audit and plan

Status: **approved 5 November 2026**, implemented on branch `feat/i18n` (decisions in §13)
UI design (Claude Design canvas): https://claude.ai/artifact/Sua9KamyaHPpubLk83ycci

---

## 1. Goal

Serve every page of stationbyte.com in nine languages, each written the way a native speaker in that market would write it, so the studio can rank, be cited by AI assistants and convert in each market. English stays the default and keeps every URL it has today.

**Out of scope for this change:** per-country pricing and legal entities, translated SkedEz screenshots, a translation management system (TMS) UI. The format chosen below plugs into Crowdin, Tolgee, Weblate or Lokalise later without code changes.

## 2. Locales

| Locale | URL prefix | `<html lang>` | hreflang | OG locale | Register and voice |
|---|---|---|---|---|---|
| English (default) | none (`/`) | `en-GB` | `en` + `x-default` | `en_GB` | As today: British spelling, plain, direct |
| Spanish (Spain) | `/es` | `es-ES` | `es` | `es_ES` | **tú**: the norm for modern Spanish tech studios; Castilian vocabulary (*ordenador*, *móvil*, *presupuesto*) |
| Portuguese (Brazil) | `/pt-br` | `pt-BR` | `pt` | `pt_BR` | **você**, warm and direct; Brazilian tech vocabulary (*time*, *app*, *deploy* where natural) |
| French | `/fr` | `fr-FR` | `fr` | `fr_FR` | **vous**; French typography (thin no-break space before `: ; ? !`, « guillemets ») |
| German | `/de` | `de-DE` | `de` | `de_DE` | **Sie** (B2B norm for buying decisions); no anglicism soup; gender-inclusive where it reads naturally |
| Italian | `/it` | `it-IT` | `it` | `it_IT` | **voi/tu** neutral constructions; *founder*, *team* accepted |
| Dutch | `/nl` | `nl-NL` | `nl` | `nl_NL` | **je/jij**: standard for modern Dutch B2B; short, direct |
| Japanese | `/ja` | `ja` | `ja` | `ja_JP` | です・ます body copy; headlines written as Japanese copy, not translated English; no forced spaces |
| Korean | `/ko` | `ko` | `ko` | `ko_KR` | 합니다체 body copy; short headlines; `word-break: keep-all` |

Why language-level hreflang (`es`, not `es-ES`): there is one Spanish and one Portuguese version, so the language code lets Google show them to all Spanish and Portuguese speakers (Latin America, Portugal) instead of only Spain or Brazil. Google does not support `es-419`. The copy itself is written for Spain and Brazil, as you asked. The `/pt-br` prefix leaves room for a `/pt-pt` later.

### Suggested extra languages (your call; see §13)

| Language | Why | Cost |
|---|---|---|
| **Korean (`ko`)**, recommended | High income, heavy SaaS and AI adoption, low English-first browsing, few English-only studios competing | Same as Japanese (CJK typography already handled) |
| Arabic (`ar`), Gulf | Large digital-transformation budgets in the UAE and Saudi Arabia | Right-to-left: every layout and the motion direction need mirroring. A separate phase |
| Swedish, Danish, Norwegian | Rich markets | Very high English proficiency, so low return. Not recommended now |
| Polish, Turkish, Chinese | Polish and Turkish are mostly supply markets for outsourcing. Mainland China is hard to reach (Google blocked) | Not recommended |

Switzerland, Austria, Belgium, Luxembourg and Canada are already covered by German, French and Dutch.

## 3. Library and approach (researched)

**Chosen: [`next-intl`](https://next-intl.dev) 4.14** (supports Next 16 and its `proxy.ts`).

- The most widely used i18n library for the App Router: Server Components, static rendering, typed message keys, ICU MessageFormat (plurals, select, rich text), `Intl` dates and numbers, and locale-aware navigation (`Link`, `redirect`, `getPathname`).
- It is listed in Next's own i18n guide (`node_modules/next/dist/docs/01-app/02-guides/internationalization.md`).
- Messages live in plain JSON, which every translation platform imports.

Alternatives considered:
- **Next's built-in dictionary pattern:** no ICU plurals, no locale-aware `Link`, and navigation and metadata helpers would have to be built by hand.
- **Paraglide:** strong tree-shaking, but a smaller ecosystem for localized pathnames and metadata.
- **Lingui:** extraction-based, a better fit for apps than for a copy-heavy marketing site.
- **Intlayer, gt-next:** younger, or tied to a hosted service.

**Rules taken from Google Search Central:**
- Each language gets its own URL. Language is never switched through a cookie or IP.
- **No automatic redirects** based on a guessed language. Visitors get visible links to the other versions: the switcher, the footer column and a suggestion bar.
- hreflang lists every version, including the page itself, identically on every version, plus `x-default`.
- Google detects a page's language from its visible text, so every page must be fully translated, including navigation, alt text and diagrams. No mixed-language pages.

## 4. Routing

```
/                 → English (unchanged URLs, nothing to redirect)
/services/…       → English
/es, /es/…        → Spanish
/pt-br/…          → Portuguese (Brazil)
/fr/… /de/… /it/… /nl/… /ja/…
```

- `localePrefix: { mode: "as-needed", prefixes: { "pt-BR": "/pt-br" } }`.
- `localeDetection: false` and `localeCookie: false`. No redirects, and the site keeps its "no cookies" promise on the privacy page.
- `alternateLinks: false` (no `Link` HTTP headers). hreflang goes in the HTML `<head>` and in the sitemap, the two methods Google reads. A third method adds nothing.
- `src/proxy.ts`, Next 16's name for middleware, runs `createMiddleware(routing)`. It skips `_next`, files with an extension, `llms*.txt`, `sitemap.xml`, `robots.txt` and `manifest.webmanifest`.
- **Slugs stay English in every language** (decided): `/es/services/ai-product-engineering`. Simpler mapping between versions, and Google ranks on the page's visible content.

## 5. Audit: everything that changes

### 5.1 Structure

| Today | After |
|---|---|
| `src/app/layout.tsx` (root, `lang="en-GB"`) | `src/app/[locale]/layout.tsx` with `generateStaticParams` for the 8 locales, `setRequestLocale`, `<html lang>` per locale, and `NextIntlClientProvider` passing only the client namespaces |
| `src/app/{page,work,services,process,studio,contact,privacy}` | Moved under `src/app/[locale]/…`, unchanged otherwise. Every route stays statically generated: 13 pages × 8 locales = 104 HTML files |
| `src/app/not-found.tsx` | `[locale]/not-found.tsx` (translated) + `[locale]/[...rest]/page.tsx` + a minimal root `not-found.tsx` |
| none | `src/i18n/{routing,navigation,request}.ts`, `src/proxy.ts`, `messages/{en,es,pt-BR,fr,de,it,nl,ja}.json`, `global.d.ts` (typed keys) |
| `next.config.ts` | Wrapped in `createNextIntlPlugin()`. Security headers unchanged |
| `sitemap.ts`, `robots.ts`, `manifest.ts`, `llms*.txt` | Stay at the app root and become locale-aware (§7) |

### 5.2 Content modules (`src/content/`)

Data stays in TypeScript: slugs, images, loops, hrefs, tags, stats and stack names. **All prose moves to `messages/*.json`**, keyed by stable ids:

| File | Prose to move |
|---|---|
| `site.ts` | title, description, `replyTime`, `nav` labels, `nowBuilding`, `process` (4 stages × 6 fields), `rhythm`, `engagements`, `agreements`, `principles`, founder role, bio, stat labels and project notes |
| `services.ts` | 4 services × (title, body, metaTitle, description, headline, image alt, diagram heading, problem, 6 deliverables, 4 approach steps, proof, 3 FAQs) |
| `work.ts` | SkedEz description, summary, facts, problem, built ×8, notes ×3, pricing notes. Prices stay in € as published on skedez.com |
| `contact.ts` | `kinds` and `budgets` become **stable ids** (`ai`, `saas`, `apps`, `design`, `unsure`; `lt15`, `15-50`, `50-150`, `gt150`, `unsure`) with translated labels. The server action validates ids, so validation no longer depends on English text |
| `schema.ts` | Becomes functions of the locale (§7.4) |
| `llms.ts` | Becomes functions of the locale (§7.3) |
| `seo.ts` | `pageMetadata` takes the locale and adds `alternates.languages` and `openGraph.alternateLocale` |

### 5.3 Pages: hard-coded copy to extract

| File | Notes |
|---|---|
| `page.tsx` (home) | Marquee label |
| `work/page.tsx`, `work/skedez/page.tsx` | Hero, every heading, notes, Article JSON-LD headline, image alts |
| `services/page.tsx`, `services/[slug]/page.tsx` | Hero, section headings, "Service 0n" eyebrow (ICU), `generateStaticParams` per locale (and per localized slug) |
| `process/page.tsx` | Hero, "Stage 0n", headings, figure caption |
| `studio/page.tsx` | Hero with an inline link (`t.rich`), principle notes, company facts, figure caption, portrait alt |
| `contact/page.tsx` | Hero, aside, "Not ready yet?" sentence with two links (`t.rich`) |
| `contact/actions.ts` | Validation messages per locale (the locale is sent with the form and checked against the list). The Slack post stays in English and adds `Language: es` so you know which language to reply in. The mailto fallback subject and body are translated |
| `privacy/page.tsx` | Full legal text, "Updated" date via `Intl.DateTimeFormat`, plus the line "If versions differ, the English version prevails." Adds one sentence about the language-bar memory (§6.3) |
| `not-found.tsx` | All copy |

### 5.4 Components

| Component | Change |
|---|---|
| `site/Header` | Nav labels, CTA, menu `sr-only` labels. **New `LanguageSwitcher`** (desktop menu, phone chips). `Link` and `usePathname` come from `@/i18n/navigation` so active-state matching ignores the prefix |
| `site/Footer` | Column headings, links. **New "Language" column** (plain `<a hreflang>` links, crawlable). The aria-hidden tagline is translated too |
| `site/PageHero` | "Home" crumb, breadcrumb `aria-label`, BreadcrumbList JSON-LD with localized names and URLs |
| `site/NextStep` | Eyebrow, default title, lede, CTA |
| `home/*` | Hero, Work (facts, alts, "Case study" cursor label), Services (accordion), Process, Studio (inline link), Contact (copy button states), Puzzle (status text with ICU plurals: "1 move / 3 moves", Japanese "3手") |
| `contact/*` | Labels, placeholders, errors, status messages, "n of 5 answered" (ICU), budget labels formatted with `Intl.NumberFormat` |
| `motion/Marquee` | Play/pause `sr-only` label |
| `motion/SplitFlap` | Width-aware cells for full-width CJK glyphs (1.7em). Glyph shuffle uses katakana for `ja`. `toUpperCase` is skipped for non-Latin scripts |
| `motion/Cta` | No change (children are already strings) |
| `visuals/*` | About 120 short UI strings in the diagrams (BookingFlow sample salon, ProcessVisuals, ServiceDiagram, DataFlow, Architecture, DeviceDuo), all translated. The sample salon services become **native examples per market** (for example *Corte y peinado*, *カット＋ブロー*), and times and days use `Intl` formats |
| `brand/*` | No text. No change |

### 5.5 Typography and layout

- **Japanese and Korean:** Geist has no CJK glyphs, so Latin text stays in Geist and CJK text uses the platform's own font: Hiragino / Apple SD Gothic Neo on Apple devices, Yu Gothic / Malgun Gothic on Windows, Noto Sans CJK on Android and Linux. A Noto webfont through `next/font` was tried and dropped: it is about 120 unicode-range slices per language, which made builds depend on hundreds of Google Fonts downloads. Korean also gets `word-break: keep-all`. Under `:lang(ja)`: display tracking −0.02em instead of −0.05em, line-height 1.12 for display and 1.8 for body, `word-break: auto-phrase` (natural phrase breaks), no uppercase eyebrows, eyebrow tracking 0.04em.
- **German, Dutch, French:** long compounds. Headings get `hyphens: auto` and `overflow-wrap: anywhere` as a safety net. Nav width is checked at the `md` breakpoint (German nav plus switcher plus "Projekt anfragen" fits at 768px, see canvas).
- **French:** `&nbsp;`/narrow no-break spaces before `: ; ! ?` are written into the messages themselves.
- **Text expansion:** buttons never get fixed widths, and two-line display titles are authored per language (each language writes its own line break).
- **OG images:** `scripts/og/build.mjs` loops over locales and writes `public/og/{locale}/{page}.jpg`. Japanese outlines use the Noto Sans JP TTF, from the Google Fonts repo (OFL), as a build-only dev dependency.

## 6. UI (see the canvas)

1. **Desktop switcher** in the header, between the nav and "Start a project": a 44px pill with a globe icon and a two-letter code. It opens a menu listing each language by its **native name** (never flags: a flag is a country, not a language). The current language is marked by a signal-blue tile. Each item has `lang` and `hreflang`, so screen readers pronounce it correctly. Esc closes the menu, arrow keys move focus, and focus returns to the trigger.
2. **Phone menu:** a two-column grid of language chips above the CTA.
3. **Footer "Language" column:** plain links to every version. These are crawlable links between language versions, which Google recommends.
4. **Suggestion bar:** shown only when the browser's language is supported and differs from the page. It is written in the visitor's language ("Esta página también está disponible en español." with buttons "Ver en español" and "Seguir en inglés"). It never redirects, is never shown to bots (it is client-side and there is no server detection), and either button hides it for good. The choice is stored in `localStorage`: no cookie, nothing sent to the server.
5. **Switching language keeps the page:** `/services/saas-platforms` switches to `/es/servicios/plataformas-saas` (or `/es/services/saas-platforms` without localized slugs). In-page anchors are kept when the section exists.

## 7. SEO, AI discoverability and structured data

### 7.1 Metadata (every page, every locale)
- `alternates.canonical` is the page's own locale URL.
- `alternates.languages` lists all 8 versions plus `x-default` → English. Next renders this as `<link rel="alternate" hreflang>`.
- `openGraph.locale` is the current locale. `openGraph.alternateLocale` lists the other 7.
- Titles and descriptions are **written per market**, not translated literally. Each targets the phrase people in that market actually search for (for example *desarrollo de software a medida*, *Softwareentwicklung*, *agência de desenvolvimento de software*, *ソフトウェア開発会社*), within the usual length limits (about 60 and 155 characters; Japanese about 30 and 80 full-width characters).
- `title.template` is per locale.

### 7.2 Sitemap
- `sitemap.ts` emits all 104 URLs. Each `<url>` carries `<xhtml:link rel="alternate">` for all 8 languages plus `x-default` (Next's `alternates.languages` in `MetadataRoute.Sitemap`). Image entries stay attached per page.
- `robots.ts` is unchanged apart from listing the sitemap. `/llms.txt` and the per-locale files are allowed.

### 7.3 llms.txt (no official i18n standard yet; follows the common pattern)
- `/llms.txt`: English index plus a **"Languages"** section linking `/{prefix}/llms.txt` for each locale.
- `/{prefix}/llms.txt` and `/{prefix}/llms-full.txt`: the same structure, written in that language, linking only that language's URLs. All are built from the same messages, so they can't drift from the pages.

### 7.4 JSON-LD
- `WebSite.inLanguage` lists all 8 languages. Each page node carries its own `inLanguage`.
- Organization `@id` stays one stable id across languages (one entity, many pages).
- `contactPoint.availableLanguage`: **decision**. It should list only languages you will actually reply in (§13).
- Service, FAQPage, BreadcrumbList, AboutPage, ContactPage and Article are localized (names, descriptions, FAQ text, URLs).

### 7.5 Manifest
- A single manifest stays in English. Per-locale manifests bring almost nothing for a marketing site.

## 8. Translation method ("native, not translated")

1. **English source freeze:** `messages/en.json` is extracted first, and the English site must look identical to today. That is a regression check.
2. **Per-language brief:** register (§2), a glossary of terms kept in English (StationByte, SkedEz, product names, "SaaS", "AI/IA/KI"), brand metaphors to *adapt* rather than translate ("the open slot", "eight tiles, one open slot", "senior hands"), and SEO phrases per market.
3. **Transcreation:** one specialist pass per language, run in parallel. Headlines and CTAs are rewritten as native copy (see the canvas: "Wir bauen Software, die live geht.", "リリースまで、つくりきる。"), with numbers, dates, currency and punctuation in local conventions.
4. **Independent review pass** per language: a second reviewer checks fluency, consistency with the glossary, terms that read as machine translation, and legal accuracy on the privacy page.
5. **Recommended before launch:** a human native read-through of at least `de`, `fr` and `ja` (the most demanding markets). I'll export a review sheet per language.

## 9. Quality gates (added to CI)

- `npm run i18n:check`: every locale has exactly the English keys, ICU arguments and rich-text tags match, there are no empty strings, and no English left in non-English files (heuristic).
- `typecheck`: typed message keys mean a missing English key fails the build.
- Playwright smoke test on 8 locales × key pages: `<html lang>`, a self-referencing hreflang set with x-default, canonical, no raw message keys on the page, no horizontal overflow at 390, 768 and 1440 px, the switcher keeps the path, and the contact form shows errors in the page's language.
- Validate `sitemap.xml`, and run the Rich Results test on one page per locale after deploy.

## 10. Rollout and Search Console (at the very end)

1. Merge and deploy through Coolify, then spot-check one page in each locale in production.
2. **Google Search Console** (property for stationbyte.com, verified by DNS): resubmit `sitemap.xml`, request indexing for the 7 new locale home pages and the top service pages through URL Inspection, and watch Pages and "Alternate page with proper canonical" over the following weeks. The International Targeting report has been retired, so hreflang is checked by URL Inspection and crawl reports.
3. Suggested, and needs your account: **Bing Webmaster Tools.** Import from GSC and submit the sitemap. Bing feeds Copilot and ChatGPT search, which supports the goal of appearing everywhere. IndexNow ping on deploy.

## 11. Implementation plan

| Phase | Work | Output |
|---|---|---|
| 0 | Install `next-intl`. Add routing, proxy, request config, the plugin and typed messages. Move `app/*` under `[locale]` | English site renders identically, all URLs unchanged |
| 1 | Extract every English string (§5.2–5.4) into `messages/en.json`. Contact ids. Locale-aware `seo.ts`, `schema.ts`, `llms.ts` | Zero hard-coded copy (`i18n:check` passes) |
| 2 | LanguageSwitcher (desktop and phone), footer column, suggestion bar, Japanese typography, SplitFlap CJK, German hyphenation | UI per the approved canvas |
| 3 | Transcreation of 7 locales in parallel, then an independent review pass | `messages/{locale}.json` |
| 4 | Localized slugs (if approved), sitemap with alternates, metadata alternates, per-locale llms files, JSON-LD, per-locale OG images | SEO layer complete |
| 5 | QA: lint, typecheck, i18n:check, build, Playwright smoke tests, visual pass at 3 widths × 8 locales | Green CI, screenshots |
| 6 | PR. After merge and deploy: Search Console sitemap and indexing requests | Live and submitted |

## 12. Risks

- **Translation quality** is the biggest risk to conversion. Mitigated by §8 and a human read of de, fr and ja.
- **Promises in other languages:** the site says "the person who answers is an engineer". If you can't reply in Japanese or Dutch, that line and `availableLanguage` must say so honestly (for example, "We reply in English, Spanish or Portuguese").
- **Build time:** 104 static pages plus 88 OG images. Still small.
- **Content drift:** solved structurally, because there is one key set and CI fails on any missing key.

### Known limitation

- **404 pages are rendered in the browser, not in the server HTML.** With the root layout under `app/[locale]`, Next 16.4 returns unknown URLs with the right status (404) and `noindex`, but the server sends an empty shell that the client fills with the translated 404 page. This was confirmed with Next's own default not-found page, so it isn't in our code. It only affects visitors without JavaScript. Revisit when Next changes how it renders not-found under a dynamic root layout.
- **The ICU message parser ships to the browser** (about 13.5 KB gzip, one chunk), because client components format messages with plurals and rich text. next-intl's experimental `messages.precompile` would remove it, but it compiles messages into a non-string form, and the site reads structured copy (lists, FAQs, cards) as plain strings. Revisit if that option stabilises with raw access.
- **Payload:** each page carries only the client messages its own components read (`src/i18n/ClientMessages.tsx`). The language menu and phone chips render their lists only when opened, and the footer list is the crawlable one. Net cost versus the English-only site is about +4 KB gzip of HTML per page, almost all of it hreflang tags and language links.

## 13. Decisions (approved 5 November 2026)

1. **UI:** approved as designed on the canvas. Language selectors show **language names only, never countries** ("Português", not "Português (Brasil)").
2. **Languages:** English, Spanish, Portuguese, French, German, Italian, Dutch, Japanese and **Korean**. Arabic is not added now.
3. **URLs:** English slugs everywhere.
4. **Budget ranges:** US dollars, written in each language's own number format (`Intl.NumberFormat`, compact).
5. **Reply languages:** every site language. The contact copy says "we reply in your language", and `contactPoint.availableLanguage` lists all nine. Slack posts include the language the visitor wrote from.
