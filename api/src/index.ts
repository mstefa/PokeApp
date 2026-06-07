import { createApp } from './app';
import { config } from './config/app.config';
import { logger } from './shared/logger';
import { conn, testConnection } from './infrastructure/persistence/sequelize';

const app = createApp();
const port = config.port;

const startServer = async (): Promise<void> => {
  try {
    // Check database connection first with detailed logging
    await testConnection();

    await conn.sync({ force: false });
    logger.info('✅ Database connected and synchronized');

    app.listen(port, () => {
      logger.info(`🚀 Server is running on port ${port}`);
      logger.info(`📝 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

export default app;
