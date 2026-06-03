import InvalidArgumentError from '../errors/InvalidArgumentError';

const MIN_VALUE = 0;
const MAX_VALUE = 255;

export class PokemonStat {
  readonly value: number;

  constructor(value: number | undefined, statName: string) {
    if (value !== undefined) {
      this.ensureIsNumber(value, statName);
      this.ensureIsInRange(value, statName);
    }
    this.value = value ?? 0;
  }

  toString(): string {
    return this.value.toString();
  }

  private ensureIsNumber(value: number, statName: string): void {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new InvalidArgumentError(`${statName} must be a valid number`);
    }
  }

  private ensureIsInRange(value: number, statName: string): void {
    const maxValue = statName.toLowerCase() === 'weight' ? 10000 : MAX_VALUE;
    if (value < MIN_VALUE || value > maxValue) {
      throw new InvalidArgumentError(
        `${statName} must be between ${MIN_VALUE} and ${maxValue}`
      );
    }
  }
}
