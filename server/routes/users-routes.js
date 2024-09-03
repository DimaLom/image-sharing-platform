import express from 'express';

import { UsersController } from '../controllers/users-controller.js';

const router = express.Router();

const controller = new UsersController();

router.post('/create', controller.createUser);
router.get('/:id', controller.getUser);

export const usersRoutes = router;
