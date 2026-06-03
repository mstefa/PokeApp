import { Router } from 'express';
import { register as registerPokemonsTs } from './pokemons.routes';
import { register as registerTypesTs } from './types.routes';

export function registerRoutes(router: Router) {
  // Create sub-routers for TypeScript routes
  const pokemonsTsRouter = Router();
  const typesTsRouter = Router();

  registerPokemonsTs(pokemonsTsRouter);
  registerTypesTs(typesTsRouter);

  // Mount TypeScript routes
  router.use('/pokemons', pokemonsTsRouter);
  router.use('/types', typesTsRouter);
}




