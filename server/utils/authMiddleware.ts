import jwt from 'jsonwebtoken';

import { CommonResponseMessage } from '../constants/CommonResponseMessage';
import { MiddlewareFunction } from '../types';

export const authMiddleware: MiddlewareFunction = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send({ error: CommonResponseMessage.AccessDenied });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);

    res.status(401).send({ error: CommonResponseMessage.AccessDenied });
  }
};
