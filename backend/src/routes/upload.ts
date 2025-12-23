import { Router } from 'express';
import checkUserAuth from '../middlewares/auth';
import fileMiddleware from '../middlewares/upload-file';
import uploadFile from '../controllers/upload';

const router = Router();

router.post('/', checkUserAuth, fileMiddleware.single('file'), uploadFile);

export default router;
