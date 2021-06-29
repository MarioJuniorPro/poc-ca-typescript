import { Server } from 'http';
import { logger } from '@/shared/logger';

export const terminate = (server: Server, options = { coreDump: false, timeout: 500 }): any => {
  // Exit function
  const exit = (code: number) => {
    // eslint-disable-next-line no-unused-expressions
    options.coreDump ? process.abort() : process.exit(code);
  };

  return (code: number, reason: string) => (err: Error) => {
    logger.info(`Application terminated with code ${code}: ${reason}.`);
    if (err && err instanceof Error) {
      logger.error(err.message, err.stack);
    }

    // Attempt a graceful shutdown
    server.close((error) => {
      if (error) {
        logger.fatal(error);
        exit(1);
      }
      logger.info('Server Closed');
      exit(code);
    });
    setTimeout(exit, options.timeout).unref();
  };
};
