# ⚙️ API Agent Workspace Guide

This guide defines the context, reference maps, and development protocols for developers and AI coding agents working on the PokeApp **Backend API** (`api/`).

---

## 🧭 Workspace Reference Map
* **Changelog**: [api/docs/CHANGELOG.md](file:///Users/mstefanutti/workspace/PokeApp/api/docs/CHANGELOG.md) (tracks release logs)
* **Documentation**:
  - [architecture.md](file:///Users/mstefanutti/workspace/PokeApp/api/docs/documentation/architecture.md) (structural layout & sequence diagrams)
  - [stack-definitions.md](file:///Users/mstefanutti/workspace/PokeApp/api/docs/documentation/stack-definitions.md) (runtime layers, database, & adapters)
* **Specifications**:
  - [specs/README.md](file:///Users/mstefanutti/workspace/PokeApp/api/docs/specs/README.md) (guides for writing task specs)
  - [migration-plan.md](file:///Users/mstefanutti/workspace/PokeApp/api/docs/specs/migration-plan.md) (TypeScript migration status)
  - [api-specification.md](file:///Users/mstefanutti/workspace/PokeApp/api/docs/specs/api-specification.md) (endpoints routing specifications)
* **HTTP Requests**: [request/](file:///Users/mstefanutti/workspace/PokeApp/api/docs/request/) (raw template test queries)

---

## 🚦 Task Workflow Rules
1. **Create Spec First**: Create a spec markdown file under `docs/specs/` outlining database, schemas, routes, and test cases.
2. **Test-Driven Development (TDD)**: Write failing Vitest integration (`tests/integration/`) or Cucumber functional (`tests/features/`) tests first, then write minimal code to make them green.
3. **Update Changelog**: Document modifications in the `[Unreleased]` section of `docs/CHANGELOG.md`.
4. **Git Double-Check Protocol**: Run `git status` + `git diff HEAD`, propose the commit message, and obtain explicit user permission before staging/committing.

---

## 💻 Developer Commands
* `pnpm install`: Install dependencies.
* `pnpm run dev`: Start hot-reload dev server.
* `pnpm run build`: Compile TypeScript.
* `pnpm run test`: Run all tests (Vitest integration + Cucumber BDD).
* `pnpm run test:unit` / `pnpm run test:watch`: Run/watch Vitest tests.
* `pnpm run test:integration`: Run Cucumber functional tests.

---

## 🛠️ Testing Specifications
* **Integration Focus**: Do not write separate tests for routes or Sequelize models. Cover everything via integration or functional tests.
* **Assertions**: Use Vitest's `expect` inside `.spec.ts` files, and Node's native `assert` inside Cucumber `.steps.ts` definitions. Do not install third-party libraries like Chai.
* **DB Cleanliness**: Ensure tests clean up tables (using `.destroy({ where: {}, force: true })`) in `afterEach` or `After` hooks to avoid state leakage.
