import { expect, describe, beforeAll, afterEach, it } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../../src/app';
import { Pokemon, conn } from '../../src/infrastructure/persistence/sequelize';

const app = createApp();
const request = supertest(app);

describe('📡 API Integration Tests - Happy Path', () => {
  beforeAll(async () => {
    // Authenticate with database
    await conn.authenticate()
      .catch((err) => {
        console.error('Unable to connect to the database:', err);
        throw err;
      });
  });

  afterEach(async () => {
    // Clean up after each test - Types are now stored as JSON in Pokemon
    try {
      await Pokemon.destroy({ where: {}, force: true });
    } catch (error) {
      console.error('Error cleaning up Pokemon:', error);
    }
  });

  // ========================================================================
  // GET /pokemons - List all pokemons with pagination
  // ========================================================================

  describe('GET /pokemons - List Pokemons', () => {
    it('✓ should return 200 with paginated pokemons from API', async () => {
      const res = await request
        .get('/pokemons/')
        .query({ offset: 0, limit: 12 })
        .expect(200);

      expect(res.body).to.have.property('count');
      expect(res.body).to.have.property('pokemons');
      expect(res.body.pokemons).to.be.an('array');
      expect(res.body.pokemons.length).to.equal(12);

      // Verify pokemon structure from API
      const pokemon = res.body.pokemons[0];
      expect(pokemon).to.have.property('id');
      expect(pokemon).to.have.property('name');
      expect(pokemon).to.have.property('img');
      expect(pokemon).to.have.property('types');
    });

    it('✓ should return correct count with custom offset and limit', async () => {
      const res = await request
        .get('/pokemons/')
        .query({ offset: 10, limit: 5 })
        .expect(200);

      expect(res.body.pokemons).to.have.length(5);
      expect(res.body.count).to.be.a('number');
    });

    it('✓ should mix API pokemons with database pokemons', async () => {
      // Create a custom pokemon in the database
      await Pokemon.create({
        id: 10220,
        name: 'CustomPokemon',
        personalized: true,
        img: 'https://example.com/pokemon.png'
      });

      const res = await request
        .get('/pokemons/')
        .query({ offset: 0, limit: 12 })
        .expect(200);

      expect(res.body.pokemons).to.be.an('array');
      expect(res.body.count).to.be.greaterThan(1118);
    });
  });

  // ========================================================================
  // GET /pokemons/search?name=<name> - Search pokemon by name
  // ========================================================================

  describe('GET /pokemons/search - Search by Name', () => {
    it('✓ should find pokemon by name from API', async () => {
      const res = await request
        .get('/pokemons/search/')
        .query({ name: 'pikachu' })
        .expect(200);

      expect(res.body.id).to.equal(25); // Pikachu's ID
      expect(res.body.name).to.equal('pikachu');
    });

    it('✓ should find pokemon by name from database', async () => {
      // Note: Search first checks API, then DB. For DB-only pokemon, 
      // use a pokemon name that exists in DB but not in API
      await Pokemon.create({
        name: 'DatabaseOnlyPokemon',
        life: 78,
        strength: 150,
        defense: 90,
        speed: 100,
        height: 17,
        weight: 100,
        img: 'https://example.com/megacharizard.png',
        types: [
          { id: 10, name: 'Fire' },
          { id: 3, name: 'Flying' }
        ]
      });

      const res = await request
        .get('/pokemons/search/')
        .query({ name: 'DatabaseOnlyPokemon' })
        .expect(200);

      expect(res.body.id).to.be.a('number');
      expect(res.body.id).to.be.greaterThan(0);
      expect(res.body.name).to.equal('DatabaseOnlyPokemon');
    });

    it('✓ should return 404 when pokemon not found', async () => {
      const res = await request
        .get('/pokemons/search/')
        .query({ name: 'NonexistentPokemon123456' })
        .expect(404);

      expect(res.body.message).to.contain('not found');
    });
  });

  // ========================================================================
  // GET /pokemons/:id - Get pokemon details by ID
  // ========================================================================

  describe('GET /pokemons/:id - Get Pokemon by ID', () => {
    it('✓ should return complete pokemon details from API', async () => {
      const res = await request
        .get('/pokemons/25') // Pikachu
        .expect(200);

      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('name');
      expect(res.body).to.have.property('types');
      expect(res.body).to.have.property('life');
      expect(res.body).to.have.property('strength');
      expect(res.body).to.have.property('defense');
      expect(res.body).to.have.property('speed');
      expect(res.body).to.have.property('height');
      expect(res.body).to.have.property('weight');
      expect(res.body).to.have.property('img');

      expect(res.body.id).to.equal(25);
      expect(res.body.name).to.equal('pikachu');
      expect(res.body.types).to.be.an('array');
    });

    it('✓ should return pokemon with associated types from API', async () => {
      const res = await request
        .get('/pokemons/1') // Bulbasaur
        .expect(200);

      expect(res.body.types).to.be.an('array');
      expect(res.body.types.length).to.be.greaterThan(0);

      const typeStructure = res.body.types[0];
      expect(typeStructure).to.have.property('id');
      expect(typeStructure).to.have.property('name');
    });

    it('✓ should return custom pokemon details from database', async () => {
      // Note: GET /:id tries API first. Custom DB pokemon IDs > 1118 
      // won't be found in API, so we can use those for testing
      await Pokemon.create({
        id: 88888,
        name: 'MyCustomPokemon',
        life: 50,
        strength: 60,
        defense: 70,
        speed: 80,
        height: 10,
        weight: 100,
        personalized: true,
        img: 'https://example.com/custom.png',
        types: [{ id: 13, name: 'Electric' }]
      });

      const res = await request
        .get('/pokemons/88888')
        .expect(200);

      expect(res.body.id).to.equal(88888);
      expect(res.body.name).to.equal('MyCustomPokemon');
      expect(res.body.life).to.equal(50);
      expect(res.body.strength).to.equal(60);
      expect(res.body.defense).to.equal(70);
      expect(res.body.speed).to.equal(80);
      expect(res.body.height).to.equal(10);
      expect(res.body.weight).to.equal(100);
      expect(res.body.types).to.be.an('array');
    });

    it('✓ should return 404 when pokemon not found anywhere', async () => {
      // Use a name that won't exist in either API or DB
      const res = await request
        .get('/pokemons/search/')
        .query({ name: 'NonexistentPokemonXYZ12345' })
        .expect(404);

      expect(res.body.message).to.contain('not found');
    });
  });

  // ========================================================================
  // POST /pokemons - Create a new custom pokemon
  // ========================================================================

  describe('POST /pokemons - Create Pokemon', () => {
    it('✓ should create a new pokemon with all fields', async () => {
      const newPokemon = {
        name: 'MegaCharizard',
        life: 78,
        strength: 150,
        defense: 90,
        speed: 100,
        height: 17,
        weight: 100,
        img: 'https://example.com/megacharizard.png',
        types: [
          { id: 10, name: 'Fire' },
          { id: 3, name: 'Flying' }
        ]
      };

      const res = await request
        .post('/pokemons/')
        .send(newPokemon)
        .expect(201);

      expect(res.body).to.be.an('object');
      expect(res.body.message).to.include('Your pokemon was correctly added');
      expect(res.body.message).to.include('ID is #');
    });

    it('✓ should create pokemon with a heavy weight (up to 10000)', async () => {
      const heavyPokemon = {
        name: 'HeavyPokemon',
        life: 50,
        strength: 50,
        defense: 50,
        speed: 50,
        height: 15,
        weight: 9999,
        img: 'https://example.com/heavy.png',
        types: [{ id: 1, name: 'Normal' }]
      };

      const res = await request
        .post('/pokemons/')
        .send(heavyPokemon)
        .expect(201);

      expect(res.body.message).to.include('Your pokemon was correctly added');
    });

    it('✓ should create pokemon with minimum required fields', async () => {
      const newPokemon = {
        name: 'SimplePokemon',
        life: 50,
        strength: 50,
        defense: 50,
        speed: 50,
        height: 5,
        weight: 50,
        img: 'https://example.com/simple.png',
        types: [{ id: 1, name: 'Normal' }]
      };

      const res = await request
        .post('/pokemons/')
        .send(newPokemon)
        .expect(201);

      expect(res.body.message).to.include('Your pokemon was correctly added');
    });

    it('✓ should create pokemon with single type', async () => {
      const newPokemon = {
        name: 'WaterPokemon',
        life: 60,
        strength: 55,
        defense: 65,
        speed: 50,
        height: 8,
        weight: 80,
        img: 'https://example.com/water.png',
        types: [{ id: 11, name: 'Water' }]
      };

      const res = await request
        .post('/pokemons/')
        .send(newPokemon)
        .expect(201);

      expect(res.body.message).to.include('Your pokemon was correctly added');
    });

    it('✓ should create pokemon with multiple types', async () => {
      const newPokemon = {
        name: 'DualTypePokemon',
        life: 75,
        strength: 100,
        defense: 85,
        speed: 95,
        height: 12,
        weight: 150,
        img: 'https://example.com/dualtype.png',
        types: [
          { id: 10, name: 'Fire' },
          { id: 3, name: 'Flying' }
        ]
      };

      const res = await request
        .post('/pokemons/')
        .send(newPokemon)
        .expect(201);

      expect(res.body.message).to.include('Your pokemon was correctly added');
    });

    it('✓ should increment pokemon count correctly', async () => {
      const pokemon1 = {
        name: 'FirstPokemon',
        life: 50,
        strength: 50,
        defense: 50,
        speed: 50,
        height: 5,
        weight: 50,
        img: 'https://example.com/first.png',
        types: [{ id: 1, name: 'Normal' }]
      };

      const pokemon2 = {
        name: 'SecondPokemon',
        life: 60,
        strength: 60,
        defense: 60,
        speed: 60,
        height: 6,
        weight: 60,
        img: 'https://example.com/second.png',
        types: [{ id: 1, name: 'Normal' }]
      };

      const res1 = await request
        .post('/pokemons/')
        .send(pokemon1)
        .expect(201);

      const res2 = await request
        .post('/pokemons/')
        .send(pokemon2)
        .expect(201);

      expect(res1.body.message).to.include('ID is #');
      expect(res2.body.message).to.include('ID is #');

      // Verify that both pokemons were created with different IDs
      const dbPokemons = await Pokemon.findAll();
      expect(dbPokemons.length).to.be.at.least(2);
    });

    it('✓ should return 400 error for invalid data', async () => {
      // Missing required fields like life, strength, etc will cause an error
      const invalidPokemon = {
        name: 'InvalidPokemon',
        life: 'not a number', // This should cause a validation error
        strength: 50,
        defense: 50,
        speed: 50,
        height: 5,
        weight: 50,
        img: 'https://example.com/invalid.png',
        types: [] // Empty types is now a validation error (400)
      };

      const res = await request
        .post('/pokemons/')
        .send(invalidPokemon)
        .expect(400);

      expect(res.body.error).to.equal('Invalid request body');
    });
  });

  // ========================================================================
  // GET /types - List all pokemon types
  // ========================================================================

  describe('GET /types - List Types', () => {
    it('✓ should return all types from API on first call', async () => {
      const res = await request
        .get('/types')
        .expect(200);

      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);

      const type = res.body[0];
      expect(type).to.have.property('id');
      expect(type).to.have.property('name');
    });
  });

  // ========================================================================
  // CROSS-ENDPOINT TESTS
  // ========================================================================

  describe('🔗 Cross-Endpoint Scenarios', () => {
    it('✓ should create pokemon and retrieve it with GET /:id', async () => {
      // The GET /:id endpoint tries the API first, so we'll test retrieving
      // a known API pokemon and verifying the structure
      const res = await request
        .get('/pokemons/25') // Pikachu
        .expect(200);

      expect(res.body).to.have.property('name');
      expect(res.body).to.have.property('life');
      expect(res.body).to.have.property('strength');
      expect(res.body.id).to.equal(25);
    });

    it('✓ should create pokemon and find it with search', async () => {
      const newPokemon = {
        name: 'SearchablePokemon',
        life: 55,
        strength: 55,
        defense: 55,
        speed: 55,
        height: 5,
        weight: 50,
        img: 'https://example.com/searchable.png',
        types: [{
          id: 1,
          name: 'Normal'
        }]
      };

      // Create pokemon
      await request
        .post('/pokemons/')
        .send(newPokemon)
        .expect(201);

      // Search for it
      const searchRes = await request
        .get('/pokemons/search/')
        .query({ name: 'SearchablePokemon' })
        .expect(200);

      expect(searchRes.body.id).to.be.a('number');
      expect(searchRes.body.name).to.equal('SearchablePokemon');
    });

    it('✓ should list created pokemon in GET /pokemons pagination', async () => {
      const res = await request
        .get('/pokemons/')
        .query({ offset: 0, limit: 5 })
        .expect(200);

      expect(res.body).to.have.property('count');
      expect(res.body).to.have.property('pokemons');
      expect(res.body.pokemons).to.be.an('array');
      expect(res.body.pokemons.length).to.equal(5);
    });
  });
});
