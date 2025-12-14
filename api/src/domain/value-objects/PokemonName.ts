import InvalidArgumentError from '../errors/InvalidArgumentError';

const MIN_LENGTH = 1;
const MAX_LENGTH = 50;

export class PokemonName {
  readonly value: string;

  constructor(value: string) {
    this.ensureNotEmpty(value);
    this.ensureLength(value);
    this.value = value.trim();
  }

  toString(): string {
    return this.value;
  }

  private ensureNotEmpty(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new InvalidArgumentError('PokemonName cannot be empty');
    }
  }

  private ensureLength(value: string): void {
    if (value.length < MIN_LENGTH || value.length > MAX_LENGTH) {
      throw new InvalidArgumentError(
        `PokemonName must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters`
      );
    }
  }
}
