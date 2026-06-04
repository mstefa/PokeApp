# 🗺️ PokeApp Agent Workspace Map

Welcome to the **PokeApp** project. This file serves as the centralized entry point and master guide for agentic developers working on the repository. It defines core patterns, provides quick links to architectural docs, and maps execution commands across both workspaces.

---

## 🛠️ Repository Architecture Overview

The codebase is split into two primary workspaces:
1. **Backend (API)**: A TypeScript-based server built with Node.js/Express, adhering strictly to **Hexagonal Architecture (Ports and Adapters)** and TDD.
2. **Frontend (Client)**: A modern client-side layout powered by **Astro SSR (Server-Side Rendering)** and **React Islands**, utilizing local CSS modules for scoping.

---

## 🧭 Developer Guides & Reference Maps

### 1. ⚙️ Backend (API) Workspace
For specific mandates on backend design, tests, and Sequelize integration, review the **[API Agent Instructions](file:///Users/mstefanutti/workspace/PokeApp/api/AGENTS.MD)**.

* **[API Specifications](file:///Users/mstefanutti/workspace/PokeApp/api/docs/api-specification.md)**: Details on Express routing, controllers, use cases, and JSON schemas.
* **[Architecture Diagrams](file:///Users/mstefanutti/workspace/PokeApp/api/docs/architecture-diagrams.md)**: Mermaid charts showing structural component patterns and execution sequence.
* **[Migration Plan](file:///Users/mstefanutti/workspace/PokeApp/api/docs/migration-plan.md)**: Status and checklists for the transition to TypeScript.
* **[Changelog](file:///Users/mstefanutti/workspace/PokeApp/api/docs/CHANGELOG.md)**: Historical tracking of backend feature releases and hotfixes.

### 2. 🎨 Frontend (Client) Workspace
For details regarding UI design guidelines, styling rules, and Astro-React rendering splits, review the **[Client Agent Instructions](file:///Users/mstefanutti/workspace/PokeApp/client/AGENTS.MD)**.

* **[Architecture Specifications](file:///Users/mstefanutti/workspace/PokeApp/client/docs/architecture.md)**: File-based routing maps, hydration directives, and structural hierarchy.
* **[Astro SSR Migration Guide](file:///Users/mstefanutti/workspace/PokeApp/client/docs/ssr_astro_migration.md)**: Transition path from CRA (Create React App) to Astro, state parameters tracking in URLs, and pagination setups.
* **[Styles Guide](file:///Users/mstefanutti/workspace/PokeApp/client/docs/styles_guide.md)**: Modern custom theme colors, bouncy animations, responsive CSS tokens, and component cards template rules.
* **[Styles Migration Plan](file:///Users/mstefanutti/workspace/PokeApp/client/docs/styles_migration_plan.md)**: Step-by-step checklist to migrate custom properties and clean up layout files.
* **[PNPM Migration Guide](file:///Users/mstefanutti/workspace/PokeApp/client/docs/pnpm_migration.md)**: Dependency structure guidelines and pnpm commands configuration.
* **[Client Migration Plan](file:///Users/mstefanutti/workspace/PokeApp/client/docs/migration_plan.md)**: Interactive checklist mapping migrated React modules and legacy components.

---

## 🚦 Core Mandates & Protocols

> [!IMPORTANT]
> All AI agents and developers must strictly follow the source control, dependency management, and commit rules.

* **Package Manager**: **Always** use `pnpm` inside both workspaces (never run raw `npm` or `yarn`).
* **Source Control Double-Check Protocol**:
  - Never stage or commit changes automatically.
  - Before requesting a commit, run `git status`, verify staged diffs using `git diff HEAD`, and present a descriptive, standardized commit message (e.g. `feat(client): ...` or `fix(api): ...`) to the user for final manual approval.

---

## 💻 Workspace Command Reference

Below is a quick reference table showing scripts to run common actions using `pnpm`:

| Action | Backend API Command ([api/](file:///Users/mstefanutti/workspace/PokeApp/api)) | Frontend Client Command ([client/](file:///Users/mstefanutti/workspace/PokeApp/client)) |
| :--- | :--- | :--- |
| **Install** | `pnpm install` | `pnpm install` |
| **Dev Server** | `pnpm run dev` | `pnpm run dev` |
| **Build Project** | `pnpm run build` | `pnpm run build` |
| **All Tests** | `pnpm run test` (Vitest & Cucumber) | `pnpm run test` (Vitest & RTL) |
| **Unit Tests** | `pnpm run test:unit` (Vitest) | — |
| **Watch Tests** | `pnpm run test:watch` (Vitest) | `pnpm run test:watch` (Vitest) |
| **BDD/Integration**| `pnpm run test:integration` (Cucumber) | — |
| **Lint & Format** | `pnpm run lint` / `pnpm run format` | — |
