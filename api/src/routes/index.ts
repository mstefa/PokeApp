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
  const { register: registerTypesTs } = await import('./types.routes');

  // Create sub-routers for TypeScript routes
  const pokemonsTsRouter = Router();
  const typesTsRouter = Router();

  registerPokemonsTs(pokemonsTsRouter);
  registerTypesTs(typesTsRouter);

  // Mount TypeScript routes alongside JS routes
  // TS routes will override JS routes for matching paths
  router.use('/pokemons', pokemonsTsRouter);
  router.use('/types', typesTsRouter);
}




