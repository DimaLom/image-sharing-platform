import express from 'express';
import multer from 'multer';

import { FilesService } from '../services/files-service.js';

const router = express.Router();

const service = new FilesService();

// Настройка multer для обработки файла в памяти
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), service.uploadFile);
router.get('/:id', service.getFile);
router.delete('/:id', service.deleteFile);

export const filesController = router;
