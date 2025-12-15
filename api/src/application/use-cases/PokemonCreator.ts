import { logger } from '@/shared/logger';
import { Pokemon, PokemonDto } from '../../domain/Pokemon';
import { PokemonRepository } from '../../domain/PokemonRepository';
import InvalidArgumentError from '../../domain/errors/InvalidArgumentError';

/**
 * Use Case: Create Pokemon
 * Handles the creation of a new custom Pokemon with full validation
 * Uses the domain class to ensure all business rules are enforced
 */
export class PokemonCreator {
  private repository: PokemonRepository;

  constructor(repository: PokemonRepository) {
    this.repository = repository;
  }

  async run(data: PokemonDto, id: number): Promise<Pokemon> {
    try {

      logger.info(`PokemonCreator: Creating pokemon with ID ${id}`, { data });

      const pokemon = Pokemon.fromPrimitives({
        ...data,
        id
      });

      logger.info("PokemonCreator: Validated pokemon", { pokemon });

      const savedPokemon = await this.repository.create(pokemon, id);

      return savedPokemon;
    } catch (error) {
      if (error instanceof InvalidArgumentError) {
        // Re-throw domain errors as-is
        throw error;
      }
      // Wrap other errors
      throw new Error(`Failed to create pokemon: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
