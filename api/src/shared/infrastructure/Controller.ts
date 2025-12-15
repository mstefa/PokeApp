import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { DomainError } from '../errors';

export abstract class Controller {
  abstract run(req: Request, res: Response): Promise<void>;

  protected errorHandling(error: unknown, res: Response) {
    if (error instanceof DomainError) {
      console.error(error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    } else {
      console.error(error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
    }
  }
}
