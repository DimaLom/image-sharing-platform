import express from 'express';
import multer from 'multer';

import { FilesController } from '../controllers/files-controller.js';

const router = express.Router();

const controller = new FilesController();

// Настройка multer для обработки файла в памяти
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), controller.uploadFile);
router.get('/:id', controller.getFile);
router.delete('/:id', controller.deleteFile);

export const filesRoutes = router;
