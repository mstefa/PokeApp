import { Sequelize } from 'sequelize';
import { config } from '../../config/app.config';
import { initPokemonModel, PokemonModel } from './models/Pokemon';
import { initTypeModel, TypeModel } from './models/Type';

const dbConfig = config.database;

let sequelize: Sequelize;

if (config.nodeEnv === 'production') {
  sequelize = new Sequelize({
    database: dbConfig.database,
    dialect: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions,
    ssl: dbConfig.ssl,
    logging: dbConfig.logging,
  });
} else {
  sequelize = new Sequelize(
    `postgres://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/${dbConfig.database}`,
    { logging: dbConfig.logging, native: dbConfig.native }
  );
}

// Initialize models
initPokemonModel(sequelize);
initTypeModel(sequelize);

export {
  sequelize,
  sequelize as conn,
  PokemonModel as Pokemon,
  TypeModel as Type
};
export default sequelize;
