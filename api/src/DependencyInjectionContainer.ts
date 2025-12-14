import { GetPokemonsController } from './application/controllers/get-pokemons-controller';
import { PokemonsFetcher } from './application/use-cases/PokemonsFetcher';
import { PokemonRepositoryFacade } from './infrastructure/adapters/PokemonRepositoryFacade';
import { ExternalPokemonAPI } from './infrastructure/external/ExternalPokemonAPI';
import { LocalDatabasePokemonRepository } from './infrastructure/persistence/LocalDatabasePokemonRepository';
import { PokemonRepository } from './domain/ports/PokemonRepository';

export class DependencyContainer {
  private static instance: DependencyContainer;

  // Controllers (are public to be accessible from route definitions)
  public getPokemonsController!: GetPokemonsController;

  private pokemonsFetcher!: PokemonsFetcher;
  private pokemonRepository!: PokemonRepository;

  private constructor() {
    // Initialize the data sources
    const externalAPI = new ExternalPokemonAPI();
    const localDatabase = new LocalDatabasePokemonRepository();

    // Initialize the facade that aggregates both data sources
    this.pokemonRepository = new PokemonRepositoryFacade(externalAPI, localDatabase);

    // Initialize use cases with the facade
    this.pokemonsFetcher = new PokemonsFetcher(this.pokemonRepository);

    // Initialize controllers with use cases
    this.getPokemonsController = new GetPokemonsController(this.pokemonsFetcher);
  }

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

}
