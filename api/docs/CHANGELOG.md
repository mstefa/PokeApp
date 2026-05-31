# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-05-31

### Added
- **TypeScript Model Migration:**
    - `src/infrastructure/persistence/models/Pokemon.ts`: Created strongly-typed TypeScript Sequelize model with integer statistical validations and hooks.
    - `src/infrastructure/persistence/models/Type.ts`: Created strongly-typed TypeScript Sequelize model for Pokemon types.
- **Central TS Database Connection:**
    - `src/infrastructure/persistence/sequelize.ts`: Created central TypeScript database adapter loading Sequelize configuration parameters.
- **Integration Test Resilience:**
    - `tests/integration/errors.integration.spec.js`: Introduced unhappy paths, edge cases, Zod validation errors, and external API down error handling integration tests.
- **Local Dev Database Orchestration:**
    - `docker-compose.yml`: Added Docker Compose PostgreSQL service on port 5432 for automated database setup.

### Changed
- **Legacy Bridging:**
    - `src/db.js`: Transformed into a lightweight bridge file that routes legacy Javascript requirements to the new TypeScript Sequelize models.
- **Repository Refactoring:**
    - `LocalDatabasePokemonRepository.ts` & `LocalDatabaseTypeRepository.ts`: Modified to import strongly-typed TS Sequelize models, removing `any` type annotations, JS requires, and unnecessary parseInt calls.
- **Pagination Validation:**
    - `GetPokemonsController.ts`: Implemented query boundary parsing and sanitization for limit and offset parameters.
- **Test Infrastructure Stability:**
    - `package.json`: Updated test scripts to use `--import=tsx` (fixing crashes on Node 22+).
    - `AGENTS.MD`: Added instructions requiring AI agents to always update `docs/CHANGELOG.md` upon committing.
- **Migration Plan:**
    - `docs/migration-plan.md`: Checked off all Phase 1 and Phase 2 checklist tasks as completed, and added Cucumber BDD integration tests as **Phase 4**.

### Removed
- **Legacy JS Models:**
    - Deleted `src/models/Pokemon.js` and `src/models/Type.js` in favor of new TS models.

## [Unreleased] - 2026-05-10

### Added
- **Documentation:**
    - `docs/migration-plan.md`: Step-by-step strategy for TypeScript & Hexagonal migration with a progress TODO list.
    - `docs/api-specification.md`: Detailed definitions of all API use cases.
    - `docs/architecture-diagrams.md`: Component and sequence diagrams using Mermaid.js.
- **Persistence:**
    - `src/models/Type.js`: Legacy Sequelize model for Pokemon types to enable database synchronization.
- **Project Configuration:**
    - `AGENTS.MD`: Core mandates and instructions for AI agents, including progress tracking and commit protocols.
    - `GEMINI.md`: Symbolic link to `AGENTS.MD` for system-level integration.
    - Global `~/.gemini/GEMINI.md`: Updated with the "Double-Check Protocol" for commits.

### Changed
- **API Response Standardization:**
    - `SearchPokemonController`: Updated to return full Pokemon details instead of just the ID.
    - `CreatePokemonController`: Updated to return `201 Created` and a structured JSON response to match current integration test expectations.
- **Infrastructure & Adapters:**
    - `PokemonRepositoryFacade`: Fixed domain object instantiation to use `Pokemon.fromPrimitives()`.
    - `src/db.js`: Registered the new `Type` model for database synchronization.
- **Validation:**
    - `pokemon-schemas.ts`: Aligned Zod validation limits with domain constraints (e.g., max stats set to 255).
- **Testing:**
    - `tests/integration/endpoints.integration.spec.js`: Fully stabilized integration tests. All 20 tests (GET, POST, Search, Detail) are now passing after aligning expectations with the new JSON-based API.

### Fixed
- **Database Connection:** Resolved `ConnectionRefusedError` by ensuring the Docker Postgres container is running.
- **Types Endpoint:** Fixed 500 errors on `GET /types` by restoring the Type model and synchronization.
