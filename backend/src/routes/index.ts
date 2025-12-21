import express from 'express';
import orderRoutes from './order';
import productRoutes from './product';
import authRouter from './auth';

const router = express.Router();

router.use('/product', productRoutes);
router.use('/order', orderRoutes);
router.use('/auth', authRouter);

export default router;
