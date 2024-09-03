import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { CommonResponseMessage } from '../constants/CommonResponseMessage';
import { UserResponseMessage } from '../constants/UserResponseMessage';
import { User } from '../models/User';

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).send({ error: UserResponseMessage.UserExists });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ name, email, password: hashedPassword });
      await user.save();

      if (!process.env.JWT_SECRET) {
        return res
          .status(500)
          .send({ error: CommonResponseMessage.ServerError });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '12h',
      });

      return res.status(201).send({
        token,
        message: UserResponseMessage.Registered,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).send({ error: CommonResponseMessage.ServerError });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .send({ error: UserResponseMessage.UserNotFound });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(401)
          .send({ error: UserResponseMessage.InvalidPassword });
      }

      if (!process.env.JWT_SECRET) {
        return res
          .status(500)
          .send({ error: CommonResponseMessage.ServerError });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '12h',
      });

      return res.status(200).send({ token });
    } catch (error) {
      console.error(error);

      res.status(500).send({ error: CommonResponseMessage.ServerError });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Проверка на валидность MongoDB ObjectID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: UserResponseMessage.InvalidID });
      }

      const user = await User.findById(id);

      if (!user) {
        return res
          .status(404)
          .send({ error: UserResponseMessage.UserNotFound });
      }

      // Возвращаем данные пользователя
      res.status(200).send(user);
    } catch (error) {
      console.error(error);

      res.status(500).send({ error: CommonResponseMessage.ServerError });
    }
  }
}