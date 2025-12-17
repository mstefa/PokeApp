import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { DomainError } from '../errors';
import { logger } from '../logger';

export abstract class Controller {
  abstract run(req: Request, res: Response): Promise<void>;

  protected errorHandling(error: unknown, res: Response) {
    logger.error('Controller Error:', { error });
    if (error instanceof DomainError) {
      res.status(error.statusCode).send({ message: error.message });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
    }
  }
}
