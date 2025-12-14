import { Pokemon } from '../../domain/Pokemon';
import { PokemonRepository } from '../../domain/ports/PokemonRepository';
import { CreatePokemonRequest } from '../../domain/entities/Pokemon';
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

  async run(data: CreatePokemonRequest, id: number): Promise<Pokemon> {
    try {
      // Domain class validates all inputs during construction
      // If validation fails, InvalidArgumentError is thrown
      // Persist to repository
      const savedPokemon = await this.repository.create(data, id);

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
