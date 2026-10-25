# 🔒 Client Undici Security Overrides & TS6 Typecheck Alignment

This specification documents the remediation of `undici` transitive vulnerabilities and TypeScript 6.0 `tsconfig.json` alignment in the `/client` workspace.

## Context & Rationale
1. **Transitive `undici` Vulnerabilities**:
   - `pnpm audit` identified 6 vulnerabilities (2 high, 4 moderate) across `undici@7.29.1` (pinned in `miniflare`) and `undici@8.11.2` (via `unifont` and `jsdom`):
     - `GHSA-xjj6-f33q-929c` (High): Denial of Service via unhandled error on excessive content-encodings.
     - `GHSA-4qv8-2p9j-2685` (Moderate): Denial of Service via unbounded memory in the EventSource parser.
     - `GHSA-f72v-6w45-q472` (Moderate): Subresource Integrity bypass via non-lowercase algorithm tokens.
   - Added scoped `overrides` in `client/pnpm-workspace.yaml` (`undici@>=7.0.0 <7.30.1: "^7.30.1"` and `undici@>=8.0.0 <8.12.2: "^8.12.2"`), resolving `undici` to `7.30.1` and `8.12.3`.
2. **TypeScript 6.0 `baseUrl` Deprecation Fix**:
   - Following the upgrade to `typescript@6.0.3` in PR #79, `pnpm run typecheck` failed with `TS5101: Option 'baseUrl' is deprecated`.
   - Updated `client/tsconfig.json` to remove `baseUrl` and use relative path mapping (`"@/*": ["./src/*"]`).

## Verification
- `pnpm audit`: `No known vulnerabilities found` (0 vulnerabilities).
- `pnpm run typecheck`, `pnpm run test --run`, and `pnpm run build`: All passing with exit code 0.
