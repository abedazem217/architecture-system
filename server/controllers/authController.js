import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validateUserRegistration } from '../validators/index.js';

/**
 * Auth Controller
 * Handles user authentication and authorization
 */

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, adminCode } = req.body;

    // If registering as admin, require admin code
    if (role === 'admin' || !role) {
      if (!adminCode) {
        return res.status(400).json({
          status: 'error',
          message: 'Admin code is required',
        });
      }
      if (adminCode !== 'ADMIN123') {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid admin code',
        });
      }
    }

    // Validation
    const validation = validateUserRegistration({ name, email, phone, password });
    if (!validation.isValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: validation.errors,
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        status: 'error',
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || 'admin',
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Registration failed',
      error: error.message,
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required',
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'Account is inactive',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: error.message,
    });
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch profile',
      error: error.message,
    });
  }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, company, address, specialization, profilePic } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name,
        phone,
        company,
        address,
        specialization,
        profilePic,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

/**
 * Change password
 * POST /api/auth/change-password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'All password fields are required',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'New password and confirm password do not match',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 6 characters',
      });
    }

    // Find user with password field
    const user = await User.findById(req.userId).select('+password');

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect',
      });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to change password',
      error: error.message,
    });
  }
};

/**
 * Logout (Token invalidation - frontend clears token)
 * POST /api/auth/logout
 */
export const logout = (req, res) => {
  try {
    // Token invalidation is handled on frontend by removing token
    // In production, you might want to implement a token blacklist
    res.status(200).json({
      status: 'success',
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Logout failed',
    });
  }
};

/**
 * Admin: Add Architect Account
 * POST /api/auth/add-architect
 * Only admins can create architect accounts
 */
export const addArchitect = async (req, res) => {
  try {
    // Check if user is admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Only admins can create architect accounts',
      });
    }

    const { name, email, phone, password, role } = req.body;

    // Validation
    const validation = validateUserRegistration({ name, email, phone, password });
    if (!validation.isValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: validation.errors,
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        status: 'error',
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create architect user
    const architect = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'architect',
    });

    await architect.save();

    const architectResponse = architect.toObject();
    delete architectResponse.password;

    res.status(201).json({
      status: 'success',
      message: 'Architect account created successfully',
      data: {
        user: architectResponse,
      },
    });
  } catch (error) {
    console.error('Add architect error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create architect account',
      error: error.message,
    });
  }
};

/**
 * Admin: Get All Architects
 * GET /api/auth/architects
 * Only admins can view all architects
 */
export const getArchitects = async (req, res) => {
  try {
    // Check if user is admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Only admins can view architects',
      });
    }

    const architects = await User.find({ role: 'architect' }).select('-password');

    res.status(200).json({
      status: 'success',
      data: architects,
    });
  } catch (error) {
    console.error('Get architects error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch architects',
      error: error.message,
    });
  }
};

/**
 * Architect: Add Client Account
 * POST /api/auth/add-client
 * Only architects can create client accounts for their projects
 */
export const addClient = async (req, res) => {
  try {
    // Check if user is architect
    if (req.userRole !== 'architect') {
      return res.status(403).json({
        status: 'error',
        message: 'Only architects can create client accounts',
      });
    }

    const { name, email, phone, password } = req.body;

    // Validation
    const validation = validateUserRegistration({ name, email, phone, password });
    if (!validation.isValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: validation.errors,
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        status: 'error',
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create client user
    const client = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'client',
    });

    await client.save();

    const clientResponse = client.toObject();
    delete clientResponse.password;

    res.status(201).json({
      status: 'success',
      message: 'Client account created successfully',
      data: {
        user: clientResponse,
      },
    });
  } catch (error) {
    console.error('Add client error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create client account',
      error: error.message,
    });
  }
};
