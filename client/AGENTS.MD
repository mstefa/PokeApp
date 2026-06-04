# 🎨 Client Agent Workspace Guide

This guide defines the context, reference maps, and development protocols for developers and AI coding agents working on the PokeApp **Frontend Client** (`client/`).

---

## 🧭 Workspace Reference Map
* **Changelog**: [client/docs/CHANGELOG.md](file:///Users/mstefanutti/workspace/PokeApp/client/docs/CHANGELOG.md) (tracks release logs)
* **Documentation**:
  - [architecture.md](file:///Users/mstefanutti/workspace/PokeApp/client/docs/documentation/architecture.md) (components layout, islands, & SSR data flow)
  - [stack-definitions.md](file:///Users/mstefanutti/workspace/PokeApp/client/docs/documentation/stack-definitions.md) (Astro, React, CSS Modules details)
  - [styles_guide.md](file:///Users/mstefanutti/workspace/PokeApp/client/docs/documentation/styles_guide.md) (custom colors, layouts, & bouncy animations)
* **Specifications**:
  - [specs/README.md](file:///Users/mstefanutti/workspace/PokeApp/client/docs/specs/README.md) (guides for writing task specs)
  - [migration-plan.md](file:///Users/mstefanutti/workspace/PokeApp/client/docs/specs/migration-plan.md) (Astro SSR & pnpm monorepo migration status)

---

## 🚦 Task Workflow Rules
1. **Create Spec First**: Create a spec markdown file under `docs/specs/` outlining component structure, CSS Module style plans, and hydration directives.
2. **Framework Alignment**: Presentational components must be static Astro templates compiled on the server. Interactive widgets (inputs, search bars) are React islands hydrated via client directives (e.g. `<SearchBar client:load />`).
3. **Update Changelog**: Document modifications in the `[Unreleased]` section of `docs/CHANGELOG.md`.
4. **Git Double-Check Protocol**: Run `git status` + `git diff HEAD`, propose the commit message, and obtain explicit user permission before staging/committing.

---

## 💻 Developer Commands
* `pnpm install`: Install dependencies.
* `pnpm run dev`: Start Astro dev server.
* `pnpm run build`: Compile Astro & React assets.
* `pnpm run test`: Run Vitest + React Testing Library (RTL) tests.
* `pnpm run test:watch`: Run tests in watch mode.

---

## 🛠️ Testing Specifications
* **RTL Assertions**: Query elements by accessible role or text labels (e.g., `screen.getByRole('button', { name: /search/i })`). Avoid Enzyme-style selectors.
* **User Event Simulation**: Use `@testing-library/user-event` to simulate user keypresses, clicks, and state transitions instead of low-level `.simulate()` commands.
* **Mocks**: Cleanly stub out browser fetches inside test suites via global variables (e.g. `global.fetch = vi.fn().mockImplementation(...)`).
