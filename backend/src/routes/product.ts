import { Router } from 'express';
import checkUserAuth from '../middlewares/auth';
import { validateProductBody } from '../middlewares/validations';
import {
  createProduct, deleteProduct, getProducts, updateProduct,
} from '../controllers/product';

const router = Router();

router.get('/', getProducts);
router.post('/', checkUserAuth, validateProductBody, createProduct);
router.patch('/:productId', checkUserAuth, updateProduct);
router.delete('/:productId', checkUserAuth, deleteProduct);

export default router;
