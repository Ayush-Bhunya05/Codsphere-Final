import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// Middleware to check if user needs to change password
const checkPasswordChange = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return next(); // Admin doesn't need password change
    }

    // Import User model dynamically to avoid circular dependencies
    const User = (await import('../models/User.js')).default;
    const requiresChange = await User.checkPasswordChangeRequired(req.user.userId);
    
    if (requiresChange && req.path !== '/change-password') {
      return res.status(403).json({
        success: false,
        message: 'Password change required',
        requiresPasswordChange: true
      });
    }

    next();
  } catch (error) {
    console.error('Password change check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export { authMiddleware, adminMiddleware, checkPasswordChange };