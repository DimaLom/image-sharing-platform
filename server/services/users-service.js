import mongoose from 'mongoose';
import { User } from '../models/User.js';

export class UsersService {
  async createUser(req, res) {
    try {
      const { name, email, password } = req.body;

      const user = new User({
        name,
        email,
        password,
      });

      await user.save();

      res.status(201).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getUser(req, res) {
    try {
      const { id } = req.params;

      // Проверка на валидность MongoDB ObjectID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid user ID' });
      }

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }

      // Возвращаем данные пользователя
      res.status(200).send(user);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'An error occurred' });
    }
  }
}
