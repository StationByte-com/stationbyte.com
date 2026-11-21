# NPM Audit Status

Date: 2026-10-27

Branch: fix/npm-vulnerabilities-next16

## Summary

All vulnerabilities were resolved with package updates only: no npm overrides, no `npm audit fix --force`, no downgrades.

Before: 10 vulnerable packages (2 critical, 7 high, 1 moderate): `next`, `tar`, `postcss` (direct and Next's internal copy), `sharp`, `brace-expansion`, `browserslist`, `js-yaml`, `nanoid`, `source-map-js`, `@humanfs/node`.

After: `npm audit` reports 0 vulnerabilities.

Next.js 15.x still pins its internal `postcss@8.4.31` (vulnerable up to 8.5.22) in every release, including 15.5.28, so the only update-only fix was the Next.js 16 major upgrade (16.4.3 pins `postcss@8.5.23` and `sharp@^0.35.5`).

## Updated packages

- next 15.5.18 → 16.4.3
- react / react-dom 19.1.0 → 19.3.1
- eslint-config-next 15.5.18 → 16.4.3
- postcss 8.5.14 → 8.5.32
- tailwindcss / @tailwindcss/postcss 4.1.8 → 4.3.3 (drops the vulnerable `tar` dependency)
- autoprefixer 10.4.21 → 10.6.2
- eslint 9.28.0 → 9.39.5
- @eslint/eslintrc 3.3.1 → 3.3.7
- typescript 5.8.3 → 5.9.3
- @types/react / @types/react-dom → 19.3.0, @types/node → 20.19.43
- Transitive packages refreshed through lockfile resolution.

## Follow-up update (2026-10-27): remaining packages

- typescript 5.9.3 → 6.0.3
- @types/node 20.19.43 → 24.19.2, matching the runtime
- `Dockerfile.production` base image `node:20-alpine` (end of life since 2026-04-30) → `node:24-alpine` (current LTS)

Every package is now on its newest stable version that installs without overrides or `--legacy-peer-deps`. Newer majors that remain blocked:

- ESLint 10: the latest `eslint-plugin-react` (7.37.5), `eslint-plugin-import` (2.32.0) and `eslint-plugin-jsx-a11y` (6.10.2), all required by `eslint-config-next`, declare peer support only up to ESLint 9. ESLint 9.39.5 is the newest compatible release.
- TypeScript 7: `typescript-eslint` (8.72.1, required by `eslint-config-next`) requires `typescript <6.1.0`. TypeScript 6.0.3 is the newest compatible release.
- @types/node 26: types track the Node runtime. Node 26 only enters LTS on 2026-10-28, so the runtime and types stay on Node 24 LTS.

## Next.js 16 migration changes

- `lint` script changed from `next lint` (removed in Next 16) to `eslint .`.
- `eslint.config.mjs` now imports the native flat configs from `eslint-config-next` instead of using `FlatCompat`.
- `next build` updated `tsconfig.json` (`jsx: react-jsx`, `.next/dev/types/**/*.ts` include).
- `next dev` now generates `AGENTS.md` (Next.js agent rules) and recreates it on every run, so it is committed.

## Verification

- `npm audit`: found 0 vulnerabilities.
- `npm run lint`: 0 errors, 1 warning (`@next/next/no-page-custom-font` in `src/app/layout.tsx`).
- `npm run build`: succeeded on Next.js 16.4.3 (Turbopack).

### Regression check against `main` (Next 15.5.18)

Both builds were served side by side with `next start` and compared with Playwright (Chromium) at 1440×900 and 375×812:

- Routes `/`, a missing page (404), static assets and `/_next/image` optimization: same status codes and image output.
- Rendered text, links, classes, `alt` and `id` attributes of `/` and the 404 page: identical.
- Full-page screenshots with CSS animations frozen: 0 differing pixels on both pages and both viewports.
- Testimonials carousel (every slide via dots, pause, prev/next): 0 differing pixels.
- Mobile menu open/close and body scroll lock, header anchor navigation, 404 "home" link: same behavior.
- No browser console errors other than the expected 404 response. Next 16 also prefetches the 404 route's RSC payload (one extra 404 fetch).
- `next dev` (Turbopack): `/` and the 404 page render with no error overlay. The `next/image` "missing sizes" warning for `/dashboard.jpg` also appears on `main`.
- `Dockerfile.production` builds from a clean checkout (`npm ci` reports 0 vulnerabilities) and the container serves `/`, the 404 page and optimized images. The `EACCES` error writing `/app/.next/cache/images` when running as `user: node` also happens on `main` (the image cache folder is root-owned), so it is not caused by this upgrade.

## Security update (2026-11-21)

Package updates only, still no npm overrides, no `--force`, no `--legacy-peer-deps`.

- GitHub advisories published 2026-11-19 (GHSA-f3mh-rxg3-f5g2, GHSA-7qx7-33qx-rqx2, GHSA-pc58-hwjq-p385, GHSA-rhh4-g77r-r9qj, GHSA-vvgp-ww4w-46vf) affect `next` <= 16.4.4. Minimum raised to `next@^16.4.6`.
- Every other package moved to its newest patch/minor: next-intl 4.15.3, motion 14.14.0, geist 1.9.2, tailwindcss / @tailwindcss/postcss 4.3.5, postcss 8.5.33, oxlint 1.94.0, @formatjs/icu-messageformat-parser 3.5.23.
- Removed unused dev dependencies `@eslint/eslintrc` (left over from ESLint, linting is oxlint) and `autoprefixer` (not in `postcss.config.mjs`; Tailwind 4 handles prefixes).
- Node pinned to 26.13.1 (the 2026-11-10 security release) in `.nvmrc`, `Dockerfile.production` and CI (`node-version-file`). The floating `node:26-alpine` tag could resolve to an older cached image on the build host.
- Runtime image runs `apk upgrade` and removes npm, npx, corepack and yarn. Trivy finds 30 known vulnerabilities (6 high) in the image built from `main`, which is what production ran before this change: npm's bundled undici, brace-expansion, glob, minimatch, ip-address and postcss-selector-parser, plus Alpine's OpenSSL and zlib. The new image reports 0.
- Coolify (v4.7.6, latest; every published Coolify advisory is fixed in earlier versions) builds this app from `Dockerfile.production`, so these changes reach production on the next deploy from `main`. Coolify scans the image on that deploy.
- TypeScript 7.0.2 is available but stays on 6.0.3: it is a major release with no security fix involved.

Repo hardening in the same change:

- `Dockerfile.production`: base image pinned by digest as well as tag. App files are root-owned so the server process (user `node`) cannot rewrite its own code; only `.next/cache` is writable, which also fixes the `EACCES` on the image-optimization cache noted above.
- `package.json` `allowScripts` denies the install scripts of `@swc/core` and `@parcel/watcher` (pulled in by next-intl's extractor, unused here); install and build work without them.
- CI: actions pinned to commit SHAs, `persist-credentials: false` on checkout (zizmor: no findings).
- `.github/dependabot.yml`: weekly updates for npm, the Docker base image and GitHub Actions, with a 7-day cooldown on new releases.
- Contact form rate limit keys on the last `X-Forwarded-For` entry (added by Traefik) instead of the first, which the client controls, and prunes expired entries instead of clearing the whole table.
- `Content-Security-Policy` header with the directives that need no nonces: `base-uri`, `form-action`, `frame-ancestors`, `object-src`, `upgrade-insecure-requests`.
- `gitleaks` over the full git history: no leaks.

Verification: `npm audit` 0 vulnerabilities; lint, i18n:check, typecheck and build pass on Node 26.13.1; `docker build --pull` succeeds; Trivy finds 0 vulnerabilities and 0 secrets in the image; the container serves `/`, `/es`, `/contact` (200), optimized images and a missing page (404), the contact form submits through its server action, and pages show no CSP console errors.
