# API Specification (Use Cases)

## 1. Get Pokemons
- **Endpoint:** `GET /pokemons`
- **Use Case:** `PokemonsFetcher`
- **Description:** Retrieves a paginated list of pokemons from both the external API and the local database.
- **Params:** `limit` (default: 12), `offset` (default: 0).
- **Response:** `{ count: number, pokemons: Pokemon[] }`

## 2. Get Pokemon Detail
- **Endpoint:** `GET /pokemons/:id`
- **Use Case:** `PokemonDetailFetcher`
- **Description:** Retrieves full details of a pokemon by its ID.
- **Response:** `Pokemon` object.

## 3. Search Pokemon
- **Endpoint:** `GET /pokemons/search?name=...`
- **Use Case:** `PokemonDetailSearcher`
- **Description:** Searches for a pokemon by name. First checks the external API, then the database.
- **Response:** `Pokemon` object.

## 4. Create Pokemon
- **Endpoint:** `POST /pokemons`
- **Use Case:** `PokemonCreator`
- **Description:** Creates a new "personalized" pokemon in the local database.
- **Payload:** `CreatePokemonDto` (name, stats, img, types).
- **Response:** Created `Pokemon` object.

## 5. Get Types
- **Endpoint:** `GET /types`
- **Use Case:** `TypesFetcher`
- **Description:** Retrieves all available pokemon types.
- **Response:** `Type[]`
