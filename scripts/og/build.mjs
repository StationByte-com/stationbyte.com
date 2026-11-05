// Builds the 1200×630 social preview images in public/og from each page's own visual.
// Text is set in Geist and converted to outlines, so the images don't depend on installed fonts.
// English images go to public/og; every other language, with its headlines from messages/<locale>.json,
// to public/og/<locale>. Japanese and Korean fall back to Noto Sans JP/KR, fetched once from Google Fonts
// into node_modules/.cache. Run `npm run og:build` (all languages) or `npm run og:build -- es ja`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// opentype.js is CommonJS: only the default import works from ESM.
import opentype from "opentype.js";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const font = (f) => opentype.parse(fs.readFileSync(path.join(root, "node_modules/geist/dist/fonts", f)).buffer);
const SEMIBOLD = font("geist-sans/Geist-SemiBold.ttf");
const MONO = font("geist-mono/GeistMono-Medium.ttf");

const W = 1200;
const H = 630;
const INK = "#0A0A0B";
const PAPER = "#F6F6F4";
const FOG = "#A1A1AA";
const SIGNAL = "#3046FF";
const SIGNAL_INK = "#7C8CFF";

/** Path commands to SVG data. opentype's own toPathData can emit NaN for some glyphs, which ends the path early. */
const ok = (...n) => n.every(Number.isFinite);
const f2 = (n) => Math.round(n * 100) / 100;
function pathData(cmds) {
  let d = "";
  for (const c of cmds) {
    if (c.type === "M" && ok(c.x, c.y)) d += `M${f2(c.x)} ${f2(c.y)}`;
    else if (c.type === "L" && ok(c.x, c.y)) d += `L${f2(c.x)} ${f2(c.y)}`;
    else if (c.type === "Q" && ok(c.x1, c.y1, c.x, c.y)) d += `Q${f2(c.x1)} ${f2(c.y1)} ${f2(c.x)} ${f2(c.y)}`;
    else if (c.type === "C" && ok(c.x1, c.y1, c.x2, c.y2, c.x, c.y)) d += `C${f2(c.x1)} ${f2(c.y1)} ${f2(c.x2)} ${f2(c.y2)} ${f2(c.x)} ${f2(c.y)}`;
    else if (c.type === "Z") d += "Z";
  }
  return d;
}

/** Fonts tried, in order, for characters the main font doesn't have (set per language below). */
let fallbacks = [];

/** Text as an SVG path, with tracking in em. Characters missing from `f` come from the first fallback that has them. */
function text(f, str, x, y, size, fill, tracking = 0) {
  let cursor = x;
  const parts = [];
  for (const ch of str) {
    let face = f;
    let glyph = f.charToGlyph(ch);
    if (!glyph.index && ch.trim()) {
      for (const alt of fallbacks) {
        const g = alt.charToGlyph(ch);
        if (g.index) {
          face = alt;
          glyph = g;
          break;
        }
      }
    }
    // Full-width scripts are already spaced; Latin-style negative tracking would make them collide.
    const t = face === f ? tracking : Math.max(tracking, 0);
    parts.push(pathData(glyph.getPath(cursor, y, size).commands));
    cursor += (glyph.advanceWidth / face.unitsPerEm) * size + t * size;
  }
  return { svg: `<path d="${parts.join(" ")}" fill="${fill}"/>`, width: cursor - x };
}

/** Noto Sans JP/KR SemiBold as TrueType: Google Fonts serves one whole .ttf to clients without unicode-range support. */
async function cjkFont(family) {
  const cache = path.join(root, "node_modules/.cache/og-fonts");
  const file = path.join(cache, `${family.replace(/\W+/g, "-")}-600.ttf`);
  if (!fs.existsSync(file)) {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@600`, { headers: { "user-agent": "Mozilla/4.0" } })).text();
    const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
    if (!url) throw new Error(`No TrueType file for ${family}`);
    fs.mkdirSync(cache, { recursive: true });
    fs.writeFileSync(file, Buffer.from(await (await fetch(url)).arrayBuffer()));
  }
  return opentype.parse(fs.readFileSync(file).buffer);
}

/** The logo mark at a given position and tile size. */
function mark(x, y, tile, color = PAPER) {
  const gap = tile * (5 / 18);
  let out = "";
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) {
      if (r === 2 && c === 2) continue;
      const fill = r === 1 && c === 1 ? SIGNAL : color;
      out += `<rect x="${x + c * (tile + gap)}" y="${y + r * (tile + gap)}" width="${tile}" height="${tile}" rx="${tile / 4}" fill="${fill}"/>`;
    }
  return out;
}

const pages = [
  { file: "work", eyebrow: "SELECTED WORK", title: ["Products we build", "and run."], image: "images/skedez-desktop.webp", fit: "contain-top" },
  { file: "skedez", eyebrow: "CASE STUDY · SKEDEZ", title: ["Booking that", "runs itself."], image: "images/skedez-desktop.webp", fit: "contain-top" },
  { file: "services", eyebrow: "SERVICES", title: ["What we design,", "build and run."], mosaic: ["ai", "saas", "apps", "design"] },
  { file: "ai-product-engineering", eyebrow: "AI PRODUCT ENGINEERING", title: ["AI features your", "customers rely on."], image: "images/services/ai.webp" },
  { file: "saas-platforms", eyebrow: "SAAS AND PLATFORMS", title: ["SaaS that grows", "without a rewrite."], image: "images/services/saas.webp" },
  { file: "web-and-mobile-apps", eyebrow: "WEB AND MOBILE APPS", title: ["On the web and", "in every pocket."], image: "images/services/apps.webp" },
  { file: "product-design", eyebrow: "PRODUCT DESIGN", title: ["Designed by the", "people who build it."], image: "images/services/design.webp" },
  { file: "process", eyebrow: "HOW WE WORK", title: ["From idea", "to running."], image: "images/process-stacks.webp", position: "right" },
  { file: "studio", eyebrow: "STUDIO", title: ["Small studio.", "Senior hands."], image: "images/studio-stack.webp" },
  { file: "contact", eyebrow: "START A PROJECT", title: ["Tell us what", "you're building."], image: "images/contact-slot.webp" },
  { file: "privacy", eyebrow: "PRIVACY", title: ["Your data,", "kept small."], image: null },
];

const PANEL = { x: 640, y: 40, w: 520, h: 550, r: 28 };

async function panel(p) {
  const mask = Buffer.from(`<svg width="${PANEL.w}" height="${PANEL.h}"><rect width="${PANEL.w}" height="${PANEL.h}" rx="${PANEL.r}"/></svg>`);
  let img;
  if (p.mosaic) {
    const half = (PANEL.w - 10) / 2;
    const halfH = (PANEL.h - 10) / 2;
    const tiles = await Promise.all(
      p.mosaic.map((m) => sharp(path.join(root, "public/images/services", `${m}.webp`)).resize(Math.round(half), Math.round(halfH), { fit: "cover" }).toBuffer()),
    );
    img = await sharp({ create: { width: PANEL.w, height: PANEL.h, channels: 4, background: INK } })
      .composite(tiles.map((t, i) => ({ input: t, left: i % 2 ? Math.round(half + 10) : 0, top: i > 1 ? Math.round(halfH + 10) : 0 })))
      .png()
      .toBuffer();
  } else if (p.image && p.fit === "contain-top") {
    // A UI screenshot is never cropped at the sides: scale to width and sit it at the top of a graphite panel.
    const shot = await sharp(path.join(root, "public", p.image)).resize(PANEL.w - 48).toBuffer();
    const meta = await sharp(shot).metadata();
    const framed = await sharp(shot).composite([{ input: Buffer.from(`<svg width="${meta.width}" height="${meta.height}"><rect width="${meta.width}" height="${meta.height}" rx="14" fill="none"/></svg>`) }]).png().toBuffer();
    img = await sharp({ create: { width: PANEL.w, height: PANEL.h, channels: 4, background: "#161618" } })
      .composite([{ input: framed, left: 24, top: Math.round((PANEL.h - meta.height) / 2) }])
      .png()
      .toBuffer();
  } else if (p.image) {
    img = await sharp(path.join(root, "public", p.image)).resize(PANEL.w, PANEL.h, { fit: "cover", position: p.position ?? "centre" }).png().toBuffer();
  } else {
    // Privacy: no picture, just the mark large on graphite.
    const svg = `<svg width="${PANEL.w}" height="${PANEL.h}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#161618"/>${mark(110, 125, 82)}</svg>`;
    img = await sharp(Buffer.from(svg)).png().toBuffer();
  }
  return sharp(img).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}

/** The same cards in another language: eyebrows and two-line headlines from that language's messages. */
function localizedPages(m) {
  const service = (slug) => ({ eyebrow: m.services[slug].title, title: m.services[slug].headline });
  const t = {
    work: { eyebrow: m.pages.work.eyebrow, title: m.pages.work.heading },
    skedez: { eyebrow: m.pages.skedez.eyebrow, title: m.pages.skedez.heading },
    services: { eyebrow: m.pages.services.eyebrow, title: m.pages.services.heading },
    "ai-product-engineering": service("ai-product-engineering"),
    "saas-platforms": service("saas-platforms"),
    "web-and-mobile-apps": service("web-and-mobile-apps"),
    "product-design": service("product-design"),
    process: { eyebrow: m.pages.process.eyebrow, title: m.pages.process.heading },
    studio: { eyebrow: m.pages.studio.eyebrow, title: m.pages.studio.heading },
    contact: { eyebrow: m.pages.contact.eyebrow, title: m.pages.contact.heading },
    privacy: { eyebrow: m.pages.privacy.current, title: m.pages.privacy.heading },
  };
  // The homepage card: English has a hand-made one (public/opengraph-image.jpg); other languages get this.
  const home = { file: "home", eyebrow: m.home.hero.eyebrow, title: m.home.hero.title, image: "video/hero-wide-poster.jpg", position: "right" };
  return [...pages.map((p) => ({ ...p, ...t[p.file] })), home];
}

const LEFT = 560; // room for the headline before the picture panel

async function render(list, outDir, locale) {
  fs.mkdirSync(outDir, { recursive: true });
  for (const p of list) {
    const eyebrowText = p.eyebrow.toLocaleUpperCase(locale);
    let eyebrowSize = 18;
    while (text(MONO, eyebrowText, 64, 218, eyebrowSize, SIGNAL_INK, 0.08).width > LEFT && eyebrowSize > 12) eyebrowSize -= 1;
    const eyebrow = text(MONO, eyebrowText, 64, 218, eyebrowSize, SIGNAL_INK, 0.08);
    // Start at the size English used and shrink until both lines fit beside the panel.
    let size = p.title.some((l) => l.length > 17) ? 54 : 62;
    while (Math.max(...p.title.map((l) => text(SEMIBOLD, l, 60, 300, size, PAPER, -0.045).width)) > LEFT && size > 34) size -= 2;
    const l1 = text(SEMIBOLD, p.title[0], 60, 300, size, PAPER, -0.045);
    const l2 = text(SEMIBOLD, p.title[1], 60, 300 + size * (fallbacks.length ? 1.16 : 1.02), size, PAPER, -0.045);
    const word = text(SEMIBOLD, "stationbyte", 112, 103, 30, PAPER, -0.035);
    const url = text(MONO, "STATIONBYTE.COM", 64, 566, 15, FOG, 0.08);
    const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${INK}"/>
      <circle cx="1040" cy="80" r="260" fill="${SIGNAL}" opacity="0.12"/>
      ${mark(64, 70, 11)}${word.svg}${eyebrow.svg}${l1.svg}${l2.svg}${url.svg}
    </svg>`;
    await sharp(Buffer.from(svg))
      .composite([{ input: await panel(p), left: PANEL.x, top: PANEL.y }])
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(path.join(outDir, `${p.file}.jpg`));
    console.log("og", locale, p.file);
  }
}

const source = fs.readFileSync(path.join(root, "src/i18n/locales.ts"), "utf8");
const all = [...source.match(/export const locales = \[([^\]]+)\]/)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const wanted = process.argv.slice(2).length ? process.argv.slice(2) : all;

for (const locale of wanted) {
  fallbacks = locale === "ja" ? [await cjkFont("Noto Sans JP")] : locale === "ko" ? [await cjkFont("Noto Sans KR")] : [];
  if (locale === "en") {
    // English keeps the hand-tuned titles above.
    await render(pages, path.join(root, "public/og"), "en");
    continue;
  }
  const messages = JSON.parse(fs.readFileSync(path.join(root, "messages", `${locale}.json`), "utf8"));
  await render(localizedPages(messages), path.join(root, "public/og", locale), locale);
}
