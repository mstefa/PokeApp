import express, { Express, Router } from 'express';
import morgan from 'morgan';
import { registerRoutes } from './routes/index';
import { conn } from './infrastructure/persistence/sequelize';
import { logger } from './shared/logger';

export interface AppOptions {
  isShuttingDown?: () => boolean;
}

export const createApp = (options?: AppOptions): Express => {
  const app = express();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(morgan('dev'));

  // CORS middleware
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });

  // Register routes (both old JS routes and new TS routes)
  const mainRouter = Router();

  // Synchronously register JS routes
  // @ts-ignore
  // const pokemonsJsRouter = require('./routes/pokemons.js');
  // // @ts-ignore
  // const typesJsRouter = require('./routes/types.js');

  // mainRouter.use('/pokemons', pokemonsJsRouter);
  // mainRouter.use('/pokemons', typesJsRouter);
  // mainRouter.use('/types', typesJsRouter);

  registerRoutes(mainRouter);
  app.use('/', mainRouter);

  // Health check
  app.get('/health', async (_req, res) => {
    if (options?.isShuttingDown?.()) {
      res.status(503).json({
        status: 'unhealthy',
        message: 'Server is shutting down',
        database: 'unknown',
      });
      return;
    }

    try {
      await conn.authenticate();
      res.json({
        status: 'ok',
        database: 'connected',
      });
    } catch (dbError) {
      logger.error('Health check failed: database disconnected', dbError);
      res.status(503).json({
        status: 'unhealthy',
        message: 'Database connection failed',
        database: 'disconnected',
      });
    }
  });

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  // Error handling middleware
  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  );

  return app;
};


