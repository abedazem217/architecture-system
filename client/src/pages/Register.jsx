import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, register, error, setError } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');
  const [adminCode, setAdminCode] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError('');
    setError(null);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    if (!adminCode.trim()) {
      setLocalError('Admin code is required');
      return false;
    }
    if (adminCode !== 'ADMIN123') {
      setLocalError('Invalid admin code');
      return false;
    }
    if (!formData.name.trim()) {
      setLocalError('Name is required');
      return false;
    }
    if (formData.name.trim().length < 3) {
      setLocalError('Name must be at least 3 characters');
      return false;
    }
    if (!formData.email.trim()) {
      setLocalError('Email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setLocalError('Phone is required');
      return false;
    }
    if (!formData.password) {
      setLocalError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccess('');

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'admin',
        adminCode: adminCode,
      });
      setSuccess(`✅ Welcome, ${formData.name}! Redirecting...`);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 2,
            width: '100%',
          }}
        >
          {/* Header */}
          <Typography
            variant="h4"
            component="h1"
            sx={{
              marginBottom: 1,
              fontWeight: 'bold',
              textAlign: 'center',
              color: 'primary.main',
            }}
          >
            Create Account
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              marginBottom: 3,
              color: 'text.secondary',
            }}
          >
            Admin Only - Create Initial Admin Account
          </Typography>

          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              {success}
            </Alert>
          )}

          {/* Error Alert */}
          {(localError || error) && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {localError || error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="name"
              type="text"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              margin="normal"
              disabled={isLoading}
              required
            />

            <TextField
              fullWidth
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              margin="normal"
              disabled={isLoading}
              required
            />

            <TextField
              fullWidth
              name="phone"
              type="tel"
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+970123456789"
              margin="normal"
              disabled={isLoading}
              required
            />

            <TextField
              fullWidth
              name="adminCode"
              type="password"
              label="Admin Verification Code"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              placeholder="Enter admin code to register"
              margin="normal"
              disabled={isLoading}
              required
              helperText="Only admins can create accounts. Enter the verification code."
            />

            <TextField
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              margin="normal"
              disabled={isLoading}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              margin="normal"
              disabled={isLoading}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPassword}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                marginTop: 3,
                marginBottom: 2,
                padding: '10px',
                fontSize: '1rem',
              }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
          </form>

          {/* Sign In Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
