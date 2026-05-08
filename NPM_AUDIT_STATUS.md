# NPM Audit Status

Date: 2026-05-08

Branch: codex/fix-npm-vulnerabilities

## Summary

Package updates were applied without npm overrides, forced audit fixes, dependency downgrades, or a Next.js major upgrade.

Updated packages:

- next 15.5.18
- eslint-config-next 15.5.18
- postcss 8.5.14
- Transitive vulnerable packages refreshed through npm lockfile resolution, including brace-expansion, flatted, picomatch, and tar.

## Remaining Audit Finding

`npm audit` still reports 2 moderate severity vulnerabilities involving `next` and its internal `postcss` dependency:

- `postcss <8.5.10`: GHSA-qx2v-qp2m-jg93, "PostCSS has XSS via Unescaped </style> in its CSS Stringify Output"
- `next 9.3.4-canary.0 - 16.3.0-canary.5`: depends on vulnerable versions of `postcss`

No high severity vulnerabilities are reported by the final audit.

The remaining finding is caused by Next.js pinning its internal `postcss` dependency to `8.4.31`. The project is on stable `next@15.5.18`, which still pins internal `postcss@8.4.31`; stable `next@16.2.6` also still pins internal `postcss@8.4.31`. `npm audit` suggests `npm audit fix --force`, which would install `next@9.3.3`; that is an unsafe downgrade and a breaking change. The current canary release has moved its internal `postcss` dependency, but canary adoption and Next.js major upgrades are outside the approved scope.

## Verification

Task 2 ran:

- `npm audit`: exits with code 1 because of the remaining 2 moderate `next`/internal `postcss` findings described above.

Final verification after package updates should include:

- `npm audit`
- `npm run lint`
- `npm run build`

Task 2 did not run `npm run lint` or `npm run build`.
