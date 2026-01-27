import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './Navbar.jsx';

/**
 * AppLayout Component
 * Main layout wrapper with Navbar
 */
export default function AppLayout() {
  const location = useLocation();

  // Pages that don't need Navbar
  const hideNavbar = ['/login', '/register', '/'].includes(location.pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      {!hideNavbar && <Navbar />}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Outlet />
      </Box>

      {/* Footer (optional) */}
      {!hideNavbar && (
        <Box
          component="footer"
          sx={{
            backgroundColor: '#fff',
            borderTop: '1px solid #eee',
            py: 2,
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: '0.875rem',
          }}
        >
          © 2026 Architect Office System. All rights reserved.
        </Box>
      )}
    </Box>
  );
}
