const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('pokemon', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    life: {
      type: DataTypes.INTEGER,
    },
    strength: {
      // type: DataTypes.REAL,
      type: DataTypes.INTEGER
    },
    defense: {
      type: DataTypes.INTEGER,
    },
    speed: {
      type: DataTypes.INTEGER,
    },
    height: {
      type: DataTypes.INTEGER,
    },
    weight: {
      type: DataTypes.INTEGER,
    },
    personalized: {
      type: DataTypes.BOOLEAN,
      }, 
    img: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      }  
    },
  });
};
