# Quick Reference Guide

## 📁 New Files at a Glance

### Application Layer
```
src/application/
├── controllers/
│   └── get-pokemons-controller.ts     # HTTP handler for GET /pokemons
├── dto/
│   └── PokemonsDto.ts                 # Response type definition
└── use-cases/
    └── PokemonsFetcher.ts             # Business logic
```

### Infrastructure Layer
```
src/infrastructure/
└── adapters/
    └── SequelizePokemonRepository.ts  # Data access implementation
```

### Shared/Support
```
src/shared/
└── infrastructure/
    └── Controller.ts                  # Base controller class

src/routes/
├── index.ts                           # Route validation utilities
└── pokemons.routes.ts                 # Endpoint definitions

src/DependencyInjectionContainer.ts    # Dependency management
```

### Documentation
```
├── GET_POKEMONS_IMPLEMENTATION.md     # Full implementation guide
├── ARCHITECTURE_DIAGRAMS.md           # Visual diagrams
├── INSTALLATION_AND_NEXT_STEPS.md     # Setup instructions
└── SUMMARY_OF_CHANGES.md              # This file's companion
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd api
npm install
```

### 2. Build
```bash
npm run build
```

### 3. Test
```bash
npm run test:integration
```

### 4. Run
```bash
npm run dev
```

### 5. Verify
```bash
curl "http://localhost:3000/pokemons?limit=5&offset=0"
```

---

## 📊 Architecture at a Glance

### Layers (Bottom to Top)
```
HTTP Request
    ↓
[Controller] - HTTP handling (GetPokemonsController)
    ↓
[Use Case] - Business logic (PokemonsFetcher)
    ↓
[Domain] - Interfaces (IPokemonRepository)
    ↓
[Adapter] - Implementation (SequelizePokemonRepository)
    ↓
Database / External API
```

### Data Flow
```
Request with query params (limit, offset)
    ↓
Controller parses params
    ↓
Use Case calls Repository
    ↓
Repository fetches from API & DB
    ↓
Maps to Domain Entity
    ↓
Returns DTO
    ↓
Controller sends JSON Response
```

---

## 🎯 Key Classes

### GetPokemonsController
- **Role**: Handle HTTP requests
- **Method**: `run(req, res)`
- **Does**: Parse params → call use case → send response

### PokemonsFetcher
- **Role**: Business logic
- **Method**: `run(limit, offset)`
- **Does**: Call repository → transform → return DTO

### SequelizePokemonRepository
- **Role**: Data access
- **Method**: `findAll(offset, limit)`
- **Does**: Fetch from API → Query DB → Combine → Map to domain

### DependencyInjectionContainer
- **Role**: Create and manage dependencies
- **Method**: `getInstance()`
- **Does**: Instantiate and wire all objects

---

## 🔗 Request Path

```
GET /pokemons?limit=5&offset=0

→ Route Validation (express-validator)
  Check: limit and offset are numeric
  
→ GetPokemonsController.run()
  Parse: limit = 5, offset = 0
  
→ PokemonsFetcher.run(5, 0)
  Call: repository.findAll(0, 5)
  
→ SequelizePokemonRepository.findAll()
  Fetch: getPokemonsALL(0, 5) from API
  Query: Pokemon.count() from DB
  Map: Results to domain entities
  
→ Response (200 OK)
{
  "count": 1130,
  "pokemons": [...]
}
```

---

## 📦 Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| `express-validator` | ^7.0.0 | Request validation |
| `http-status` | ^1.7.4 | HTTP status constants |

**Install**: `npm install`

---

## 🧪 Testing

```bash
# All tests
npm run test

# Integration tests only
npm run test:integration

# Watch mode
npm run test:watch

# Specific test
npm run test:integration -- --grep "GET /pokemons"
```

---

## 📝 Endpoint Details

### GET /pokemons
- **URL**: `/pokemons`
- **Method**: GET
- **Query Params**:
  - `limit` (optional, default: 12) - Number of items
  - `offset` (optional, default: 0) - Starting position
- **Response**: 
  - Status: 200 OK
  - Body: `{ count: number, pokemons: Pokemon[] }`
- **Validation**:
  - limit and offset must be numeric
  - Invalid params return 422 Unprocessable Entity

### Example Calls
```bash
# Default (limit=12, offset=0)
curl http://localhost:3000/pokemons

# Custom limit
curl http://localhost:3000/pokemons?limit=5

# Custom offset
curl http://localhost:3000/pokemons?offset=10

# Both params
curl "http://localhost:3000/pokemons?limit=5&offset=10"
```

---

## 🔍 Code Structure

### Controller
```typescript
async run(req, res) {
  const limit = parseInt(req.query.limit) || 12;
  const offset = parseInt(req.query.offset) || 0;
  
  const pokemons = await this.pokemonsFetcher.run(limit, offset);
  res.status(200).send(pokemons);
}
```

### Use Case
```typescript
async run(limit, offset) {
  const result = await this.repository.findAll(offset, limit);
  return result; // Already a DTO
}
```

### Repository
```typescript
async findAll(offset, limit) {
  const pokemons = await getPokemonsALL(offset, limit);
  const dbCount = await PokemonModel.count();
  return { count: 1118 + dbCount, pokemons };
}
```

---

## 🔄 How to Add Another Endpoint

### 1. Create Use Case
```typescript
// src/application/use-cases/PokemonFinder.ts
export class PokemonFinder {
  async run(id: number): Promise<PokemonDto> {
    return await this.repository.findById(id);
  }
}
```

### 2. Create Controller
```typescript
// src/application/controllers/get-pokemon-controller.ts
export class GetPokemonController extends Controller {
  async run(req, res) {
    const pokemon = await this.pokemonFinder.run(req.params.id);
    res.status(200).send(pokemon);
  }
}
```

### 3. Add Route
```typescript
// In src/routes/pokemons.routes.ts
router.get('/:id', (req, res) =>
  DIContainer.getPokemonController().run(req, res)
);
```

### 4. Register in DI Container
```typescript
// In DependencyInjectionContainer.ts
this.pokemonFinder = new PokemonFinder(this.pokemonRepository);
this.getPokemonController = new GetPokemonController(this.pokemonFinder);
```

---

## 🛠️ Common Tasks

### Build TypeScript
```bash
npm run build
```

### Run Development Server
```bash
npm run dev
```

### Run Tests
```bash
npm run test:integration
```

### Format Code
```bash
npm run format
```

### Lint Code
```bash
npm run lint
```

### Production Build
```bash
npm run build
npm start
```

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `GET_POKEMONS_IMPLEMENTATION.md` | Detailed implementation guide |
| `ARCHITECTURE_DIAGRAMS.md` | Visual architecture explanations |
| `INSTALLATION_AND_NEXT_STEPS.md` | Setup and next steps |
| `SUMMARY_OF_CHANGES.md` | Overview of all changes |
| `QUICK_REFERENCE.md` | This file - quick lookup |

---

## 🎓 Learning Resources

### Architecture
- Hexagonal Architecture concepts
- Repository Pattern
- Dependency Injection
- Domain-Driven Design

### Code
- Look at `get-pokemons-controller.ts` for controller pattern
- Look at `PokemonsFetcher.ts` for use case pattern
- Look at `SequelizePokemonRepository.ts` for repository pattern
- Look at `DependencyInjectionContainer.ts` for DI pattern

### Tests
- `tests/integration/endpoints.integration.spec.js` - Integration tests
- Shows how endpoints are tested
- Shows expected response format

---

## ⚠️ Troubleshooting

### "Module not found: express-validator"
```bash
npm install
```

### "Cannot find module" errors
```bash
npm run build
```

### Tests fail to run
```bash
npm install
npm run test:integration
```

### Port 3000 in use
```bash
# Kill process using port 3000
kill -9 $(lsof -t -i:3000)

# Or change port in environment
PORT=3001 npm run dev
```

### Database connection error
- Check `.env` file
- Verify PostgreSQL is running
- Check `docker-compose.yml`

---

## 📋 Checklist for Next Endpoint

- [ ] Create Use Case class
- [ ] Create Controller class (extends Controller)
- [ ] Create DTO type (if needed)
- [ ] Add repository method (if needed)
- [ ] Create route handler
- [ ] Register in DependencyInjectionContainer
- [ ] Add validation schema
- [ ] Write integration tests
- [ ] Test manually with curl
- [ ] Update documentation

---

## 🎯 Next Endpoints to Migrate

In order of priority:

1. **GET /pokemons/:id** - Get single pokemon
2. **POST /pokemons** - Create pokemon
3. **GET /types** - List types
4. **GET /pokemons/search** - Search pokemon
5. **PUT /pokemons/:id** - Update pokemon (if needed)
6. **DELETE /pokemons/:id** - Delete pokemon (if needed)

---

## 💡 Tips

- Keep domain layer free of external dependencies
- Use DTOs to decouple API from domain
- Inject dependencies, don't create them
- Write tests as you go
- Document complex business logic
- Use TypeScript types extensively
- Follow single responsibility principle

---

## 📞 Need Help?

1. Read `GET_POKEMONS_IMPLEMENTATION.md` for detailed explanation
2. Check `ARCHITECTURE_DIAGRAMS.md` for visual reference
3. Look at existing code patterns in this implementation
4. Check test file for usage examples
5. Review test file for expected behavior

---

## 🎉 You've Successfully Implemented:

✅ Hexagonal Architecture
✅ Dependency Injection
✅ Repository Pattern
✅ Use Case/Service Layer
✅ TypeScript Controllers
✅ Request Validation
✅ Error Handling
✅ Full Integration with Existing Code
✅ Comprehensive Documentation

**Ready to migrate other endpoints using this pattern!**
