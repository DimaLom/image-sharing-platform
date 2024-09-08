import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export type AppRequest = Request & { user?: JwtPayload };

export type MiddlewareFunction = (
  req: AppRequest,
  res: Response,
  next: NextFunction,
) => void;
