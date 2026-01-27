/**
 * Utility Functions for Backend
 */

// Example: Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Example: Date utilities
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US');
};

// Example: Response formatter
export const sendResponse = (status, message, data = null) => {
  return {
    status,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};
