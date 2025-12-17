import { logger } from '@/shared/logger';
import { PokemonDto } from '../../domain/Pokemon';
import { PokemonRepository } from '../../domain/PokemonRepository';
import { NotFoundError } from '@/shared/errors';

/**
 * Use Case: Fetch Pokemon Detail
 * Handles fetching a single pokemon by ID or name from both external API and local database
 * Tries external API first, then falls back to local database
 */
export class PokemonFetcher {
  private repository: PokemonRepository;

  constructor(repository: PokemonRepository) {
    this.repository = repository;
  }

  /**
   * Fetch a pokemon by ID or name
   * First tries the external API, then falls back to local database
   * @throws InvalidArgumentError if pokemon not found
   */
  async run(id: number): Promise<PokemonDto> {
    logger.info(`PokemonDetailFetcher: Fetching pokemon with name: ${id}`);

    const pokemon = await this.repository.findById(id);
    if (!pokemon) {
      throw new NotFoundError(`Pokemon with name ${id} not found`);
    }

    logger.info(`PokemonDetailFetcher: Found pokemon`, { pokemonId: pokemon.id });
    return pokemon.toPrimitives();
  }
}
