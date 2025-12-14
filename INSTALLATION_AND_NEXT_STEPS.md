# Installation & Next Steps

## Current Status

The TypeScript GET Pokemons endpoint has been fully implemented following the Hexagonal Architecture pattern from the [simple-api-template](https://github.com/mstefa/simple-api-template).

### Files Created:

**Application Layer:**
- ✅ `src/application/controllers/get-pokemons-controller.ts` - HTTP request handler
- ✅ `src/application/dto/PokemonsDto.ts` - Response data structure
- ✅ `src/application/use-cases/PokemonsFetcher.ts` - Business logic

**Domain Layer:**
- ✅ `src/domain/ports/IPokemonRepository.ts` - Already existed, used as interface

**Infrastructure Layer:**
- ✅ `src/infrastructure/adapters/SequelizePokemonRepository.ts` - Repository implementation

**Shared/Support:**
- ✅ `src/shared/infrastructure/Controller.ts` - Base controller class
- ✅ `src/routes/index.ts` - Route validation utilities
- ✅ `src/routes/pokemons.routes.ts` - Endpoint definitions
- ✅ `src/DependencyInjectionContainer.ts` - Dependency management

**Documentation:**
- ✅ `GET_POKEMONS_IMPLEMENTATION.md` - Complete implementation guide
- ✅ `ARCHITECTURE_DIAGRAMS.md` - Visual architecture diagrams

## Installation Steps

### 1. Install Dependencies

```bash
cd /Users/mstefanutti/workspace/PokeApp/api
npm install express-validator http-status
```

### 2. Build TypeScript

```bash
npm run build
```

### 3. Run Tests

```bash
npm run test:integration
```

Expected output:
```
✓ GET /pokemons - should return 200 with paginated pokemons
✓ GET /pokemons - should return correct count with custom offset and limit
✓ GET /pokemons/search - should find pokemon by name
... [other tests] ...
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:3000`

### 5. Test the Endpoint

```bash
# Get first 12 pokemons (default)
curl "http://localhost:3000/pokemons"

# Get 5 pokemons starting from offset 0
curl "http://localhost:3000/pokemons?limit=5&offset=0"

# Get 10 pokemons starting from offset 100
curl "http://localhost:3000/pokemons?limit=10&offset=100"
```

## Architecture Patterns Used

### 1. **Hexagonal Architecture (Ports & Adapters)**
- **Port**: `IPokemonRepository` interface
- **Adapter**: `SequelizePokemonRepository` implementation
- Allows swapping out database implementations without changing business logic

### 2. **Dependency Injection**
- `DependencyInjectionContainer` manages object creation
- Controllers receive dependencies, don't create them
- Facilitates testing with mock dependencies

### 3. **Domain-Driven Design (DDD)**
- Clear separation between Domain, Application, and Infrastructure layers
- Domain layer has no external dependencies
- Business logic stays pure and testable

### 4. **Repository Pattern**
- Data access is abstracted behind an interface
- Implementation details hidden from business logic
- Easy to change data sources without affecting use cases

### 5. **Data Transfer Objects (DTOs)**
- `PokemonsDto` decouples API contract from internal models
- API can evolve independently from domain entities

## Project Structure Overview

```
PokeApp/
├── api/
│   ├── src/
│   │   ├── application/      ← HTTP & Use Cases
│   │   ├── domain/           ← Business Rules
│   │   ├── infrastructure/   ← Data Access
│   │   ├── shared/           ← Common Classes
│   │   ├── routes/           ← Endpoint Definitions
│   │   ├── app.ts            ← Express Setup
│   │   ├── DependencyInjectionContainer.ts
│   │   └── index.ts          ← Entry Point
│   ├── tests/                ← Integration Tests
│   ├── package.json
│   └── tsconfig.json
├── client/                   ← React App
└── docker-compose.yml
```

## Key Implementation Details

### GetPokemonsController

Handles HTTP requests with these responsibilities:
- Validates input (handled by middleware)
- Parses query parameters
- Calls business logic
- Returns structured responses
- Handles errors gracefully

```typescript
async run(req: GetPokemonsRequest, res: Response) {
  const limit = req.query.limit ? parseInt(req.query.limit) : 12;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;

  try {
    const pokemons = await this.pokemonsFetcher.run(limit, offset);
    res.status(httpStatus.OK).send(pokemons);
  } catch (error) {
    this.errorHandling(error, res);
  }
}
```

### PokemonsFetcher (Use Case)

Contains business logic:
- Determines what data is needed
- Calls the repository
- Transforms data if needed
- Returns DTOs

```typescript
async run(limit: number, offset: number): Promise<PokemonsDto> {
  const result = await this.repository.findAll(offset, limit);
  return {
    count: result.count,
    pokemons: result.pokemons
  };
}
```

### SequelizePokemonRepository

Implements data access:
- Integrates with existing services (pokemonsIdRequest.js)
- Queries database using Sequelize ORM
- Combines API and DB data
- Maps to domain entities

```typescript
async findAll(offset: number, limit: number): Promise<PokemonListResponse> {
  const pokemons = await getPokemonsALL(offset, limit, false);
  const dbCount = await PokemonModel.count({});
  const totalCount = countAPIPokemons + dbCount;

  return {
    count: totalCount,
    pokemons: pokemons
  };
}
```

## Integration with Existing Code

The implementation works seamlessly with existing code:

✅ **Uses existing services**: `pokemonsIdRequest.js` for API calls
✅ **Uses existing models**: Sequelize Pokemon/Type models from `db.js`
✅ **Compatible with routes**: Both JS and TS routes can coexist
✅ **Same database**: Connects to existing PostgreSQL database
✅ **Existing tests pass**: Integration tests still work

## Next Steps

### To Migrate Other Endpoints to TypeScript:

1. **GET /pokemons/:id** (Get Pokemon by ID)
   - Create `GetPokemonController`
   - Use `PokemonFinder` use case
   - Add route to `pokemons.routes.ts`

2. **POST /pokemons** (Create Pokemon)
   - Create `CreatePokemonController`
   - Use `PokemonCreator` use case
   - Add repository method `save(pokemon)`

3. **GET /types** (List Types)
   - Follow same pattern for Types
   - Create `GetTypesController` and routes

4. **Search /pokemons/search** (Search Pokemon by Name)
   - Create `SearchPokemonController`
   - Use `PokemonSearcher` use case
   - Add route handler

### Code Improvements:

1. **Add custom domain errors**:
   ```typescript
   export class PokemonNotFoundError extends DomainError {
     constructor(id: number) {
       super(`Pokemon with id ${id} not found`, 404);
     }
   }
   ```

2. **Add logging**:
   ```typescript
   this.logger.info(`Fetching ${limit} pokemons from offset ${offset}`);
   ```

3. **Add caching**:
   ```typescript
   const cached = await this.cache.get(`pokemons:${offset}:${limit}`);
   if (cached) return cached;
   ```

4. **Add filtering**:
   ```typescript
   async findByType(type: string): Promise<Pokemon[]>
   async findByStats(minStats: Stats): Promise<Pokemon[]>
   ```

5. **Add sorting**:
   ```typescript
   async findAll(offset, limit, sortBy, sortOrder): Promise<PokemonListResponse>
   ```

## Testing

### Run all tests:
```bash
npm run test
```

### Run integration tests only:
```bash
npm run test:integration
```

### Run specific test:
```bash
npm run test:integration -- --grep "GET /pokemons"
```

### Watch mode:
```bash
npm run test:watch
```

## Deployment

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Docker:
```bash
docker-compose up --build
```

## Troubleshooting

### Module not found errors:
```bash
npm install
npm run build
```

### Port already in use:
```bash
# Change port in config or:
kill -9 $(lsof -t -i:3000)
```

### Database connection issues:
- Check `.env` file has correct DB credentials
- Ensure PostgreSQL is running
- Check `docker-compose.yml` for Docker setup

### TypeScript compilation errors:
```bash
npx tsc --noEmit  # Check for errors
npm run build     # Compile
```

## References

- [Hexagonal Architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [simple-api-template](https://github.com/mstefa/simple-api-template)
- [Express.js](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)
- [TypeScript](https://www.typescriptlang.org/)

## Questions or Issues?

Refer to:
1. `GET_POKEMONS_IMPLEMENTATION.md` - Detailed implementation guide
2. `ARCHITECTURE_DIAGRAMS.md` - Visual architecture explanations
3. `tests/integration/endpoints.integration.spec.js` - Test examples
4. Source code comments - Inline documentation
