/**
 * Port (Interface) for Type Repository
 */
import { Type } from '../entities/Type';

export interface TypeRepository {
  findAll(): Promise<Type[]>;
  findById(id: number): Promise<Type | null>;
  create(type: Type): Promise<Type>;
  findOrCreate(type: Type): Promise<Type>;
}
