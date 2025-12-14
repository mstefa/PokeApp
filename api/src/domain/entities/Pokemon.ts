/**
 * Domain Entity: Pokemon
 * Re-exports the Pokemon domain class from domain/Pokemon.ts
 * Uses class-based implementation with built-in validation
 */
export type { Pokemon as PokemonDomainClass } from '../Pokemon';
export type { PokemonDto as PokemonEntity } from '../Pokemon';

export interface PokemonType {
  id: number;
  name: string;
}

export interface CreatePokemonRequest {
  name: string;
  life?: number;
  strength?: number;
  defense?: number;
  speed?: number;
  height?: number;
  weight?: number;
  img?: string;
  types?: PokemonType[];
}

export interface PokemonListResponse {
  count: number;
  pokemons: Array<{
    id: number;
    name: string;
    life?: number;
    strength?: number;
    defense?: number;
    speed?: number;
    height?: number;
    weight?: number;
    img?: string;
    personalized: boolean;
  }>;
}
