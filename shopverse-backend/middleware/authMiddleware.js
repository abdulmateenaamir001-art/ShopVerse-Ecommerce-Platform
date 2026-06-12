import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check if the request has an authorization header that starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token from the header (It looks like "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // 3. Crack open the token using our secret key to get the user's ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ FIXED: The token payload uses 'userId', not 'id'
      req.user = await User.findById(decoded.userId).select('-password');

      // 5. Check if user was found
      if (!req.user) {
        return res.status(401).json({ message: 'User not found in database' });
      }

      // 6. The wristband is valid! Let them pass to the next function.
      return next();
    } catch (error) {
      console.error('Auth Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token was found at all...
  return res.status(401).json({ message: 'Not authorized, no token provided' });
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // User is an admin, let them through!
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};