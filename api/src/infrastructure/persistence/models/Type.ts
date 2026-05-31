import { Model, DataTypes, Sequelize } from 'sequelize';

export class TypeModel extends Model {
  public id!: number;
  public name!: string;
}

export function initTypeModel(sequelize: Sequelize): typeof TypeModel {
  TypeModel.init(
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
      }
    },
    {
      sequelize,
      tableName: 'types',
      timestamps: false,
      underscored: true,
    }
  );

  return TypeModel;
}
