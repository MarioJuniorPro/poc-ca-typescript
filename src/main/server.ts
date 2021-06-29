import dotenv from 'dotenv';
import 'module-alias/register';
dotenv.config();

import { App } from '@/infra/http/app';
import { terminate } from '@/infra/http/util/terminate.util';
import { AppConfig } from '@/shared/config/app.config';
import { logger } from '@/shared/logger';

/**
 * Boot the Application Server.
 */
const bootstrap = async () => {
  /**
   * Sample of async route loading.
   */
  const { route: SampleRoute } = await import('@/infra/http/routes/sample.route');

  // Build app configuration.
  const appConfig = AppConfig.build(process.env as any);

  // Build the application.
  const app = new App(appConfig.config, [SampleRoute]);

  // Start and bind the application.
  const server = await app.listen();

  const exitHandler = terminate(server, {
    coreDump: false,
    timeout: 500,
  });

  process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
  process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
  process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
  process.on('SIGINT', exitHandler(0, 'SIGINT'));
};
process.on('exit', (code) => {
  logger.info(`Process exited with code: ${code}`);
});

bootstrap().catch((err: Error) => {
  logger.error(`Failed to bootstrap the application. ${err.stack}`);
  process.exit(1);
});
