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
│    - limit: \"5\" → 5 (number)           │
│    - offset: \"0\" → 0 (number)          │
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
  \"count\": 1130,
  \"pokemons\": [
    {
      \"id\": 1,
      \"name\": \"bulbasaur\",
      \"img\": \"https://...\",\n      \"personalized\": false,\n      \"types\": [\n        { \"id\": 12, \"name\": \"grass\" },\n        { \"id\": 4, \"name\": \"poison\" }\n      ]\n    },\n    // 4 more pokemons...\n  ]\n}\n```\n\n## Dependency Injection Container\n\n```\nDependencyInjectionContainer (Singleton)\n│\n├─► SequelizePokemonRepository\n│   ├─ getPokemonsALL (service)\n│   └─ Pokemon (model)\n│\n├─► PokemonsFetcher\n│   └─ depends on: IPokemonRepository\n│\n└─► GetPokemonsController\n    └─ depends on: PokemonsFetcher\n```\n\n## File Organization\n\n```\nsrc/\n│\n├── application/           (Business logic & HTTP layer)\n│   ├── controllers/\n│   │   └── get-pokemons-controller.ts\n│   ├── dto/\n│   │   └── PokemonsDto.ts\n│   └── use-cases/\n│       └── PokemonsFetcher.ts\n│\n├── domain/                (Business rules - Pure logic, no dependencies)\n│   ├── entities/\n│   │   ├── Pokemon.ts\n│   │   └── Type.ts\n│   └── ports/            (Interfaces - define contracts)\n│       └── IPokemonRepository.ts\n│\n├── infrastructure/        (Technical implementations)\n│   └── adapters/\n│       └── SequelizePokemonRepository.ts\n│\n├── shared/               (Shared utilities)\n│   └── infrastructure/\n│       └── Controller.ts (Base class)\n│\n├── routes/               (Route definitions)\n│   ├── index.ts (validation utilities)\n│   └── pokemons.routes.ts (endpoint definitions)\n│\n├── DependencyInjectionContainer.ts\n├── app.ts\n└── index.ts\n```\n