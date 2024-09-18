import { Response } from 'express';
import mongoose from 'mongoose';

import { CommonResponseMessage } from '../constants/CommonResponseMessage';
import { MAX_FILE_SIZE, VALID_MIME_TYPES } from '../constants/file';
import { FileResponseMessage } from '../constants/FileResponseMessage';
import { File } from '../models/File';
import { User } from '../models/User';
import { AppRequest } from '../types';

export class FileController {
  public static async uploadFile(req: AppRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).send({ error: FileResponseMessage.NotFound });
      }

      const { originalname, mimetype, buffer } = req.file;
      const userId = req.user?.id;

      if (req.file.size > MAX_FILE_SIZE) {
        return res.status(400).send({ error: FileResponseMessage.InvalidSize });
      }

      if (!VALID_MIME_TYPES.includes(mimetype)) {
        return res.status(400).send({ error: FileResponseMessage.MustBeImage });
      }

      const newFile = new File({
        filename: originalname,
        data: buffer,
        contentType: mimetype,
        userId,
      });

      const savedFile = await newFile.save();

      await User.findByIdAndUpdate(userId, { $push: { files: savedFile._id } });

      return res.status(201).send({
        fileId: savedFile._id,
        filename: savedFile.filename,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).send({ error: CommonResponseMessage.ServerError });
    }
  }

  public static async getUserFiles(req: AppRequest, res: Response) {
    try {
      const user = await User.findById(req.user?.id);

      if (!user) {
        return res
          .status(400)
          .send({ error: CommonResponseMessage.ServerError });
      }

      const dbFiles = (await File.find({ _id: { $in: user.files } })) ?? [];

      const files = dbFiles.map((file) => ({
        fileId: file._id,
        filename: file.filename,
        contentType: file.contentType,
        data: file.data,
      }));

      return res.status(200).send({ files });
    } catch (error) {
      console.log(error);

      return res.status(500).send({ error: CommonResponseMessage.ServerError });
    }
  }

  public static async getFile(req: AppRequest, res: Response) {
    try {
      const file = await File.findById(req.params.id);

      if (!file) {
        return res.status(404).send({ error: FileResponseMessage.NotFound });
      }

      return res.send({
        fileId: file._id,
        filename: file.filename,
        contentType: file.contentType,
        data: file.data,
      });
    } catch (error) {
      console.log(error);

      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ error: FileResponseMessage.InvalidID });
      }

      return res.status(500).send({ error: CommonResponseMessage.ServerError });
    }
  }

  public static async deleteFile(req: AppRequest, res: Response) {
    try {
      const { id } = req.params;

      const deletedFile = await File.findByIdAndDelete(id);

      if (!deletedFile) {
        return res.status(404).send({ error: FileResponseMessage.NotFound });
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
