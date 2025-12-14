import { IPokemonRepository } from '../../domain/ports/IPokemonRepository';
import { PokemonsDto } from '../dto/PokemonsDto';

export class PokemonsFetcher {
  private repository: IPokemonRepository;

  constructor(repository: IPokemonRepository) {
    this.repository = repository;
  }

  async run(limit: number, offset: number): Promise<PokemonsDto> {
    const result = await this.repository.findAll(offset, limit);

    return {
      count: result.count,
      pokemons: result.pokemons
    };
  }
}

