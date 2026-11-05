# Translation brief: stationbyte.com

Source of truth: `messages/en.json`. Each language lives in `messages/<locale>.json` with **exactly the same keys, nesting and array lengths**. `npm run i18n:check -- <locale>` must pass.

## What "native" means here

The goal is **transcreation**: the text a senior copywriter in that market would have written for this studio. A literal translation is not the goal.
- Rewrite headlines, eyebrows and CTAs as native copy. Keep each headline's idea and its short, confident, slightly dry tone. Display headlines are arrays of **two lines**: write two natural lines in your language, each short (aim for ≤ 22 Latin characters per line, ≤ 11 full-width characters for Japanese/Korean).
- Body copy is plain, concrete and direct. Short sentences. No marketing fluff, no exclamation marks, no emoji.
- Use the vocabulary local founders and CTOs actually use. Where the local tech scene uses an English term (SaaS, app, deploy, staging, founder, team), use it if it reads naturally. Never force a clumsy native coinage.
- Meta titles and descriptions (`meta.*`, `pages.*.title/description`, `services.*.metaTitle/description`) should use the phrase people in that market **search for**, while staying accurate. Limits: titles ≤ 60 characters (CJK ≤ 30), descriptions 120–155 characters (CJK 60–80).
- Numbers, dates, units, currency and punctuation follow local conventions: "€9.90/mo" becomes "9,90 €/mes" (es) or "9,90 €/Monat" (de); "1 hr 30 min" becomes "1 h 30 min" (fr) or "1時間30分" (ja). Times stay 24-hour-friendly ("9:30").
- Day abbreviations ("Mon", "Tue") and "Tuesday" use local forms.
- The sample salon in `visuals.booking` (Studio Lumière, cut and blow-dry, balayage, colour refresh) must feel local. Use a plausible local salon name (you may keep "Studio Lumière" if it is natural there) and real service names a salon in that market would list. Keep 4 services and keep `initials` matching the business name (2 letters, or 1–2 characters for CJK). Reuse the first service name consistently in `reminders[0].text`.
- `home.hero.words` are shown on a split-flap board in CAPITALS, one at a time. Keep each to **≤ 14 characters** (CJK ≤ 7), no punctuation.
- Eyebrows (small uppercase labels) stay short.

## Never translate

StationByte, StationByte LLC, SkedEz, Pablo Italo, Iluy.ai, Climate4Buildings, AorForms, ElevateAB, Studio Lumière (unless adapting the sample salon), product and tech names (Next.js, React, React Native, Expo, TypeScript, Node.js, PostgreSQL, Stripe, AWS, OpenAI, Anthropic, Shopify, Figma, Google Calendar, Google Meet, Google Play, App Store, WhatsApp, iOS, Android, CSV, CI/CD, REST, API), email addresses, URLs and domains (skedez.com, pabloitalo.com, stationbyte.com), "GDPR Art. 6(1)(b)" style legal references (use the local name of the GDPR where one exists: RGPD in es/fr, GDPR in pt-BR (Brazilians know it by that name), DSGVO in de, AVG in nl, GDPR in it; ja: GDPR (EU一般データ保護規則); ko: GDPR(EU 일반 개인정보 보호법)).

## Placeholders, tags and ICU (the build fails if you break these)

- Keep every `{placeholder}` exactly, for example `{name}`, `{title}`, `{count}`, `{time}`, `{n}`, `{date}`, `{language}`, `{amount}`, `{from}`, `{to}`, `{team}`, `{list}`, `{url}`, `{email}`, `{text}`, `{live}`, `{alt}`, `{headline}`, `{core}`, `{movable}`, `{row}`, `{col}`, `{service}`. You may move them within the sentence.
- Keep rich-text tags exactly and around the right words: `<link>…</link>`, `<b>…</b>`, `<mail>…</mail>`, `<form>…</form>`, `<process>…</process>`, `<product>…</product>`.
- ICU plurals and selects: keep the structure and the selector keywords (`plural`, `select`, `one`, `other`, `yes`) and translate only the text inside the branches. Use your language's plural categories: Japanese and Korean use `other` only, e.g. `{count, plural, other {#手}}`. French uses `one` for 0 and 1. Always keep `other`.
- **Apostrophes:** use the typographic apostrophe ’ (U+2019), not the straight `'`, everywhere. A straight apostrophe can break ICU parsing.
- **French:** put a narrow no-break space (U+202F) before `: ; ? !` and inside « guillemets », and use ’ for elisions (l’équipe).
- **German:** „…“ quotes. **Dutch, Italian, Spanish, Portuguese:** use your language's usual quotation marks.
- JSON must stay valid UTF-8 JSON. Escape `"` inside strings as `\"` (better: use local quotation marks).

## Specific keys

- `language.suggestText`: "This page is also available in <your language>." written in your language, naming your language (e.g. "Esta página también está disponible en español.").
- `language.suggestGo`: button text, e.g. "Ver en español", "Auf Deutsch lesen", "日本語で見る".
- `language.suggestStay`: button text to stay on the current page, with `{language}`. `{language}` is filled by the browser's `Intl.DisplayNames` in **your** language (Spanish produces "inglés", German "Englisch", Dutch "Engels", French "anglais", Italian "inglese", Portuguese "inglês", Japanese "英語", Korean "영어"). Write a sentence that is grammatical with that exact form: "Seguir en {language}", "Auf {language} bleiben", "In het {language} blijven", "Rester en {language}", "Continua in {language}", "Continuar em {language}", "{language}のまま見る", "{language}로 계속 보기".
- `language.change`: the switcher button's accessible label, e.g. "Idioma: {name}. Cambiar de idioma".
- `pages.privacy.translationNote`: in English this is empty. In your language, write one sentence: "This is a translation for convenience; if it differs from the English version, the English version prevails."
- `pages.privacy.*`: legal text. Translate **accurately and completely**, in the register of a real privacy policy in that market. Don't add or drop obligations.
- `skedez.built[5]` ("Six languages") and `visuals.architecture.clients[1].v` refer to **SkedEz's** booking pages (English, Portuguese, Spanish, French, German, Italian). Keep that meaning.
- `home.work.facts[2].v` ("Clients book in 6") means SkedEz clients can book in 6 languages.
- `contactForm.mail.*` builds an email the visitor sends from their own mail app, so write it in your language.
- `llms.*` is read by AI assistants. Plain, factual language.
- The studio **replies in every language of the site** ("We reply within 48 hours, in your language"). Keep that promise exactly where English makes it.

## Register per language

| Locale | Variety | Address | Notes |
|---|---|---|---|
| es | Spain (castellano) | **tú** | Peninsular vocabulary (*móvil*, *ordenador*, *presupuesto*, *empresa*). Avoid Latin-American-only terms. "IA". |
| pt-br | Brazil | **você** | Brazilian tech vocabulary (*time*, *app*, *empresa*, *orçamento*). "IA". |
| fr | France | **vous** | French typography rules above. "IA". Avoid unnecessary anglicisms, but "SaaS", "start-up" and "design" are fine. |
| de | Germany | **Sie** | Clear B2B German, compound nouns, no anglicism soup ("KI", "App", "SaaS" fine). Avoid gendered forms where a neutral phrasing exists (*Gründerteams*, *Unternehmen*). |
| it | Italy | **voi**/impersonal | Professional, warm. "IA". *founder*, *team*, *SaaS*, *app* are fine. |
| nl | Netherlands | **je/jij** | Direct, informal-professional Dutch B2B tone. "AI". |
| ja | Japan | です・ます | Natural Japanese business copy. Headlines may be noun-ending (体言止め) or punchy plain form. Full-width punctuation (、。・). No spaces between Japanese words. Katakana tech terms as Japanese teams write them (プロダクト, リリース, ステージング, SaaS, AI). |
| ko | Korea | 합니다체 for body | Natural Korean business copy. Headlines short and punchy. Tech terms as Korean teams write them (프로덕트, 릴리스, 스테이징, SaaS, AI). |
