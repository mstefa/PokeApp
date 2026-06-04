import { PokemonRepository } from '../../domain/PokemonRepository';
import { PokemonsDto } from '../dto/PokemonsDto';

export class PokemonsFetcher {
  private repository: PokemonRepository;

  constructor(repository: PokemonRepository) {
    this.repository = repository;
  }

  async run(limit: number, offset: number): Promise<PokemonsDto> {

    const result = await this.repository.findAll(offset, limit);

    return {
      count: result.count,
      pokemons: result.pokemons.map((p) => p.toPrimitives())
    };
  }
}

