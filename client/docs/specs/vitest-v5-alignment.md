# 🧪 Vitest v5 Alignment Specification

This specification documents the upgrade of `vitest` from `4.1.11` to `5.0.3` in the frontend client workspace (`/client`).

## Rationale
The backend API (`/api`) was updated to `vitest: 5.0.3` via PR #69. Aligning the frontend client workspace to the same major and minor release ensures consistent testing capabilities, runner behaviors, and reporter ergonomics across the repository.

## Changes
- **Dependency Version Update (`client/package.json`)**:
  - `vitest`: Updated from `4.1.11` to `5.0.3`.
- **Test Matcher Import (`client/src/components/PokemonDetail.test.tsx`)**:
  - Replaced `import '@testing-library/jest-dom'` with `import '@testing-library/jest-dom/vitest'` to properly extend Vitest 5's `Assertion` interface and preserve TypeScript type checking for DOM matchers (e.g., `.toBeInTheDocument()`).
- **Lockfile Refresh (`client/pnpm-lock.yaml`)**:
  - Updated Vitest dependencies and sub-dependencies.

## Verification
- Unit Tests: `pnpm run test --run` passing (1/1 tests).
- Type Check: `pnpm run typecheck` passing (0 errors).
- Build: `pnpm run build` completed successfully.
