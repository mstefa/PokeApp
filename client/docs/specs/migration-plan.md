# 🚀 PokeApp Frontend Migration Plan: CRA to Astro SSR, pnpm & Styles

This master migration document details the roadmap, architectural guidelines, and status of modernizing the PokeApp frontend (`client`). It combines the transitions for the package manager, rendering strategy, component design, and styles.

---

## 1. Executive Summary

| Feature / Tooling | Old State | Target State | Objective |
| :--- | :--- | :--- | :--- |
| **Package Manager** | `npm` | `pnpm` | Standardize workspaces, enable fast cached installations, and save disk space. |
| **Build Engine** | Create React App (Webpack 4) | **Astro v4+** (Vite) | Remove deprecated Webpack/CRA config, boost compile speed, and enable native CSS Modules. |
| **Rendering Strategy**| Client-Side Render (CSR SPA) | **Server-Side Render (SSR)** | Perform data fetches on the server, serving static HTML to speed up initial load. |
| **State Management** | Redux (Thunk, Boilerplate) | Server-Side Loader + URL Params | Eliminate global state managers. Filter, page, and search parameters reside in the URL. |
| **Routing** | React Router v5 | Astro File-Based Routing | Leverage folder-based URL resolution (`src/pages/[id].astro`). |
| **Styling** | Global Ad-hoc Stylesheets | **Scoped CSS Modules + Design Tokens**| Scoped component styles using standard `*.module.css` matching design tokens. |
| **Testing** | Enzyme (React 16 adapter) | Vitest + React Testing Library (RTL) | Replace Enzyme with user-event simulations and accessible testing roles. |

---

## 2. Astro SSR & Islands Architecture

We use Astro's **Island Architecture**. Standard structure layouts, detailed page views, and static content compile to pure HTML server-side with zero JS impact. Only interactive widgets (e.g. `SearchBar`, forms) run as React components hydrated on the client via `client:load`.

### Request-Response Flow with Astro SSR
```mermaid
sequenceDiagram
    autonumber
    actor Browser as User Browser
    participant Astro as Astro SSR Server (client)
    participant API as Express API (api)
    database DB as PostgreSQL DB

    Browser->>Astro: Request Page (e.g., GET /pokemon/25)
    activate Astro
    Astro->>API: Server-Side Fetch (GET /pokemons/25)
    activate API
    API->>DB: Query Pokemon
    DB-->>API: Return DB Record
    API-->>Astro: Return Pokemon JSON
    deactivate API
    Astro->>Astro: Render HTML (Astro Layout + React Detail Component)
    Astro-->>Browser: Return Rendered HTML & minimal CSS
    deactivate Astro
    Note over Browser: Page renders instantly with ZERO client-side JavaScript!
```

---

## 3. Styles Migration Plan (Kanto Design System)

The design system transition updates variables and layout systems into the custom properties scheme defined in [Layout.astro](file:///Users/mstefanutti/workspace/PokeApp/client/src/layouts/Layout.astro).

### Migration Steps:
1. **Define Core Tokens**: Establish system custom properties (colors, borders, bouncy transitions, shadows) in the global CSS selector inside [Layout.astro](file:///Users/mstefanutti/workspace/PokeApp/client/src/layouts/Layout.astro).
2. **Convert CSS Files to Modules**: Rename component stylesheets from `*.css` to `*.module.css` (e.g., `SearchBar.module.css`).
3. **Use Scoped Classes**: Replace raw class strings with modules imports:
   ```tsx
   import Styles from './SearchBar.module.css';
   // Use in markup:
   <div className={Styles.searchContainer}>
   ```
4. **Delete Unused CSS**: Clean up global styles (`index.css` or equivalent) to keep only layout foundations.

---

## 4. Package Manager Migration (pnpm)

We use a monorepo setup managed via `pnpm-workspace.yaml`.

### Unified Setup Commands:
* Install dependencies in both workspaces: `pnpm install`
* Build all applications: `pnpm run build`
* Start local database and hot-reload dev servers: `pnpm run dev`

### CI/CD Deployment Settings:
For standalone deployments (such as Netlify/Vercel):
* Set build directory root to `/client`.
* Replace `npm install` with `pnpm install`.
* Use the command `pnpm run build`.

---

## 5. Testing Modernization

### Vitest & React Testing Library (RTL)
1. **Remove Enzyme**: Delete `enzyme` and adapt any tests using `shallow()` or `mount()` to use standard RTL selectors.
2. **User Event Simulation**: Use `@testing-library/user-event` to simulate clicks/types instead of Enzyme's `.simulate('click')`.
3. **Astro Page Mocking**: Server fetches inside page files are mocked via global variables:
   ```ts
   global.fetch = vi.fn().mockImplementation(...)
   ```
