# TypeScript Setup & Migration Guide

## ✅ What's Been Setup

### 1. **TypeScript Configuration** (`tsconfig.json`)
- **Target:** ES2020 (modern JavaScript)
- **Module:** CommonJS (compatible with Node.js)
- **Strict Mode:** Enabled for maximum type safety
- **Path Aliases:** For cleaner imports
  - `@/*` → `src/*`
  - `@config/*` → `src/config/*`
  - `@domain/*` → `src/domain/*`
  - etc.

### 2. **Project Structure (Hexagonal Ready)**
```
src/
├── config/                 # Configuration files
│   └── app.config.ts
├── domain/                # Business logic (pure, no dependencies)
│   ├── entities/          # Domain models
│   │   ├── Pokemon.ts
│   │   └── Type.ts
│   ├── ports/             # Interfaces (contracts)
│   │   ├── IPokemonRepository.ts
│   │   ├── ITypeRepository.ts
│   │   └── IExternalService.ts
│   └── use-cases/         # Business operations (coming next)
├── infrastructure/        # Technical implementations
│   ├── adapters/          # Interface implementations
│   ├── persistence/       # Database/ORM
│   └── external/          # External APIs
├── application/           # HTTP/Express layer
│   ├── controllers/       # Request handlers
│   ├── dto/              # Request/Response schemas
│   └── middleware/        # Express middleware
└── shared/               # Cross-cutting concerns
    ├── errors/           # Error classes
    └── utils/            # Helper utilities
```

### 3. **Tools Installed**
- `typescript` - TypeScript compiler
- `ts-node` - Run TypeScript directly (development)
- `tsx` - TypeScript executor (alternative)
- `@types/node` - Node.js type definitions
- `@types/express` - Express type definitions
- `@types/morgan` - Morgan type definitions
- `@types/sequelize` - Sequelize type definitions
- `@typescript-eslint/parser` - TypeScript ESLint support
- `@typescript-eslint/eslint-plugin` - TypeScript linting rules

### 4. **NPM Scripts**
```bash
npm run build              # Compile TypeScript to dist/
npm run build:watch       # Watch for changes and recompile
npm run dev              # Development mode with ts-node (auto-reload)
npm start                # Production mode (run compiled JS)
npm run lint             # Lint TypeScript and JavaScript
npm run format           # Format code with Prettier
```

---

## 🚀 How to Start Using TypeScript

### Option 1: Development Mode (Recommended for Now)
```bash
npm run dev
# Runs TypeScript directly without compilation
# Hot-reloads with nodemon
```

### Option 2: Production Mode
```bash
npm run build           # Compile to dist/
npm start              # Run compiled code
```

---

## 📝 Created Files

### Domain Layer (Pure Business Logic)
- ✅ `src/domain/entities/Pokemon.ts` - Pokemon domain model
- ✅ `src/domain/entities/Type.ts` - Type domain model
- ✅ `src/domain/ports/IPokemonRepository.ts` - Repository interface
- ✅ `src/domain/ports/ITypeRepository.ts` - Type repository interface
- ✅ `src/domain/ports/IExternalService.ts` - External service interfaces

### Configuration & Utilities
- ✅ `src/config/app.config.ts` - Centralized configuration
- ✅ `src/shared/errors/index.ts` - Domain error classes
- ✅ `src/shared/utils/index.ts` - Utility functions and logger

### Application Entry Point
- ✅ `src/app.ts` - Express app factory
- ✅ `src/index.ts` - Server entry point

---

## 📚 Key TypeScript Features Used

### 1. **Strict Type Safety**
```typescript
interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
}

// Type-safe function
function getPokemon(id: number): Promise<Pokemon | null> {
  // ...
}
```

### 2. **Discriminated Unions for Results**
```typescript
type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

// Usage:
const result = await service.getPokemon(1);
if (result.ok) {
  console.log(result.value); // Typed as Pokemon
} else {
  console.log(result.error);  // Typed as Error
}
```

### 3. **Domain-Driven Design Factories**
```typescript
const pokemon = createPokemon({
  name: 'Pikachu',
  // ... other fields
}, 25);
// Validates on creation, throws if invalid
```

### 4. **Custom Error Classes**
```typescript
throw new NotFoundError('Pokemon', 25);
throw new ValidationError('Invalid pokemon data');
```

---

## 🔄 Migration Path (JavaScript → TypeScript)

The migration is **gradual**. You can keep existing JavaScript files and convert them one by one:

### Phase 1: Types & Interfaces (✅ Done)
- Define all domain interfaces
- Create type definitions for existing models
- Set up error classes

### Phase 2: Use Cases (Next)
- Create business logic layer
- TypeScript only - pure business rules
- No Express, no database dependencies

### Phase 3: Adapters (After Phase 2)
- Implement repository pattern
- Sequelize adapter implementation
- External API adapter

### Phase 4: Controllers (After Phase 3)
- Convert routes to controllers
- Thin request handling layer
- Delegate to use-cases

### Phase 5: Full Migration
- Remove remaining JavaScript files
- Complete hexagonal architecture
- Full type safety throughout

---

## 🛠️ Development Workflow

### 1. **Watch Mode During Development**
```bash
npm run dev
```
- Compiles TypeScript on save
- Restarts server automatically
- Hot reload for development

### 2. **Type Checking**
```bash
# Check types without running
npx tsc --noEmit
```

### 3. **Linting**
```bash
npm run lint
npm run format
```

---

## ⚠️ Important Notes

### 1. **Running the Current Code**
The existing JavaScript files still work! The TypeScript is being added alongside.

```bash
# JavaScript (current - still works)
node index.js

# TypeScript (new - development)
npm run dev

# TypeScript compiled (production)
npm run build && npm start
```

### 2. **Type Checking is Strict**
Any type errors will be caught at compile time, preventing runtime bugs.

### 3. **Path Aliases**
Use the `@/` prefix for cleaner imports:
```typescript
// Before
import { Pokemon } from '../../../domain/entities/Pokemon';

// After
import { Pokemon } from '@domain/entities/Pokemon';
```

### 4. **No Types for Existing Packages**
If TypeScript complains about missing types:
```bash
npm install --save-dev @types/package-name
```

---

## 📊 TypeScript Configuration Options

### Current Settings Explained
- `strict: true` - Enables all strict type checking
- `noImplicitAny: true` - Must specify types
- `noUnusedLocals: true` - Warns about unused variables
- `noUnusedParameters: true` - Warns about unused parameters
- `noImplicitReturns: true` - Must return value from all code paths
- `declaration: true` - Generate `.d.ts` files for public types
- `sourceMap: true` - Debug TypeScript in browsers/tools

---

## 🚨 Troubleshooting

### "Cannot find module 'X'"
Install type definitions:
```bash
npm install --save-dev @types/X
```

### "Type 'any' is not assignable to..."
You're using a value without a proper type. Add type annotation:
```typescript
// Before
const value = something; // Type is 'any'

// After
const value: string = something;
```

### "Object is possibly 'null'"
Handle the null case:
```typescript
const pokemon = await repo.findById(1);
if (pokemon !== null) {
  console.log(pokemon.name);
}
```

---

## ✨ Next Steps

1. **Build first use-case in TypeScript** (Phase 2)
   - Example: `GetPokemonsUseCase`
   - Pure business logic
   - No external dependencies

2. **Implement repository adapters** (Phase 3)
   - Sequelize adapter
   - PokeAPI adapter

3. **Create controllers** (Phase 4)
   - Thin request handlers
   - Delegate to use-cases

4. **Complete migration** (Phase 5)
   - Remove JavaScript files
   - Full type safety

---

## 📖 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Express TypeScript](https://expressjs.com/en/resources/middleware/helmet.html)
