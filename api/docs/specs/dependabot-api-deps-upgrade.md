# Spec: Dependabot API Dependencies Upgrade (PR #44)

This specification details the plan, package updates, and verification results for the general dependency upgrades in the `api` (backend) workspace, as proposed in Dependabot PR #44.

---

## 1. Context & Objectives

To keep the backend application secure, stable, and aligned with upstream releases, Dependabot PR #44 groups the weekly minor and patch upgrades for the `api` workspace. This update resolves outdated production and development dependencies, reducing the surface area of potential bugs and security vulnerabilities.

---

## 2. Technical Scope

The following package versions are updated in `api/package.json`:

### A. Production Dependencies
- **`axios`**: `1.18.1` → `1.19.0`
- **`cors`**: `2.8.5` → `2.8.6`
- **`pg`**: `8.22.0` → `8.23.0`
- **`pino`**: `10.1.0` → `10.3.1`
- **`zod`**: `4.2.0` → `4.4.3`

### B. Development Dependencies
- **`@cucumber/cucumber`**: `13.0.0` → `13.2.1`
- **`@eslint/eslintrc`**: `3.3.5` → `3.3.6`
- **`@types/pino`**: `7.0.4` → `7.0.5`
- **`@types/supertest`**: `7.2.0` → `7.2.1`
- **`@typescript-eslint/eslint-plugin`**: `8.63.0` → `8.67.0`
- **`@typescript-eslint/parser`**: `8.63.0` → `8.67.0`
- **`eslint`**: `10.6.0` → `10.9.0`
- **`prettier`**: `3.9.4` → `3.9.6`
- **`tsc-alias`**: `1.9.0` → `1.9.2`
- **`tsx`**: `4.23.0` → `4.23.12`
- **`vitest`**: `4.1.10` → `4.1.11`

---

## 3. Impact Analysis

1. **Production Runtime**:
   - `pg` v8.23.0 is a minor update with bug fixes and stability improvements for the PostgreSQL client.
   - `axios` v1.19.0 and `cors` v2.8.6 are minor versions with backward-compatible bug fixes.
   - `pino` v10.3.1 and `zod` v4.4.3 are fully backward-compatible and resolve minor typing and validation edge-cases.
2. **Tooling & Linter**:
   - ESLint and typescript-eslint components are updated to consistent minor versions, preventing parsing discrepancies.
   - Test runners (`vitest` and `@cucumber/cucumber`) remain fully compatible with current test suites.

---

## 4. Verification & Testing

The verification plan consists of:
1. Re-installing dependencies with `pnpm install` in the API workspace.
2. Building the API workspace via `pnpm build` to verify compilation.
3. Running all Unit Tests using `pnpm test:unit`.
4. Starting local services (PostgreSQL container) and running all Integration & BDD BDD scenarios using `pnpm test:integration`.

All tests have successfully run and passed on the local branch, confirming zero regressions.
