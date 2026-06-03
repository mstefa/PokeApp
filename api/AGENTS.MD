# Agent Instructions

This project follows a strict Hexagonal Architecture and TDD approach for its TypeScript migration.

## Reference Documentation
- **API Specifications:** [docs/api-specification.md](docs/api-specification.md) - Contains the detailed use cases and endpoint definitions.
- **Migration Plan:** [docs/migration-plan.md](docs/migration-plan.md) - The step-by-step strategy for the TypeScript transition.
- **Architecture:** [docs/architecture-diagrams.md](docs/architecture-diagrams.md) - Component and sequence diagrams for the system.

## Core Mandates
- Prioritize a TDD approach: update or add tests first, ensure they fail, then implement the fix.
- Keep the application in a "green" state (passing tests) as much as possible.
- Adhere to the domain-driven patterns defined in `src/domain`.
- **Package Manager:** Always use `pnpm` for installing packages, managing dependencies, and running commands (do not use `npm` or `yarn`).
- **Progress Tracking & Documentation:** 
    - Always update the "Migration TODO List" in `docs/migration-plan.md` after completing a task or phase. Mark completed items with `[x]`.
    - Always update [docs/CHANGELOG.md](docs/CHANGELOG.md) before staging and committing changes, to clearly document additions, modifications, and fixes under the appropriate release or `[Unreleased]` section.
- **Commit Protocol:** Always follow the "Double-Check Protocol" (status, diff, and message proposal) before any commit, regardless of the user's initial instruction.

## Testing Infrastructure & Commands
The test suite consists of two layers:
- **Vitest Integration Tests:** Fast API-level integration tests covering endpoints (happy paths, edge cases, validations, external service mocks) configured in `vitest.config.ts`.
- **Cucumber BDD Tests:** High-level functional/acceptance tests written in Gherkin syntax mapping user features.

### Execution Commands:
- `pnpm test`: Runs **all** tests sequentially (Vitest integration tests first, followed by Cucumber BDD).
- `pnpm test:unit`: Runs only the Vitest integration tests once.
- `pnpm test:watch`: Runs the Vitest suite in interactive watch mode.
- `pnpm test:integration`: Runs only the Cucumber BDD acceptance tests.

## Testing Specifications & Guidelines
- **Integration-First Approach:** Do not create separate unit tests for routes or Sequelize models. All code modifications must be covered by integration tests (`tests/integration/*.spec.ts`) or Cucumber features (`tests/features/*.feature`).
- **Assertion Standards:**
  - Inside `.spec.ts` files, use Vitest's built-in `expect` assertions (e.g. `expect(res.body).toHaveProperty('id')`).
  - Inside Cucumber step definitions (`tests/step_definitions/*.steps.ts`), use Node's native `assert` module (e.g. `assert.strictEqual(res.status, 200)`). Do not import or add third-party assertion libraries like Chai.
- **Mocking:** Use Vitest's built-in `vi` utilities (like `vi.spyOn(axios, 'get').mockImplementation(...)`) rather than mutating global modules or using external mocking libraries.
- **Database Cleanliness:** Ensure all database-interacting tests clear tables (e.g., using `Pokemon.destroy({ where: {}, force: true })`) in `afterEach` or `After` hooks to avoid state leaking between scenarios.
