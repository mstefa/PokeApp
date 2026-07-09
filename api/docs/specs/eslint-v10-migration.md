# Spec: ESLint v10 Migration

This specification details the plan and configuration design for migrating the backend linter from ESLint v8 to ESLint v10 in the `pokemon-api` workspace.

---

## 1. Context & Objectives

As part of resolving open Dependabot pull requests, Phase 2 upgrades the development dependency `eslint` to `^10.6.0` (PR #18).
ESLint v9 and v10 strictly enforce the new **Flat Configuration** format (`eslint.config.js` or `eslint.config.mjs`) by default. The legacy configuration format (`.eslintrc.json`) is deprecated and no longer natively supported.

---

## 2. Technical Changes

### A. Configuration Format Migration
- **Remove legacy config**: Delete [api/.eslintrc.json](file:///Users/mstefanutti/workspace/PokeApp/api/.eslintrc.json).
- **Create new flat config**: Create `api/eslint.config.js` using ESM syntax.
- **Airbnb-base Compatibility**:
  - The `eslint-config-airbnb-base` rules are loaded using the `@eslint/eslintrc` `FlatCompat` utility to wrap legacy configurations.
- **TypeScript-ESLint integration**:
  - Integrate `@typescript-eslint` plugin and parser within the flat config configuration block.
- **Prettier integration**:
  - Include `eslint-config-prettier` config to disable formatting rules that conflict with Prettier.

### B. package.json script update
- The CLI flag `--ext` is deprecated and unsupported in ESLint v9/v10.
- Update the lint script in `api/package.json`:
  - From: `eslint src/ --ext .ts,.js --fix`
  - To: `eslint src/ --fix`

---

## 3. Verification Plan

1. Install modern ESLint and `@eslint/eslintrc` helper.
2. Formulate and test the `eslint.config.js` rules.
3. Verify linter runs successfully via `pnpm lint`.
4. Ensure code formatting is correct via `pnpm format`.
5. Ensure verification builds pass via `pnpm build`.
