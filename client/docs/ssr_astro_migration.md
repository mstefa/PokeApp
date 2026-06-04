# Astro SSR & React Island Migration Guide

This guide details how to migrate the Create React App (CRA) frontend to **Astro SSR** while retaining the existing **CSS Modules** and modernizing the state and testing systems.

---

## 1. Installation & Configuration

Astro will act as the host server-side framework. It will run in **SSR mode** and load the existing React components as interactive widgets where needed.

Navigate to the `client` directory and install the Astro core, Node.js SSR adapter, and React integrations:

```bash
cd client
pnpm install astro @astrojs/react @astrojs/node
```

Create an `astro.config.mjs` file in the `client` root:

```javascript
// client/astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server', // Enables Server-Side Rendering (SSR)
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [react()],
});
```

---

## 2. Directory Restructuring

Astro uses a file-based router. Move your assets and refactor folders as follows:

```
client/
├── public/                 # Astro public directory (static assets, images, gifs)
│   ├── resources/
│   │   ├── loading.gif     # Mapped from client/src/resurces/
│   │   └── pikachuLogo.png
├── src/
│   ├── components/         # React Components (kept as-is, converted to TSX)
│   │   ├── CreatePokemon.tsx
│   │   ├── NavBar.tsx
│   │   ├── Pokemon.tsx
│   │   ├── PokemonDetail.tsx
│   │   └── SearchBar.tsx
│   ├── layouts/
│   │   └── Layout.astro     # Global layout (HTML head, header, navbar)
│   ├── pages/              # Astro routing controllers (Server-Side Rendered)
│   │   ├── index.astro     # Maps to /
│   │   ├── home.astro      # Maps to /home
│   │   ├── create.astro    # Maps to /create
│   │   └── pokemon/
│   │       └── [id].astro  # Maps to /pokemon/:id (dynamic SSR route)
```

---

## 3. Preserving CSS Modules

**CSS Modules** work out of the box in Astro! No custom webpack configuration is required.
Keep imports inside your React components exactly as they are:
```javascript
import Styles from './PokemonDetail.module.css';
```
Astro’s Vite builder automatically parses class mappings and generates unique scoped hashes during build time.

---

## 4. Replacing Redux with Server-Side Fetches & URL Params

Currently, the app relies on Redux to fetch data client-side and store filter/search/pagination states globally. In Astro SSR, **we eliminate Redux** and fetch data directly on the server.

### Example: Pokemon Detail Migration

#### BEFORE: React CRA + Redux (`client/src/components/PokemonDetail.js`)
The component handles its own fetching inside a client-side `useEffect` and reads state via Redux:

```jsx
// client/src/components/PokemonDetail.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPokemonsDetail } from '../actions';

export default function PokemonDetail(props) {
  const pokemon = useSelector(state => state.pokemonDetail);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPokemonsDetail(props.match.params.id));
  }, [props.match.params.id, dispatch]);

  if (pokemon.name) {
    return <div>{pokemon.name}</div>;
  }
  return <div>Loading...</div>;
}
```

#### AFTER: Astro SSR & Presentational React (`client/src/pages/pokemon/[id].astro`)
The data is fetched server-side in the Astro page container. The React component becomes a lightweight presentational component that renders instantly on the server with **zero JavaScript sent to the client**.

First, clean the React component:
```tsx
// client/src/components/PokemonDetail.tsx
import React from 'react';
import Styles from './PokemonDetail.module.css';

interface Pokemon {
  id: number;
  name: string;
  life: number;
  strength: number;
  defense: number;
  speed: number;
  height: number;
  weight: number;
  img?: string;
  types: Array<{ name: string }>;
}

export default function PokemonDetail({ pokemon }: { pokemon: Pokemon }) {
  return (
    <div className={Styles.container}>
      <img className={Styles.img} src={pokemon.img} alt={pokemon.name} />
      <p className={Styles.name}>{pokemon.name}</p>
      {/* ... Rest of stats ... */}
    </div>
  );
}
```

Then, create the Astro page template:
```astro
---
// client/src/pages/pokemon/[id].astro
import Layout from '../../layouts/Layout.astro';
import PokemonDetail from '../../components/PokemonDetail';

// 1. Read URL params directly in Astro
const { id } = Astro.params;

// 2. Fetch data directly on the server
const baseURL = process.env.API_URL || 'http://localhost:3002';
let pokemon = null;
let error = null;

try {
  const res = await fetch(`${baseURL}/pokemons/${id}`);
  if (res.ok) {
    pokemon = await res.ok ? await res.json() : null;
  }
} catch (err) {
  error = err.message;
}
---
<Layout title={pokemon ? pokemon.name : "Pokemon Details"}>
  {pokemon ? (
    <PokemonDetail pokemon={pokemon} />
  ) : (
    <div>Error loading Pokemon: {error}</div>
  )}
</Layout>
```

---

## 5. Handling Filters & Search via URL Parameters

In the current React code, Redux filters Pokemon items client-side. In Astro, search, sorting, and filtering are mapped to **URL search params** (`/home?page=2&type=fire&sort=asc`).

Astro handles this dynamically on the server:

```astro
---
// client/src/pages/home.astro
import Layout from '../layouts/Layout.astro';
import Pokemon from '../components/Pokemon';
import SearchBar from '../components/SearchBar'; // Rendered as client island
import Pagination from '../components/Pagination';

// Extract query parameters on the server
const url = new URL(Astro.request.url);
const page = parseInt(url.searchParams.get('page') || '1');
const type = url.searchParams.get('type') || 'all';
const sort = url.searchParams.get('sort') || 'asc';
const search = url.searchParams.get('search') || '';

const limit = 12;
const offset = (page - 1) * limit;

// Fetch filtered database queries directly from your API
const apiBase = process.env.API_URL || 'http://localhost:3002';
const apiRes = await fetch(`${apiBase}/pokemons?offset=${offset}&limit=${limit}&type=${type}&sort=${sort}&search=${search}`);
const { pokemons, count } = await apiRes.json();
---
<Layout title="Pokemon Home">
  <!-- Load the SearchBar as an interactive client-side island -->
  <SearchBar client:load currentType={type} currentSort={sort} />
  
  <div class="pokemon-grid">
    {pokemons.map((p) => (
      <Pokemon id={p.id} name={p.name} img={p.img} types={p.types} />
    ))}
  </div>

  <Pagination 
    total={count} 
    currentPage={page} 
    limit={limit} 
  />
</Layout>
```

---

## 6. Testing Modernization: Enzyme to Vitest + RTL

Enzyme relies on React internals that are broken in React 18+. We migrate to **Vitest** (running fast on Vite) and **React Testing Library** (checking behavior from the user's perspective).

### Old Enzyme Test (`PokemonDetail.test.js`)
```javascript
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

it('deberia renderizar los detalles', () => {
  const wrapper = mount(<PokemonDetail match={match} store={store} />);
  expect(wrapper.contains(todo.name)).toEqual(true);
});
```

### Modern Vitest + RTL Test (`PokemonDetail.test.tsx`)
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PokemonDetail from './PokemonDetail';

describe('<PokemonDetail />', () => {
  const mockPokemon = {
    id: 1,
    name: "Pikachu",
    life: 35,
    strength: 55,
    defense: 40,
    speed: 90,
    height: 4,
    weight: 60,
    types: [{ name: 'electric' }]
  };

  it('renders stats and name correctly from props', () => {
    render(<PokemonDetail pokemon={mockPokemon} />);
    
    // Check elements exist on the screen
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText(/hp: 35/i)).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();
  });
});
```
