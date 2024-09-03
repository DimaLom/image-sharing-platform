import mongoose from 'mongoose';

import { File } from '../models/File.js';

export class FilesController {
  async uploadFile(req, res) {
    try {
      const { originalname, mimetype, buffer } = req.file;

      // Создаем новый файл и сохраняем его в базу данных
      const newFile = new File({
        filename: originalname,
        data: buffer,
        contentType: mimetype,
      });

      const savedFile = await newFile.save();

      // Отправляем в ответ название файла и его ID
      res.status(201).send({
        fileId: savedFile._id,
        filename: savedFile.filename,
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }

  async getFile(req, res) {
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
  }
  async deleteFile(req, res) {
    try {
      const { id } = req.params;

      // Попытка найти и удалить файл по ID
      const deletedFile = await File.findByIdAndDelete(id);

      if (!deletedFile) {
        return res.status(404).send({ error: 'File not found' });
      }

      res.status(200).send({
        message: 'File deleted successfully!',
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send({ error: 'An error occurred while trying to delete the file' });
    }
  }
}
