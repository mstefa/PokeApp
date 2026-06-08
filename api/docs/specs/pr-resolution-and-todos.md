# Spec: API Types Seeding, TS 6 Compatibility, & Future Upgrade Plan

This specification details the design for introducing type seeding to the API database, modernizing TS compiler configuration, and tracking the future upgrades of high-risk dependencies.

---

## 1. Context & Objectives

### A. Automatic Pokemon Types Seeding
The current TypeScript rewrite of the backend did not carry over the dynamic seeding of Pokemon types from the legacy Javascript version. This causes integration tests and client pages to fail on clean database environments.
* **Goal**: Automatically check if the `types` table is empty upon calling `GET /types` or at startup, fetch all types from the PokeAPI if so, populate the database table, and serve the request.

### B. TypeScript 6 Compatibility
* **Goal**: Modernize the compiler options in the API's [tsconfig.json](file:///Users/mstefanutti/workspace/PokeApp/api/tsconfig.json) using the `"ignoreDeprecations": "6.0"` configuration block. This prevents compilation failures under modern compiler versions while preserving the path mapping and module resolution structures.

---

## 2. Detailed Technical Design

### A. Dynamic Seeding of Types
We will integrate a seeding helper inside the `LocalDatabaseTypeRepository`'s `findAll` method:
1. When `findAll()` is invoked:
   * Query the `types` table.
   * If the returned array length is `0`, make an external HTTP request to PokeAPI (`https://pokeapi.co/api/v2/type`).
   * For each type returned, extract the ID (e.g. from the resource URL `/type/10/`) and the name.
   * Store these types in the database using `TypeModel.create` or `TypeModel.findOrCreate`.
   * Re-query the database to return the newly seeded types.

### B. TS 6 Compatibility
We will append the `"ignoreDeprecations": "6.0"` option inside the `compilerOptions` of [tsconfig.json](file:///Users/mstefanutti/workspace/PokeApp/api/tsconfig.json).

---

## 3. Future Upgrade Roadmap (TODOs)

The following high-risk Dependabot pull requests require future verification and major upgrades:

- [ ] **Wrangler v4.x Deployment Testing**:
  * **Scope**: Bumping `wrangler` from `3.114.17` to `4.98.0` in the client devDependencies.
  * **Verification**: Verify that Wrangler v4 compatibility exists for the Cloudflare Pages Astro build, checking `wrangler.jsonc` path resolutions.
- [ ] **Astro 5 & React 19 Migration**:
  * **Scope**: Major migration updating the client workspace to React 19, `@astrojs/react` 5.x, and Astro 5.x.
  * **Verification**: Confirm hydration works across React islands and resolve any legacy context/ref APIs.
