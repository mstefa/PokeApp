# 📝 PokeApp Client Changelog

All notable changes to the PokeApp Client (`client` workspace) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Deploy Workflow Split:**
  - `docs/specs/deploy-workflows-spec.md`: Specification for splitting the API and client deployment workflows with manual triggers and path filters.
  - `.github/workflows/deploy-client.yml`: GitHub Actions workflow to deploy the frontend client to Cloudflare Workers.
- Created unified central workspace maps.
- Configured modular CSS architecture and design tokens in [Layout.astro](file:///Users/mstefanutti/workspace/PokeApp/client/src/layouts/Layout.astro).
- Implemented specifications and step-by-step plans under [landing-and-filters-spec.md](file:///Users/mstefanutti/workspace/PokeApp/client/docs/specs/landing-and-filters-spec.md).
- Added interactive Pokéball and "PULSAR START" button with floating keyframe animations, audio feedback, and fullscreen whiteout transition on `/`.
- Added **"Limpiar Filtros" (Clear Filters)** button to `SearchBar` component to turn off active search filters in one click.
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
