import { TypeName } from './value-objects/TypeName';

export interface TypeDto {
  id?: number;
  name: string;
}

export class Type {
  private readonly id?: number;
  private readonly name: TypeName;

  constructor(name: string, id?: number) {
    this.name = new TypeName(name);
    this.id = id;
  }

  getId(): number | undefined {
    return this.id;
  }

  getName(): string {
    return this.name.value;
  }

  toPrimitives(): TypeDto {
    return {
      id: this.id,
      name: this.name.value,
    };
  }

  static fromPrimitives(data: TypeDto): Type {
    return new Type(data.name, data.id);
  }
}
