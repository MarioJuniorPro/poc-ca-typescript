import { Request, Router, Response } from 'express';
import { HttpException } from '../errors/http.error';

export const route = (router: Router): void => {
  /**
   * Some sample routes.
   */
  router.get('/', (_req: Request, res: Response) => {
    res.json({ live: true });
  });

  router.get('/heavy', (_req: Request, res: Response) => {
    // eslint-disable-next-line no-empty
    for (let index = 0; index < 1e7; index++) {}
    res.json({ heavy: true });
  });

  router.get('/slow', (_req: Request, res: Response) => {
    const DELAY_MS = 5_000;
    const timeout = setTimeout(() => {
      res.json({ delay: DELAY_MS });
      clearTimeout(timeout);
    }, DELAY_MS);
  });

  router.get('/error', () => {
    throw new HttpException(500, 'BOOM!');
  });
};
