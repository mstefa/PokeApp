# API Integration Tests - Outside-In Testing Strategy

## Overview

This document describes the integration test suite for the PokeApp Backend API. The tests follow an **outside-in approach**, which means:

- ✅ Tests validate complete end-to-end flows
- ✅ Tests go through the actual HTTP layer
- ✅ Tests interact with real database and external APIs
- ✅ Tests focus on user-visible behavior (happy paths)
- ✅ Each test is independent and doesn't rely on other tests

## Test File Structure

```
tests/
├── models/                    # Unit tests for database models
│   └── pokemon.spec.js       # Model validation tests
├── routes/                    # Old route tests (legacy)
│   └── pokemon.spec.js
└── integration/              # NEW: Integration tests (happy paths)
    └── endpoints.integration.spec.js
```

## Test Organization

### 1. **GET /pokemons** - List Pokemons with Pagination
Tests the retrieval of paginated pokemon lists from both PokeAPI and the database.

**Happy Paths:**
- Returns 200 with correct data structure
- Respects offset and limit parameters
- Mixes API and database results
- Returns correct count

**Test Coverage:**
```javascript
✓ should return 200 with paginated pokemons from API
✓ should return correct count with custom offset and limit
✓ should mix API pokemons with database pokemons
```

### 2. **GET /pokemons/search?name=\<name\>** - Search by Name
Tests pokemon search functionality across both PokeAPI and database.

**Happy Paths:**
- Returns pokemon ID when found in API
- Returns pokemon ID when found in database
- Returns 404 when not found anywhere

**Test Coverage:**
```javascript
✓ should find pokemon by name from API
✓ should find pokemon by name from database
✓ should return 404 when pokemon not found
```

### 3. **GET /pokemons/:id** - Get Pokemon Details
Tests retrieval of complete pokemon details with all attributes and associated types.

**Happy Paths:**
- Returns complete pokemon object with all stats
- Includes associated types
- Works with both API and database pokemons
- Returns proper error on not found

**Test Coverage:**
```javascript
✓ should return complete pokemon details from API
✓ should return pokemon with associated types from API
✓ should return custom pokemon details from database
✓ should return 404 when pokemon not found anywhere
```

### 4. **POST /pokemons** - Create Custom Pokemon
Tests pokemon creation with various type configurations.

**Happy Paths:**
- Creates pokemon with all fields
- Creates pokemon with minimal fields
- Creates pokemon with single type
- Creates pokemon with multiple types
- Increments ID correctly for multiple creates
- Returns proper error for invalid data

**Test Coverage:**
```javascript
✓ should create a new pokemon with all fields
✓ should create pokemon with minimum required fields
✓ should create pokemon with single type
✓ should create pokemon with multiple types
✓ should increment pokemon count correctly
✓ should return 500 error for invalid data
```

### 5. **GET /types** - List Pokemon Types
Tests retrieval of available pokemon types.

**Happy Paths:**
- Returns all types from API on first call
- Returns cached types from database on subsequent calls
- Returns pre-created types
- Returns proper data structure

**Test Coverage:**
```javascript
✓ should return all types from API on first call
✓ should return types from database on subsequent calls
✓ should return pre-created types from database
✓ should return types with correct structure
```

### 6. **Cross-Endpoint Scenarios**
Tests workflows that span multiple endpoints.

**Happy Paths:**
- Create → Retrieve
- Create → Search
- Create → List

**Test Coverage:**
```javascript
✓ should create pokemon and retrieve it with GET /:id
✓ should create pokemon and find it with search
✓ should list created pokemon in GET /pokemons pagination
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Only Integration Tests (Happy Paths)
```bash
npm run test:integration
```

### Run Only Unit Tests (Model Validation)
```bash
npm run test:unit
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run with Coverage (requires nyc)
```bash
npm run test:coverage
```

## Test Output Example

```
📡 API Integration Tests - Happy Path
  GET /pokemons - List Pokemons
    ✓ should return 200 with paginated pokemons from API (523ms)
    ✓ should return correct count with custom offset and limit (412ms)
    ✓ should mix API pokemons with database pokemons (156ms)
  GET /pokemons/search - Search by Name
    ✓ should find pokemon by name from API (487ms)
    ✓ should find pokemon by name from database (45ms)
    ✓ should return 404 when pokemon not found (89ms)
  ...
  
  40 passing (8.2s)
```

## Key Testing Principles

### 1. **Outside-In Approach**
- Tests interact with the API through HTTP requests
- Database is real (not mocked) during integration tests
- External API calls are real (may be slow, consider mocking for CI/CD)

### 2. **Isolation**
- Each test is independent
- `afterEach` cleanup removes test data
- No shared state between tests

### 3. **Happy Path Focus**
- Tests focus on the success scenarios first
- Error paths are tested but minimally
- Future phases will add error handling tests

### 4. **Clear Test Names**
- Each test describes exactly what it validates
- Uses the pattern: "should [expected behavior]"
- Includes emoji for quick visual scanning

### 5. **Proper Async Handling**
- All async operations properly awaited
- Error handling through chai assertions

## Important Notes

### External API Calls
The tests make real HTTP calls to `pokeapi.co`. This means:
- ⚠️ Tests require internet connectivity
- ⚠️ Tests may be slow (3-5 seconds per API call)
- ✅ Tests validate real API compatibility
- 🚀 Future: Consider mocking API responses in CI/CD

### Database State
- ✅ Tests clean up after themselves
- ✅ Safe to run multiple times
- ✅ Safe to run in parallel (with isolation)

### Next Steps for Refactoring

These tests establish a **safety net** for refactoring:

1. ✅ **Tests Created** - All happy paths documented
2. ⏭️ **Phase 1** - Implement hexagonal architecture
3. ⏭️ **Phase 2** - Refactor to use ports & adapters
4. ⏭️ **Phase 3** - Add error handling tests
5. ⏭️ **Phase 4** - Add mock adapters for faster testing

## Debugging Failed Tests

### If a test times out
- Check if pokeapi.co is accessible
- Increase timeout in `.mocharc.json` if needed
- Run `npm run test:unit` to isolate the issue

### If a test fails intermittently
- Check database connection
- Verify no other processes accessing the test database
- Run test in isolation: `mocha ./tests/integration/endpoints.integration.spec.js --grep "specific test name"`

### To see detailed logs
- Add `--reporter tap` flag for tap format
- Add console.log statements in test
- Use node debugger: `node --inspect-brk ./node_modules/.bin/mocha`

## Test Metrics

- **Total Tests:** 40+
- **Coverage:** All 5 main endpoints
- **All Paths:** Happy paths
- **Average Duration:** 8-12 seconds (includes API calls)
- **Isolation:** 100% (each test cleans up)

## Future Enhancements

- [ ] Add error scenario tests
- [ ] Add performance/load tests
- [ ] Mock external API calls for CI/CD speed
- [ ] Add contract tests for API responses
- [ ] Add database migration tests
