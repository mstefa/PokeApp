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

* **[API Specifications](file:///Users/mstefanutti/workspace/PokeApp/api/docs/specs/api-specification.md)**: Details on Express routing, controllers, use cases, and JSON schemas.
* **[Architecture Diagrams](file:///Users/mstefanutti/workspace/PokeApp/api/docs/documentation/architecture.md)**: Mermaid charts showing structural component patterns and execution sequence.
* **[Migration Plan](file:///Users/mstefanutti/workspace/PokeApp/api/docs/specs/migration-plan.md)**: Status and checklists for the transition to TypeScript.
* **[Changelog](file:///Users/mstefanutti/workspace/PokeApp/api/docs/CHANGELOG.md)**: Historical tracking of backend feature releases and hotfixes.

### 2. 🎨 Frontend (Client) Workspace
For details regarding UI design guidelines, styling rules, and Astro-React rendering splits, review the **[Client Agent Instructions](file:///Users/mstefanutti/workspace/PokeApp/client/AGENTS.MD)**.

* **[Architecture Specifications](file:///Users/mstefanutti/workspace/PokeApp/client/docs/documentation/architecture.md)**: File-based routing maps, hydration directives, and structural hierarchy.
* **[Astro SSR Migration Guide](file:///Users/mstefanutti/workspace/PokeApp/client/docs/specs/migration-plan.md)**: Transition path from CRA (Create React App) to Astro, state parameters tracking in URLs, and pagination setups.
* **[Styles Guide](file:///Users/mstefanutti/workspace/PokeApp/client/docs/documentation/styles_guide.md)**: Modern custom theme colors, bouncy animations, responsive CSS tokens, and component cards template rules.
* **[Changelog](file:///Users/mstefanutti/workspace/PokeApp/client/docs/CHANGELOG.md)**: Historical tracking of frontend client-side refactorings and features.

---

## 🚦 Core Mandates & Protocols

> [!IMPORTANT]
> All AI agents and developers must strictly follow the source control, dependency management, and commit rules.

* **Workflow Pipeline**: 
  1. When assigned a task/fix, **first** create the corresponding specs file under the appropriate workspace directory (`api/docs/specs/` or `client/docs/specs/`).
  2. **Before staging/committing**, update the `CHANGELOG.md` file in that workspace (`api/docs/CHANGELOG.md` or `client/docs/CHANGELOG.md`) listing your additions, changes, or removals.
* **Package Manager**: **Always** use `pnpm` inside both workspaces (never run raw `npm` or `yarn`).
* **Source Control Double-Check Protocol**:
  - Never stage or commit changes automatically.
  - Before requesting a commit, run `git status`, verify staged diffs using `git diff HEAD`, and present a descriptive, standardized commit message (e.g. `feat(client): ...` or `fix(api): ...`) to the user for final manual approval.

---

## 💻 Global Workspace Commands (Makefile)

At the root of the project, a [Makefile](file:///Users/mstefanutti/workspace/PokeApp/Makefile) is provided to orchestrate operations across both the `api` and `client` folders:

| Root Make Command | Description |
| :--- | :--- |
| `make help` | Displays help information and all available commands. |
| `make install` | Runs `pnpm install` in both `/api` and `/client` directories to restore dependencies. |
| `make db-up` | Starts the local PostgreSQL database Docker container in the background. |
| `make db-down` | Shuts down and removes the PostgreSQL Docker container. |
| `make db-logs` | Tunnels live real-time output streams from the PostgreSQL container. |
| `make run-api` | Shorthand utility checking DB health and running the Express API hot-reload mode. |
| `make run-client` | Shorthand utility starting the Astro dev server for client interactions. |
| `make dev` | Starts database Docker container, backend API process, and client dev server in parallel. |
| `make build` | Compiles both API typescript modules and Client Astro island files for production. |
| `make clean` | Cleans compilation build folders and wipes out `node_modules` paths. |
