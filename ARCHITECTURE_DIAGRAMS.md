# GET Pokemons Endpoint - Architecture Diagram

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        HTTP Client                              │
│                  GET /pokemons?limit=12&offset=0               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Express Middleware                          │
│              (CORS, JSON Parser, Morgan Logger)                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Route Handler                                │
│   (pokemons.routes.ts - Validation & Controller Registration)  │
│                                                                  │
│  - validateReqSchema (express-validator)                       │
│  - GET /pokemons - calls controller.run()                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│              GetPokemonsController (HTTP Handler)              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ run(req, res)                                       │       │
│  │  1. Parse limit & offset from query params         │       │
│  │  2. Call pokemonsFetcher.run(limit, offset)        │       │
│  │  3. Send 200 response with data                    │       │
│  │  4. Catch errors and send error response          │       │
│  └─────────────────────────────────────────────────────┘       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                             │
│              PokemonsFetcher (Use Case/Service)                │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ run(limit: number, offset: number)                 │       │
│  │  1. Call repository.findAll(offset, limit)        │       │
│  │  2. Map result to PokemonsDto                      │       │
│  │  3. Return DTO                                      │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                  │
│  Dependencies:                                                  │
│  - IPokemonRepository (interface)                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DOMAIN LAYER                                 │
│                   Interfaces/Ports                              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ IPokemonRepository (Port)                           │       │
│  │  - findAll(offset, limit): PokemonListResponse    │       │
│  │  - findById(id): Pokemon | null                    │       │
│  │  - findByName(name): Pokemon | null               │       │
│  │  - create(data): Pokemon                           │       │
│  │  - count(): number                                 │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ Pokemon (Entity)                                    │       │
│  │  - id, name, img, personalized                     │       │
│  │  - stats (life, strength, defense, speed, etc)    │       │
│  │  - types: Type[]                                   │       │
│  └─────────────────────────────────────────────────────┘       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                            │
│              SequelizePokemonRepository (Adapter)              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ Implements IPokemonRepository                       │       │
│  │                                                      │       │
│  │ findAll(offset, limit):                            │       │
│  │  1. Call getPokemonsALL(offset, limit, false)     │       │
│  │  2. Get Pokemon.count() from DB                    │       │
│  │  3. Combine API results with DB results           │       │
│  │  4. Map to domain entities                        │       │
│  │  5. Return PokemonListResponse                    │       │
│  └─────────────────────────────────────────────────────┘       │
└────────────────────────────┬────────────────────────────────────┘
                             │
           ┌─────────────────┴──────────────────┐
           │                                    │
           ▼                                    ▼
  ┌──────────────────┐           ┌──────────────────────┐
  │  Sequelize ORM   │           │  External API Call   │
  │  (PostgreSQL)    │           │  (pokemonsIdRequest) │
  │  Pokemon Model   │           │  pokemonapi.co       │
  └──────────────────┘           └──────────────────────┘
```

## Sequence Diagram

```
Client          Route       Controller     UseCase      Repository    DB/API
  │               │             │             │             │           │
  │──GET /pokemons─────────────►│             │             │           │
  │               │             │             │             │           │
  │               │─validate───►│             │             │           │
  │               │◄──pass──────│             │             │           │
  │               │             │─run()───────►             │           │
  │               │             │             │─findAll()──►│           │
  │               │             │             │             │─API call─►│
  │               │             │             │             │◄──data───│
  │               │             │             │             │           │
  │               │             │             │             │─DB query─►│
  │               │             │             │             │◄──count───│
  │               │             │             │             │           │
  │               │             │             │◄─response───│           │
  │               │             │◄────dto─────┤             │           │
  │               │◄──200 JSON──┤             │             │           │
  │◄──200 OK──────┤             │             │             │           │
```

## Data Flow Example

```
REQUEST:
GET /pokemons?limit=5&offset=0

PROCESSING:
┌─────────────────────────────────────────┐
│ 1. Route Validation                     │
│    - limit: "5" → 5 (number)           │
│    - offset: "0" → 0 (number)          │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│ 2. Controller                           │
│    - Parses: limit=5, offset=0         │
│    - Calls: PokemonsFetcher.run(5, 0)  │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│ 3. UseCase (PokemonsFetcher)            │
│    - Calls: repository.findAll(0, 5)   │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│ 4. Repository                           │
│    - Calls: getPokemonsALL(0, 5)       │
│    - Gets: 5 pokemons from API         │
│    - Counts: 12 from database          │
│    - Returns: {count:1130, pokemons:[]}│
└──────────────────┬──────────────────────┘
                   ▼
RESPONSE:
{
  "count": 1130,
  "pokemons": [
    {
      "id": 1,
      "name": "bulbasaur",
      "img": "https://...",
      "personalized": false,
      "types": [
        { "id": 12, "name": "grass" },
        { "id": 4, "name": "poison" }
      ]
    },
    // 4 more pokemons...
  ]
}
```

## Dependency Injection Container

```
DependencyInjectionContainer (Singleton)
│
├─► SequelizePokemonRepository
│   ├─ getPokemonsALL (service)
│   └─ Pokemon (model)
│
├─► PokemonsFetcher
│   └─ depends on: IPokemonRepository
│
└─► GetPokemonsController
    └─ depends on: PokemonsFetcher
```

## File Organization

```
src/
│
├── application/           (Business logic & HTTP layer)
│   ├── controllers/
│   │   └── get-pokemons-controller.ts
│   ├── dto/
│   │   └── PokemonsDto.ts
│   └── use-cases/
│       └── PokemonsFetcher.ts
│
├── domain/                (Business rules - Pure logic, no dependencies)
│   ├── entities/
│   │   ├── Pokemon.ts
│   │   └── Type.ts
│   └── ports/            (Interfaces - define contracts)
│       └── IPokemonRepository.ts
│
├── infrastructure/        (Technical implementations)
│   └── adapters/
│       └── SequelizePokemonRepository.ts
│
├── shared/               (Shared utilities)
│   └── infrastructure/
│       └── Controller.ts (Base class)
│
├── routes/               (Route definitions)
│   ├── index.ts (validation utilities)
│   └── pokemons.routes.ts (endpoint definitions)
│
├── DependencyInjectionContainer.ts
├── app.ts
└── index.ts
```
