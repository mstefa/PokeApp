# Client Architecture

This document describes the design, component interactions, data flow, and file layout of the modern Astro SSR client codebase for the PokeApp.

---

## 1. Component Architecture (Islands of Interactivity)

The application uses Astro's **Island Architecture**. The layout, navigation, and detailed views are rendered statically to pure HTML on the server. Interactive features (like searching or complex forms) are hydrated dynamically as client-side React islands.

```mermaid
graph TD
    subgraph Browser_Runtime [Browser / User Agent]
        HTML[Static HTML Document]
        HydratedReact[React Components: Hydrated]
        CSS[Scoped CSS Styling]
    end

    subgraph Astro_SSR_Engine [Astro SSR Engine]
        Layout[Global Layout]
        AstroPages[Astro Page Templates]
        CSSModules[CSS Modules Parser]
        ServerFetch[Astro.fetch Server Controller]
    end

    subgraph External_API [API Services]
        BackendAPI[Express Backend API: Port 3002]
    end

    %% Component relations
    AstroPages -->|uses| Layout
    AstroPages -->|fetches| ServerFetch
    CSSModules -.->|compiles| AstroPages
    ServerFetch -->|HTTP Request| BackendAPI

    %% Output relations
    AstroPages -->|generates| HTML
    AstroPages -->|injects React client:load| HydratedReact
    CSSModules -->|compiles| CSS
```

---

## 2. Dynamic Search Sequence (Server-Side Driven)

State is stored in the browser's URL search parameters rather than in client-side memory stores (like Redux). The diagram below displays how a search query triggers server-side updates:

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Browser as Browser Window
    participant SearchBar as React SearchBar Island (client:load)
    participant Astro as Astro SSR Server
    participant API as Express API (Port 3002)

    User->>SearchBar: Types 'Charizard' and presses Enter/Search
    SearchBar->>Browser: Update location URL: /home?search=Charizard
    Browser->>Astro: GET /home?search=Charizard
    activate Astro
    Astro->>Astro: Extract 'search' param from Astro.url
    Astro->>API: HTTP Server-Side Fetch: /pokemons?search=Charizard
    activate API
    API-->>Astro: Return matching Pokemon JSON
    deactivate API
    Astro->>Astro: Render HTML Grid containing Cards
    Astro-->>Browser: Return updated HTML page
    deactivate Astro
    Browser->>User: Display updated UI grid containing Charizard
```

---

## 3. Project File Organization

The application code files are organized by routing entries and framework purposes:

```mermaid
graph TD
    Root["client/"]
    Root --> Config["astro.config.mjs"]
    Root --> TSConfig["tsconfig.json"]
    Root --> Docs["docs/"]
    Root --> Pub["public/"]
    Root --> Src["src/"]
    
    Pub --> Assets["resources/ (images, gifs)"]

    Src --> Layouts["layouts/"]
    Src --> Components["components/"]
    Src --> Pages["pages/"]
    Src --> Types["types/"]

    Layouts --> Global["Layout.astro"]
    
    Components --> ReactComp["React UI Components (CSS Modules & TSX)"]
    
    Pages --> Static["index.astro"]
    Pages --> DynamicList["home.astro"]
    Pages --> DynamicDetails["pokemon/"]
    Pages --> FormPage["create.astro"]

    DynamicDetails --> ID["[id].astro"]
```
