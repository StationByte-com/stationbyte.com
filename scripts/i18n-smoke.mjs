// Fetches every page in every language from a running server and checks what search engines and people get:
//   status 200, <html lang>, one self-referencing canonical, a complete hreflang set with x-default,
//   og:locale, no untranslated message keys, and the per-language llms.txt files.
// Run against a local production build: npm run build && npx next start -p 3107, then
//   node scripts/i18n-smoke.mjs [base URL, default http://localhost:3107]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = (process.argv[2] ?? "http://localhost:3107").replace(/\/$/, "");
const SITE = "https://stationbyte.com";

const source = fs.readFileSync(path.join(root, "src/i18n/locales.ts"), "utf8");
const locales = [...source.match(/export const locales = \[([^\]]+)\]/)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const htmlLang = Object.fromEntries([...source.matchAll(/"?([a-z-]+)"?: \{ name: "[^"]+", short: "[^"]+", htmlLang: "([^"]+)"/g)].map((m) => [m[1], m[2]]));
const services = [...fs.readFileSync(path.join(root, "src/content/services.ts"), "utf8").matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
const paths = ["/", "/work", "/work/skedez", "/services", ...services.map((s) => `/services/${s}`), "/process", "/studio", "/contact", "/privacy"];
const at = (locale, p) => (locale === "en" ? p : `/${locale}${p === "/" ? "" : p}`);

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`  ✗ ${msg}`);
};

for (const locale of locales) {
  let ok = 0;
  for (const p of paths) {
    const url = at(locale, p);
    const res = await fetch(base + url, { redirect: "manual" });
    if (res.status !== 200) {
      fail(`${url}: HTTP ${res.status}`);
      continue;
    }
    const html = await res.text();
    const before = failures;
    const lang = html.match(/<html[^>]*\blang="([^"]+)"/)?.[1];
    if (lang !== htmlLang[locale]) fail(`${url}: <html lang="${lang}">, expected "${htmlLang[locale]}"`);
    const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
    const expected = `${SITE}${url === "/" ? "" : url}`;
    if (canonical.length !== 1 || canonical[0] !== expected) fail(`${url}: canonical ${JSON.stringify(canonical)}, expected ${expected}`);
    const alternates = [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/gi)].map((m) => [m[1], m[2]]);
    if (alternates.length !== locales.length + 1) fail(`${url}: ${alternates.length} hreflang links, expected ${locales.length + 1}`);
    if (!alternates.some(([l, h]) => l === "x-default" && h === `${SITE}${p === "/" ? "" : p}`)) fail(`${url}: x-default missing or wrong`);
    if (!alternates.some(([, h]) => h === expected)) fail(`${url}: hreflang set doesn't include the page itself`);
    if (!/<meta property="og:locale" content="[a-z]{2}_[A-Z]{2}"/.test(html)) fail(`${url}: og:locale missing`);
    // next-intl prints the key path when a message is missing, e.g. "pages.work.title".
    const leaked = html.match(/>(?:pages|common|home|contactForm|visuals|services|language|footer|header|nav)\.[a-zA-Z.]+</);
    if (leaked) fail(`${url}: untranslated key ${leaked[0]}`);
    if (failures === before) ok++;
  }
  for (const file of ["llms.txt", "llms-full.txt"]) {
    const url = locale === "en" ? `/${file}` : `/${locale}/${file}`;
    const res = await fetch(base + url);
    if (res.status !== 200) fail(`${url}: HTTP ${res.status}`);
    else if (!(await res.text()).startsWith("# StationByte")) fail(`${url}: unexpected content`);
  }
  console.log(`${locale}: ${ok}/${paths.length} pages clean`);
}

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = (sitemap.match(/<url>/g) ?? []).length;
if (urls !== paths.length * locales.length) fail(`sitemap.xml: ${urls} URLs, expected ${paths.length * locales.length}`);
if (!sitemap.includes('hreflang="x-default"')) fail("sitemap.xml: no x-default alternates");
console.log(`sitemap.xml: ${urls} URLs`);

console.log(failures ? `\n${failures} problems` : "\nAll good");
process.exit(failures ? 1 : 0);
