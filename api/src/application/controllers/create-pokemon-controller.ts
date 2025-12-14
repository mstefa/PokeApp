import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { Controller } from '../../shared/infrastructure/Controller';
import { PokemonCreator } from '../use-cases/PokemonCreator';
import { logger } from '@/shared/logger';
import InvalidArgumentError from '../../domain/errors/InvalidArgumentError';

type CreatePokemonRequest = Request & {
  body: {
    name: string;
    life?: number;
    strength?: number;
    defense?: number;
    speed?: number;
    height?: number;
    weight?: number;
    img?: string;
    types?: Array<{ id: number; name: string }>;
  };
};

export class CreatePokemonController extends Controller {
  private pokemonCreator: PokemonCreator;

  constructor(pokemonCreator: PokemonCreator) {
    super();
    this.pokemonCreator = pokemonCreator;
  }

  async run(req: CreatePokemonRequest, res: Response) {
    logger.info(`CreatePokemonController: Creating pokemon "${req.body.name}"`);

    try {
      // Get next ID from repository (this will be passed from the route)
      const nextId = (req as any).nextId || 10220;

      const pokemon = await this.pokemonCreator.run(req.body, nextId);

      res.status(httpStatus.CREATED).json({
        message: `Your pokemon was correctly added. Its ID is #${pokemon.getId()}`,
        pokemon: pokemon.toPrimitives()
      });
    } catch (error) {
      if (error instanceof InvalidArgumentError) {
        res.status(error.httpStatus).json({ error: error.message });
      } else {
        this.errorHandling(error, res);
      }
    }
  }
}
