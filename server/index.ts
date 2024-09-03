import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import { fileRoutes } from './routes/file-routes';
import { userRoutes } from './routes/user-routes';

dotenv.config();

const app = express();

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

// Подключение к базе данных
mongoose
  .connect(process.env.MONGODB_URI)
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

app.use('/api/user', userRoutes);
app.use('/api/file', fileRoutes);

// Запуск сервера
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
