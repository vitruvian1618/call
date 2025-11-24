import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (
  err: Error | HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err.message || 'Internal server error';
  if (status >= 500) {
    logger.error(err);
  } else {
    logger.warn(message);
  }
  res.status(status).json({ error: message, details: (err as HttpError).details });
};
