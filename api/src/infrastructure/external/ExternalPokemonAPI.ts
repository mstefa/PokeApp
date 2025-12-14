import axios from 'axios';
import { Pokemon, PokemonType } from '../../domain/entities/Pokemon';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEAPI_TOTAL_COUNT = 1118; // Official Pokemon count in PokeAPI

/**
 * External PokeAPI Adapter
 * Handles all calls to the official PokeAPI service (read-only)
 * Implements the external data source for official Pokemon data
 */
export class ExternalPokemonAPI {
  /**
   * Fetch pokemons from PokeAPI by offset and limit
   * This function retrieves official Pokemon data from the external API
   */
  async getPokemonsFromAPI(
    offset: number,
    limit: number,
    includeStats: boolean = false
  ): Promise<Pokemon[]> {
    try {
      const url = `${POKEAPI_BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;
      const response = await axios.get(url);

      const pokemonsData = response.data.results;
      const pokemons: Promise<Pokemon>[] = [];

      // Fetch detailed information for each pokemon
      for (const pokemonData of pokemonsData) {
        pokemons.push(this.getPokemonDetail(pokemonData.url, includeStats));
      }

      return Promise.all(pokemons);
    } catch (error) {
      console.error('Error fetching pokemons from PokeAPI:', error);
      throw error;
    }
  }

  /**
   * Fetch a single pokemon from PokeAPI by ID or name
   */
  async getPokemonFromAPI(idOrName: number | string): Promise<Pokemon | null> {
    try {
      const url = `${POKEAPI_BASE_URL}/pokemon/${idOrName}`;
      const response = await axios.get(url);

      return this.mapPokemonDetail(response.data, true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error(`Error fetching pokemon ${idOrName} from PokeAPI:`, error);
      throw error;
    }
  }

  /**
   * Check if a pokemon ID/name exists in PokeAPI
   */
  async existsInAPI(idOrName: number | string): Promise<boolean> {
    try {
      const url = `${POKEAPI_BASE_URL}/pokemon/${idOrName}`;
      await axios.head(url);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      // For other errors, assume it doesn't exist or API is unreachable
      return false;
    }
  }

  /**
   * Get the total count of pokemons in PokeAPI
   */
  getTotalCount(): number {
    return POKEAPI_TOTAL_COUNT;
  }

  /**
   * Get pokemon detail from a URL (used internally)
   */
  private async getPokemonDetail(
    url: string,
    includeStats: boolean = false
  ): Promise<Pokemon> {
    try {
      const response = await axios.get(url);
      return this.mapPokemonDetail(response.data, includeStats);
    } catch (error) {
      console.error('Error reading pokemon object from PokeAPI:', error);
      throw new Error('404: PokemonNotFound');
    }
  }

  /**
   * Map raw PokeAPI response to Pokemon entity
   */
  private mapPokemonDetail(data: any, includeStats: boolean): Pokemon {
    // Extract types
    const types: PokemonType[] = [];
    if (data.types && Array.isArray(data.types)) {
      data.types.forEach((typeData: any) => {
        const typeId = parseInt(
          typeData.type.url.match(/\/(\d+)\/?$/)?.[1] || '0'
        );
        types.push({
          id: typeId,
          name: typeData.type.name
        });
      });
    }

    // Get the best available image
    const img =
      data.sprites?.other?.dream_world?.front_default ||
      data.sprites?.other?.['official-artwork']?.front_default ||
      data.sprites?.front_default ||
      '';

    const pokemon: Pokemon = {
      id: data.id,
      name: data.name,
      img,
      personalized: false,
      types,
      // Default stats if not available
      life: 0,
      strength: 0,
      defense: 0,
      speed: 0,
      height: 0,
      weight: 0
    };

    // Add detailed stats if requested
    if (includeStats && data.stats && Array.isArray(data.stats)) {
      pokemon.life = data.stats[0]?.base_stat || 0; // HP
      pokemon.strength = data.stats[1]?.base_stat || 0; // Attack
      pokemon.defense = data.stats[2]?.base_stat || 0; // Defense
      pokemon.speed = data.stats[5]?.base_stat || 0; // Speed
      pokemon.height = data.height || 0;
      pokemon.weight = data.weight || 0;
    }

    return pokemon;
  }
}
