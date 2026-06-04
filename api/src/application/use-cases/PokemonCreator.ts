import { logger } from '@/shared/logger';
import { Pokemon } from '../../domain/Pokemon';
import { PokemonRepository } from '../../domain/PokemonRepository';
import { TypeDto } from '@/domain/Type';
import { config } from '@/config/app.config';

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

  async run(data: CreatePokemonDto): Promise<Pokemon> {

    logger.info(`PokemonCreator: Creating pokemon with name ${data.name}`, { data });

    const id = await this.repository.count() + 1 + config.officialPokemonThreshold; // Simple ID generation strategy

    const pokemon = Pokemon.fromPrimitives({
      ...data,
      id
    });

    logger.info("PokemonCreator: Validated pokemon", { pokemon });

    await this.repository.create(pokemon, id);

    return pokemon;

  }
}


export interface CreatePokemonDto {
  name: string;
  life: number;
  strength: number;
  defense: number;
  speed: number;
  height: number;
  weight: number;
  personalized: boolean;
  img: string;
  types: TypeDto[];
}
