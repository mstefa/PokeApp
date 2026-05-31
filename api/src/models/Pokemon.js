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
