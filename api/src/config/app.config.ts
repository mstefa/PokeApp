import dotenv from 'dotenv';

dotenv.config();

export interface DatabaseConfig {
  dialect: 'postgres';
  database: string;
  username: string;
  password: string;
  host: string;
  port: number;
  logging: boolean;
  native: boolean;
  pool?: {
    max: number;
    min: number;
    idle: number;
  };
  dialectOptions?: Record<string, unknown>;
  ssl?: boolean;
}

export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  database: DatabaseConfig;
}

const getAppConfig = (): AppConfig => {
  const nodeEnv = (process.env.NODE_ENV || 'development') as AppConfig['nodeEnv'];
  const port = parseInt(process.env.PORT || '3000', 10);

  const dbConfig: DatabaseConfig = {
    dialect: 'postgres',
    database: process.env.DB_NAME || 'pokemon',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    logging: nodeEnv === 'development',
    native: false,
  };

  if (nodeEnv === 'production') {
    dbConfig.pool = {
      max: 3,
      min: 1,
      idle: 10000,
    };
    dbConfig.dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      keepAlive: true,
    };
    dbConfig.ssl = true;
  }

  return {
    port,
    nodeEnv,
    database: dbConfig,
  };
};

export const config = getAppConfig();
