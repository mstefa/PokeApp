# TypeScript Backend Setup - Quick Reference

## ✅ What's Ready

### Core Setup Complete
- ✅ TypeScript compiler configured (strict mode)
- ✅ Hexagonal architecture directory structure
- ✅ Domain entities (Pokemon, Type)
- ✅ Repository ports (interfaces)
- ✅ Error handling classes
- ✅ Configuration management
- ✅ Build scripts ready
- ✅ ESLint + Prettier configured for TypeScript

### Files Created
```
src/
├── index.ts                          # Entry point
├── app.ts                            # Express app factory
├── config/app.config.ts             # Configuration
├── domain/
│   ├── entities/Pokemon.ts          # Domain model
│   ├── entities/Type.ts             # Type model
│   ├── ports/IPokemonRepository.ts  # Repository interface
│   ├── ports/ITypeRepository.ts     # Type repo interface
│   └── ports/IExternalService.ts    # External API interfaces
├── shared/
│   ├── errors/index.ts              # Error classes
│   └── utils/index.ts               # Utilities & logger
└── infrastructure/ (ready for adapters)
└── application/ (ready for controllers)
```

---

## 🚀 Quick Start

### Development (Recommended)
```bash
npm run dev
```
- Runs TypeScript with ts-node
- Hot reload with nodemon
- Auto-compile on save

### Production
```bash
npm run build    # Compile to dist/
npm start        # Run compiled JS
```

### Other Commands
```bash
npm run lint              # Check code style
npm run format            # Format code
npm run test:integration  # Run existing tests
```

---

## 📝 What to Do Next

### Phase 1: Use Cases (Business Logic)
Create TypeScript use-cases for business operations:

Example structure:
```typescript
// src/domain/use-cases/GetPokemonsUseCase.ts
export class GetPokemonsUseCase {
  constructor(
    private pokemonRepository: IPokemonRepository,
    private externalService: IExternalPokemonService
  ) {}

  async execute(offset: number, limit: number): Promise<PokemonListResponse> {
    // Pure business logic here
    return this.pokemonRepository.findAll(offset, limit);
  }
}
```

### Phase 2: Repository Adapters
Implement the ports with Sequelize:

```typescript
// src/infrastructure/persistence/SequelizePokemonRepository.ts
export class SequelizePokemonRepository implements IPokemonRepository {
  // Implementation using Sequelize models
}
```

### Phase 3: External Service Adapters
Implement PokeAPI adapter:

```typescript
// src/infrastructure/external/PokeAPIService.ts
export class PokeAPIService implements IExternalPokemonService {
  // API calls using axios
}
```

### Phase 4: Controllers
Create thin HTTP layer:

```typescript
// src/application/controllers/PokemonsController.ts
export class PokemonsController {
  constructor(private getPokemonsUseCase: GetPokemonsUseCase) {}

  async list(req: Request, res: Response): Promise<void> {
    const result = await this.getPokemonsUseCase.execute(
      req.query.offset,
      req.query.limit
    );
    res.json(result);
  }
}
```

---

## 🔧 TypeScript Tips

### Path Aliases
Use clean imports instead of `../../../`:
```typescript
// Instead of
import { Pokemon } from '../../../domain/entities/Pokemon';

// Use
import { Pokemon } from '@domain/entities/Pokemon';
```

### Type Safety
Every function should have types:
```typescript
// Good
async function getPokemon(id: number): Promise<Pokemon | null> {
  // ...
}

// Avoid
async function getPokemon(id) { // Missing types!
  // ...
}
```

### Error Handling
Use the custom error classes:
```typescript
import { NotFoundError, ValidationError } from '@shared/errors';

throw new NotFoundError('Pokemon', id);
throw new ValidationError('Invalid pokemon data');
```

---

## 📚 Key Files to Know

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript compiler config (strict mode) |
| `.eslintrc.json` | Linting rules for TypeScript |
| `.prettierrc.json` | Code formatting rules |
| `src/config/app.config.ts` | Centralized app configuration |
| `src/shared/errors/index.ts` | Domain error classes |
| `src/shared/utils/index.ts` | Helper functions |

---

## ✨ Benefits of This Setup

1. **Type Safety** - Catch errors at compile time, not runtime
2. **Clean Architecture** - Clear separation of concerns
3. **Testability** - Easy to mock dependencies via ports
4. **Maintainability** - Clear structure and interfaces
5. **IDE Support** - Better autocomplete and refactoring
6. **Documentation** - Types serve as inline documentation

---

## 🆘 Troubleshooting

### TypeScript won't compile
```bash
npx tsc --noEmit    # Check for errors
npm run build       # Full compilation
```

### Missing type definitions
```bash
npm install --save-dev @types/package-name
```

### Want to check types without compiling?
```bash
npx tsc --noEmit
```

### Want to see compiled JavaScript?
```bash
npm run build
cat dist/index.js
```

---

## 📖 Documentation Files

- `TYPESCRIPT_SETUP.md` - Detailed TypeScript guide
- `TEST_STRATEGY.md` - Integration test documentation
- This file - Quick reference

---

**Ready to implement the first use-case? 🚀**
