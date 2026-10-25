# 🔒 API Dependabot PR #80 Resolution & Transitive Vulnerability Patches

This specification documents the resolution of Dependabot PR #80 (`dependabot/npm_and_yarn/api/dependencies-0071e70689`) and the remediation of GitHub Dependabot and `pnpm audit` security alerts in `/api`.

## Context & Rationale
1. **Dependabot PR #80 (`build(deps): bump the dependencies group in /api with 6 updates`)**:
   - Bumped `dotenv` (`17.4.2` -> `18.0.7`), `zod` (`4.6.6` -> `4.6.7`), `@typescript-eslint/eslint-plugin` (`8.71.1` -> `8.71.2`), `@typescript-eslint/parser` (`8.71.1` -> `8.71.2`), `vitest` (`5.0.3` -> `5.0.4`), and `typescript` (`6.0.3` -> `7.0.2`).
   - Upgrading `typescript` to `7.0.2` broke CI because `@typescript-eslint@8.71.2` does not support TypeScript 7.0 (`Error: typescript-eslint does not support TS 7.0`) and TypeScript 7.0 removed `moduleResolution: "node"` and `baseUrl`.
   - Retaining `typescript` at `6.0.3` (matching `/client`) and ignoring major `typescript` bumps in `.github/dependabot.yml` keeps the toolchain compatible while applying the other 5 updates.
2. **Transitive Security Vulnerabilities**:
   - Multiple open GitHub Dependabot and `pnpm audit` advisories existed in `api/pnpm-lock.yaml`:
     - `body-parser` (`2.3.0` -> `2.4.0`): Fixes `GHSA-27r3-jxmh-p828` (High — DoS via trailing bytes after a compressed request body).
     - `follow-redirects` (`1.16.0` -> `1.16.1`): Fixes `GHSA-q3jh-wrc6-jgq8` (Alert #164, High) and `GHSA-8r9p-f939-6h3c` (Alert #163, High).
     - `moment` (`2.30.1` -> `2.31.0`): Fixes `GHSA-4p3w-j4w9-5jqw` (Alert #135, Moderate — Path Traversal via crafted non-string locale name).
     - `brace-expansion` (`1.1.18` -> `1.1.21`): Fixes `GHSA-q2hr-2g5m-vwhr` (Alert #148, Moderate), `GHSA-qhr7-859c-m2p7` (High), and `GHSA-6j4f-fj2g-mc7p` (High).
     - `vite` (`8.0.16` -> `8.3.5`): Fixes `GHSA-587h-7wmj-h5pm` (Alert #166, High), `GHSA-r825-w8mm-5pxw` (Alert #167, Moderate), `GHSA-698v-4r3x-3vcv` (Alert #165, Moderate), `GHSA-rq7h-c2jc-7f22` (Moderate), and `GHSA-9jrq-w75r-8gcw` (Low).

## Verification
- `pnpm audit`: 0 unignored vulnerabilities (`1 moderate (1 ignored)` for `uuid@8.3.2` pinned by `sequelize`).
- `pnpm run lint`, `pnpm exec prettier --check "src/**/*.ts"`, `pnpm run typecheck`, `pnpm run test:unit`, and `pnpm run build`: All passing with exit code 0.
