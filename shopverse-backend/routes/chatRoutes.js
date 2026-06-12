import express from 'express';
import { handleChat } from '../controllers/chatController.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Adjust path if it's lower/uppercase U

const router = express.Router();

// Optional user attachment middleware so it extracts user data if logged in, but doesn't block guests
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      console.log("Guest token parsing bypassed");
    }
  }
  next();
};

// Route: /api/chat
router.post('/', optionalAuth, handleChat);

export default router;