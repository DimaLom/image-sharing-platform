import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import cors from 'cors';

import User from './models/User.js';

dotenv.config();

const app = express();

// Подключение к базе данных
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
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

// Определяем место хранения и имя файла
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Добавляем уникальное имя к файлу
  },
});

const upload = multer({ storage });

app.post('/users', async (req, res) => {
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
});

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    res.status(201).send({
      filename: req.file.filename,
      message: 'File uploaded successfully!',
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.get('/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join('uploads', filename);
  res.sendFile(filepath, { root: '.' }, (err) => {
    if (err) {
      res.status(404).send({ error: 'File not found' });
    }
  });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
