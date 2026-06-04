# 📋 Client Feature Specifications (Specs)

Welcome to the Client Feature Specifications directory. This directory hosts documentation, mockup specifications, routing changes, and component breakdown specifications for new features and bug fixes on the frontend client.

---

## 🚦 Developer & Agent Rule
Every developer or AI coding agent must strictly adhere to the following workflow when implementing a task or fix:

1. **Write Specs First**: Before writing any UI code, page templates, React islands, or stylesheet modifications, create a new specification markdown file in this directory detailing component hierarchies, hydration scopes, URL search parameters used, and CSS custom property allocations.
2. **Review/Validate Specs**: Ensure page design alignment and state handling are sound.
3. **Implement**: Code the components and pages in a Vitest-asserted environment.
4. **Changelog Update**: Before making a git commit, update [CHANGELOG.md](file:///Users/mstefanutti/workspace/PokeApp/client/docs/CHANGELOG.md) to record your modifications.

---

## 📂 Directory Contents
* **[migration-plan.md](file:///Users/mstefanutti/workspace/PokeApp/client/docs/specs/migration-plan.md)**: Roadmap checklist for Astro SSR and React Islands client migration.
