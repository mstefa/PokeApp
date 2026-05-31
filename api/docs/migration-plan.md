# Migration Plan: TypeScript & Hexagonal Architecture

## Objective
Continue the migration of the PokeApp API to TypeScript and Hexagonal Architecture, ensuring high test coverage and maintaining a functional application at every step.

## Current Status (feat/update-api)
- **Infrastructure:** `DependencyInjectionContainer` implemented. Hybrid routing (JS/TS) active.
- **Domain:** `Pokemon` and `Type` entities defined in TS. `PokemonRepository` and `TypeRepository` interfaces defined.
- **Application:** Use cases for `PokemonCreator`, `PokemonsFetcher`, `PokemonDetailFetcher`, `PokemonDetailSearcher`, and `TypesFetcher` are implemented in TS.
- **Persistence:** Currently uses legacy `src/db.js` (Sequelize) and `src/models/Pokemon.js`. `LocalDatabasePokemonRepository` acts as an adapter.

## Migration TODO List

### Phase 1: Test Stabilization & Coverage (TDD)
- [x] **Unskip Search Tests:** Enable all tests in `tests/integration/endpoints.integration.spec.js`.
- [x] **Fix Search Response:** Adjust `SearchPokemonController` to return full JSON object.
- [x] **Stabilize Integration Tests:** Update remaining 7 failing assertions in `POST /pokemons` to match new JSON structure.
- [x] **Fix Deprecated Mocha Flags:** Migrate `--loader=tsx` to `--import=tsx` in `package.json` test scripts to support Node v18.19+/v20.6+/v22+.
- [x] **Create Dev Infrastructure:** Add a `docker-compose.yml` for a local PostgreSQL setup to run integration tests locally.
- [x] **Add Missing Integration Tests:**
    - [x] Validation errors (e.g., creating a pokemon with missing fields).
    - [x] Edge cases for pagination (offset/limit).
    - [x] Error handling for external API failures.

### Phase 2: Domain & Persistence Migration
- [x] **Migrate Models to TS:**
    - [x] Convert `src/models/Pokemon.js` to a TypeScript Sequelize model.
    - [x] Update `src/db.js` to a TypeScript configuration file (`src/infrastructure/persistence/sequelize.ts`).
- [x] **Refine Repositories:**
    - [x] Update `LocalDatabasePokemonRepository` and `LocalDatabaseTypeRepository` to use the new TS models.
    - [x] Ensure strict typing for all database operations.

### Phase 3: Final Infrastructure & Cleanup
- [ ] **Complete Route Migration:** Ensure all logic is removed from `src/routes/pokemons.js` and `src/routes/types.js` before deleting them.
- [ ] **Standardize Error Handling:** Implement a global Error Middleware in TS.
- [ ] **Convert Tests to TS:** Migrate `.spec.js` files to `.spec.ts`.
- [ ] **Update Docker Setup:** Modernize `Dockerfile` to compile TS using `tsc` and run in a modern Node.js environment.
- [ ] **Add Environment Configuration Safety:** Introduce a Zod-validated configuration loader class for type-safe environment variables.

### Phase 4: Cucumber BDD Integration Tests
- [ ] **Configure Cucumber Framework:** Add `@cucumber/cucumber` devDependency and create root `cucumber.js` configuration.
- [ ] **Write Gherkin Features:** Define `tests/features/pokemons.feature` covering health, pagination, search, and validation error paths.
- [ ] **Implement Cucumber Step Definitions:**
    - [ ] Create `tests/step_definitions/preparation.steps.ts` managing the server launch and database cleaning hooks.
    - [ ] Create `tests/step_definitions/controller.steps.ts` mapping step patterns with Supertest assertions.

## Step-by-Step Migration Strategy (Detailed)

### Phase 1: Test Stabilization & Coverage (TDD)
1.  **Unskip Search Tests:** Enable all tests in `tests/integration/endpoints.integration.spec.js`.
2.  **Fix Search Response:** Adjust `SearchPokemonController` or `PokemonSearcher` to return the expected structured object (ID + details) instead of just the ID.
3.  **Fix Deprecated Mocha Flags:** Update `package.json` test scripts to use `--import=tsx` instead of `--loader=tsx` so tests run successfully on modern Node versions.
4.  **Create Dev Infrastructure:** Create a `docker-compose.yml` defining the local PostgreSQL service and document environment setup in `.env`.
5.  **Add Missing Integration Tests:**
    *   Validation errors (e.g., creating a pokemon with missing fields).
    *   Edge cases for pagination (offset/limit).
    *   Error handling for external API failures.

### Phase 2: Domain & Persistence Migration
1.  **Migrate Models to TS:**
    *   Convert `src/models/Pokemon.js` to a TypeScript Sequelize model.
    *   Update `src/db.js` to a TypeScript configuration file (`src/infrastructure/persistence/sequelize.ts`).
2.  **Refine Repositories:**
    *   Update `LocalDatabasePokemonRepository` and `LocalDatabaseTypeRepository` to use the new TS models.
    *   Ensure strict typing for all database operations.

### Phase 3: Final Infrastructure & Cleanup
1.  **Complete Route Migration:** Ensure all logic is removed from `src/routes/pokemons.js` and `src/routes/types.js` before deleting them.
2.  **Standardize Error Handling:** Implement a global Error Middleware in TS that handles `NotFoundError`, `InvalidArgumentError`, etc., consistently.
3.  **Convert Tests to TS:** Migrate `.spec.js` files to `.spec.ts` for full type safety in the test suite.
4.  **Update Docker Setup:** Update the `Dockerfile` to build the app with `tsc` and run the output `dist/index.js` under a modern alpine node image.
5.  **Add Environment Configuration Safety:** Build a schema-based environment validator using Zod in `src/config/index.ts` to ensure required variables are present and correct.

### Phase 4: Cucumber BDD Integration Tests
1.  **Configure Cucumber Framework:** Add the necessary BDD dependencies and set up the `cucumber.js` runner config in the root.
2.  **Write Gherkin Features:** Add Gherkin specification feature files under `tests/features/`.
3.  **Implement Cucumber Step Definitions:** Code the steps definitions and preparation hook classes under `tests/step_definitions/` mapping scenarios to Express controllers.

---

# Verification & Testing
- **Integration Tests:** Run `npm run test:integration` after every small change.
- **TDD Workflow:** 
  1. Identify a missing or failing test.
  2. Implement/Fix the minimal code to make it green.
  3. Refactor.
- **Manual Verification:** Use files in `docs/request/` (e.g., `get-pokemon.http`) to verify behavior.
