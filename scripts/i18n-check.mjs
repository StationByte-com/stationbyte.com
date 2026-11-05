// Checks every messages/<locale>.json against the English source (messages/en.json):
//   - the same keys, the same array lengths, the same value types
//   - the same {placeholders} and <tags> in every string
//   - valid ICU MessageFormat (plurals, selects, rich-text tags)
//   - nothing left empty, and no long English sentence copied over untranslated
// Run: npm run i18n:check [-- es ja]   (no arguments: every locale)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "@formatjs/icu-messageformat-parser";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "messages");
const read = (l) => JSON.parse(fs.readFileSync(path.join(dir, `${l}.json`), "utf8"));
const en = read("en");

// Locales come from src/i18n/locales.ts, so the check can't drift from the site.
const localesSource = fs.readFileSync(path.join(root, "src/i18n/locales.ts"), "utf8");
const all = [...localesSource.match(/export const locales = \[([^\]]+)\]/)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]).filter((l) => l !== "en");
const wanted = process.argv.slice(2).length ? process.argv.slice(2) : all;

// Strings that are legitimately identical in every language: names, numbers, symbols.
const SAME_OK = /^(StationByte.*|SkedEz.*|Studio Lumière|API|REST|Webhooks|Auth|PostgreSQL|Studio|Design|Prototype|Email|WhatsApp|Pro|Free|Teams|Balayage|SL|Figma|Google Calendar|Google Meet|Design systems|Design tokens|Web app|.{0,3})$/;
// English strings allowed to be empty (filled only in other languages).
const EMPTY_IN_EN = new Set(["pages.privacy.translationNote"]);

/** Argument and tag names in an ICU message, read from the parser's tree (select/plural branch text is not an argument). */
function names(message) {
  const args = new Set();
  const tags = new Set();
  const walk = (elements) => {
    for (const el of elements) {
      if (el.type === 8) {
        tags.add(el.value);
        walk(el.children);
      } else if ([1, 2, 3, 4, 5, 6].includes(el.type)) {
        args.add(el.value);
        if (el.options) for (const o of Object.values(el.options)) walk(o.value);
      }
    }
  };
  walk(parse(message));
  return { args: [...args].toSorted().join(","), tags: [...tags].toSorted().join(",") };
}
const type = (v) => (Array.isArray(v) ? "array" : v === null ? "null" : typeof v);

function compare(src, dst, key, errors, warnings) {
  if (type(src) !== type(dst)) return errors.push(`${key}: expected ${type(src)}, got ${type(dst)}`);
  if (Array.isArray(src)) {
    if (src.length !== dst.length) errors.push(`${key}: expected ${src.length} items, got ${dst.length}`);
    src.forEach((v, i) => dst[i] !== undefined && compare(v, dst[i], `${key}[${i}]`, errors, warnings));
    return;
  }
  if (typeof src === "object") {
    for (const k of Object.keys(src)) {
      if (!(k in dst)) errors.push(`${key ? `${key}.` : ""}${k}: missing`);
      else compare(src[k], dst[k], key ? `${key}.${k}` : k, errors, warnings);
    }
    for (const k of Object.keys(dst)) if (!(k in src)) errors.push(`${key ? `${key}.` : ""}${k}: not in English`);
    return;
  }
  if (typeof src !== "string") return;
  if (!dst.trim()) {
    if (!(EMPTY_IN_EN.has(key) && !src)) errors.push(`${key}: empty`);
    return;
  }
  let a;
  let b;
  try {
    a = names(src);
    b = names(dst);
  } catch (e) {
    errors.push(`${key}: invalid ICU message (${e.message})`);
    return;
  }
  if (a.args !== b.args) errors.push(`${key}: placeholders {${a.args}} → {${b.args}}`);
  if (a.tags !== b.tags) errors.push(`${key}: tags <${a.tags}> → <${b.tags}>`);
  if (src === dst && src.length > 3 && !SAME_OK.test(src) && /[a-z]{3,}\s[a-z]{3,}/i.test(src)) warnings.push(`${key}: identical to English: "${src.slice(0, 60)}"`);
}

let failed = false;
for (const locale of wanted) {
  const file = path.join(dir, `${locale}.json`);
  if (!fs.existsSync(file)) {
    console.error(`✗ ${locale}: messages/${locale}.json is missing`);
    failed = true;
    continue;
  }
  let data;
  try {
    data = read(locale);
  } catch (e) {
    console.error(`✗ ${locale}: not valid JSON (${e.message})`);
    failed = true;
    continue;
  }
  const errors = [];
  const warnings = [];
  compare(en, data, "", errors, warnings);
  if (errors.length) failed = true;
  console.log(`${errors.length ? "✗" : "✓"} ${locale}: ${errors.length} errors, ${warnings.length} untranslated-looking strings`);
  for (const e of errors) console.log(`    error  ${e}`);
  for (const w of warnings) console.log(`    check  ${w}`);
}
// English must parse too.
const enErrors = [];
compare(en, en, "", enErrors, []);
if (enErrors.length) {
  failed = true;
  enErrors.forEach((e) => console.log(`    en error  ${e}`));
}
process.exit(failed ? 1 : 0);
