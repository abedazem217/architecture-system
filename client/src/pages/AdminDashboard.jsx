import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import api from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [architects, setArchitects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newArchitect, setNewArchitect] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchArchitects();
  }, [isAuthenticated, user, navigate]);

  const fetchArchitects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/auth/architects');
      setArchitects(response.data);
    } catch (err) {
      setError('Failed to fetch architects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewArchitect({ name: '', email: '', phone: '', password: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArchitect((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!newArchitect.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (newArchitect.name.trim().length < 3) {
      setError('Name must be at least 3 characters');
      return false;
    }
    if (!newArchitect.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!newArchitect.phone.trim()) {
      setError('Phone is required');
      return false;
    }
    if (!newArchitect.password) {
      setError('Password is required');
      return false;
    }
    if (newArchitect.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleAddArchitect = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      await api.post('/api/auth/add-architect', {
        name: newArchitect.name,
        email: newArchitect.email,
        phone: newArchitect.phone,
        password: newArchitect.password,
        role: 'architect',
      });
      setSuccess('✅ Architect account created successfully!');
      handleCloseDialog();
      fetchArchitects();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create architect account');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Button variant="contained" onClick={handleOpenDialog}>
          Add Architect
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Dialog for Adding Architect */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create Architect Account</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={newArchitect.name}
              onChange={handleInputChange}
              placeholder="Architect name"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={newArchitect.email}
              onChange={handleInputChange}
              placeholder="architect@example.com"
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              type="tel"
              value={newArchitect.phone}
              onChange={handleInputChange}
              placeholder="+970123456789"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={newArchitect.password}
              onChange={handleInputChange}
              placeholder="Set password"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleAddArchitect} variant="contained" disabled={loading}>
            {loading ? 'Creating...' : 'Create Architect'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Architects Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {architects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color="textSecondary">No architects found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              architects.map((arch) => (
                <TableRow key={arch._id} hover>
                  <TableCell>{arch.name}</TableCell>
                  <TableCell>{arch.email}</TableCell>
                  <TableCell>{arch.phone}</TableCell>
                  <TableCell>
                    <Chip label="Active" color="success" size="small" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {loading && architects.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default AdminDashboard;
