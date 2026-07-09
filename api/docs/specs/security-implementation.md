# 🛡️ PokeApp Security Specification Implementation

This document details the adaptation and implementation of the Konta Security Specification for the PokeApp Backend API.

## 1. Supply Chain Defense

### 1.1 Granular Script Execution Allowlist (pnpm)
- **Status:** Handled via [pnpm-workspace.yaml](file:///Users/mstefanutti/workspace/PokeApp/api/pnpm-workspace.yaml). Trusted dependencies (such as `esbuild` and `unrs-resolver`) are permitted to run build scripts under `allowBuilds`.
- **Enforcement:** Ensure that `ignore-scripts=true` is **not** set in [api/.npmrc](file:///Users/mstefanutti/workspace/PokeApp/api/.npmrc) to avoid disabling native script execution.

### 1.2 Exact Version Pinning
- **Implementation:**
  - Removed all flexible semver symbols (`^` and `~`) from dependencies and devDependencies in [api/package.json](file:///Users/mstefanutti/workspace/PokeApp/api/package.json).
  - Added `save-exact=true` to [api/.npmrc](file:///Users/mstefanutti/workspace/PokeApp/api/.npmrc) to enforce exact versioning for future additions.

### 1.3 Lockfile Integrity
- **Implementation:** Updated the backend `pnpm-lock.yaml` file after pinning versions. Lockfile verification continues to be enforced in the CI pipeline using `pnpm install --frozen-lockfile`.

---

## 2. CI/CD Pipeline Verification

We updated the verification pipeline in [.github/workflows/pr-check.yml](file:///Users/mstefanutti/workspace/PokeApp/.github/workflows/pr-check.yml) to implement:
- **Type Checking:** Added a backend typecheck step using `pnpm run typecheck` (`tsc --noEmit`).
- **Security Audit:** Configured the audit level to `--audit-level=high` to block builds with high/critical CVEs.
- **Behavioral Supply Chain Scan:** Added an optional Socket CLI dependency scanner (`npx socket cli scan || true`).
- **Database / Integration testing:** Since integration tests require a local database and BDD setup, only unit tests (which run in-memory and mock the database) run in the CI pipeline to keep runs fast and reliable.

---

## 3. Environment & Deployment Security

### 3.1 Security Headers
- **Implementation:** Added a custom security headers middleware in [api/src/app.ts](file:///Users/mstefanutti/workspace/PokeApp/api/src/app.ts) enforcing:
  - `Content-Security-Policy`: Disallows frames and restricts default sources (`default-src 'none'; frame-ancestors 'none'`).
  - `Strict-Transport-Security`: Forces HTTPS connections.
  - `X-Frame-Options`: Denies framing (`DENY`).
  - `X-Content-Type-Options`: Blocks MIME type sniffing (`nosniff`).
  - `Referrer-Policy`: Hides referrer info (`no-referrer`).
  - `X-Permitted-Cross-Domain-Policies`: Disables cross-domain policy files (`none`).

### 3.2 Database Security
- **Adaptation:** PokeApp uses Sequelize object-relational mapping and database synchronization (`sequelize.sync()`) rather than version-controlled SQL migration scripts. All schema changes are declared inside code-managed Sequelize models in the `api/src/infrastructure/persistence/models/` directory. Direct manual alterations of the production database are prohibited.
