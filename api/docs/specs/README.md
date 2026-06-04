# 📋 API Feature Specifications (Specs)

Welcome to the API Feature Specifications directory. This directory hosts documentation, request payloads, schemas, and endpoint specifications for specific features and bugs on the backend API.

---

## 🚦 Developer & Agent Rule
Every developer or AI coding agent must strictly adhere to the following workflow when implementing a task or fix:

1. **Write Specs First**: Before writing any functional code or tests, create a new specification markdown file in this directory describing the feature, route inputs/outputs, database schema changes, and test strategies.
2. **Review/Validate Specs**: Ensure the design and architecture are aligned.
3. **Implement**: Code the changes using a test-driven development (TDD) approach.
4. **Changelog Update**: Before making a git commit, update [CHANGELOG.md](file:///Users/mstefanutti/workspace/PokeApp/api/docs/CHANGELOG.md) to record your modifications.

---

## 📂 Directory Contents
* **[migration-plan.md](file:///Users/mstefanutti/workspace/PokeApp/api/docs/specs/migration-plan.md)**: Roadmap checklist for the backend API's TypeScript migration.
* **[api-specification.md](file:///Users/mstefanutti/workspace/PokeApp/api/docs/specs/api-specification.md)**: Master REST API schema detailing endpoints, query parameters, payloads, and status codes.
* **[request/ (outside specs)](file:///Users/mstefanutti/workspace/PokeApp/api/docs/request/)**: A collection of `.http` template requests to manually inspect endpoints using tools like REST Client.
