import { Request, Response, Router } from 'express';

import { DependencyContainer } from '../DependencyInjectionContainer';

export const register = (router: Router) => {
  const DIContainer = DependencyContainer.getInstance();

  // GET /types - Fetch all types
  router.get('/', (req: Request, res: Response) =>
    DIContainer.getTypesController.run(req, res)
  );
};
