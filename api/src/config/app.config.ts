import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env.local and .env, conditionally overriding based on DB_CONNECTION settings
export const loadEnv = () => {
  const envPath = path.resolve(process.cwd(), '.env');
  let envConfig: Record<string, string> = {};
  if (fs.existsSync(envPath)) {
    try {
      const fileContent = fs.readFileSync(envPath);
      envConfig = dotenv.parse(fileContent);
    } catch (err) {
      // Ignore read errors
    }
  }

  const envLocalPath = path.resolve(process.cwd(), '.env.local');
  let envLocalConfig: Record<string, string> = {};
  if (fs.existsSync(envLocalPath)) {
    try {
      const fileContent = fs.readFileSync(envLocalPath);
      envLocalConfig = dotenv.parse(fileContent);
    } catch (err) {
      // Ignore read errors
    }
  }

  // Determine DB_CONNECTION from process.env, .env.local, or .env
  const dbConnection = process.env.DB_CONNECTION || envLocalConfig.DB_CONNECTION || envConfig.DB_CONNECTION;

  let finalConfig: Record<string, string> = {};
  const dbKeys = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_NAME', 'DB_PASSWORD', 'DB_SSL'];

  if (dbConnection === 'supabase') {
    // If DB_CONNECTION is 'supabase', database connection keys must come from .env
    // Start with .env settings
    finalConfig = { ...envConfig };
    
    // Merge only non-database settings from .env.local (like PORT)
    for (const [key, value] of Object.entries(envLocalConfig)) {
      if (!dbKeys.includes(key)) {
        finalConfig[key] = value;
      }
    }
  } else {
    // Default: local takes priority (.env.local overrides .env)
    if (fs.existsSync(envLocalPath)) {
      // Start with all keys from .env
      finalConfig = { ...envConfig };
      
      // Override database connection keys ONLY with .env.local values
      // If a database connection key is missing in .env.local, delete it to prevent inheriting from .env
      for (const dbKey of dbKeys) {
        if (envLocalConfig[dbKey] !== undefined) {
          finalConfig[dbKey] = envLocalConfig[dbKey];
        } else {
          delete finalConfig[dbKey];
        }
      }
      
      // Merge all other non-database keys from .env.local (like PORT)
      for (const [key, value] of Object.entries(envLocalConfig)) {
        if (!dbKeys.includes(key)) {
          finalConfig[key] = value;
        }
      }
    } else {
      // No .env.local exists, use .env settings
      finalConfig = { ...envConfig };
    }
  }

  // Apply finalConfig to process.env (without overriding shell environment variables already set)
  for (const [key, value] of Object.entries(finalConfig)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  // Set fallback DB_SSL to 'false' if it's local connection and not explicitly set
  const finalHost = process.env.DB_HOST || 'localhost';
  const isLocalHost = finalHost === 'localhost' || finalHost === '127.0.0.1';
  if (isLocalHost && process.env.DB_SSL === undefined) {
    process.env.DB_SSL = 'false';
  }
};

loadEnv();

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
  officialPokemonThreshold: number;
}

export const getAppConfig = (): AppConfig => {
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

  const useSSL = process.env.DB_SSL === 'true' || nodeEnv === 'production';

  if (useSSL) {
    dbConfig.dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      keepAlive: true,
    };
    dbConfig.ssl = true;
  }

  if (nodeEnv === 'production') {
    dbConfig.pool = {
      max: 3,
      min: 1,
      idle: 10000,
    };
  }

  return {
    port,
    nodeEnv,
    officialPokemonThreshold: 1118,
    database: dbConfig,
  };
};

export const config = getAppConfig();
