import { Router } from 'express';
import { validateProductBody } from '../middlewares/validations';
import {
  createProduct, deleteProduct, getProducts, updateProduct,
} from '../controllers/product';

const router = Router();

router.get('/', getProducts);
router.post('/', validateProductBody, createProduct);
router.patch('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);

export default router;
