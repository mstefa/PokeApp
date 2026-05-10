# Changelog

All notable changes to this project will be documented in this file.

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
