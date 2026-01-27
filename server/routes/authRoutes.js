import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  addArchitect,
  getArchitects,
  addClient,
} from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

/**
 * Public Routes
 */
router.post('/register', register);
router.post('/login', login);

/**
 * Protected Routes
 */
router.get('/me', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/change-password', auth, changePassword);
router.post('/logout', auth, logout);

/**
 * Admin Routes
 */
router.post('/add-architect', auth, addArchitect);
router.get('/architects', auth, getArchitects);

/**
 * Architect Routes
 */
router.post('/add-client', auth, addClient);

export default router;
