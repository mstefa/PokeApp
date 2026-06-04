import { Model, DataTypes, Sequelize } from 'sequelize';

export class PokemonModel extends Model {
  public id!: number;
  public name!: string;
  public life!: number;
  public strength!: number;
  public defense!: number;
  public speed!: number;
  public height!: number;
  public weight!: number;
  public img!: string;
  public personalized!: boolean;
  public types!: Array<{ id: number; name: string }>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initPokemonModel(sequelize: Sequelize): typeof PokemonModel {
  PokemonModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      life: {
        type: DataTypes.INTEGER,
        validate: { isInt: true }
      },
      strength: {
        type: DataTypes.INTEGER,
        validate: { isInt: true }
      },
      defense: {
        type: DataTypes.INTEGER,
        validate: { isInt: true }
      },
      speed: {
        type: DataTypes.INTEGER,
        validate: { isInt: true }
      },
      height: {
        type: DataTypes.INTEGER,
        validate: { isInt: true }
      },
      weight: {
        type: DataTypes.INTEGER,
        validate: { isInt: true }
      },
      img: {
        type: DataTypes.TEXT,
        validate: { isUrl: true }
      },
      personalized: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      types: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      }
    },
    {
      sequelize,
      tableName: 'pokemons',
      timestamps: true,
      underscored: true,
      hooks: {
        beforeValidate: (pokemon: PokemonModel) => {
          if (!pokemon.name || typeof pokemon.name !== 'string') {
            throw new Error('It requires a valid name');
          }
        }
      }
    }
  );

  return PokemonModel;
}
