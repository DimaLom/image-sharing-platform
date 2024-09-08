import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { CommonResponseMessage } from '../constants/CommonResponseMessage';
import { FileResponseMessage } from '../constants/FileResponseMessage';
import { File } from '../models/File';

export class FileController {
  public static async uploadFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .send({ error: FileResponseMessage.FileNotFound });
      }

      const { originalname, mimetype, buffer } = req.file;

      // Создаем новый файл и сохраняем его в базу данных
      const newFile = new File({
        filename: originalname,
        data: buffer,
        contentType: mimetype,
      });

      const savedFile = await newFile.save();

      // Отправляем в ответ название файла и его ID
      return res.status(201).send({
        fileId: savedFile._id,
        filename: savedFile.filename,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).send({ error: CommonResponseMessage.ServerError });
    }
  }

  public static async getFile(req: Request, res: Response) {
    try {
      const file = await File.findById(req.params.id);

      if (!file) {
        return res
          .status(404)
          .send({ error: FileResponseMessage.FileNotFound });
      }

      res.set('Content-Type', file.contentType);
      return res.send(file.data);
    } catch (error) {
      console.log(error);

      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ error: FileResponseMessage.InvalidID });
      }

      return res.status(500).send({ error: CommonResponseMessage.ServerError });
    }
  }

  public static async deleteFile(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Попытка найти и удалить файл по ID
      const deletedFile = await File.findByIdAndDelete(id);

      if (!deletedFile) {
        return res
          .status(404)
          .send({ error: FileResponseMessage.FileNotFound });
      }

      return res.status(200).send({
        message: FileResponseMessage.Deleted,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).send({ error: CommonResponseMessage.ServerError });
    }
  }
}
