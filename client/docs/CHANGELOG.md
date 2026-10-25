# 📝 PokeApp Client Changelog

All notable changes to the PokeApp Client (`client` workspace) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - 2026-10-25

### Added
- **Undici Security Overrides & TS6 Alignment Specification:**
  - `client/docs/specs/undici-security-and-ts6-fixes.md`: Specification detailing `undici` security overrides and `tsconfig.json` path mapping update for TypeScript 6.0.

### Security
- **Transitive `undici` Vulnerability Patches:**
  - `client/pnpm-workspace.yaml` & `client/pnpm-lock.yaml`: Added overrides for `undici` (`>=7.0.0 <7.30.1` -> `^7.30.1` and `>=8.0.0 <8.12.2` -> `^8.12.2`), resolving `GHSA-xjj6-f33q-929c`, `GHSA-4qv8-2p9j-2685`, and `GHSA-f72v-6w45-q472` (`undici@7.30.1` and `undici@8.12.3`).

### Changed
- **TypeScript 6.0 Configuration:**
  - `client/tsconfig.json`: Removed deprecated `baseUrl` option and updated `@/*` path alias to `./src/*` so `pnpm run typecheck` passes cleanly under TypeScript 6.0.3.
  - `.github/dependabot.yml`: Added `ignore` rule for major `typescript` updates (`version-update:semver-major`).

## [Unreleased] - 2026-10-14

### Added
- **Dependabot Optimization Specification:**
  - `client/docs/specs/dependabot-monthly-grouping-optimization.md`: Specification detailing Dependabot monthly grouping, GitHub actions bundling, and PR noise reduction.

### Changed
- **Dependabot Configuration:**
  - `.github/dependabot.yml`: Switched update interval to monthly, removed minor/patch restriction to group all version bumps, added GitHub Actions grouping, and retained `open-pull-requests-limit: 2`.

## [Unreleased] - 2026-10-13

### Added
- **pnpm Settings Cleanup Specification:**
  - `client/docs/specs/pnpm-settings-cleanup.md`: Specification detailing migration of `onlyBuiltDependencies` from `package.json` to `pnpm-workspace.yaml`.
- **Vitest v5 Alignment Specification:**
  - `client/docs/specs/vitest-v5-alignment.md`: Specification detailing the upgrade of `vitest` to version `5.0.3` to match backend tooling.
- **Unified Frontend Lockfile Refresh Specification:**
  - `client/docs/specs/unified-lockfile-refresh.md`: Specification detailing the unified refresh of transitive dependencies and supply chain security patches.

### Security
- **Transitive Dependency Vulnerability Patches:**
  - Patched `http-cache-semantics` (4.2.0 -> 4.3.0), `smol-toml` (1.8.0 -> 1.9.1), `devalue` (5.9.2 -> 5.9.4), `baseline-browser-mapping` (2.10.33 -> 2.11.28), `browserslist` (4.28.2 -> 4.29.3), and `source-map-js` (1.2.1 -> 1.2.2) in `client/pnpm-lock.yaml`.

### Changed
- **CI/CD Workflow Documentation:**
  - `.github/workflows/pr-check.yml`: Updated comments on client security audit to reflect Astro v7 and Cloudflare adapter v14.
- **Tooling Alignment:**
  - `client/package.json`: Removed deprecated `pnpm.onlyBuiltDependencies` block to eliminate warning in pnpm v11+.
  - `client/pnpm-workspace.yaml`: Moved `onlyBuiltDependencies` list (`esbuild`, `sharp`, `workerd`) to workspace configuration.
  - `client/package.json`: Upgraded `vitest` from `4.1.11` to `5.0.3` to align with the backend test suite.
  - `client/src/components/PokemonDetail.test.tsx`: Migrated matchers import to `@testing-library/jest-dom/vitest`.
  - `client/package.json`: Bumped `wrangler` from `4.135.0` to `4.150.0` to satisfy `@cloudflare/vite-plugin` peer dependency requirements.
  - `client/pnpm-workspace.yaml`: Added exclusions for `miniflare` and `wrangler` release ages.

---

## [0.1.0] - 2026-08-25

### Added
- **Astro v7 Migration Specification:**
  - `client/docs/specs/astro-v7-migration.md`: Specification detailing the client-side upgrade to Astro v7 and its integrations/adapters.

### Changed
- **Astro & Integrations Upgrade (PR #39, #38, #28):**
  - Upgraded dependencies in `client/package.json`: `astro` (7.1.1), `@astrojs/cloudflare` (14.0.0), `@astrojs/node` (11.0.2), and `@astrojs/react` (5.0.7).
  - Upgraded devDependencies in `client/package.json`: `@vitejs/plugin-react` (6.1.0), `vitest` (4.1.11), and `wrangler` (4.125.0).
  - Configured `client/tsconfig.json` to extend `"astro/tsconfigs/strict"` for modern module resolution.
  - Configured `client/wrangler.jsonc` to use `@astrojs/cloudflare/entrypoints/server` as the main server entrypoint.
  - Updated `client/src/middleware.ts` to use Astro's `MiddlewareHandler` types.
  - Updated lockfile `client/pnpm-lock.yaml`.

### Added
- **Security Specification:**
  - `client/docs/specs/security-implementation.md`: Specification detailing the implementation of supply chain defense, CI/CD checks, and environment/hosting controls.
- **Security Headers Middleware:**
  - `client/src/middleware.ts`: Astro response middleware setting CSP, HSTS, X-Frame-Options, Referrer-Policy, X-Content-Type-Options, and X-Permitted-Cross-Domain-Policies for Cloudflare deployment.
- **Dependabot Noise Reduction Specification:**
  - `client/docs/specs/dependabot-noise-reduction.md`: Specification detailing the changes to reduce Dependabot Pull Request noise.
- **Deploy Workflow Split:**
  - `docs/specs/deploy-workflows-spec.md`: Specification for splitting the API and client deployment workflows with manual triggers and path filters.
  - `.github/workflows/deploy-client.yml`: GitHub Actions workflow to deploy the frontend client to Cloudflare Workers.
  - `docs/specs/responsiveness-fixes-spec.md`: Specification detailing responsiveness and mobile viewport layout changes.
- Created unified central workspace maps.
- Configured modular CSS architecture and design tokens in [Layout.astro](file:///Users/mstefanutti/workspace/PokeApp/client/src/layouts/Layout.astro).
- Implemented specifications and step-by-step plans under [landing-and-filters-spec.md](file:///Users/mstefanutti/workspace/PokeApp/client/docs/specs/landing-and-filters-spec.md).
- Added interactive Pokéball and "PULSAR START" button with floating keyframe animations, audio feedback, and fullscreen whiteout transition on `/`.
- Added **"Limpiar Filtros" (Clear Filters)** button to `SearchBar` component to turn off active search filters in one click.

### Changed
- **Supply Chain Defense & Exact Version Pinning:**
  - `client/package.json`: Pinned all dependency and devDependency versions exactly (removing `^` and `~`). Added `"typecheck": "tsc --noEmit"` script.
  - `client/.npmrc`: Added `save-exact=true` to enforce exact version saving by default.
  - `.github/workflows/pr-check.yml`: Integrated optional Socket CLI scans for the frontend.
- **Dependabot Configuration:**
  - `.github/dependabot.yml`: Reduced `open-pull-requests-limit` from `5` to `2` and added a 1-day cooldown policy (`cooldown: default-days: 1`) for frontend client dependencies.
- **Mobile Responsiveness Fixes:** Updated `Navbar.module.css`, `index.astro`, `SearchBar.module.css`, `Pagination.module.css`, `CreatePokemon.module.css`, and `PokemonDetail.module.css` with responsive media queries, flex wrapping, and increased mobile touch target sizes (48px) to comply with Kanto Retro-Sleek design system guidelines.

### Fixed
- **SSR API URL Resolution on Cloudflare:** Updated [home.astro](file:///Users/mstefanutti/workspace/PokeApp/client/src/pages/home.astro), [create.astro](file:///Users/mstefanutti/workspace/PokeApp/client/src/pages/create.astro), and [[id].astro](file:///Users/mstefanutti/workspace/PokeApp/client/src/pages/pokemon/[id].astro) to prioritize `import.meta.env.PUBLIC_API_URL` over non-prefixed runtime variables, ensuring the Render URL is statically baked in at build time and preventing the localhost fallback/403 block on Cloudflare.
- Updated `client/pnpm-workspace.yaml` to define `packages` workspace pattern, resolving the `packages field missing or empty` error during Cloudflare deployments using pnpm.
- Fixed duplicate key `"dragon"` in the `typeTranslation` object literal in [TypeBadge.tsx](file:///Users/mstefanutti/workspace/PokeApp/client/src/components/ui/TypeBadge.tsx).
- Added `wrangler` to `client/package.json` devDependencies to ensure it is installed and cached on CI/CD systems, avoiding the `wrangler: not found` execution error.
- Added `client/public/.assetsignore` to exclude the server-side `_worker.js` directory from being uploaded as a static asset, resolving the Cloudflare build blocker.

### Changed
- Refactored landing page layout to align with Kanto Retro-Sleek design tokens.
- Updated `Layout.astro` to conditionally render the global navigation bar based on the current page route, hiding it on `/`.
- Eliminated all `!important` rules from CSS modules by using element-qualified class selectors (e.g., `button.className`) to increase specificity.
- Migrated client build framework from Create React App (CRA) to Astro SSR.
- Replaced npm package manager with pnpm.
- Replaced Redux global state management with URL Search Parameters.
- Swapped Enzyme testing framework with Vitest and React Testing Library (RTL).
- Updated `client/wrangler.jsonc` to deploy the Astro client as a Cloudflare Worker with assets (Workers Builds) and added observability logging configurations.

### Removed
- Removed the `deploy-frontend` job from the GitHub Actions CD workflow in favor of Cloudflare Workers Builds integration.
