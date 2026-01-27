import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  Container,
  Avatar,
  IconButton,
  Divider,
} from '@mui/material';
import { AccountCircle, LogoutRounded, Dashboard, Folder, Event, Description, Shield } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';
import { getInitials } from '../utils/index.js';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout, isArchitect, isClient, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  if (!isAuthenticated) return null;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard sx={{ mr: 0.5 }} /> },
    { label: 'Projects', path: '/projects', icon: <Folder sx={{ mr: 0.5 }} /> },
    { label: 'Meetings', path: '/meetings', icon: <Event sx={{ mr: 0.5 }} /> },
    { label: 'Documents', path: '/documents', icon: <Description sx={{ mr: 0.5 }} /> },
  ];

  // Add admin link if user is admin
  if (isAdmin) {
    navItems.push({ label: 'Admin', path: '/admin', icon: <Shield sx={{ mr: 0.5 }} /> });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#fff',
        color: '#333',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 0',
          }}
        >
          {/* Logo */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              cursor: 'pointer',
              flexGrow: 0,
              mr: 3,
            }}
            onClick={() => navigate('/dashboard')}
          >
            AOS
          </Typography>

          {/* Navigation Links */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexGrow: 1,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  color: isActive(item.path) ? 'primary.main' : '#666',
                  fontWeight: isActive(item.path) ? 'bold' : 'normal',
                  textTransform: 'none',
                  borderBottom: isActive(item.path) ? '3px solid primary.main' : 'none',
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
                startIcon={item.icon}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                mr: 1,
              }}
            >
              {user?.name || user?.email}
            </Typography>

            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{
                p: 0,
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: 'primary.main',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                {getInitials(user?.name || 'User')}
              </Avatar>
            </IconButton>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem disabled>
                <AccountCircle sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {user?.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {user?.role}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                <AccountCircle sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <LogoutRounded sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
