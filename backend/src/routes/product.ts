import { Router } from 'express';
import { validateProductBody } from '../middlewares/validations';
import {
  createProduct, deleteProduct, getProducts, updateProduct,
} from '../controllers/product';

const router = Router();

router.get('/product', getProducts);
router.post('/product', validateProductBody, createProduct);
router.patch('/product/:productId', updateProduct);
router.delete('/product/:productId', deleteProduct);

export default router;
