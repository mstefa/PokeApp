/**
 * Port (Interface) for Pokemon Repository
 * Defines how the domain interacts with persistence
 */
import type { Pokemon } from './Pokemon';

export interface PokemonRepository {
  findAll(offset: number, limit: number): Promise<{ pokemons: Pokemon[]; count: number; }>;
  findById(id: number | string): Promise<Pokemon | null>;
  findByName(name: string): Promise<Pokemon | null>;
  create(pokemon: Pokemon, id: number): Promise<Pokemon>;
  count(): Promise<number>;
}
