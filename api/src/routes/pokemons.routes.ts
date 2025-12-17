import { Request, Response, Router } from 'express';
// import { query } from 'express-validator';

import { DependencyContainer } from '../DependencyInjectionContainer';
// import { validateReqSchema } from './index';

export const register = (router: Router) => {
  const DIContainer = DependencyContainer.getInstance();

  // const reqGetPokemonsSchema = [
  //   query('limit').optional().isNumeric(),
  //   query('offset').optional().isNumeric()
  // ];

  // GET /pokemons - Fetch all pokemons
  router.get('/', (req: Request, res: Response) =>
    DIContainer.getPokemonsController.run(req, res)
  );

  // GET /pokemons/search?name=<name> - Search pokemon by name
  router.get('/search', (req: Request, res: Response) =>
    DIContainer.searchPokemonController.run(req, res)
  );

  // GET /pokemons/:id - Fetch pokemon detail by ID or name
  router.get('/:id', (req: Request, res: Response) =>
    DIContainer.getPokemonDetailController.run(req, res)
  );

  // POST /pokemons - Create a new pokemon with validation
  router.post('/', (req: Request, res: Response) =>
    DIContainer.createPokemonController.run(req, res)
  );
};


