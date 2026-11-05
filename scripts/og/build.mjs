// Builds the 1200×630 social preview images in public/og from each page's own visual.
// Text is set in Geist and converted to outlines, so the images don't depend on installed fonts.
// Run with `npm run og:build` after changing a page title or visual.
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

/** Text as an SVG path, with tracking in em. */
function text(f, str, x, y, size, fill, tracking = 0) {
  let cursor = x;
  const parts = [];
  for (const ch of str) {
    const glyph = f.charToGlyph(ch);
    parts.push(pathData(glyph.getPath(cursor, y, size).commands));
    cursor += (glyph.advanceWidth / f.unitsPerEm) * size + tracking * size;
  }
  return { svg: `<path d="${parts.join(" ")}" fill="${fill}"/>`, width: cursor - x };
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

fs.mkdirSync(path.join(root, "public/og"), { recursive: true });
for (const p of pages) {
  const eyebrow = text(MONO, p.eyebrow, 64, 218, 18, SIGNAL_INK, 0.08);
  const size = p.title.some((l) => l.length > 17) ? 54 : 62;
  const l1 = text(SEMIBOLD, p.title[0], 60, 300, size, PAPER, -0.045);
  const l2 = text(SEMIBOLD, p.title[1], 60, 300 + size * 1.02, size, PAPER, -0.045);
  const word = text(SEMIBOLD, "stationbyte", 112, 103, 30, PAPER, -0.035);
  const url = text(MONO, "STATIONBYTE.COM", 64, 566, 15, FOG, 0.08);
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${INK}"/>
    <circle cx="1040" cy="80" r="260" fill="${SIGNAL}" opacity="0.12"/>
    ${mark(64, 70, 11)}${word.svg}${eyebrow.svg}${l1.svg}${l2.svg}${url.svg}
  </svg>`;
  const out = path.join(root, "public/og", `${p.file}.jpg`);
  await sharp(Buffer.from(svg))
    .composite([{ input: await panel(p), left: PANEL.x, top: PANEL.y }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(out);
  console.log("og", p.file);
}
