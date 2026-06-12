import express from 'express';
import { 
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
  createProductReview,
  getTopProducts // <-- 1. Import it here!
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

// --- NEW: Top Products (MUST GO BEFORE /:id) ---
router.get('/top', getTopProducts);

router.route('/:id/reviews').post(protect, createProductReview);

// The /:id route MUST stay at the bottom!
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;