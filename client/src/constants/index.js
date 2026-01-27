/**
 * Frontend Constants
 */

// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  ARCHITECT: 'architect',
  CLIENT: 'client',
};

// Project Status
export const PROJECT_STATUS = {
  PLANNING: 'planning',
  LICENSED: 'licensed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ON_HOLD: 'on_hold',
};

// Status Display Labels
export const STATUS_LABELS = {
  planning: 'Planning',
  licensed: 'Licensed',
  in_progress: 'In Progress',
  completed: 'Completed',
  on_hold: 'On Hold',
};

// Status Colors (Material-UI)
export const STATUS_COLORS = {
  planning: 'info',
  licensed: 'success',
  in_progress: 'warning',
  completed: 'success',
  on_hold: 'error',
};

// Routes
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DETAILS: '/projects/:id',
  MEETINGS: '/meetings',
  DOCUMENTS: '/documents',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  PREFERENCES: 'user_preferences',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
};
