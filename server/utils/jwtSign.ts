import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { CommonResponseMessage } from '../constants/CommonResponseMessage';

export const jwtSign = (id: mongoose.Types.ObjectId, tokenIssuedAt: number) => {
  if (!process.env.JWT_SECRET) {
    return {
      error: CommonResponseMessage.ServerError,
    };
  }

  const token = jwt.sign({ id, iat: tokenIssuedAt }, process.env.JWT_SECRET, {
    expiresIn: '12h',
  });

  return {
    token,
  };
};
