/**
 * Global Constants for Backend
 */

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

// Meeting Status
export const MEETING_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Document Types
export const DOCUMENT_TYPES = {
  BLUEPRINT: 'blueprint',
  LICENSE: 'license',
  CONTRACT: 'contract',
  REPORT: 'report',
  OTHER: 'other',
};

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'An error occurred',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  VALIDATION_ERROR: 'Validation error',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};
