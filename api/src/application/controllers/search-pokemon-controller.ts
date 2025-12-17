import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { Controller } from '../../shared/infrastructure/Controller';
import { logger } from '@/shared/logger';
import { PokemonSearcher } from '../use-cases/PokemonDetailSearcher';

export class SearchPokemonController extends Controller {
  private pokemonSearcher: PokemonSearcher;

  constructor(pokemonSearcher: PokemonSearcher) {
    super();
    this.pokemonSearcher = pokemonSearcher;
  }

  async run(req: Request, res: Response): Promise<void> {
    const { name } = req.query;

    if (!name) {
      logger.warn('SearchPokemonController: Name query parameter is missing');
      res.status(httpStatus.BAD_REQUEST).json({
        error: 'Name query parameter is required'
      });
      return;
    }

    logger.info(`SearchPokemonController: Searching for pokemon with name: ${name}`);

    try {
      const pokemon = await this.pokemonSearcher.run(name as string);
      // Return only the ID as per the original implementation
      res.status(httpStatus.OK).send({ id: pokemon.id });
    } catch (error) {
      this.errorHandling(error, res);
    }
  }
}
