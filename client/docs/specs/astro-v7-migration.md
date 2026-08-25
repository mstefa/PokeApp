# Spec: client Astro v7 Migration

This specification details the plan, package updates, and configuration adjustments for upgrading the client workspace to Astro v7.

---

## 1. Context & Objectives

To leverage modern bundler features, performance gains, and secure dependencies, the client application is upgraded from Astro v4 to Astro v7. Along with this core upgrade, the respective integrations and adapters are updated to compatible major versions.

---

## 2. Technical Scope

The following package versions are updated in `client/package.json`:

### A. Dependencies
- **`astro`**: `4.16.19` → `7.1.1`
- **`@astrojs/cloudflare`**: `11.2.0` → `14.0.0`
- **`@astrojs/node`**: `10.0.5` → `11.0.2`
- **`@astrojs/react`**: `3.6.3` → `5.0.7`

### B. DevDependencies
- **`@vitejs/plugin-react`**: `4.3.4` → `6.1.0`
- **`vitest`**: `4.1.10` → `4.1.11`
- **`wrangler`**: `3.114.17` → `4.125.0`

---

## 3. Configuration & Compatibility Adjustments

1. **Wrangler Configuration (`client/wrangler.jsonc`)**:
   - In Astro v6+, the adapter provides a unified server entrypoint instead of referencing local output paths directly.
   - Updated the `"main"` field from `"./dist/_worker.js/index.js"` to `"@astrojs/cloudflare/entrypoints/server"`.
2. **TypeScript Configuration (`client/tsconfig.json`)**:
   - Extended `"astro/tsconfigs/strict"` to inherit recommended TypeScript compiler options (such as modern module resolution and synthetic default imports support).
3. **Middleware Type Definitions (`client/src/middleware.ts`)**:
   - Switched from the deprecated `MiddlewareResponseHandler` to `MiddlewareHandler` to align with Astro v7 API definitions and resolve implicit `any` parameter types.
4. **Vite Plugins & Vitest**:
   - Upgraded `@vitejs/plugin-react` to `6.1.0` and `vitest` to `4.1.11` to match Vite v8 / Rolldown expectations and resolve JSX parsing issues in test suites.

---

## 4. Verification Plan

1. **Clean Installation**: Run `pnpm install` in the client directory.
2. **Typecheck Verification**: Run `pnpm run typecheck` to ensure no compiler warnings or errors remain.
3. **Production Compilation**: Run `pnpm run build` to verify the application bundle compiles correctly.
4. **Test Suite Verification**: Run `pnpm run test` to verify client components render correctly.
