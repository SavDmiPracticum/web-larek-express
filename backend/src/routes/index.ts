import express from 'express';
import orderRoutes from './order';
import productRoutes from './product';

const router = express.Router();

router.use('/', productRoutes);
router.use('/', orderRoutes);

export default router;
