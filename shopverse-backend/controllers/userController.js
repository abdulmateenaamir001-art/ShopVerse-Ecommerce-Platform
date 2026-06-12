import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/users
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create the user (Password hashes automatically because of our Model!)
    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(res, user._id), // <-- FIXED: Added 'res'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Log in user & get token
// @route   POST /api/users/login
export const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user by email
    const user = await User.findOne({ email });

    // 2. Check if user exists AND password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(res, user._id), // <-- FIXED: Added 'res'
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // Only update password if a new one was provided
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Requires Token!)
export const getUserProfile = async (req, res) => {
  try {
    // protect middleware should attach req.user, but guard anyway
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.isAdmin) {
        return res.status(400).json({ message: 'Cannot delete an Admin user' });
      }
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

// Initialize the Google Client
const client = new OAuth2Client('605480101966-9reqb4thtt6dviu853ol9tshqp931dou.apps.googleusercontent.com');

// @desc    Auth user with Google
// @route   POST /api/users/google
// @access  Public
export const googleAuth = async (req, res) => {
  const { token } = req.body;
  
  try {
    // 1. Verify the token actually came from Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '605480101966-9reqb4thtt6dviu853ol9tshqp931dou.apps.googleusercontent.com',
    });
    
    // 2. Extract the user's Google profile
    const { email, name } = ticket.getPayload();

    // 3. Check if they already have an account in our MongoDB
    let user = await User.findOne({ email });

    // 4. If they don't exist, create a new account automatically!
    if (!user) {
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), 
      });
    }

    // 5. Send back our own ShopVerse JWT token just like a normal login
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(res, user._id), // <-- FIXED: Added 'res'
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: 'Invalid Google Token' });
  }
};