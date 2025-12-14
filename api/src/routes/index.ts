import { Router } from 'express';

// @ts-ignore - Old JavaScript routes (existing endpoints)
const pokemonsJsRouter = require('./pokemons.js');
// @ts-ignore - Old JavaScript routes (existing endpoints)
const typesJsRouter = require('./types.js');

export async function registerRoutes(router: Router) {
  // Register existing JavaScript routes for pokemons and types
  router.use('/pokemons', pokemonsJsRouter);
  router.use('/types', typesJsRouter);

  // Import and register new TypeScript routes
  const { register: registerPokemonsTs } = await import('./pokemons.routes');

  // Create a sub-router for TypeScript pokemons routes
  const pokemonsTsRouter = Router();
  registerPokemonsTs(pokemonsTsRouter);

  // Mount TypeScript pokemons routes alongside JS routes
  // Both versions coexist - TS routes will override JS routes for matching paths
  router.use('/pokemons', pokemonsTsRouter);
}




