import { z } from 'zod';

/**
 * Schema for Pokemon type
 */
export const TypeSchema = z.object({
  id: z.number().int().positive().default(0),
  name: z.string().min(1, 'Type name is required').max(50, 'Type name must be less than 50 characters'),
});

export type Type = z.infer<typeof TypeSchema>;

/**
 * Schema for creating a new Pokemon
 */
export const CreatePokemonSchema = z.object({
  name: z
    .string()
    .min(1, 'Pokemon name is required')
    .max(100, 'Pokemon name must be less than 100 characters')
    .trim(),

  img: z
    .string()
    .url('Image must be a valid URL')
    .or(z.literal(''))
    .default(''),

  life: z
    .number()
    .int('Life must be an integer')
    .min(0, 'Life must be at least 0')
    .max(999, 'Life must be less than 1000')
    .default(50),

  strength: z
    .number()
    .int('Strength must be an integer')
    .min(0, 'Strength must be at least 0')
    .max(999, 'Strength must be less than 1000')
    .default(50),

  defense: z
    .number()
    .int('Defense must be an integer')
    .min(0, 'Defense must be at least 0')
    .max(999, 'Defense must be less than 1000')
    .default(50),

  speed: z
    .number()
    .int('Speed must be an integer')
    .min(0, 'Speed must be at least 0')
    .max(999, 'Speed must be less than 1000')
    .default(50),

  height: z
    .number()
    .min(0, 'Height must be at least 0')
    .max(99999, 'Height must be less than 100000')
    .default(0),

  weight: z
    .number()
    .min(0, 'Weight must be at least 0')
    .max(99999, 'Weight must be less than 100000')
    .default(0),

  types: z
    .array(TypeSchema)
    .min(1, 'At least one type is required')
    .default([]),
});

export type CreatePokemonRequest = z.infer<typeof CreatePokemonSchema>;
