/**
 * Port (Interface) for Type Repository
 * Defines how the domain interacts with persistence for Types
 */
import { Type } from '../Type';

export interface TypeRepository {
  findAll(): Promise<Type[]>;
  findById(id: number): Promise<Type | null>;
  findByName(name: string): Promise<Type | null>;
  create(name: string): Promise<Type>;
  findOrCreate(name: string, id?: number): Promise<Type>;
}
