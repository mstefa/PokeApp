# Spec: Graceful Shutdown & Database Startup Retry

This specification defines the implementation of a graceful shutdown process and database connection retry mechanism on server startup for the backend API.

---

## 🎯 Objectives

1. **Database Connection Retry on Startup**: If the database is not immediately available on startup, the application should retry connection verification multiple times with a backoff delay before failing and exiting.
2. **Graceful Shutdown Sequence**: Upon receiving termination signals (`SIGINT`, `SIGTERM`), the application must gracefully shut down by stopping the HTTP server from accepting new requests, allowing active requests to finish within a timeout, and safely closing database connection pools.
3. **Shutdown Timeout**: Introduce a timeout (10 seconds) during graceful shutdown to force-exit the process if requests or cleanup take too long.
4. **Enhanced Health Check Endpoint**: Update `/health` to verify database connection health dynamically and reflect the server's shutdown state, returning `503 Service Unavailable` under abnormal/unhealthy conditions.
5. **Fatal Error Safety**: Capture uncaught exceptions and unhandled promise rejections, log them, and trigger the graceful shutdown sequence to avoid resource leaks before exiting.

---

## ⚙️ Design & Implementation Details

### 1. Database Connection Retry on Startup

We will update the startup sequence in `api/src/index.ts` to retry database authentication if it fails initially.
- **Max Retries**: 3 retries (total of 4 attempts).
- **Delay**: 3 seconds between retries.
- **Logging**: Each failure will be logged with a warning, indicating the retry count and remaining attempts.

```typescript
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectDbWithRetry(retries = MAX_RETRIES): Promise<void> {
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      await testConnection();
      await conn.sync({ force: false });
      logger.info('✅ Database connected and synchronized');
      return;
    } catch (error) {
      logger.warn(`⚠️ Database connection attempt ${attempt} failed. error: ${error instanceof Error ? error.message : String(error)}`);
      if (attempt > retries) {
        throw new Error('Database connection retries exhausted');
      }
      logger.info(`Waiting ${RETRY_DELAY_MS / 1000}s before next attempt...`);
      await sleep(RETRY_DELAY_MS);
    }
  }
}
```

### 2. Graceful Shutdown Handler

We will add a signal handling mechanism in `api/src/index.ts` for `SIGTERM` and `SIGINT`.
When a signal is caught:
1. Mark the application status as shutting down (so `/health` immediately reports `503`).
2. Set a 10-second watchdog timer to force-exit with code `1` if cleanup hangs.
3. Close the HTTP server (`server.close()`).
4. Close the Sequelize database connection (`conn.close()`).
5. Exit the process with code `0`.

```typescript
let isShuttingDown = false;
let server: any; // http.Server reference

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
      server.close((err?: Error) => {
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
```

### 3. Fatal Error Interception

We will also listen to process events `uncaughtException` and `unhandledRejection`. When caught, we log them, run the cleanup sequence, and exit with code `1`.

```typescript
const handleFatalError = async (message: string, error: any) => {
  logger.fatal(`💥 Fatal Error: ${message}`, {
    error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
  });
  
  // Attempt clean shutdown
  await gracefulShutdown('FATAL');
  process.exit(1);
};

process.on('uncaughtException', (err) => handleFatalError('uncaughtException', err));
process.on('unhandledRejection', (reason) => handleFatalError('unhandledRejection', reason));
```

### 4. Enhanced Health Check Endpoint

We will modify `api/src/app.ts` to accept an optional state-checker option:

```typescript
export interface AppOptions {
  isShuttingDown?: () => boolean;
}

export const createApp = (options?: AppOptions): Express => {
  // ...
  
  app.get('/health', async (_req, res) => {
    // 1. Check shutting down status
    if (options?.isShuttingDown?.()) {
      return res.status(503).json({
        status: 'unhealthy',
        message: 'Server is shutting down',
        database: 'unknown'
      });
    }

    // 2. Check database status dynamically
    try {
      await conn.authenticate();
      return res.json({
        status: 'ok',
        database: 'connected'
      });
    } catch (dbError) {
      logger.error('Health check failed: database disconnected', dbError);
      return res.status(503).json({
        status: 'unhealthy',
        message: 'Database connection failed',
        database: 'disconnected'
      });
    }
  });
  
  // ...
}
```

---

## 🧪 Testing Plan

1. **Unit/Integration Tests**:
   - Write integration tests for the `/health` endpoint to verify:
     - Normal case: returns 200 `status: ok` and `database: connected`.
     - Database connection failure case: returns 503 `status: unhealthy` and `database: disconnected`.
     - Shutting down case: returns 503 `status: unhealthy` and `message: Server is shutting down`.
2. **Manual verification**:
   - Simulate DB unavailability during start-up to verify retry logging and final failure.
   - Run the server, send a `SIGINT` (Ctrl+C) or `SIGTERM` (via kill command), and verify graceful log outputs and quick shutdown.
