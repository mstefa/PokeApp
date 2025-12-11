/**
 * Domain Entity: Pokemon
 * Pure business object without any persistence concerns
 */
export interface PokemonType {
  id: number;
  name: string;
}

export interface PokemonStats {
  life: number;
  strength: number;
  defense: number;
  speed: number;
  height: number;
  weight: number;
}

export interface Pokemon extends PokemonStats {
  id: number;
  name: string;
  img: string;
  personalized: boolean;
  types: PokemonType[];
}

export interface CreatePokemonRequest {
  name: string;
  life: number;
  strength: number;
  defense: number;
  speed: number;
  height: number;
  weight: number;
  img: string;
  types: PokemonType[];
}

export interface PokemonListResponse {
  count: number;
  pokemons: Pokemon[];
}

// Factory for creating Pokemon entities
export const createPokemon = (data: CreatePokemonRequest, id: number): Pokemon => {
  if (!data.name || data.name.trim().length === 0) {
    throw new Error('Pokemon name is required');
  }

  return {
    id,
    name: data.name,
    life: data.life,
    strength: data.strength,
    defense: data.defense,
    speed: data.speed,
    height: data.height,
    weight: data.weight,
    img: data.img,
    personalized: true,
    types: data.types || [],
  };
};
