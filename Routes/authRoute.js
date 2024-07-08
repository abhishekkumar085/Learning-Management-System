import express from 'express';
import {
  getUser,
  logout,
  signin,
  signup,
} from '../constroller/authController.js';

import jwtAuth from '../middleware/jwtAuth.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.get('/user', jwtAuth, getUser);
authRouter.get('/logout', jwtAuth, logout);

export default authRouter;
