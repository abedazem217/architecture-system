import React, { createContext, useState, useEffect, useMemo } from 'react';
import { authAPI } from '../services/api.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user_data');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Save session to localStorage
   */
  const saveSession = (data) => {
    const sessionUser = {
      _id: data._id || data.user?._id,
      name: data.name || data.user?.name,
      email: data.email || data.user?.email,
      phone: data.phone || data.user?.phone,
      role: data.role || data.user?.role,
      profilePic: data.profilePic || data.user?.profilePic,
    };

    const sessionToken = data.token;

    localStorage.setItem('auth_token', sessionToken);
    localStorage.setItem('user_data', JSON.stringify(sessionUser));

    setToken(sessionToken);
    setUser(sessionUser);
    setError(null);
  };

  /**
   * Register new user
   */
  const register = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register(formData);
      saveSession(response.data.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login({ email, password });
      saveSession(response.data.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setToken(null);
      setUser(null);
      setError(null);
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await authAPI.updateProfile(profileData);
      const updatedUser = response.data.data;
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Profile update failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change password
   */
  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    try {
      setLoading(true);
      const response = await authAPI.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Password change failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      isAuthenticated: !!token && !!user,
      isArchitect: user?.role === 'architect',
      isClient: user?.role === 'client',
      isAdmin: user?.role === 'admin',
      register,
      login,
      logout,
      updateProfile,
      changePassword,
      setError,
    }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
