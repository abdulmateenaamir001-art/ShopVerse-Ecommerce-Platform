import express from 'express';
import { 
  addOrderItems, 
  getOrderById, 
  updateOrderToPaid, 
  createStripePaymentIntent,
  getMyOrders,
  getOrders, // <-- Imported
  updateOrderToDelivered, // <-- Imported
  getAdminSummary,
  confirmOrderPayment,
  dispatchOrder
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; // <-- Import admin middleware

const router = express.Router();

// 1. Double-locked route: You must be logged in AND an admin to see all orders
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);

// Admin dashboard summary metrics
router.route('/summary').get(protect, admin, getAdminSummary);

router.route('/myorders').get(protect, getMyOrders); 

router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/stripe').post(protect, createStripePaymentIntent);


// 2. Double-locked route: Confirm payment (verification layer)
router.route('/:id/confirm').put(protect, admin, confirmOrderPayment);

// 3. Double-locked route: Dispatch + tracking
router.route('/:id/dispatch').put(protect, admin, dispatchOrder);

// 4. Double-locked route: Mark as delivered
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);


export default router;