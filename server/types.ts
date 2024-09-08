import { NextFunction, Request, Response } from 'express';

type AppRequest = Request & { user?: string | object };

export type MiddlewareFunction = (
  req: AppRequest,
  res: Response,
  next: NextFunction,
) => void;
