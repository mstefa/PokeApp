import { logger } from '@/shared/logger';
import { Pokemon, PokemonDto } from '../../domain/Pokemon';
import { PokemonRepository } from '../../domain/PokemonRepository';

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

    logger.info(`PokemonCreator: Creating pokemon with ID ${id}`, { data });

    const pokemon = Pokemon.fromPrimitives({
      ...data,
      id
    });

    logger.info("PokemonCreator: Validated pokemon", { pokemon });

    await this.repository.create(pokemon, id);

    return pokemon;

  }
}
