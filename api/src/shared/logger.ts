import pino from 'pino';
import type { LoggerOptions } from 'pino';


const isProduction = process.env.NODE_ENV === 'prod';
const logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');

// Palabras clave sensibles que serán redactadas
const sensibleKeys = ['password', 'token', 'authorization', 'secret', 'apiKey', 'api_key'];

// Configuración del redact (redacción de datos sensibles)
const redactOptions = {
  paths: sensibleKeys.flatMap(key => [
    `*.${key}`,
    `**.${key}`,
    `[*].${key}`
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

// Crear la instancia única del logger
const logger = transport
  ? pino(loggerConfig, transport)
  : pino(loggerConfig);

export { logger };
