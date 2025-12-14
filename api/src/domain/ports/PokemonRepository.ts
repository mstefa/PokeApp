/**
 * Port (Interface) for Pokemon Repository
 * Defines how the domain interacts with persistence
 */
import { Pokemon, CreatePokemonRequest, PokemonListResponse } from '../entities/Pokemon';

export interface PokemonRepository {
  findAll(offset: number, limit: number): Promise<PokemonListResponse>;
  findById(id: number | string): Promise<Pokemon | null>;
  findByName(name: string): Promise<Pokemon | null>;
  create(pokemon: CreatePokemonRequest, id: number): Promise<Pokemon>;
  count(): Promise<number>;
}
