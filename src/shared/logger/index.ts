import pino, { Logger } from 'pino';

/**
 * Logger
 */
export const logger: Logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: process.env.NODE_ENV !== 'production' || process.env.LOG_PRETTY_PRINT === 'true',
});
