import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
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
  Alert,
  CircularProgress,
  Chip,
  Grid,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';
import { projectAPI } from '../services/api.js';

export default function Projects() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isArchitect } = useAuth();

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: '',
    location: '',
    budget: '',
    status: 'planning',
  });

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    // Filter projects based on search and status
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAll({ limit: 50 });
      setProjects(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      title: '',
      description: '',
      clientId: '',
      location: '',
      budget: '',
      status: 'planning',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateProject = async () => {
    try {
      if (!formData.title || !formData.description) {
        setError('Please fill in required fields');
        return;
      }

      const response = await projectAPI.create(formData);
      setProjects([...projects, response.data.data]);
      handleCloseDialog();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectAPI.delete(id);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      planning: 'info',
      licensed: 'success',
      in_progress: 'warning',
      completed: 'success',
      on_hold: 'error',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Projects
        </Typography>
        <Typography color="textSecondary">
          Manage and track all your architectural projects
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Search & Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
              SelectProps={{ native: true }}
            >
              <option value="all">All Statuses</option>
              <option value="planning">Planning</option>
              <option value="licensed">Licensed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </TextField>
          </Grid>
          {isArchitect && (
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenDialog}
              >
                New Project
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Projects Table */}
      {filteredProjects.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="textSecondary">No projects found</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Phase</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Budget</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project._id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {project.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{project.location || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={project.status}
                      color={getStatusColor(project.status)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {project.phase}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {project.budget ? `$${project.budget.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/projects/${project._id}`)}
                    >
                      View
                    </Button>
                    {isArchitect && (
                      <>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          sx={{ ml: 1 }}
                          onClick={() => navigate(`/projects/${project._id}?edit=true`)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Delete />}
                          color="error"
                          sx={{ ml: 1 }}
                          onClick={() => handleDeleteProject(project._id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Project Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Project Title"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            margin="normal"
            multiline
            rows={4}
            required
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Budget"
            name="budget"
            type="number"
            value={formData.budget}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Initial Status"
            name="status"
            value={formData.status}
            onChange={handleFormChange}
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value="planning">Planning</option>
            <option value="licensed">Licensed</option>
            <option value="in_progress">In Progress</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateProject} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
