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
- **Progress Tracking:** Always update the "Migration TODO List" in `docs/migration-plan.md` after completing a task or phase. Mark completed items with `[x]`.
