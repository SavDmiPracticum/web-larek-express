import { Router } from 'express';
import { validateOrderBody } from '../middlewares/validations';
import createOrder from '../controllers/order';

const router = Router();

router.post('/order', validateOrderBody, createOrder);

export default router;
