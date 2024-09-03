import express from 'express';

import { UserController } from '../controllers/user-controller';

const router = express.Router();

const controller = new UserController();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/:id', controller.getUser);

export const userRoutes = router;
