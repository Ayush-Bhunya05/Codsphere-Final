import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class AuthController {
  // User login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Check if it's admin login
      if (email === process.env.ADMIN_EMAIL) {
        if (password === process.env.ADMIN_PASSWORD) {
          const adminUser = {
            id: 0,
            email: process.env.ADMIN_EMAIL,
            role: 'admin',
            full_name: 'System Administrator',
            must_change_pwd: false
          };

          const token = jwt.sign(
            { 
              userId: adminUser.id, 
              email: adminUser.email, 
              role: adminUser.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
          );

          return res.status(200).json({
            success: true,
            message: 'Admin login successful',
            data: {
              user: adminUser,
              token,
              requiresPasswordChange: false
            }
          });
        } else {
          return res.status(401).json({
            success: false,
            message: 'Invalid admin credentials'
          });
        }
      }

      // Regular user login
      const user = await User.findByEmail(email);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Verify password
      const isPasswordValid = await User.verifyPassword(password, user.password_hash);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Prepare user data (exclude password_hash)
      const userData = {
        id: user.id,
        full_name: user.full_name,
        moodle_id: user.moodle_id,
        year: user.year,
        batch: user.batch,
        class: user.class,
        course: user.course,
        email: user.email,
        role: user.role,
        must_change_pwd: user.must_change_pwd,
        created_at: user.created_at
      };

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: userData,
          token,
          requiresPasswordChange: user.must_change_pwd
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login'
      });
    }
  }

  // Change password (for first-time login)
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      // Validate new password
      const passwordError = AuthController.validatePassword(newPassword);
      if (passwordError) {
        return res.status(400).json({
          success: false,
          message: passwordError
        });
      }

      // Get user to verify current password
      const user = await User.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await User.verifyPassword(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      await User.updatePassword(userId, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during password change'
      });
    }
  }

  // Validate password strength
  static validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return null;
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      const user = await User.findByEmail(req.user.email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Exclude password_hash
      const userData = {
        id: user.id,
        full_name: user.full_name,
        moodle_id: user.moodle_id,
        year: user.year,
        batch: user.batch,
        class: user.class,
        course: user.course,
        email: user.email,
        role: user.role,
        must_change_pwd: user.must_change_pwd,
        created_at: user.created_at
      };

      res.status(200).json({
        success: true,
        data: userData
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export default AuthController;