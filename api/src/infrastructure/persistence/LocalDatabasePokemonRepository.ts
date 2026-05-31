import { logger } from '@/shared/logger';
import { Pokemon as PokemonDomain } from '../../domain/Pokemon';
import { PokemonRepository } from '../../domain/PokemonRepository';
import { NotFoundError } from '@/shared/errors';

import { Pokemon as PokemonModel } from './sequelize';

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
        offset,
        limit,
        order: [['id', 'DESC']]
      });

      const totalCount = await PokemonModel.count({});

      return {
        count: totalCount,
        pokemons: customPokemons.map((p) => this.mapToEntity(p).toPrimitives())
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
      const pokemon = await PokemonModel.findByPk(id);

      if (!pokemon) {
        logger.debug('LocalDB: Pokemon not found', { id });

        throw new NotFoundError(`Custom Pokemon with ID "${id}" not found`);
      }

      return this.mapToEntity(pokemon)
    } catch (error) {
      logger.error(`Error finding custom pokemon with ID ${id}:`, error as Error);
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
  async create(pokemonDomain: PokemonDomain, id: number): Promise<void> {
    try {

      logger.info('LocalDB: Creating new pokemon', { id, name: pokemonDomain.name.toString() });

      // Convert types array to JSON format for storage
      const typesJson = pokemonDomain.types && pokemonDomain.types.length > 0
        ? pokemonDomain.types.map(t => ({
          id: t.id,
          name: t.name.toString()
        }))
        : [];

      const model = {
        id,
        name: pokemonDomain.name.toString(),
        life: pokemonDomain.life.toString(),
        strength: pokemonDomain.strength.toString(),
        defense: pokemonDomain.defense.toString(),
        speed: pokemonDomain.speed.toString(),
        height: pokemonDomain.height.toString(),
        weight: pokemonDomain.weight.toString(),
        img: pokemonDomain.img.toString() || "https://http2.mlstatic.com/D_NQ_NP_2X_872556-MLA99519668399_112025-F.webp",
        types: [{ id: 1, name: "normal" }],
        personalized: true
      }

      const pokemon = await PokemonModel.create(model);

      logger.info('LocalDB: Pokemon created successfully', {
        pokemonId: pokemon.id,
        pokemonName: pokemon.name,
        typesCount: typesJson.length
      });

      return;
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
  private mapToEntity(model: PokemonModel): PokemonDomain {
    return PokemonDomain.fromPrimitives(
      {
        id: model.id,
        name: model.name,
        life: model.life,
        strength: model.strength,
        defense: model.defense,
        speed: model.speed,
        height: model.height,
        weight: model.weight,
        personalized: model.personalized || false,
        img: model.img,
        types: model.types ? model.types.map((t: any) => ({
          id: t.id,
          name: t.name
        })) : []
      }
    );
  }
}
