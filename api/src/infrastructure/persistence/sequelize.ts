import { Sequelize } from 'sequelize';
import { config } from '../../config/app.config';
import { initPokemonModel, PokemonModel } from './models/Pokemon';
import { initTypeModel, TypeModel } from './models/Type';
import { logger } from '../../shared/logger';

const dbConfig = config.database;

const sequelize = new Sequelize({
  database: dbConfig.database,
  dialect: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  pool: dbConfig.pool,
  dialectOptions: dbConfig.dialectOptions,
  ssl: dbConfig.ssl,
  logging: dbConfig.logging ? (sql) => logger.debug(sql) : false,
});

// Initialize models
initPokemonModel(sequelize);
initTypeModel(sequelize);

/**
 * Validates the database connection and logs diagnostic details upon failure.
 */
export const testConnection = async (): Promise<void> => {
  try {
    logger.info('Checking database connection...', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      username: dbConfig.username,
      ssl: !!dbConfig.ssl,
    });
    await sequelize.authenticate();
    logger.info('✅ Database connection has been established successfully.');
  } catch (error: any) {
    let friendlyMessage = 'Database connection failed';
    if (error.name === 'SequelizeConnectionRefusedError') {
      friendlyMessage = `Database connection refused. Please check that your PostgreSQL server is running on ${dbConfig.host}:${dbConfig.port} and accepting connections.`;
    } else if (error.name === 'SequelizeAccessDeniedError') {
      friendlyMessage = `Database access denied. Please verify your DB_USER (${dbConfig.username}) and DB_PASSWORD credentials.`;
    } else if (error.name === 'SequelizeInvalidConnectionError') {
      friendlyMessage = `Database connection configuration is invalid. Please check your credentials and hosts.`;
    } else if (error.name === 'SequelizeHostNotFoundError') {
      friendlyMessage = `Database host not found. Please check your DB_HOST (${dbConfig.host}).`;
    } else if (error.name === 'SequelizeHostNotReachableError') {
      friendlyMessage = `Database host at ${dbConfig.host} is not reachable.`;
    } else if (error.name === 'SequelizeConnectionTimedOutError' || error.name === 'SequelizeTimeoutError') {
      friendlyMessage = `Database connection timed out. Check network path and firewall configuration.`;
    }
    
    logger.error(`❌ ${friendlyMessage}`, {
      name: error.name,
      message: error.message,
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      username: dbConfig.username,
      stack: error.stack,
      originalError: error.original ? {
        message: error.original.message,
        code: error.original.code,
        errno: error.original.errno,
      } : undefined,
    });
    throw error;
  }
};

export {
  sequelize,
  sequelize as conn,
  PokemonModel as Pokemon,
  TypeModel as Type
};
export default sequelize;

