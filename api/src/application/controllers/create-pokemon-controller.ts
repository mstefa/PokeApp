import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ZodError } from 'zod';

import { Controller } from '../../shared/infrastructure/Controller';
import { PokemonCreator } from '../use-cases/PokemonCreator';
import { logger } from '../../shared/logger';
import InvalidArgumentError from '../../domain/errors/InvalidArgumentError';
import { CreatePokemonSchema, CreatePokemonRequest as ValidatedCreatePokemonRequest } from '../../shared/validation/pokemon-schemas';

type CreatePokemonRequest = Request & {
  body: ValidatedCreatePokemonRequest;
};

export class CreatePokemonController extends Controller {
  private pokemonCreator: PokemonCreator;

  constructor(pokemonCreator: PokemonCreator) {
    super();
    this.pokemonCreator = pokemonCreator;
  }

  async run(req: CreatePokemonRequest, res: Response): Promise<void> {
    try {
      // Validate request body using Zod schema
      const validatedBody = CreatePokemonSchema.parse(req.body);

      logger.info(`Creating pokemon "${validatedBody.name}"`);

      // Cast the validated body to PokemonDto (id will be set by PokemonCreator)
      const pokemonData = {
        ...validatedBody,
        personalized: true,
      };

      const pokemon = await this.pokemonCreator.run(pokemonData);

      logger.info(`Pokemon created successfully`, {
        pokemonId: pokemon.id,
        pokemonName: pokemon.name.value
      });

      res.status(httpStatus.OK).json({
        message: `Your pokemon was correctly added. Its ID is #${pokemon.id}`,
        pokemon: pokemon.toPrimitives()
      });
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn(`Validation error creating pokemon`, {
          errors: error.issues.map((e: any) => ({
            field: e.path.join('.'),
            message: e.message,
            code: e.code
          }))
        });

        const details = error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }));

        res.status(httpStatus.BAD_REQUEST).json({
          error: 'Invalid request body',
          details
        });
        return;
      }

      if (error instanceof InvalidArgumentError) {
        logger.warn(`Invalid pokemon data`, {
          error: error.message
        });
        res.status(error.httpStatus).json({ error: error.message });
      } else {
        logger.error(`Failed to create pokemon`, {
          error: error instanceof Error ? error.message : String(error)
        });
        this.errorHandling(error, res);
      }
    }
  }
}
