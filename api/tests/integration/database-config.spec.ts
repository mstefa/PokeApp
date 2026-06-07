import { expect, describe, it, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getAppConfig, loadEnv } from '../../src/config/app.config';
import { conn, testConnection } from '../../src/infrastructure/persistence/sequelize';
import { logger } from '../../src/shared/logger';

describe('⚙️ Database Config & Integration Tests', () => {
  const originalEnv = { ...process.env };
  const envLocalPath = path.resolve(process.cwd(), '.env.local');
  let originalEnvLocalExists = false;
  let originalEnvLocalContent: string | null = null;

  beforeAll(() => {
    originalEnvLocalExists = fs.existsSync(envLocalPath);
    if (originalEnvLocalExists) {
      originalEnvLocalContent = fs.readFileSync(envLocalPath, 'utf8');
    }
  });

  afterAll(() => {
    // Restore or clean up .env.local at the very end
    if (originalEnvLocalExists && originalEnvLocalContent !== null) {
      fs.writeFileSync(envLocalPath, originalEnvLocalContent);
    } else if (fs.existsSync(envLocalPath)) {
      fs.unlinkSync(envLocalPath);
    }
  });

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Environment File Loading Priority', () => {
    it('should prioritize variables in .env.local over .env', () => {
      // 1. Create a temporary .env.local containing specific database properties
      fs.writeFileSync(envLocalPath, 'DB_NAME=env_local_test_db\nDB_USER=env_local_user');

      // 2. Set environment variables on process.env to ensure they don't block dotenv from loading from .env.local
      delete process.env.DB_NAME;
      delete process.env.DB_USER;

      // 3. Manually call loadEnv to re-trigger dotenv config with the temporary file
      loadEnv();

      const dynamicConfig = getAppConfig();
      expect(dynamicConfig.database.database).toBe('env_local_test_db');
      expect(dynamicConfig.database.username).toBe('env_local_user');
    });

    it('should prioritize .env connection keys if DB_CONNECTION is set to supabase', () => {
      const envPath = path.resolve(process.cwd(), '.env');
      const originalEnvContent = fs.readFileSync(envPath, 'utf8');

      try {
        // 1. Write test variables to .env (including DB_CONNECTION=supabase)
        fs.writeFileSync(envPath, 'DB_CONNECTION=supabase\nDB_NAME=supabase_test_db\nDB_USER=supabase_user');
        
        // 2. Write test variables to .env.local
        fs.writeFileSync(envLocalPath, 'DB_NAME=env_local_test_db\nDB_USER=env_local_user\nPORT=9999');

        // Delete process.env variables so they can be re-evaluated
        delete process.env.DB_CONNECTION;
        delete process.env.DB_NAME;
        delete process.env.DB_USER;
        delete process.env.PORT;

        // 3. Trigger environment loading
        loadEnv();

        const dynamicConfig = getAppConfig();
        // Database credentials must come from .env (Supabase)
        expect(dynamicConfig.database.database).toBe('supabase_test_db');
        expect(dynamicConfig.database.username).toBe('supabase_user');
        // Non-database settings (like PORT) must still come from .env.local
        expect(dynamicConfig.port).toBe(9999);
      } finally {
        // Restore original .env
        fs.writeFileSync(envPath, originalEnvContent);
      }
    });
  });

  describe('SSL / Dialect Options Configuration', () => {
    it('should enable SSL and dialectOptions when DB_SSL is true', () => {
      process.env.DB_SSL = 'true';
      process.env.NODE_ENV = 'development';

      const configResult = getAppConfig();

      expect(configResult.database.ssl).toBe(true);
      expect(configResult.database.dialectOptions).toBeDefined();
      expect(configResult.database.dialectOptions?.ssl).toEqual({
        require: true,
        rejectUnauthorized: false,
      });
    });

    it('should disable SSL when DB_SSL is false', () => {
      process.env.DB_SSL = 'false';
      process.env.NODE_ENV = 'development';

      const configResult = getAppConfig();

      expect(configResult.database.ssl).toBeUndefined();
      expect(configResult.database.dialectOptions).toBeUndefined();
    });
  });

  describe('Database Connection Error Logging', () => {
    it('should log comprehensive error details when connection is refused', async () => {
      const authSpy = vi.spyOn(conn, 'authenticate').mockRejectedValue({
        name: 'SequelizeConnectionRefusedError',
        message: 'connect ECONNREFUSED 127.0.0.1:5432'
      });
      const logSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});

      await expect(testConnection()).rejects.toThrow();

      expect(authSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Database connection refused'),
        expect.objectContaining({
          name: 'SequelizeConnectionRefusedError',
          message: 'connect ECONNREFUSED 127.0.0.1:5432',
          host: expect.any(String),
          port: expect.any(Number),
        })
      );
    });

    it('should log comprehensive error details when access is denied', async () => {
      const authSpy = vi.spyOn(conn, 'authenticate').mockRejectedValue({
        name: 'SequelizeAccessDeniedError',
        message: 'password authentication failed for user "postgres"'
      });
      const logSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});

      await expect(testConnection()).rejects.toThrow();

      expect(authSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Database access denied'),
        expect.objectContaining({
          name: 'SequelizeAccessDeniedError',
          message: 'password authentication failed for user "postgres"',
        })
      );
    });
  });
});
