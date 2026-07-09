import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { logger } from '@/shared/logger';
import { Controller } from '../../shared/infrastructure/Controller';
import { TypesFetcher } from '../use-cases/TypesFetcher';

export class GetTypesController extends Controller {
  private typesFetcher: TypesFetcher;

  constructor(typesFetcher: TypesFetcher) {
    super();
    this.typesFetcher = typesFetcher;
  }

  async run(_req: Request, res: Response) {
    logger.info('GetTypesController: Fetching all types');

    try {
      const types = await this.typesFetcher.run();
      res.status(httpStatus.OK).json(types);
    } catch (error) {
      this.errorHandling(error, res);
    }
  }
}
