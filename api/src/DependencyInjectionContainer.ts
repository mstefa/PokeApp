import { GetPokemonsController } from './application/controllers/get-pokemons-controller';
import { CreatePokemonController } from './application/controllers/create-pokemon-controller';
import { GetTypesController } from './application/controllers/get-types-controller';
import { GetPokemonDetailController } from './application/controllers/get-pokemon-detail-controller';
import { SearchPokemonController } from './application/controllers/search-pokemon-controller';
import { PokemonsFetcher } from './application/use-cases/PokemonsFetcher';
import { PokemonCreator } from './application/use-cases/PokemonCreator';
import { TypesFetcher } from './application/use-cases/TypesFetcher';
import { PokemonFetcher } from './application/use-cases/PokemonDetailFetcher';
import { PokemonRepositoryFacade } from './infrastructure/adapters/PokemonRepositoryFacade';
import { ExternalPokemonAPI } from './infrastructure/external/ExternalPokemonAPI';
import { LocalDatabasePokemonRepository } from './infrastructure/persistence/LocalDatabasePokemonRepository';
import { LocalDatabaseTypeRepository } from './infrastructure/persistence/LocalDatabaseTypeRepository';
import { PokemonRepository } from './domain/PokemonRepository';
import { TypeRepository } from './domain/TypeRepository';
import { PokemonSearcher } from './application/use-cases/PokemonDetailSearcher';

export class DependencyContainer {
  private static instance: DependencyContainer;

  // Controllers (are public to be accessible from route definitions)
  public getPokemonsController!: GetPokemonsController;
  public createPokemonController!: CreatePokemonController;
  public getTypesController!: GetTypesController;
  public getPokemonDetailController!: GetPokemonDetailController;
  public searchPokemonController!: SearchPokemonController;

  private pokemonsFetcher!: PokemonsFetcher;
  private pokemonSearcher!: PokemonSearcher;
  private pokemonCreator!: PokemonCreator;
  private typesFetcher!: TypesFetcher;
  private pokemonDetailFetcher!: PokemonFetcher;
  private pokemonRepository!: PokemonRepository;
  private typeRepository!: TypeRepository;

  private constructor() {
    // Initialize the data sources
    const externalAPI = new ExternalPokemonAPI();
    const localPokemonDatabase = new LocalDatabasePokemonRepository();
    const localTypeDatabase = new LocalDatabaseTypeRepository();

    // Initialize the facade that aggregates both data sources for Pokemons
    this.pokemonRepository = new PokemonRepositoryFacade(externalAPI, localPokemonDatabase);
    this.typeRepository = localTypeDatabase;

    // Initialize use cases with repositories
    this.pokemonsFetcher = new PokemonsFetcher(this.pokemonRepository);
    this.pokemonCreator = new PokemonCreator(localPokemonDatabase);
    this.typesFetcher = new TypesFetcher(this.typeRepository);
    this.pokemonSearcher = new PokemonSearcher(this.pokemonRepository);
    this.pokemonDetailFetcher = new PokemonFetcher(this.pokemonRepository);

    // Initialize controllers with use cases
    this.getPokemonsController = new GetPokemonsController(this.pokemonsFetcher);
    this.createPokemonController = new CreatePokemonController(this.pokemonCreator);
    this.getTypesController = new GetTypesController(this.typesFetcher);
    this.getPokemonDetailController = new GetPokemonDetailController(this.pokemonDetailFetcher);
    this.searchPokemonController = new SearchPokemonController(this.pokemonSearcher);
  }

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }
}
