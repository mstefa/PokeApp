module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  return sequelize.define(
    'Pokemon',
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
        type: DataTypes.STRING,
      },
      strength: {
        type: DataTypes.STRING,
      },
      defense: {
        type: DataTypes.STRING,
      },
      speed: {
        type: DataTypes.STRING,
      },
      height: {
        type: DataTypes.STRING,
      },
      weight: {
        type: DataTypes.STRING,
      },
      img: {
        type: DataTypes.TEXT,
      },
      personalized: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      // Nueva columna para almacenar tipos como JSON
      types: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Array of type objects: [{ id, name }, ...]'
      }
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
};
