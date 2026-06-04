export type PokemonsDto = {
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
};
