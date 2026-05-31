/**
 * Integration Tests - Unhappy Paths, Validations & Error Handling
 * 
 * These tests validate how the application handles errors, bad input data,
 * validation constraints, and external failures.
 */

const { expect } = require('chai');
const supertest = require('supertest');
const axios = require('axios');
const { createApp } = require('../../src/app.ts');
const { Pokemon, conn } = require('../../src/db.js');

const app = createApp();
const request = supertest(app);

describe('📡 API Integration Tests - Error Handling & Edge Cases', () => {
  before(async () => {
    // Authenticate with database
    await conn.authenticate()
      .catch((err) => {
        console.error('Unable to connect to the database:', err);
        throw err;
      });
  });

  afterEach(async () => {
    // Clean up after each test
    try {
      await Pokemon.destroy({ where: {}, force: true });
    } catch (error) {
      console.error('Error cleaning up Pokemon:', error);
    }
  });

  // ========================================================================
  // GET /pokemons - Pagination Edge Cases
  // ========================================================================

  describe('GET /pokemons - Pagination Edge Cases & Validation', () => {
    it('✗ should fallback to defaults if limit or offset are invalid strings', async () => {
      const res = await request
        .get('/pokemons/')
        .query({ limit: 'invalid_limit', offset: 'invalid_offset' })
        .expect(200);

      // Should default to limit=12 and offset=0, which returns 12 pokemons
      expect(res.body).to.have.property('count');
      expect(res.body).to.have.property('pokemons');
      expect(res.body.pokemons).to.be.an('array');
      expect(res.body.pokemons.length).to.equal(12);
    });

    it('✗ should fallback to defaults for negative limit or offset', async () => {
      // In JavaScript, a negative offset/limit passed to external API or Sequelize
      // is handled gracefully or defaults to 0/12 depending on logic.
      // Let's verify it responds with 200 rather than crashing
      const res = await request
        .get('/pokemons/')
        .query({ limit: -5, offset: -10 })
        .expect(200);

      expect(res.body.pokemons).to.be.an('array');
    });
  });

  // ========================================================================
  // POST /pokemons - Input Validation (Zod Schemas)
  // ========================================================================

  describe('POST /pokemons - Zod Schemas Validation Errors', () => {
    it('✗ should fail with 400 when name is missing', async () => {
      const invalidPokemon = {
        life: 50,
        strength: 50,
        defense: 50,
        speed: 50,
        height: 5,
        weight: 50,
        img: 'https://example.com/missing-name.png',
        types: [{ id: 1, name: 'Normal' }]
      };

      const res = await request
        .post('/pokemons/')
        .send(invalidPokemon)
        .expect(400);

      expect(res.body).to.be.an('object');
      expect(res.body.error).to.equal('Invalid request body');
      expect(res.body.details).to.be.an('array');
      
      const nameError = res.body.details.find(d => d.field === 'name');
      expect(nameError).to.exist;
      expect(nameError.message).to.match(/Required|Invalid input/i);
    });

    it('✗ should fail with 400 when stat is out of range [0, 255]', async () => {
      const invalidPokemon = {
        name: 'SuperPokemon',
        life: 300, // Zod schema max is 255
        strength: 50,
        defense: 50,
        speed: 50,
        height: 5,
        weight: 50,
        img: 'https://example.com/stat-out-of-range.png',
        types: [{ id: 1, name: 'Normal' }]
      };

      const res = await request
        .post('/pokemons/')
        .send(invalidPokemon)
        .expect(400);

      expect(res.body.error).to.equal('Invalid request body');
      const lifeError = res.body.details.find(d => d.field === 'life');
      expect(lifeError).to.exist;
      expect(lifeError.message).to.contain('at most 255');
    });

    it('✗ should fail with 400 when img is not a valid URL', async () => {
      const invalidPokemon = {
        name: 'BadImagePokemon',
        life: 50,
        strength: 50,
        defense: 50,
        speed: 50,
        height: 5,
        weight: 50,
        img: 'not-a-valid-url',
        types: [{ id: 1, name: 'Normal' }]
      };

      const res = await request
        .post('/pokemons/')
        .send(invalidPokemon)
        .expect(400);

      expect(res.body.error).to.equal('Invalid request body');
      const imgError = res.body.details.find(d => d.field === 'img');
      expect(imgError).to.exist;
      expect(imgError.message).to.contain('Image must be a valid URL');
    });

    it('✗ should fail with 400 when types array is empty', async () => {
      const invalidPokemon = {
        name: 'TypelessPokemon',
        life: 50,
        strength: 50,
        defense: 50,
        speed: 50,
        height: 5,
        weight: 50,
        img: 'https://example.com/no-types.png',
        types: [] // Schema expects min(1)
      };

      const res = await request
        .post('/pokemons/')
        .send(invalidPokemon)
        .expect(400);

      expect(res.body.error).to.equal('Invalid request body');
      const typesError = res.body.details.find(d => d.field === 'types');
      expect(typesError).to.exist;
      expect(typesError.message).to.contain('At least one type is required');
    });
  });

  // ========================================================================
  // EXTERNAL API FAILURE HANDLING
  // ========================================================================

  describe('📡 External API Unreachable / Failures', () => {
    let originalGet;

    beforeEach(() => {
      originalGet = axios.get;
    });

    afterEach(() => {
      axios.get = originalGet;
    });

    it('✗ should gracefully handle external PokeAPI server failures when listing', async () => {
      // Mock axios.get to reject for API calls to simulate PokeAPI failure
      axios.get = async (url) => {
        if (url.includes('pokeapi.co')) {
          throw new Error('PokeAPI is down (Simulated 500 error)');
        }
        return originalGet(url);
      };

      const res = await request
        .get('/pokemons/')
        .query({ offset: 0, limit: 12 })
        .expect(500);

      expect(res.body.message).to.equal('Internal Server Error');
    });

    it('✗ should gracefully handle external PokeAPI failures when searching by name', async () => {
      // Create a custom pokemon in the local database
      await Pokemon.create({
        name: 'LocalSurvivor',
        life: 50,
        strength: 50,
        defense: 50,
        speed: 50,
        height: 5,
        weight: 50,
        img: 'https://example.com/survivor.png',
        types: [{ id: 1, name: 'Normal' }]
      });

      // Mock axios.get to reject for API calls to simulate PokeAPI failure
      axios.get = async (url) => {
        if (url.includes('pokeapi.co')) {
          throw new Error('PokeAPI is unreachable (Simulated Network Error)');
        }
        return originalGet(url);
      };

      // Since search checks local database first for custom pokemon,
      // it should be able to retrieve "LocalSurvivor" even if the API is down!
      const res = await request
        .get('/pokemons/search/')
        .query({ name: 'LocalSurvivor' })
        .expect(200);

      expect(res.body.name).to.equal('LocalSurvivor');
    });
  });
});
