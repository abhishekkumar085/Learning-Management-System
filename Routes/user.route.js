import { Router } from 'express';
import {
  getProfile,
  login,
  register,
  logout,
} from '../constroller/user.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', isLoggedIn,getProfile);

export default router;
