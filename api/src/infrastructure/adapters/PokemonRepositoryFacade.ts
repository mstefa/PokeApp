
import { Pokemon } from '../../domain/Pokemon';
import { PokemonRepository } from '../../domain/PokemonRepository';
import { ExternalPokemonAPI } from '../external/ExternalPokemonAPI';
import { LocalDatabasePokemonRepository } from '../persistence/LocalDatabasePokemonRepository';
import { config } from '@/config/app.config';

/**
 * Pokemon Repository Facade (Aggregation Pattern)
 * 
 * This facade provides a unified interface for accessing Pokemon data from two sources:
 * 1. PokeAPI (External, Read-only): Official Pokemon data
 * 2. Local Database (Read/Write): Custom user-created Pokemon
 * 
 * The routing logic determines which data source to use based on:
 * - Pokemon ID range: IDs 1-1118 are official Pokemon, IDs > 1118 are custom
 * - Operation type: Read operations check both sources, Write operations go to DB only
 * 
 * This implementation respects the Single Responsibility Principle while providing
 * a clean, unified interface to the application layer.
 */
export class PokemonRepositoryFacade implements PokemonRepository {
  private externalAPI: ExternalPokemonAPI;
  private localRepository: LocalDatabasePokemonRepository;

  // Constant representing the total count of official Pokemon in PokeAPI
  private readonly OFFICIAL_POKEMON_THRESHOLD = config.officialPokemonThreshold;

  constructor(
    externalAPI?: ExternalPokemonAPI,
    localRepository?: LocalDatabasePokemonRepository
  ) {
    this.externalAPI = externalAPI || new ExternalPokemonAPI();
    this.localRepository = localRepository || new LocalDatabasePokemonRepository();
  }

  /**
   * Find all pokemons (both official and custom)
   * 
   * Strategy:
   * 1. First fetch official Pokemon from PokeAPI up to the requested limit
   * 2. If more results are needed, fetch custom Pokemon from the local database
   * 3. Concatenate results to provide a seamless unified list
   */
  async findAll(offset: number, limit: number): Promise<{ pokemons: Pokemon[]; count: number }> {
    try {
      // Try to get official Pokemon from API starting at the offset (returns DTOs)
      const apiPokemonDto = await this.externalAPI.getPokemonsFromAPI(offset, limit);

      // Get total counts from both sources
      const apiTotalCount = this.externalAPI.getTotalCount();
      const dbTotalCount = await this.localRepository.count();
      const totalCount = apiTotalCount + dbTotalCount;

      // If we got enough results from the API, return them as primitives
      if (apiPokemonDto.length === limit) {
        return {
          count: totalCount,
          pokemons: apiPokemonDto.map(dto => {
            return Pokemon.fromPrimitives(dto);
          })
        };
      }

      // Otherwise, we need to supplement with custom Pokemon from the database
      const remainingNeeded = limit - apiPokemonDto.length;
      const dbPokemons = await this.localRepository.findAll(0, remainingNeeded);

      return {
        count: totalCount,
        pokemons: [...apiPokemonDto.map(dto => {
          return Pokemon.fromPrimitives(dto);
        }), ...dbPokemons.pokemons]
      };
    } catch (error) {
      console.error('Error in PokemonRepositoryFacade.findAll:', error);
      throw error;
    }
  }

  /**
   * Find a pokemon by ID
   * 
   * Strategy:
   * 1. Check if ID is within the official Pokemon range (1-1118)
   * 2. If yes, try to fetch from PokeAPI (read-only source)
   * 3. If no or not found, try to fetch from the local database
   * 4. This allows finding both official and custom Pokemon
   */
  async findById(id: number | string): Promise<Pokemon | null> {
    try {
      const numId = typeof id === 'string' ? parseInt(id) : id; //TODO: use only number

      // Check if this is an official Pokemon (by ID range)
      if (numId >= 1 && numId <= this.OFFICIAL_POKEMON_THRESHOLD) {
        // Try to fetch from the official API first (returns DTO)
        const officialPokemonDto = await this.externalAPI.getPokemonFromAPI(numId);
        if (officialPokemonDto) {
          // Convert DTO to domain object
          return Pokemon.fromPrimitives(officialPokemonDto);
        }
      }

      // If not found in API or custom ID, check the local database
      // This allows custom Pokemon with any ID to be stored and retrieved
      return await this.localRepository.findById(id);
    } catch (error) {
      console.error(`Error finding pokemon with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find a pokemon by name
   * 
   * Strategy:
   * 1. First try to find in the local database (custom Pokemon)
   * 2. If not found, try to fetch from PokeAPI
   * 3. This prioritizes user-created Pokemon over official ones
   */
  async findByName(name: string): Promise<Pokemon | null> {
    try {
      // First check the local database (prioritize custom Pokemon)
      const customPokemon = await this.localRepository.findByName(name);
      if (customPokemon) {
        return customPokemon;
      }

      // If not found locally, check the official API (returns DTO)
      const officialPokemonDto = await this.externalAPI.getPokemonFromAPI(name);
      if (officialPokemonDto) {
        // Convert DTO to domain object
        return Pokemon.fromPrimitives(officialPokemonDto);
      }

      return null;
    } catch (error) {
      console.error(`Error finding pokemon with name ${name}:`, error);
      throw error;
    }
  }

  /**
   * Create a new pokemon
   * 
   * Strategy:
   * - All create operations go exclusively to the local database
   * - External PokeAPI is read-only and cannot be modified
   * - User-created Pokemon are always stored locally
   */
  async create(pokemon: Pokemon, id: number): Promise<void> {
    try {
      // All write operations go to the local database
      return await this.localRepository.create(pokemon, id);
    } catch (error) {
      console.error('Error creating pokemon:', error);
      throw error;
    }
  }

  /**
   * Count custom Pokemon in the local database
   * 
   * Note: This counts only custom Pokemon, not official ones.
   * Total official Pokemon count can be obtained via getOfficialPokemonCount()
   */
  async count(): Promise<number> {
    try {
      return await this.localRepository.count();
    } catch (error) {
      console.error('Error counting custom pokemons:', error);
      throw error;
    }
  }

  /**
   * Helper method: Get the count of official Pokemon from PokeAPI
   */
  getOfficialPokemonCount(): number {
    return this.externalAPI.getTotalCount();
  }

  /**
   * Helper method: Get the total count of both official and custom Pokemon
   */
  async getTotalPokemonCount(): Promise<number> {
    try {
      const customCount = await this.count();
      const officialCount = this.getOfficialPokemonCount();
      return officialCount + customCount;
    } catch (error) {
      console.error('Error getting total pokemon count:', error);
      throw error;
    }
  }

  /**
   * Helper method: Determine if a pokemon is official (from PokeAPI) or custom
   */
  isOfficialPokemon(id: number): boolean {
    return id >= 1 && id <= this.OFFICIAL_POKEMON_THRESHOLD;
  }
}
