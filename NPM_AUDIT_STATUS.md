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

Majors intentionally not taken (no vulnerabilities):

- ESLint 10: `eslint-plugin-react`, `eslint-plugin-import` and `eslint-plugin-jsx-a11y` (required by `eslint-config-next`) do not yet declare ESLint 10 peer support, so installing it would need `--legacy-peer-deps` or overrides. ESLint 9.39.5 is the newest compatible stable release (npm marks the 9.x line as no longer supported).
- TypeScript 7.
- @types/node 26 (kept aligned with Node 20 in the Dockerfile).

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
