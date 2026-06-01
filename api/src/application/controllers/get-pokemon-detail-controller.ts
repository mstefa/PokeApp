import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { Controller } from '../../shared/infrastructure/Controller';
import { PokemonFetcher } from '../use-cases/PokemonDetailFetcher';
import { logger } from '@/shared/logger';

export class GetPokemonDetailController extends Controller {
  private pokemonFetcher: PokemonFetcher;

  constructor(pokemonDetailFetcher: PokemonFetcher) {
    super();
    this.pokemonFetcher = pokemonDetailFetcher;
  }

  async run(req: Request, res: Response) {
    const { id } = req.params;

    logger.info(`GetPokemonDetailController: Fetching pokemon with ID: ${id}`);

    try {
      const pokemon = await this.pokemonFetcher.run(parseInt(id as string));
      res.status(httpStatus.OK).send(pokemon);
    } catch (error) {
      this.errorHandling(error, res);
    }
  }
}
