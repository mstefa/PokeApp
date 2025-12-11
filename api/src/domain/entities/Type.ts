/**
 * Domain Entity: Type
 * Pokemon type/element
 */
export interface Type {
  id: number;
  name: string;
}

export const createType = (id: number, name: string): Type => {
  if (!name || name.trim().length === 0) {
    throw new Error('Type name is required');
  }

  return {
    id,
    name,
  };
};
