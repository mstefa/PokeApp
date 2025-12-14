import { Type } from '../../domain/Type';
import { TypeRepository } from '../../domain/ports/TypeRepository';

// @ts-ignore - db.js is JavaScript
const { Type: TypeModel } = require('../../db.js');

/**
 * Local Database Type Repository
 * Handles all operations for Pokemon types stored in the local database
 */
export class LocalDatabaseTypeRepository implements TypeRepository {
  /**
   * Find all types in the database
   */
  async findAll(): Promise<Type[]> {
    try {
      const types = await TypeModel.findAll();
      return types.map((t: any) => new Type(t.name, t.id));
    } catch (error) {
      console.error('Error finding all types:', error);
      throw error;
    }
  }

  /**
   * Find a type by ID
   */
  async findById(id: number): Promise<Type | null> {
    try {
      const type = await TypeModel.findByPk(id);
      return type ? new Type(type.name, type.id) : null;
    } catch (error) {
      console.error(`Error finding type with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find a type by name
   */
  async findByName(name: string): Promise<Type | null> {
    try {
      const type = await TypeModel.findOne({ where: { name } });
      return type ? new Type(type.name, type.id) : null;
    } catch (error) {
      console.error(`Error finding type with name ${name}:`, error);
      throw error;
    }
  }

  /**
   * Create a new type with validation
   */
  async create(name: string): Promise<Type> {
    try {
      // Domain class validates name during construction
      const typeDomain = new Type(name);

      const type = await TypeModel.create({
        name: typeDomain.getName()
      });

      return new Type(type.name, type.id);
    } catch (error) {
      console.error('Error creating type:', error);
      throw error;
    }
  }

  /**
   * Find or create a type
   */
  async findOrCreate(name: string, id?: number): Promise<Type> {
    try {
      // Domain class validates name during construction
      const typeDomain = new Type(name, id);

      const [type] = await TypeModel.findOrCreate({
        where: { name: typeDomain.getName() },
        defaults: id ? { id, name: typeDomain.getName() } : { name: typeDomain.getName() }
      });

      return new Type(type.name, type.id);
    } catch (error) {
      console.error(`Error finding or creating type "${name}":`, error);
      throw error;
    }
  }
}
