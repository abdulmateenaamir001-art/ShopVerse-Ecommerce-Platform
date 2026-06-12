import jwt from 'jsonwebtoken';

// Make sure it accepts 'res' first, then 'userId'
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '4h', // Token expires in 4 hours
  });

  // Check if res exists and has the cookie method before trying to use it
  if (res && typeof res.cookie === 'function') {
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 4 * 60 * 60 * 1000, // 4 hours in ms
    });
  }

  return token; // Always return the token string for Bearer headers
};

export default generateToken;