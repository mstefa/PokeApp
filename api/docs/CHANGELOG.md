# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-06-07

### Added
- **Render Integration Testing:**
  - `docs/specs/render-integration-tests.md`: Specification defining endpoints, testing objectives, payloads, and expected status codes for verifying the Render deployment environment.
  - `docs/request/render-integration.http`: REST Client template request collection file targeting the live environment at `https://pokeapp-api-l7n2.onrender.com`.
  - `docs/request/pokeapp_render_integration.postman_collection.json`: Standard Postman collection (v2.1.0) JSON file for testing the live Render endpoints.
- **Deploy Workflow Split:**
  - `docs/specs/deploy-workflows-spec.md`: Specification for splitting the API and client deployment workflows with manual triggers and path filters.
  - `.github/workflows/deploy-api.yml`: GitHub Actions workflow to deploy the backend API to Render.
- **Database Configuration Specs:**
  - `docs/specs/database-connection-review.md`: Specification defining environment loading priority, connection setup, and error logging features.
- **Graceful Shutdown Specs:**
  - `docs/specs/graceful-shutdown.md`: Specification defining database retry mechanisms on startup, signal handlers, graceful shutdown procedures, and enhanced health checks.
- **Database Diagnostics Test Suite:**
  - `tests/integration/database-config.spec.ts`: Unit and integration test suite verifying environment loading priority, SSL/dialectOptions configuration, and structured error logging.
- **Graceful Shutdown Test Suite:**
  - `tests/integration/health.integration.spec.ts`: Integration test suite verifying health check behaviors under healthy, DB disconnected, and shutting down states.

### Changed
- **Server Shutdown & Process Safety:**
  - `src/index.ts`: Implemented database reconnection retries on startup (up to 3 retries, with a 3-second delay). Added signal listeners for `SIGINT` and `SIGTERM` to initiate graceful shutdown of the HTTP server and Sequelize connections. Integrated `uncaughtException` and `unhandledRejection` hooks to capture fatal errors and shut down resources cleanly.
- **Enhanced Health Check Endpoint:**
  - `src/app.ts`: Modified the `createApp` factory function to accept `AppOptions` with an `isShuttingDown` status checker. Enhanced the `/health` endpoint to return 503 Service Unavailable when the database is unreachable or the server is in the process of shutting down.
- **Environment Variable Loading:**
  - `src/config/app.config.ts`: Modified config loading to prioritize `.env.local` over `.env`, support the `DB_CONNECTION=supabase` override toggle (forcing connection credentials to come from `.env` while preserving other non-database parameters from `.env.local`), default `DB_SSL` to `'false'` for local connections, and wrapped load logic in an exported `loadEnv()` function for testability.
- **Unified Database Instantiation:**
  - `src/infrastructure/persistence/sequelize.ts`: Standardized the Sequelize constructor to pass the options configuration object in all environments. This ensures dialect options and SSL parameters work correctly for cloud providers like Supabase even in local development mode.
- **Start-up Connection Checking:**
  - `src/infrastructure/persistence/sequelize.ts`: Implemented `testConnection()`, a diagnostics helper that authenticates with the database on start-up. It translates common Postgres errors (refused, access denied, invalid config, host not found, timeouts) into detailed, user-friendly help messages.
  - `src/index.ts`: Integrated `testConnection()` into the startup sequence, verifying connectivity before synchronizing database models.
- **Structured Error Logging Wrapper:**
  - `src/shared/logger.ts`: Enhanced `logger.error` to dynamically log both native `Error` instances (as `err`) and custom diagnostic metadata objects.

## [Unreleased] - 2026-06-03

### Added
- **Vitest Migration:**
  - Installed `vitest` as the new test runner for integration tests.
  - `vitest.config.ts`: Created new Vitest configuration with custom tsconfig path aliases (`@/*`).
  - `tests/integration/endpoints.integration.spec.ts` & `tests/integration/errors.integration.spec.ts`: Converted and migrated integration tests to TypeScript (`.spec.ts`) utilizing Vitest test hooks and spy utilities.

### Changed
- **Migration Plan & Guidelines:**
  - `docs/migration-plan.md`: Added and checked off all tasks under **Phase 6: Testing & Dependency Rationalization**.
  - `AGENTS.MD`: Added a mandate instructing agents to use `pnpm` for installing packages and executing commands. Added a complete **Testing Infrastructure & Commands** and **Testing Specifications & Guidelines** specification to maintain testing guidance alongside the project.
- **Route & Database Cleanup:**
  - `src/routes/index.ts`: Made route registration synchronous to eliminate async race conditions during test startup.
  - Migrated Cucumber test assertions in `tests/step_definitions/controller.steps.ts` to Node's native `assert` library, allowing tests to run with zero assertion framework dependencies.
- **Test Commands Simplification:**
  - `package.json`: Configured `test:unit` to run Vitest integration tests once, `test:integration` to launch Cucumber BDD tests, `test:watch` for Vitest watch mode, and `test` to run both Vitest and Cucumber BDD tests sequentially.

### Removed
- **Unused Dependencies:**
  - Uninstalled `mocha`, `chai`, `@types/chai`, and `nodemon` from `package.json`.
- **Legacy Files:**
  - Deleted legacy unit tests (`tests/models/` and `tests/routes/`).
  - Deleted legacy route and bridge files (`src/routes/pokemons.js`, `src/routes/types.js`, `src/db.js`).
  - Deleted unused services folder (`src/services/`).

### Fixed
- **Pokemon Weight Validation Limit:**
  - `src/shared/validation/pokemon-schemas.ts`: Increased the Zod validation max weight limit from 255 to 10000.
  - `src/domain/value-objects/PokemonStat.ts`: Extended value object validation checks to support a maximum limit of 10000 specifically for `Weight` statistics.
  - Added happy and unhappy path integration tests to verify proper handling of heavier Pokemon.
- **Race Conditions in Tests:**
  - `vitest.config.ts`: Configured `fileParallelism: false` to ensure test files run sequentially, avoiding concurrent database collisions.

## [Unreleased] - 2026-06-01

### Added
- **Cucumber BDD Integration Tests (Phase 4):**
    - `@cucumber/cucumber`: Added BDD testing devDependency.
    - `cucumber.js`: Added Cucumber execution configuration supporting ts-node and path mapping resolution.
    - `tests/features/pokemons.feature`: Defined BDD scenarios in Gherkin syntax covering health, paginated listing, details search, and creation validations.
    - `tests/step_definitions/preparation.steps.ts`: Implemented database connectivity and cleanup hooks (`BeforeAll`, `After`, `AfterAll`) for test isolation.
    - `tests/step_definitions/controller.steps.ts`: Created reusable step bindings using Supertest assertions for testing HTTP endpoints.

### Changed
- **Package Manager Migration (Phase 5):**
    - Transitioned project package manager from `npm` to `pnpm` by deleting the legacy `package-lock.json` and creating `pnpm-lock.yaml` using highly optimized `pnpm install`.
    - `package.json`: Updated `engines` requirement and `packageManager` properties. Added `test:cucumber` execution script.

### Fixed
- **TypeScript Compilation & Bug Fixes:**
    - `LocalDatabasePokemonRepository.ts`: Fixed return type mismatch in `findAll` by returning domain entity instances instead of calling `toPrimitives()`.
    - `LocalDatabaseTypeRepository.ts`: Corrected the constructor arguments order when instantiating the `Type` domain class (now correctly passing `id` first and `name` second).
    - `get-pokemon-detail-controller.ts`: Explicitly cast path parameter `id` as `string` to resolve Express request typing compatibility.

## [Unreleased] - 2026-05-31
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
    - `docs/migration-plan.md`: Checked off all Phase 1 and Phase 2 checklist tasks as completed, added Cucumber BDD integration tests as **Phase 4**, and added the npm to pnpm package manager migration as **Phase 5**.

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
