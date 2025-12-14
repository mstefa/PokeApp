import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { Controller } from '../../shared/infrastructure/Controller';
import { PokemonsFetcher } from '../use-cases/PokemonsFetcher';
import { logger } from '@/shared/logger';

type GetPokemonsRequest = Request & {
  query: {
    limit?: string;
    offset?: string;
  };
};

export class GetPokemonsController extends Controller {
  private pokemonsFetcher: PokemonsFetcher;

  constructor(pokemonsFetcher: PokemonsFetcher) {
    super();
    this.pokemonsFetcher = pokemonsFetcher;
  }

  async run(req: GetPokemonsRequest, res: Response) {
    const limit = req.query.limit ? parseInt(req.query.limit) : 12;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;

    logger.info(`GetPokemonsController: limit=${limit}, offset=${offset}`);

    try {
      const pokemons = await this.pokemonsFetcher.run(limit, offset);
      res.status(httpStatus.OK).send(pokemons);
    } catch (error) {
      this.errorHandling(error, res);
    }
  }
}
