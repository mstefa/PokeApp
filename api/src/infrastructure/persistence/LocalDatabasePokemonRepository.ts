import { Pokemon as PokemonDomain } from '../../domain/Pokemon';
import { PokemonRepository } from '../../domain/PokemonRepository';

// @ts-ignore - db.js is JavaScript
const { Pokemon: PokemonModel } = require('../../db.js');

/**
 * Local Database Pokemon Repository
 * Handles all operations for user-created Pokemon data stored in the local database
 * This repository supports both read and write operations
 * Uses the new domain class with built-in validation
 */
export class LocalDatabasePokemonRepository implements PokemonRepository {
  /**
   * Find all custom Pokemon in the local database
   * Does NOT include official Pokemon from PokeAPI
   */
  async findAll(offset: number, limit: number): Promise<{ pokemons: PokemonDomain[]; count: number; }> {
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
        pokemons: customPokemons.map((p: any) => this.mapToEntity(p).toPrimitives())
      };
    } catch (error) {
      console.error('Error finding all custom pokemons:', error);
      throw error;
    }
  }

  /**
   * Find a custom pokemon by ID in the local database
   */
  async findById(id: number | string): Promise<PokemonDomain | null> {
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
  async findByName(name: string): Promise<PokemonDomain | null> {
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
   * Create a new custom pokemon in the local database with validation
   */
  async create(pokemonDomain: PokemonDomain, id: number): Promise<PokemonDomain> {
    try {

      const pokemon = await PokemonModel.create({
        id: id,
        name: pokemonDomain.name,
        life: pokemonDomain.life,
        strength: pokemonDomain.strength,
        defense: pokemonDomain.defense,
        speed: pokemonDomain.speed,
        height: pokemonDomain.height,
        weight: pokemonDomain.weight,
        img: pokemonDomain.img,
        personalized: true
      });

      // Add types if provided
      if (pokemonDomain.types && pokemonDomain.types.length > 0) {
        // @ts-ignore - Sequelize method
        await pokemon.addTypes(pokemonDomain.types.map(t => t.id));
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
   * Map Sequelize model instance to Pokemon domain class
   * Validates all data during construction
   */
  private mapToEntity(model: any): PokemonDomain {
    return new PokemonDomain(
      model.id,
      model.name,
      model.life,
      model.strength,
      model.defense,
      model.speed,
      model.height,
      model.weight,
      model.personalized || false,
      model.img,
      model.Types
    );
  }
}
