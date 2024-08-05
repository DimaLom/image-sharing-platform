import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { File } from './models/File.js';
import { User } from './models/User.js';

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

// Настройка multer для обработки файла в памяти
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Маршрут для загрузки файла и сохранения его в MongoDB
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { originalname, mimetype, buffer } = req.file;

    // Создаем новый файл и сохраняем его в базу данных
    const newFile = new File({
      filename: originalname,
      data: buffer,
      contentType: mimetype,
    });

    await newFile.save();

    res
      .status(201)
      .send({ message: 'File uploaded and saved to database successfully!' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Маршрут для получения файла из базы данных
app.get('/files/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).send({ error: 'File not found' });
    }

    res.set('Content-Type', file.contentType);
    res.send(file.data);
  } catch (err) {
    console.log(err);
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).send({ error: 'Invalid file ID' });
    } else {
      res.status(500).send({ error: 'An error occurred' });
    }
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
