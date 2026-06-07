# 📡 Render Integration Testing Specification

This specification outlines the HTTP request template files designed to test the PokeApp API deployment integrated on Render.

## 🔗 Base URL
* Render Deployment API: `https://pokeapp-api-l7n2.onrender.com`

---

## 🛠️ Objectives
1. Provide a centralized HTTP client file (`render-integration.http`) containing template requests for all major API endpoints.
2. Allow developer-friendly, manual verification of the live Render database connection, API routing, and performance.
3. Keep template requests consistent with the local VS Code REST Client conventions.

---

## 📡 Endpoints Covered

### 1. Health Check (`GET /health`)
* **Purpose**: Verify if the Render instance is up and the live database is correctly connected.
* **Expected Response**: `200 OK`
* **Response Body**:
  ```json
  {
    "status": "ok",
    "database": "connected"
  }
  ```

### 2. List Pokemons (`GET /pokemons/`)
* **Purpose**: Test paginated retrieval of Pokémon.
* **Query Parameters**:
  * `limit`: Number of Pokémon to fetch (e.g., `12`)
  * `offset`: Starting offset (e.g., `0`)
* **Expected Response**: `200 OK` with paginated Pokémon schema.

### 3. Search Pokemon by Name (`GET /pokemons/search/`)
* **Purpose**: Test searching for a Pokémon by name from the external PokeAPI or the database.
* **Query Parameters**:
  * `name`: Pokémon name (e.g., `pikachu`)
* **Expected Response**: `200 OK` with details of the searched Pokémon, or `404 Not Found`.

### 4. Get Pokemon Details (`GET /pokemons/:id`)
* **Purpose**: Retrieve full stats and types of a specific Pokémon by ID.
* **Expected Response**: `200 OK` with detailed statistics.

### 5. Create Custom Pokemon (`POST /pokemons/`)
* **Purpose**: Insert a custom Pokémon into the Render PostgreSQL database.
* **Payload**:
  ```json
  {
    "name": "RenderPikachu",
    "life": 75,
    "strength": 80,
    "defense": 60,
    "speed": 110,
    "height": 4,
    "weight": 60,
    "img": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    "types": [
      {
        "id": 13,
        "name": "Electric"
      }
    ]
  }
  ```
* **Expected Response**: `201 Created`

### 6. List Types (`GET /types`)
* **Purpose**: Retrieve all stored Pokémon types.
* **Expected Response**: `200 OK`

---

## 📂 Deliverables
* **Spec**: `api/docs/specs/render-integration-tests.md` (this file)
* **REST Client file**: `api/docs/request/render-integration.http`
* **Postman Collection**: `api/docs/request/pokeapp_render_integration.postman_collection.json`
