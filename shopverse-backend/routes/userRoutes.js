import express from 'express';
import { 
  authUser, 
  registerUser, 
  getUserProfile, 
  updateUserProfile,
  getUsers,
  deleteUser,
  googleAuth // <-- THIS IS THE MISSING PIECE!
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', registerUser);
router.post('/login', authUser);
router.post('/google', googleAuth); // Your new Google route

// Private User routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin Only Routes
router.route('/').get(protect, admin, getUsers);
router.route('/:id').delete(protect, admin, deleteUser);

export default router;