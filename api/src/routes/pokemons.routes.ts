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

  router.get('/', (req: Request, res: Response) =>
    DIContainer.getPokemonsController.run(req, res)
  );
};

