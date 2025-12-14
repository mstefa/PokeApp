import { Pokemon, PokemonListResponse, CreatePokemonRequest } from '../../domain/entities/Pokemon';
import { PokemonRepository } from '../../domain/ports/PokemonRepository';

// @ts-ignore - db.js is JavaScript
const { Pokemon: PokemonModel } = require('../../db.js');

/**
 * Local Database Pokemon Repository
 * Handles all operations for user-created Pokemon data stored in the local database
 * This repository supports both read and write operations
 */
export class LocalDatabasePokemonRepository implements PokemonRepository {
  /**
   * Find all custom Pokemon in the local database
   * Does NOT include official Pokemon from PokeAPI
   */
  async findAll(offset: number, limit: number): Promise<PokemonListResponse> {
    try {
      const customPokemons = await PokemonModel.findAll({
        include: 'Types',
        offset,
        limit,
        order: [['id', 'DESC']]
      });

      const totalCount = await PokemonModel.count({});

      return {
        count: totalCount,
        pokemons: customPokemons.map((p: any) => this.mapToEntity(p))
      };
    } catch (error) {
      console.error('Error finding all custom pokemons:', error);
      throw error;
    }
  }

  /**
   * Find a custom pokemon by ID in the local database
   */
  async findById(id: number | string): Promise<Pokemon | null> {
    try {
      const pokemon = await PokemonModel.findByPk(id, { include: 'Types' });
      return pokemon ? this.mapToEntity(pokemon) : null;
    } catch (error) {
      console.error(`Error finding custom pokemon with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find a custom pokemon by name in the local database
   */
  async findByName(name: string): Promise<Pokemon | null> {
    try {
      const pokemon = await PokemonModel.findOne({
        where: { name },
        include: 'Types'
      });
      return pokemon ? this.mapToEntity(pokemon) : null;
    } catch (error) {
      console.error(`Error finding custom pokemon with name ${name}:`, error);
      throw error;
    }
  }

  /**
   * Create a new custom pokemon in the local database
   */
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
      console.error('Error creating custom pokemon:', error);
      throw error;
    }
  }

  /**
   * Get the count of custom Pokemon in the local database
   */
  async count(): Promise<number> {
    try {
      return await PokemonModel.count({});
    } catch (error) {
      console.error('Error counting custom pokemons:', error);
      throw error;
    }
  }

  /**
   * Map Sequelize model instance to Pokemon entity
   */
  private mapToEntity(model: any): Pokemon {
    return {
      id: model.id,
      name: model.name,
      life: model.life || 0,
      strength: model.strength || 0,
      defense: model.defense || 0,
      speed: model.speed || 0,
      height: model.height || 0,
      weight: model.weight || 0,
      img: model.img || '',
      personalized: model.personalized || true,
      types: model.Types
        ? model.Types.map((t: any) => ({
          id: t.id,
          name: t.name
        }))
        : []
    };
  }
}
