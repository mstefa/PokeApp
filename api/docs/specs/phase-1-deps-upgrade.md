# Spec: Phase 1 Dependency Upgrades (http-status & @types/sequelize)

This specification details the plan and execution for upgrading the first phase of backend dependencies in the `pokemon-api` workspace.

---

## 1. Context & Objectives

As part of resolving open Dependabot pull requests, Phase 1 focuses on two low-risk upgrades in the API workspace that are currently outdated:
- **`http-status`**: Upgrading from `^1.7.4` (or `1.8.1`) to `^2.1.0`.
- **`@types/sequelize`**: Upgrading from `^4.28.20` to `^6.12.0`.

These packages need to be updated directly on the `main` branch (via a dedicated PR/branch) to avoid lockfile downgrades caused by old Dependabot branch dates.

---

## 2. Technical Scope

### A. http-status Upgrade
- **Current version**: `^1.7.4`
- **Target version**: `^2.1.0` (Major version update)
- **Impact Analysis**:
  - `http-status` v2 is ESM-first and includes typescript definitions built-in.
  - The project imports `http-status` via `import httpStatus from 'http-status'`.
  - The default export is preserved in v2, meaning existing code syntax is compatible and does not require rewrite.
  - The upgrade eliminates the need for separate `@types/http-status` definitions if they existed.

### B. @types/sequelize Upgrade
- **Current version**: `^4.28.20`
- **Target version**: `^6.12.0`
- **Impact Analysis**:
  - The project runs on `sequelize@^6.35.2`.
  - The old types (`v4`) are misaligned with the runtime version.
  - Upgrading to `v6` alignment fixes static analysis type matching without runtime impact.

---

## 3. Verification Plan

1. Install upgraded versions via `pnpm`.
2. Compile/Type-check the project with `pnpm build`.
3. Run unit tests with `pnpm test:unit` to verify everything remains healthy.
