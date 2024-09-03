import express from 'express';
import multer from 'multer';

import { FileController } from '../controllers/file-controller';

const router = express.Router();

const controller = new FileController();

// Настройка multer для обработки файла в памяти
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), controller.uploadFile);
router.get('/:id', controller.getFile);
router.delete('/:id', controller.deleteFile);

export const fileRoutes = router;
