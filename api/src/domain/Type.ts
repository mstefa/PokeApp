import { TypeName } from './value-objects/TypeName';

export class Type {
  readonly id: number;
  readonly name: TypeName;

  constructor(id: number, name: string) {
    this.name = new TypeName(name);
    this.id = id;
  }

  toPrimitives(): TypeDto {
    return {
      id: this.id,
      name: this.name.value,
    };
  }

  static fromPrimitives(data: TypeDto): Type {
    return new Type(data.id, data.name);
  }
}

export interface TypeDto {
  id: number;
  name: string;
}
