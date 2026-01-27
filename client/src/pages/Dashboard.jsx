import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  FolderOpen,
  EventNote,
  Description,
  TrendingUp,
  Add,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';
import { projectAPI } from '../services/api.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isArchitect, isClient } = useAuth();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    onHoldProjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAll({ limit: 5 });
      const projectList = response.data.data || [];

      setProjects(projectList);

      // Calculate stats
      const total = response.data.pagination?.total || projectList.length;
      const active = projectList.filter(
        (p) => p.status === 'in_progress' || p.status === 'licensed'
      ).length;
      const completed = projectList.filter((p) => p.status === 'completed').length;
      const onHold = projectList.filter((p) => p.status === 'on_hold').length;

      setStats({
        totalProjects: total,
        activeProjects: active,
        completedProjects: completed,
        onHoldProjects: onHold,
      });
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `2px solid ${color}20`,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color }}>
              {value}
            </Typography>
          </Box>
          <Icon
            sx={{
              fontSize: 40,
              color: `${color}40`,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 1,
          }}
        >
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography color="textSecondary" variant="body1">
          {isArchitect
            ? 'Manage your projects and collaborate with clients'
            : 'Track your projects and communicate with architects'}
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stats Grid */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={FolderOpen}
            color="#3f51b5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={TrendingUp}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="On Hold"
            value={stats.onHoldProjects}
            icon={EventNote}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completedProjects}
            icon={Description}
            color="#2196f3"
          />
        </Grid>
      </Grid>

      {/* Recent Projects */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Recent Projects
          </Typography>
          {isArchitect && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/projects?action=create')}
              size="small"
            >
              New Project
            </Button>
          )}
        </Box>

        {projects.length === 0 ? (
          <Box py={3} textAlign="center">
            <Typography color="textSecondary">
              No projects yet. {isArchitect && 'Click "New Project" to get started!'}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project._id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  <CardHeader
                    title={project.title}
                    subheader={project.location}
                    titleTypographyProps={{ variant: 'subtitle1' }}
                    subheaderTypographyProps={{ variant: 'caption' }}
                  />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary" mb={1}>
                      {project.description?.substring(0, 60)}...
                    </Typography>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mt={2}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1,
                          py: 0.5,
                          backgroundColor: '#f0f0f0',
                          borderRadius: 1,
                          textTransform: 'capitalize',
                        }}
                      >
                        {project.status}
                      </Typography>
                      <Typography variant="caption" color="primary">
                        {project.phase}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box mt={2} textAlign="center">
          <Button
            variant="text"
            onClick={() => navigate('/projects')}
          >
            View All Projects →
          </Button>
        </Box>
      </Paper>

      {/* Quick Actions */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FolderOpen />}
              onClick={() => navigate('/projects')}
            >
              View Projects
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<EventNote />}
              onClick={() => navigate('/meetings')}
            >
              Meetings
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Description />}
              onClick={() => navigate('/documents')}
            >
              Documents
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Add />}
              onClick={() => navigate('/profile')}
            >
              My Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
