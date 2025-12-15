import { PokemonName } from './value-objects/PokemonName';
import { PokemonStat } from './value-objects/PokemonStat';
import { PokemonImage } from './value-objects/PokemonImage';
import { Type, TypeDto } from './Type';

export class Pokemon {

  constructor(
    readonly id: number,
    readonly name: PokemonName,
    readonly life: PokemonStat,
    readonly strength: PokemonStat,
    readonly defense: PokemonStat,
    readonly speed: PokemonStat,
    readonly height: PokemonStat,
    readonly weight: PokemonStat,
    readonly personalized: boolean = false,
    readonly img: PokemonImage,
    readonly types: Type[]
  ) { }

  toPrimitives(): PokemonDto {
    return {
      id: this.id,
      name: this.name.value,
      life: this.life.value,
      strength: this.strength.value,
      defense: this.defense.value,
      speed: this.speed.value,
      height: this.height.value,
      weight: this.weight.value,
      personalized: this.personalized,
      img: this.img.value,
      types: this.types.map(t => t.toPrimitives())
    };
  }

  static fromPrimitives(data: PokemonDto): Pokemon {
    return new Pokemon(
      data.id,
      new PokemonName(data.name),
      new PokemonStat(data.life, 'Life'),
      new PokemonStat(data.strength, 'Strength'),
      new PokemonStat(data.defense, 'Defense'),
      new PokemonStat(data.speed, 'Speed'),
      new PokemonStat(data.height, 'Height'),
      new PokemonStat(data.weight, 'Weight'),
      data.personalized ?? false,
      new PokemonImage(data.img),
      data.types.map(t => new Type(t.id, t.name)),
    );
  }
}

export interface PokemonDto {
  id: number;
  name: string;
  life: number;
  strength: number;
  defense: number;
  speed: number;
  height: number;
  weight: number;
  personalized: boolean;
  img: string;
  types: TypeDto[];
}
