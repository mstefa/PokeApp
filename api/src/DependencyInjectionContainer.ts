import { GetPokemonsController } from './application/controllers/get-pokemons-controller';
import { PokemonsFetcher } from './application/use-cases/PokemonsFetcher';
import { SequelizePokemonRepository } from './infrastructure/adapters/SequelizePokemonRepository';

export class DependencyContainer {
  private static instance: DependencyContainer;

  // Controllers (are public to be accessible from route definitions)
  public getPokemonsController!: GetPokemonsController;

  private pokemonsFetcher!: PokemonsFetcher;
  private pokemonRepository!: SequelizePokemonRepository;

  private constructor() {
    this.pokemonRepository = new SequelizePokemonRepository();
    this.pokemonsFetcher = new PokemonsFetcher(this.pokemonRepository);
    this.getPokemonsController = new GetPokemonsController(this.pokemonsFetcher);
  }

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

}
