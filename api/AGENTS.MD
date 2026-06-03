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
