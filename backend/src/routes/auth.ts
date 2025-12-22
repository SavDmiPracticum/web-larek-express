import { Router } from 'express';
import checkUserAuth from '../middlewares/auth';
import { validateUserRegisterBody, validateUserLoginBody } from '../middlewares/validations';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from '../controllers/auth';

const router = Router();

router.post('/login', validateUserLoginBody, loginUser);
router.post('/register', validateUserRegisterBody, registerUser);
router.get('/token', refreshAccessToken);
router.get('/logout', logoutUser);
router.get('/user', checkUserAuth, getCurrentUser);

export default router;
