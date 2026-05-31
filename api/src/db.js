// Legacy JS database connector redirected to the new strongly-typed TypeScript configuration
const { Pokemon, Type, conn } = require('./infrastructure/persistence/sequelize');

module.exports = {
  Pokemon,
  Type,
  conn
};
