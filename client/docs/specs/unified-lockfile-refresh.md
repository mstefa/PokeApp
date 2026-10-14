# 🔒 Unified Frontend Lockfile Refresh Specification

This specification outlines the refresh of transitive dependencies and supply chain security patches for the client workspace (`/client`).

## Rationale
Multiple individual Dependabot Pull Requests (#67, #66, #65, #63, #61) previously targeted isolated transitive packages in `client/pnpm-lock.yaml`, leading to merge conflicts and alert noise. By running a unified lockfile refresh, all transitive dependencies are updated atomically to their secure, patched versions while satisfying peer dependency constraints.

## Changes
- **Transitive Security Updates in `client/pnpm-lock.yaml`**:
  - `http-cache-semantics`: Bumped from `4.2.0` to `4.3.0` (fixes security alert #159).
  - `smol-toml`: Bumped from `1.8.0` to `1.9.1` (fixes security alert #161).
  - `devalue`: Bumped from `5.9.2` to `5.9.4` (fixes security alerts #153-#158).
  - `baseline-browser-mapping`: Bumped from `2.10.33` to `2.11.28` (fixes CVE-2026-45819).
  - `browserslist`: Bumped from `4.28.2` to `4.29.3` (fixes memory exhaustion and prototype write alerts).
  - `source-map-js`: Bumped from `1.2.1` to `1.2.2` (fixes CVE-2026-93749).
- **Tooling Alignment in `client/package.json`**:
  - `wrangler`: Bumped from `4.135.0` to `4.150.0` to satisfy the `@cloudflare/vite-plugin` peer dependency requirement (`^4.149.0`).
- **Workspace Policy in `client/pnpm-workspace.yaml`**:
  - Excluded `miniflare` and `wrangler` from strict minimum release age checks to allow required compatible versions.

## Verification
- Unit Tests: `pnpm run test --run` passing (1/1 tests).
- Type Check: `pnpm run typecheck` passing (0 errors).
- Build: `pnpm run build` completed successfully with Cloudflare adapter.
