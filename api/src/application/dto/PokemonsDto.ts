export type PokemonsDto = {
  count: number;
  pokemons: Array<{
    id: number;
    name: string;
    img: string;
    personalized: boolean;
    types: Array<{
      id: number;
      name: string;
    }>;
  }>;
};
