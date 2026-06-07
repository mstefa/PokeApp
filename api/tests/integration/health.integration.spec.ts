import { expect, describe, it, vi } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../../src/app';
import { conn } from '../../src/infrastructure/persistence/sequelize';

describe('📡 Health Check API Integration Tests', () => {
  it('✓ should return 200 and database connected when everything is ok', async () => {
    const app = createApp();
    const request = supertest(app);

    const res = await request.get('/health').expect(200);

    expect(res.body).toEqual({
      status: 'ok',
      database: 'connected',
    });
  });

  it('✓ should return 503 when the database connection fails', async () => {
    // Mock conn.authenticate to throw an error
    const authenticateSpy = vi.spyOn(conn, 'authenticate').mockRejectedValueOnce(new Error('Connection error'));

    const app = createApp();
    const request = supertest(app);

    const res = await request.get('/health').expect(503);

    expect(res.body).toEqual({
      status: 'unhealthy',
      message: 'Database connection failed',
      database: 'disconnected',
    });

    authenticateSpy.mockRestore();
  });

  it('✓ should return 503 when the server is shutting down', async () => {
    const app = createApp({ isShuttingDown: () => true });
    const request = supertest(app);

    const res = await request.get('/health').expect(503);

    expect(res.body).toEqual({
      status: 'unhealthy',
      message: 'Server is shutting down',
      database: 'unknown',
    });
  });
});
