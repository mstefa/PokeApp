/**
 * Port (Interface) for External API Service
 * Defines how the domain interacts with external APIs
 */
import { Pokemon, PokemonType } from '../entities/Pokemon';

export interface IExternalPokemonService {
  getPokemonById(id: number | string): Promise<Pokemon | null>;
  getPokemonByName(name: string): Promise<Pokemon | null>;
  getPokemonsList(offset: number, limit: number): Promise<{
    pokemons: Pokemon[];
    hasNext: boolean;
  }>;
}

export interface IExternalTypeService {
  getAllTypes(): Promise<PokemonType[]>;
}
