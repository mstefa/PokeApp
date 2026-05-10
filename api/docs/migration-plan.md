# Migration Plan: TypeScript & Hexagonal Architecture

## Objective
Continue the migration of the PokeApp API to TypeScript and Hexagonal Architecture, ensuring high test coverage and maintaining a functional application at every step.

## Current Status (feat/update-api)
- **Infrastructure:** `DependencyInjectionContainer` implemented. Hybrid routing (JS/TS) active.
- **Domain:** `Pokemon` and `Type` entities defined in TS. `PokemonRepository` and `TypeRepository` interfaces defined.
- **Application:** Use cases for `PokemonCreator`, `PokemonsFetcher`, `PokemonDetailFetcher`, `PokemonDetailSearcher`, and `TypesFetcher` are implemented in TS.
- **Persistence:** Currently uses legacy `src/db.js` (Sequelize) and `src/models/Pokemon.js`. `LocalDatabasePokemonRepository` acts as an adapter.

## Step-by-Step Migration Strategy

### Phase 1: Test Stabilization & Coverage (TDD)
1.  **Unskip Search Tests:** Enable all tests in `tests/integration/endpoints.integration.spec.js`.
2.  **Fix Search Response:** Adjust `SearchPokemonController` or `PokemonSearcher` to return the expected structured object (ID + details) instead of just the ID.
3.  **Add Missing Integration Tests:**
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

---

# Verification & Testing
- **Integration Tests:** Run `npm run test:integration` after every small change.
- **TDD Workflow:** 
  1. Identify a missing or failing test.
  2. Implement/Fix the minimal code to make it green.
  3. Refactor.
- **Manual Verification:** Use files in `docs/request/` (e.g., `get-pokemon.http`) to verify behavior.
