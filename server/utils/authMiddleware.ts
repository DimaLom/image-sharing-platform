import jwt from 'jsonwebtoken';

import { CommonResponseMessage } from '../constants/CommonResponseMessage';
import { User } from '../models/User';
import { MiddlewareFunction } from '../types';

export const authMiddleware: MiddlewareFunction = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send({ error: CommonResponseMessage.AccessDenied });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decoded === 'string') {
      return res
        .status(401)
        .send({ error: CommonResponseMessage.AccessDenied });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .send({ error: CommonResponseMessage.AccessDenied });
    }

    if (decoded.iat! < user.tokenIssuedAt) {
      return res
        .status(401)
        .send({ error: CommonResponseMessage.TokenExpired });
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);

    res.status(401).send({ error: CommonResponseMessage.AccessDenied });
  }
};
