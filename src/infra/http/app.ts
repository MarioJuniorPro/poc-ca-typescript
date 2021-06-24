import { Server } from 'http';
import compression from 'compression';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response, Router } from 'express';
import helmet from 'helmet';
import { AppConfigProperties } from '../../shared/config/app.config';
import { logger } from '../../shared/logger';
import { HttpException } from './errors/http.error';

type Route = (router: Router) => void;

export class App {
  private app: express.Application;

  public constructor(private readonly config: AppConfigProperties, private readonly routes: Route[]) {
    this.app = express();
    this.setup();
  }

  /**
   * Setup application's routes, middlewares and others dependencies.
   */
  public async setup(): Promise<void> {
    this.app.set('trust proxy', true);

    /**
     * Middlewares
     */
    await this.initializeMiddlewares();

    /**
     * Routes
     */
    this.app.get('/_health', (req: Request, res: Response) => {
      res.status(200).send('ok');
    });
    await this.initializeRoutes(this.routes);

    /**
     * Setup Application error handlers.
     */
    await this.initializeErrorHandling();
  }

  /**
   * Start the application and bind ports for incoming requests.
   */
  public listen(): Promise<Server> {
    return new Promise((resolve, reject) => {
      try {
        const server = this.app.listen(this.config.port, this.config.host, () => {
          logger.info('=========================================');
          logger.info(`🚀 Server started at: http://${this.config.host}:${this.config.port}`);
          logger.info('=========================================');
          resolve(server);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  public getApplication(): Application {
    return this.app;
  }

  /**
   * Setup Middlewares.
   * PS: Can be moved to a separated module.
   */
  private async initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: this.config.corsOrigin,
        credentials: true,
      }),
    );

    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  /**
   * Setup Application routes.
   */
  private async initializeRoutes(routes: Route[]) {
    routes.forEach((route) => route(this.app));
  }

  /**
   * Setup Application routes.
   */
  private async initializeErrorHandling() {
    // TODO: Move to a middleware module.
    const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
      try {
        const status: number = error.status || 500;
        const message: string = error.message || 'Something went wrong';

        logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
        res.status(status).json({ message });
      } catch (err) {
        next(err);
      }
    };

    this.app.use(errorMiddleware);
  }
}
