import { PokemonName } from './value-objects/PokemonName';
import { PokemonStat } from './value-objects/PokemonStat';
import { PokemonImage } from './value-objects/PokemonImage';

export interface PokemonDto {
  id: number;
  name: string;
  life?: number;
  strength?: number;
  defense?: number;
  speed?: number;
  height?: number;
  weight?: number;
  personalized: boolean;
  img?: string;
}

export class Pokemon {
  private readonly id: number;
  private readonly name: PokemonName;
  private readonly life: PokemonStat;
  private readonly strength: PokemonStat;
  private readonly defense: PokemonStat;
  private readonly speed: PokemonStat;
  private readonly height: PokemonStat;
  private readonly weight: PokemonStat;
  private readonly personalized: boolean;
  private readonly img: PokemonImage;

  constructor(
    id: number,
    name: string,
    life?: number,
    strength?: number,
    defense?: number,
    speed?: number,
    height?: number,
    weight?: number,
    personalized: boolean = false,
    img?: string
  ) {
    this.id = id;
    this.name = new PokemonName(name);
    this.life = new PokemonStat(life, 'Life');
    this.strength = new PokemonStat(strength, 'Strength');
    this.defense = new PokemonStat(defense, 'Defense');
    this.speed = new PokemonStat(speed, 'Speed');
    this.height = new PokemonStat(height, 'Height');
    this.weight = new PokemonStat(weight, 'Weight');
    this.personalized = personalized;
    this.img = new PokemonImage(img);
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name.value;
  }

  getLife(): number {
    return this.life.value;
  }

  getStrength(): number {
    return this.strength.value;
  }

  getDefense(): number {
    return this.defense.value;
  }

  getSpeed(): number {
    return this.speed.value;
  }

  getHeight(): number {
    return this.height.value;
  }

  getWeight(): number {
    return this.weight.value;
  }

  isPersonalized(): boolean {
    return this.personalized;
  }

  getImage(): string {
    return this.img.value;
  }

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
    };
  }

  static fromPrimitives(data: PokemonDto): Pokemon {
    return new Pokemon(
      data.id,
      data.name,
      data.life,
      data.strength,
      data.defense,
      data.speed,
      data.height,
      data.weight,
      data.personalized ?? false,
      data.img
    );
  }
}
