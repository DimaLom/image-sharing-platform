import express from 'express';

import { UsersService } from '../services/users-service.js';

const router = express.Router();

const service = new UsersService();

router.post('/create', service.createUser);
router.get('/:id', service.getUser);

export const usersController = router;
