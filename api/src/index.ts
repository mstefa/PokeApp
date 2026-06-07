import { Server } from 'http';
import { createApp } from './app';
import { config } from './config/app.config';
import { logger } from './shared/logger';
import { conn, testConnection } from './infrastructure/persistence/sequelize';

let isShuttingDown = false;
let server: Server | undefined;

const app = createApp({ isShuttingDown: () => isShuttingDown });
const port = config.port;

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDbWithRetry = async (retries = MAX_RETRIES): Promise<void> => {
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      await testConnection();
      await conn.sync({ force: false });
      logger.info('✅ Database connected and synchronized');
      return;
    } catch (error) {
      logger.warn(
        `⚠️ Database connection attempt ${attempt} failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      if (attempt > retries) {
        throw new Error('Database connection retries exhausted');
      }
      logger.info(`Waiting ${RETRY_DELAY_MS / 1000}s before next attempt...`);
      await sleep(RETRY_DELAY_MS);
    }
  }
};

const startServer = async (): Promise<void> => {
  try {
    // Check database connection first with detailed logging & retries
    await connectDbWithRetry();

    server = app.listen(port, () => {
      logger.info(`🚀 Server is running on port ${port}`);
      logger.info(`📝 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`🚨 Received signal ${signal}. Starting graceful shutdown...`);

  // Force exit timeout (10 seconds)
  const forceExitTimeout = setTimeout(() => {
    logger.error('💥 Graceful shutdown timed out. Forcefully terminating process.');
    process.exit(1);
  }, 10000);

  // Unref so the timer doesn't keep the process alive
  forceExitTimeout.unref();

  if (server) {
    logger.info('Closing HTTP server...');
    await new Promise<void>((resolve) => {
      server!.close((err?: Error) => {
        if (err) {
          logger.error('Error closing HTTP server:', err);
        } else {
          logger.info('HTTP server closed successfully.');
        }
        resolve();
      });
    });
  }

  try {
    logger.info('Closing database connection...');
    await conn.close();
    logger.info('Database connection closed successfully.');
  } catch (error) {
    logger.error('Error closing database connection:', error);
  }

  clearTimeout(forceExitTimeout);
  logger.info('👋 Graceful shutdown complete. Exiting.');
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

const handleFatalError = async (message: string, error: any) => {
  logger.fatal(`💥 Fatal Error: ${message}`, {
    error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
  });
  
  // Attempt clean shutdown before exiting with status 1
  await gracefulShutdown('FATAL');
  process.exit(1);
};

process.on('uncaughtException', (err) => handleFatalError('uncaughtException', err));
process.on('unhandledRejection', (reason) => handleFatalError('unhandledRejection', reason));

startServer();

export default app;

