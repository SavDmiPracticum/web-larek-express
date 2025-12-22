import express from 'express';
import orderRoutes from './order';
import productRoutes from './product';
import authRouter from './auth';
import uploadRouter from './upload';

const router = express.Router();

router.use('/product', productRoutes);
router.use('/order', orderRoutes);
router.use('/auth', authRouter);
router.use('/', uploadRouter);

export default router;
