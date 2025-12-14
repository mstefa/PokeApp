import InvalidArgumentError from '../errors/InvalidArgumentError';

export class PokemonImage {
  readonly value: string;

  constructor(value: string | undefined) {
    if (value) {
      this.ensureIsValidUrl(value);
      this.value = value;
    } else {
      this.value = '';
    }
  }

  toString(): string {
    return this.value;
  }

  private ensureIsValidUrl(value: string): void {
    try {
      new URL(value);
    } catch {
      throw new InvalidArgumentError(`PokemonImage must be a valid URL: ${value}`);
    }
  }
}
