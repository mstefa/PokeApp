# GitHub Copilot Instructions for simple-api-template

You are an expert developer working on a TypeScript API project. This project is a template for building smart API services using **Node.js**, **TypeScript**, **MongoDB**, and **Docker**.

## Project Context & Technology Stack

- **Language:** TypeScript (Strict mode).
- **Runtime:** Node.js.
- **Database:** MongoDB (Managed via Docker Compose).
- **Testing:** - **Unit Tests:** Jest (`npm run test:unit`).
  - **Integration Tests:** Cucumber + Supertest (`npm run test:integration`).
- **Documentation:** Swagger/OpenAPI (`docs/requests/swagger.yaml`) and REST Client files (`docs/requests/request-example.rest`).
- **Linting:** ESLint (`.eslintrc.json`, `eslint.config.mjs`).

## Coding Conventions

1.  **TypeScript Best Practices:**
    - Always use explicit types. Avoid `any` whenever possible.
    - Use interfaces for data models and API responses.
    - Prefer `async/await` over raw Promises.

2.  **Project Structure:**
    - **`src/`**: Contains the application source code. Follow the existing architectural pattern (likely MVC or Clean Architecture layers present in the `src` folder).
    - **`tests/`**: Contains all test files.
    - **`docs/`**: Documentation and API specifications.

3.  **Error Handling:**
    - Ensure meaningful HTTP status codes are returned.
    - Follow the pattern used in the project for error responses (check `src` for global error handlers).

## Testing Guidelines

When asked to write tests, you must distinguish between Unit and Integration tests:

### Unit Tests (Jest)

- Locate them in the `tests` directory (or collocated in `src` if the pattern changes, but default to `tests/`).
- Focus on testing individual functions and classes in isolation.
- Mock external dependencies (database connections, third-party services).
- Command: `npm run test:unit`

### Integration Tests (Cucumber)

- Use **Gherkin syntax** (`.feature` files) to describe scenarios.
- Implement steps in TypeScript/JavaScript using **Cucumber** and **Supertest** for HTTP requests.
- **Crucial:** Remember that running integration tests involves the database. The current setup **deletes all database data** during integration tests.
- Command: `npm run test:integration`

## Documentation & API Design

- When creating or modifying endpoints, always update the **Swagger/OpenAPI** specification in `docs/requests/swagger.yaml`.
- Provide usage examples in `docs/requests/request-example.rest` for easy testing with the VSCode REST Client.

## Docker & Deployment

- Respect the `Dockerfile` and `docker-compose.yml` configurations.
- If adding new environment variables, update `example_env` and ensure `docker-compose.yml` reflects necessary changes for the container.

## Principles

- **Keep it Simple:** Do not over-engineer solutions.
- **Consistency:** Follow the existing coding style found in `src`.
- **Clean Code:** Prioritize readability and maintainability.
