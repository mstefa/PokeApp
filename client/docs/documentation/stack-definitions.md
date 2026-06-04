# 🎨 Frontend (Client) Stack Definitions

This document details the software stack, compiler choices, rendering logic, and design frameworks used in the PokeApp frontend.

---

## 1. Core Framework & Rendering Engine
- **Astro**: Static site builder and Server-Side Rendering (SSR) engine. Runs Astro file-based pages on the server and outputs optimized static HTML pages to the browser.
- **Islands Architecture**: Astro templates render layouts, navigation, and lists server-side. For components that need dynamic UI updates (inputs, filter state changes), we wrap them as React components hydrated on demand.
- **TypeScript**: Static typing is enforced on both Astro template scripts and React component components.
- **pnpm**: Utilized to manage and link the frontend workspace.

---

## 2. Interactive Components
- **React**: Renders client-side dynamic interfaces (islands) like search bars, inputs, pagination blocks, and interactive modals.
- **React DOM**: Used by Astro to inject and hydrate React components in the browser.

---

## 3. Styling & Layout Design
- **CSS Modules**: Standard CSS scoped automatically to each component via the `[filename].module.css` name mapping. Prevents global namespace leakage.
- **Kanto Retro-Sleek CSS Custom Properties**: Core tokens defined inside the global layout file [Layout.astro](file:///Users/mstefanutti/workspace/PokeApp/client/src/layouts/Layout.astro). Custom colors, responsive grid ratios, tactile box shadows, and springy transition curves form our uniform interface design system.

---

## 4. Testing Framework
- **Vitest**: Test runner matching the backend, providing extremely fast unit and render assertions.
- **React Testing Library**: Asserts on component rendering correctness by matching accessible HTML roles and simulating real user events.
- **JSDOM**: Provides simulated browser environments for client test suites.
