# ⚙️ Backend (API) Stack Definitions

This document details the software stack, tools, framework choices, and design patterns utilized in the PokeApp backend.

---

## 1. Core Runtime & Language
- **Node.js**: Server runtime environment (version `>=22.20.0` required).
- **TypeScript**: Used strictly across all source and test directories to ensure static type safety, compile-time validation, and code clarity.
- **pnpm**: Package manager (version `>=11.5.0` required) for lighting-fast dependency resolution and monorepo workspace linking.

---

## 2. Server Framework & Routing
- **Express**: Lightweight HTTP server framework.
- **Hexagonal Architecture (Ports and Adapters)**:
  - **Domain Layer**: Contains pure business logic and model definitions (completely isolated, zero framework dependencies).
  - **Application Layer**: Contains business Use Cases coordinating actions (e.g., `PokemonsFetcher`, `PokemonCreator`).
  - **Infrastructure Layer**: Outer shell containing database adapters (Sequelize), external HTTP fetch adapters (Axios connecting to PokeAPI), and routes/controllers handling incoming HTTP requests.
- **Dependency Injection Container**: Initialized via [DependencyInjectionContainer.ts](file:///Users/mstefanutti/workspace/PokeApp/api/src/DependencyInjectionContainer.ts) to manage lifecycle and clean decoupling of ports and adapters.

---

## 3. Database & ORM
- **PostgreSQL**: Relational database engine storing user-created custom Pokémon and type configurations.
- **Sequelize ORM**: Promise-based Node.js ORM used to map models to SQL tables. Managed dynamically with migrations and schema configurations in TypeScript.

---

## 4. Testing Frameworks
- **Vitest**: High-performance unit and integration testing engine. Features include fast in-memory compilation, hot-reloads, and built-in spies/mocks.
- **Cucumber (BDD/Gherkin)**: Used to write high-level behavioral acceptance tests in Gherkin files under `tests/features/`. Validates end-to-end routing integration.
