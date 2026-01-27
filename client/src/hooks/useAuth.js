import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom Hook for Authentication
 * Provides access to auth context and common auth operations
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
