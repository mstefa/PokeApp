/**
 * Domain Entity: Type
 * Re-exports the Type domain class from domain/Type.ts
 * Uses class-based implementation with built-in validation
 */
export { Type, TypeDto as TypeEntity } from '../Type';

export const createType = (id: number, name: string) => {
  return new (require('../Type').Type)(name, id);
};
