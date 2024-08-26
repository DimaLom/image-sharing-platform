import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import { usersController } from './controllers/users-controller.js';
import { filesController } from './controllers/files-controller.js';

dotenv.config();

const app = express();

// Подключение к базе данных
mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });

// Парсинг JSON
app.use(express.json());

// Разрешаем CORS для всех запросов
app.use(cors());

app.use('/api/users', usersController);
app.use('/api/files', filesController);

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
