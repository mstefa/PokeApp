# GET Pokemons Endpoint - TypeScript Implementation

This document describes the TypeScript implementation of the GET Pokemons endpoint following the Hexagonal Architecture pattern from the [simple-api-template](https://github.com/mstefa/simple-api-template).

## Architecture Overview

The implementation follows a layered architecture with clear separation of concerns:

```
User Request
    ↓
Controller Layer (HTTP handling)
    ↓
Application/Use Case Layer (Business Logic)
    ↓
Domain Layer (Business Rules)
    ↓
Infrastructure/Adapter Layer (Data Persistence)
    ↓
Database
```

## Project Structure

```
src/
├── application/
│   ├── controllers/
│   │   └── get-pokemons-controller.ts       # HTTP Request Handler
│   ├── dto/
│   │   └── PokemonsDto.ts                   # Data Transfer Object
│   └── use-cases/
│       └── PokemonsFetcher.ts               # Business Logic
├── domain/
│   ├── entities/
│   │   └── Pokemon.ts                       # Domain Entity (already exists)
│   └── ports/
│       └── IPokemonRepository.ts            # Repository Interface
├── infrastructure/
│   └── adapters/
│       └── SequelizePokemonRepository.ts    # Repository Implementation
├── shared/
│   └── infrastructure/
│       └── Controller.ts                    # Base Controller Class
├── routes/
│   ├── index.ts                             # Route utilities & validation
│   └── pokemons.routes.ts                   # Pokemon routes
├── app.ts                                   # Express app configuration
└── DependencyInjectionContainer.ts          # Dependency management
```

## Files Created

### 1. **src/application/dto/PokemonsDto.ts**
Defines the data structure for the API response:
- Contains count and array of pokemons
- Includes pokemon details (id, name, img, types, etc.)

### 2. **src/application/use-cases/PokemonsFetcher.ts**
Implements the business logic:
- Receives limit and offset parameters
- Calls the repository to fetch pokemon data
- Returns structured response

### 3. **src/application/controllers/get-pokemons-controller.ts**
Handles HTTP requests:
- Extends the base Controller class
- Parses query parameters (limit, offset)
- Calls the use case
- Returns HTTP response with appropriate status codes
- Handles errors gracefully

### 4. **src/shared/infrastructure/Controller.ts**
Abstract base class for all controllers:
- Defines the run method signature
- Implements common error handling
- Maps domain errors to HTTP responses

### 5. **src/infrastructure/adapters/SequelizePokemonRepository.ts**
Implements the repository interface:
- Adapts domain interfaces to ORM models (Sequelize)
- Fetches data from existing pokemons.js service and database
- Maps database entities to domain entities
- Implements all methods from IPokemonRepository

### 6. **src/routes/index.ts**
Route utilities:
- Provides request schema validation middleware
- Helper functions for route registration

### 7. **src/routes/pokemons.routes.ts**
Pokemon endpoint definitions:
- GET /pokemons - List pokemons with pagination
- Validates query parameters (limit, offset)
- Uses dependency injection for controllers

### 8. **src/DependencyInjectionContainer.ts**
Dependency management:
- Singleton pattern for DI container
- Instantiates all service dependencies
- Provides controllers to routes
- Can be extended for other services

## How It Works

### Request Flow

1. **HTTP Request** arrives at `/pokemons` endpoint with query parameters:
   ```
   GET /pokemons?limit=12&offset=0
   ```

2. **Route Validation** (in pokemons.routes.ts):
   - Validates that limit and offset are numeric
   - Returns 422 if validation fails

3. **Controller** (GetPokemonsController):
   - Parses query parameters with defaults (limit: 12, offset: 0)
   - Calls PokemonsFetcher use case
   - Catches and handles errors

4. **Use Case** (PokemonsFetcher):
   - Receives validated parameters
   - Calls repository method
   - Returns DTO with count and pokemons array

5. **Repository** (SequelizePokemonRepository):
   - Calls getPokemonsALL service for API data
   - Queries database for custom pokemons
   - Combines results
   - Maps to domain entities
   - Returns PokemonListResponse

6. **Response** sent back to client:
   ```json
   {
     "count": 1130,
     "pokemons": [
       {
         "id": 1,
         "name": "bulbasaur",
         "img": "...",
         "personalized": false,
         "types": [...]
       },
       ...
     ]
   }
   ```

## Key Design Patterns

### 1. **Hexagonal Architecture (Ports & Adapters)**
- **Port**: `IPokemonRepository` interface defines what data operations are needed
- **Adapter**: `SequelizePokemonRepository` implements how to fetch data from the actual database

### 2. **Dependency Injection**
- Dependencies are created in `DependencyInjectionContainer`
- Controllers don't know about concrete implementations
- Easy to test by passing mock repositories

### 3. **Separation of Concerns**
- **Domain**: Business rules (Pokemon entity)
- **Application**: Use cases (PokemonsFetcher)
- **Infrastructure**: Technical implementations (Repository)
- **Controllers**: HTTP handling

### 4. **DTO Pattern**
- Data Transfer Objects separate internal domain models from API responses
- Allows API to evolve independently from domain

## Dependencies Added

The following packages were added to `package.json`:

```json
{
  "express-validator": "^7.0.0",
  "http-status": "^1.7.4"
}
```

Run the following command to install:
```bash
npm install
```

## Integration with Existing Code

The implementation integrates seamlessly with existing code:

1. **Existing Services**: Uses `pokemonsIdRequest.js` service for API calls
2. **Existing Models**: Works with Sequelize Pokemon model from `db.js`
3. **Existing Routes**: Can coexist with existing JavaScript routes
4. **Database**: Uses same database connection from `db.js`

## Testing

The integration test (`tests/integration/endpoints.integration.spec.js`) already tests the GET /pokemons endpoint:

```bash
npm run test:integration
```

The test validates:
- Returns 200 status code
- Response has `count` property
- Response has `pokemons` array
- Correct number of pokemons returned

## Future Enhancements

1. **Migrate other endpoints** to TypeScript following this same pattern
2. **Add filtering**: Implement search by type, stats, etc.
3. **Add sorting**: Sort by name, stats, etc.
4. **Add caching**: Cache pokemon data for better performance
5. **Error handling**: Create custom domain errors with specific HTTP codes
6. **Logging**: Add structured logging to track requests and errors

## Running the Application

Start the development server:
```bash
npm run dev
```

Test the endpoint:
```bash
curl "http://localhost:3000/pokemons?limit=5&offset=0"
```

Run tests:
```bash
npm run test:integration
```
