# 📝 PokeApp Client Changelog

All notable changes to the PokeApp Client (`client` workspace) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Created unified central workspace maps.
- Configured modular CSS architecture and design tokens in [Layout.astro](file:///Users/mstefanutti/workspace/PokeApp/client/src/layouts/Layout.astro).

### Changed
- Migrated client build framework from Create React App (CRA) to Astro SSR.
- Replaced npm package manager with pnpm.
- Replaced Redux global state management with URL Search Parameters.
- Swapped Enzyme testing framework with Vitest and React Testing Library (RTL).
