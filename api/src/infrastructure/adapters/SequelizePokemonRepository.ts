import { Pokemon } from '../../domain/Pokemon';
import { PokemonListResponse, CreatePokemonRequest } from '../../domain/entities/Pokemon';
import { PokemonRepository } from '../../domain/ports/PokemonRepository';

// @ts-ignore - db.js is JavaScript
const { Pokemon: PokemonModel } = require('../../db.js');
// @ts-ignore - Services are still in JS
const { getPokemonsALL } = require('../../services/pokemonsIdRequest');

const countAPIPokemons = 1118;

export class SequelizePokemonRepository implements PokemonRepository {
  async findAll(offset: number, limit: number): Promise<PokemonListResponse> {
    try {
      const pokemons = await getPokemonsALL(offset, limit, false);
      const dbCount = await PokemonModel.count({});
      const totalCount = countAPIPokemons + dbCount;

      return {
        count: totalCount,
        pokemons: pokemons
      };
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number | string): Promise<Pokemon | null> {
    try {
      const pokemon = await PokemonModel.findByPk(id, { include: 'Types' });
      return pokemon ? this.mapToEntity(pokemon) : null;
    } catch (error) {
      throw error;
    }
  }

  async findByName(name: string): Promise<Pokemon | null> {
    try {
      const pokemon = await PokemonModel.findOne({
        where: { name },
        include: 'Types'
      });
      return pokemon ? this.mapToEntity(pokemon) : null;
    } catch (error) {
      throw error;
    }
  }

  async create(data: CreatePokemonRequest, id: number): Promise<Pokemon> {
    try {
      const pokemon = await PokemonModel.create({
        id,
        name: data.name,
        life: data.life,
        strength: data.strength,
        defense: data.defense,
        speed: data.speed,
        height: data.height,
        weight: data.weight,
        img: data.img,
        personalized: true
      });

      // Add types if provided
      if (data.types && data.types.length > 0) {
        // @ts-ignore - Sequelize method
        await pokemon.addTypes(data.types.map(t => t.id));
      }

      return this.mapToEntity(pokemon);
    } catch (error) {
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      return await PokemonModel.count({});
    } catch (error) {
      throw error;
    }
  }

  private mapToEntity(model: any): Pokemon {
    return new Pokemon(
      model.id,
      model.name,
      model.life || 0,
      model.strength || 0,
      model.defense || 0,
      model.speed || 0,
      model.height || 0,
      model.weight || 0,
      true, // personalized = true for DB Pokemon
      model.img || ''
    );
  }
}
