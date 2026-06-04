# Agent Instructions

This project follows an Astro SSR and React Island architecture for its modern TypeScript client codebase.

## Reference Documentation
- **Migration Plan:** [docs/migration_plan.md](docs/migration_plan.md) - The master strategy checklist for the Astro and pnpm transition.
- **Astro SSR Guide:** [docs/ssr_astro_migration.md](docs/ssr_astro_migration.md) - Project folder mapping, routing, and state parameters configuration.
- **Package Manager Setup:** [docs/pnpm_migration.md](docs/pnpm_migration.md) - Commands and workspace/standalone deployment steps.
- **Architecture Specification:** [docs/architecture.md](docs/architecture.md) - Components layout, sequence diagrams, and directory organization.

## Core Mandates
- **Framework Structure**: Keep routing clean by using file-based Astro route components inside `src/pages/`.
- **Astro Pages vs. React Islands**: Only write interactive components (such as search boxes, filter actions, or form inputs) in React, and load them in Astro via client directives (e.g., `<SearchBar client:load />`). Presentational details should be compiled to pure static HTML on the server.
- **Styling**: Always use CSS Modules (e.g., `*.module.css`) for styling client components. Do not install or introduce Tailwind CSS or global frameworks.
- **State Management & Routing**:
  - Do not use Redux, MobX, or other global state managers.
  - Fetch content on the server side using Astro frontmatter data loaders.
  - Store filter, search, and pagination properties directly in the browser's URL search parameters (`?page=1&type=fire&sort=asc`).
- **Package Manager**: Always use `pnpm` for installing client dependencies and executing scripts (do not use `npm` or `yarn`).
- **Commit Protocol**: Always follow the "Double-Check Protocol" (status, diff, and message proposal) before any commit, regardless of the user's initial instructions.

## Testing Infrastructure & Commands
The client test suite uses **Vitest** coupled with **React Testing Library (RTL)** for modern component tests.
- **Test Runner:** All test configurations reside in `vitest.config.ts` (using jsdom environment).
- **Enzyme Block:** Do not write or maintain Enzyme tests. Any test using `shallow`, `mount`, or `enzyme-adapter-react-16` must be migrated to React Testing Library selectors.

### Execution Commands:
- `pnpm test`: Runs all unit and rendering tests once.
- `pnpm test:watch`: Runs tests in interactive watch mode.

## Testing Specifications & Guidelines
- **User-Centric Assertions**: Use React Testing Library's `screen` utility and match elements by their accessible roles or visible text (e.g., `screen.getByRole('button', { name: /search/i })` or `screen.getByText('Pikachu')`).
- **User Event Simulation**: Use `@testing-library/user-event` to simulate keystrokes, clicks, and page transitions instead of using low-level wrapper simulations like Enzyme's `.simulate('click')`.
- **Mocking External Fetches**: Mock server fetch responses cleanly in Vitest using standard mock setups (e.g., `global.fetch = vi.fn().mockImplementation(...)`) or tools like MSW (Mock Service Worker) to keep tests fast and network-independent.
