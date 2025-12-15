import pino from 'pino';
import type { LoggerOptions } from 'pino';

/**
 * Custom logger interface
 * Allows both simple message logging and message + object logging
 */
interface CustomLogger {
  info(message: string, data?: Record<string, any>): void;
  error(message: string, data?: Record<string, any>): void;
  warn(message: string, data?: Record<string, any>): void;
  debug(message: string, data?: Record<string, any>): void;
  trace(message: string, data?: Record<string, any>): void;
  fatal(message: string, data?: Record<string, any>): void;
}

const isProduction = process.env.NODE_ENV === 'prod';
const logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');

// Palabras clave sensibles que serán redactadas
const sensibleKeys = ['password', 'token', 'authorization', 'secret', 'apiKey', 'api_key'];

// Configuración del redact (redacción de datos sensibles)
const redactOptions = {
  paths: sensibleKeys.flatMap(key => [
    `*.${key}`,
    `**.${key}`,
    `[*].${key}`,
    `data.${key}`,
    `data.*.${key}`,
    `data.**.${key}`
  ]),
  censor: '[REDACTED]'
};

// Configuración base común para ambos entornos
const baseConfig: LoggerOptions = {
  level: logLevel,
  redact: redactOptions,
  timestamp: isProduction ? pino.stdTimeFunctions.isoTime : pino.stdTimeFunctions.unixTime,
};

// Configuración específica por entorno
let loggerConfig: LoggerOptions;
let transport: ReturnType<typeof pino.transport> | undefined;

if (isProduction) {
  // Producción: JSON puro para Grafana Loki
  loggerConfig = {
    ...baseConfig,
    formatters: {
      level: (label) => {
        return { level: label };
      }
    }
  };
} else {
  // Desarrollo: Colorido y legible con pino-pretty
  transport = pino.transport({
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: false,
      messageFormat: '{levelLabel} - {msg}',
      timestampKey: 'timestamp',
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      hideObject: false,
    }
  });

  loggerConfig = baseConfig;
}

// Crear la instancia base de Pino
const baseLogger = transport
  ? pino(loggerConfig, transport)
  : pino(loggerConfig);

/**
 * Custom logger implementation
 * Wrapper que normaliza los argumentos para aceptar:
 * - logger.info(message)
 * - logger.info(message, data)
 */
const logger: CustomLogger = {
  info: (message: string, data?: Record<string, any>) => {
    if (data) {
      baseLogger.info({ msg: message, data });
    } else {
      baseLogger.info(message);
    }
  },

  error: (message: string, data?: Record<string, any>) => {
    if (data) {
      baseLogger.error({ msg: message, data });
    } else {
      baseLogger.error(message);
    }
  },

  warn: (message: string, data?: Record<string, any>) => {
    if (data) {
      baseLogger.warn({ msg: message, data });
    } else {
      baseLogger.warn(message);
    }
  },

  debug: (message: string, data?: Record<string, any>) => {
    if (data) {
      baseLogger.debug({ msg: message, data });
    } else {
      baseLogger.debug(message);
    }
  },

  trace: (message: string, data?: Record<string, any>) => {
    if (data) {
      baseLogger.trace({ msg: message, data });
    } else {
      baseLogger.trace(message);
    }
  },

  fatal: (message: string, data?: Record<string, any>) => {
    if (data) {
      baseLogger.fatal({ msg: message, data });
    } else {
      baseLogger.fatal(message);
    }
  }
};

export { logger };
export type { CustomLogger };
