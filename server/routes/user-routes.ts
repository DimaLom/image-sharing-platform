import express from 'express';

import { UserController } from '../controllers/user-controller';
import { authMiddleware } from '../utils/authMiddleware';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/update', authMiddleware, UserController.updateUser);
router.get('/', authMiddleware, UserController.getUser);

export const userRoutes = router;
