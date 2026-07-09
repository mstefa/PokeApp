import { expect, describe, it } from 'vitest';
import { Pokemon } from '../../../src/domain/Pokemon';

describe('Pokemon Domain Model', () => {
  it('should create a Pokemon instance from primitives and convert back to primitives', () => {
    const pokemonData = {
      id: 25,
      name: 'pikachu',
      life: 35,
      strength: 55,
      defense: 40,
      speed: 90,
      height: 4,
      weight: 60,
      personalized: false,
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      types: [
        { id: 13, name: 'electric' }
      ]
    };

    const pokemon = Pokemon.fromPrimitives(pokemonData);

    expect(pokemon.id).toBe(25);
    expect(pokemon.name.value).toBe('pikachu');
    expect(pokemon.life.value).toBe(35);
    expect(pokemon.strength.value).toBe(55);
    expect(pokemon.types).toHaveLength(1);
    expect(pokemon.types[0].name.value).toBe('electric');

    const primitives = pokemon.toPrimitives();
    expect(primitives).toEqual(pokemonData);
  });
});
