import express from 'express';
import multer from 'multer';

import { FileController } from '../controllers/file-controller';
import { authMiddleware } from '../utils/authMiddleware';

const router = express.Router();

// Настройка multer для обработки файла в памяти
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  FileController.uploadFile,
);

router.get('/list', authMiddleware, FileController.getUserFiles);
router.get('/:id', authMiddleware, FileController.getFile);
router.delete('/:id', authMiddleware, FileController.deleteFile);

export const fileRoutes = router;
